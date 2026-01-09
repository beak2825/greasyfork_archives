// ==UserScript==
// @name         Euridis - Script Trame d'Entretien Tool4Staffing
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Ajoute un formulaire structuré pour la trame d'entretien Euridis dans Tool4Staffing + Remplace les badges de scoring par des émojis + Historique des versions
// @author       Euridis Business School
// @match        https://eureka.tool4staffing.com/*
// @grant        none
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tool4staffing.com&size=32
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/555856/Euridis%20-%20Script%20Trame%20d%27Entretien%20Tool4Staffing.user.js
// @updateURL https://update.greasyfork.org/scripts/555856/Euridis%20-%20Script%20Trame%20d%27Entretien%20Tool4Staffing.meta.js
// ==/UserScript==

/**
 * @fileoverview Script Tampermonkey pour améliorer l'interface Tool4Staffing d'Euridis
 * @version 4.0
 * @description Fonctionnalités : Formulaire trame d'entretien, émojis scoring, standardisation téléphones, sélection rapide formations, historique des versions
 */

(function() {
    'use strict';

    // ============================================
    // 🔧 UTILITAIRES
    // ============================================

    /**
     * Crée une fonction debounced qui retarde l'exécution
     * @param {Function} fn - Fonction à debouncer
     * @param {number} delay - Délai en ms
     * @returns {Function} Fonction debounced avec méthode cancel()
     */
    const debounce = (fn, delay) => {
        let timer = null;
        const debounced = (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { timer = null; fn(...args); }, delay);
        };
        debounced.cancel = () => { clearTimeout(timer); timer = null; };
        return debounced;
    };

    /**
     * Crée une fonction throttled qui limite les appels
     * @param {Function} fn - Fonction à throttler
     * @param {number} limit - Intervalle minimum entre appels en ms
     * @returns {Function} Fonction throttled
     */
    const throttle = (fn, limit) => {
        let throttled = false;
        return (...args) => {
            if (throttled) return;
            fn(...args);
            throttled = true;
            setTimeout(() => { throttled = false; }, limit);
        };
    };

    /** Table d'échappement HTML */
    const HTML_ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };

    /**
     * Échappe les caractères HTML dangereux
     * @param {string} text - Texte à échapper
     * @returns {string} Texte échappé
     */
    const escapeHtml = (text) => String(text || '').replace(/[&<>"']/g, c => HTML_ESCAPE_MAP[c]);

    /**
     * Échappe les caractères spéciaux pour utilisation dans une RegExp
     * @param {string} str - Chaîne à échapper
     * @returns {string} Chaîne échappée
     */
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    /**
     * Normalise le HTML (supprime \r\n Windows et trim)
     * @param {string} html - HTML à normaliser
     * @returns {string} HTML normalisé
     */
    const normalizeHtml = (html) => (html || '').replace(/\r\n/g, '\n').trim();

    /**
     * Cache DOM simplifié pour éviter les requêtes répétées
     * @namespace DOMCache
     */
    const DOMCache = {
        _cache: new Map(),
        _ttl: 5000,

        /**
         * Récupère un élément du cache ou du DOM
         * @param {string} selector - Sélecteur CSS
         * @param {boolean} [force=false] - Force le rafraîchissement
         * @returns {Element|null}
         */
        get(selector, force = false) {
            const cached = this._cache.get(selector);
            if (!force && cached && Date.now() - cached.t < this._ttl && document.contains(cached.el)) {
                return cached.el;
            }
            const el = document.querySelector(selector);
            el ? this._cache.set(selector, { el, t: Date.now() }) : this._cache.delete(selector);
            return el;
        },

        /** @param {string} selector @returns {NodeList} */
        getAll: (selector) => document.querySelectorAll(selector),

        /** Invalide le cache (un sélecteur ou tout) @param {string} [selector] */
        invalidate(selector) {
            selector ? this._cache.delete(selector) : this._cache.clear();
        }
    };

    // ============================================
    // ⚙️ CONFIGURATION CENTRALISÉE
    // ============================================

    /**
     * Configuration principale du script
     * @const {Object}
     */
    const CONFIG = Object.freeze({
        dom: Object.freeze({
            wrapperId: 'euridisEnhancerWrapper',
            panelId: 'euridisFloatingPanel',
            styleId: 'euridisEnhancerStyles',
            panelContainerId: 'euridis-panel-container'
        }),
        timing: Object.freeze({
            tabCheck: 750,
            sync: 700,
            save: 1200,
            recordWatch: 1500,
            editWatch: 500,
            periodic: 2000
        }),
        text: Object.freeze({
            marker: '===== COMPTE-RENDU D\'ENTRETIEN EURIDIS =====',
            markerPrefix: '===== COMPTE-RENDU D\'ENTRETIEN EURIDIS'
        }),
        sections: Object.freeze({
            profilMotivation: 'PROFIL & MOTIVATION',
            projetPro: 'PROJET PROFESSIONNEL & ALTERNANCE',
            perceptionEcole: 'PERCEPTION & CHOIX DE L\'ECOLE',
            syntheseProfil: 'SYNTHESE DU PROFIL',
            btsPrereq: 'PRE-REQUIS BTS CI',
            bachelorPrereq: 'PRE-REQUIS BACHELOR/MASTERE'
        }),
        fields: Object.freeze({
            nomEvaluateur: { id: 'nomEvaluateur', type: 'text' },
            noteEntretien: { id: 'noteEntretien', type: 'text' },
            admisNonAdmis: { id: 'admisNonAdmis', type: 'text' },
            profilMotivation: { id: 'profilMotivation', type: 'textarea' },
            maitriseFrancais: { id: 'maitriseFrancais', type: 'checkbox' },
            projetPro: { id: 'projetPro', type: 'textarea' },
            permis: { id: 'permis', type: 'checkbox' },
            alternance: { id: 'alternance', type: 'checkbox' },
            perceptionEcole: { id: 'perceptionEcole', type: 'textarea' },
            euridisChoix1: { id: 'euridisChoix1', type: 'checkbox' },
            syntheseProfil: { id: 'syntheseProfil', type: 'textarea' },
            anglaisBTS: { id: 'anglaisBTS', type: 'checkbox' },
            espagnolBTS: { id: 'espagnolBTS', type: 'checkbox' },
            technologie: { id: 'technologie', type: 'checkbox' },
            commerce: { id: 'commerce', type: 'checkbox' },
            anglaisBachelor: { id: 'anglaisBachelor', type: 'checkbox' },
            anglaisMastere: { id: 'anglaisMastere', type: 'checkbox' },
            bureautique: { id: 'bureautique', type: 'checkbox' }
        }),
        defaults: Object.freeze({
            maitriseFrancais: true,
            commerce: true,
            bureautique: true,
            technologie: true
        }),
        form: Object.freeze({
            targetField: 'observations',
            buttonTab: 'commentLabel'
        }),
        history: Object.freeze({
            maxVersions: 50,
            storagePrefix: 'euridis_history_',
            // Format: texte visible discret (Tool4Staffing supprime les data-* attributes)
            warningLine: '<p style="font-size:9px;color:#999;margin:12px 0 2px 0;">--- IMPORTANT: Ne pas supprimer la ligne ci-dessous (historique) ---</p>',
            tagOpen: '<p style="font-size:6px;line-height:6px;color:#bbb;margin:0;">[EHIST:',
            tagClose: ']</p>',
            // Marqueur textuel pour extraction (sans emoji, plus fiable)
            textMarker: '[EHIST:',
            textMarkerEnd: ']',
            // Anciens marqueurs pour rétrocompatibilité (lecture seulement)
            legacyMarker: '<!-- EURIDIS_HISTORY_DATA:',
            legacyEndMarker: ' -->',
            legacyEmojiMarker: 'Historique: '
        }),
        scoringEmojis: Object.freeze({ 'n': '🟠', 'o': '🟡', 'to': '🟢' })
    });

    // Constantes dérivées (calculées une seule fois au démarrage)
    const FIELD_KEYS = Object.keys(CONFIG.fields);
    const FIELD_ID_SET = new Set(FIELD_KEYS.map(k => CONFIG.fields[k].id));
    const FIELD_ID_TO_KEY = Object.freeze(
        FIELD_KEYS.reduce((acc, key) => { acc[CONFIG.fields[key].id] = key; return acc; }, {})
    );
    const ALL_TOGGLES = Object.freeze([
        'maitriseFrancais', 'permis', 'alternance', 'euridisChoix1',
        'anglaisBTS', 'espagnolBTS', 'technologie', 'commerce',
        'anglaisBachelor', 'anglaisMastere', 'bureautique'
    ]);
    const BLOCK_SPACER = '<p>&nbsp;</p>';

    // ============================================
    // 🎓 MODULE : SÉLECTION RAPIDE DES FORMATIONS
    // ============================================

    /**
     * Module de gestion de la sélection rapide des formations et statuts
     * @namespace FormationModule
     */
    const FormationModule = (() => {
        const SEL = {
            dropdown: '.bootstrap-select .dropdown-menu ul.inner',
            category: 'li.disabled',
            btn: '.euridis-quick-select-btn',
            text: '.text'
        };
        // Mots-clés pour les formations
        const FORMATION_KEYWORDS = ['Business School', 'Sales Academy'];
        // Mots-clés pour les statuts (catégories du dropdown statut)
        const STATUS_KEYWORDS = ['Cycle Prospect', 'Cycle Concours', 'Campus à distance', 'Cycle FC'];
        // Tous les mots-clés combinés
        const ALL_KEYWORDS = [...FORMATION_KEYWORDS, ...STATUS_KEYWORDS];

        /** Vérifie si un dropdown contient des catégories supportées */
        const isSupportedDropdown = (dd) => {
            const texts = dd.querySelectorAll('li .text');
            return [...texts].some(el => ALL_KEYWORDS.some(kw => el.textContent.includes(kw)));
        };

        /** Récupère les items d'une catégorie */
        const getCategoryItems = (cat, dd) => {
            const all = [...dd.querySelectorAll('li')];
            const idx = all.indexOf(cat);
            if (idx === -1) return [];
            const items = [];
            for (let i = idx + 1; i < all.length; i++) {
                if (all[i].classList.contains('disabled')) break;
                const t = all[i].querySelector('.text')?.textContent?.trim();
                if (t !== '...') items.push(all[i]);
            }
            return items;
        };

        /** Met à jour l'état visuel du bouton */
        const updateBtn = (cat, dd, btn) => {
            const items = getCategoryItems(cat, dd);
            if (!items.length) return;
            const allSel = items.every(i => i.classList.contains('selected'));
            btn.innerHTML = allSel ? 'Tout désélectionner' : '⚡ Tout sélectionner';
            btn.classList.toggle('deselect-mode', allSel);
            btn.title = allSel ? 'Désélectionner toutes les formations' : 'Sélectionner toutes les formations';
        };

        /** Bascule la sélection de tous les items */
        const toggleSelection = (cat, dd) => {
            const items = getCategoryItems(cat, dd);
            if (!items.length) return;
            const allSel = items.every(i => i.classList.contains('selected'));
            items.forEach(item => {
                const link = item.querySelector('a');
                if (link && (allSel ? item.classList.contains('selected') : !item.classList.contains('selected'))) {
                    link.click();
                }
            });
        };

        /** Crée un bouton de sélection rapide */
        const createBtn = (cat, dd) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'euridis-quick-select-btn';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSelection(cat, dd);
            });
            return btn;
        };

        /** Observe les changements de sélection */
        const observeDropdown = (dd) => {
            if (dd.dataset.euridisObserved) return;
            dd.dataset.euridisObserved = 'true';
            new MutationObserver(throttle(() => {
                dd.querySelectorAll(SEL.category).forEach(cat => {
                    const btn = cat.querySelector(SEL.btn);
                    if (btn) updateBtn(cat, dd, btn);
                });
            }, 100)).observe(dd, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
        };

        /** Injecte les boutons dans les dropdowns supportés */
        const inject = () => {
            DOMCache.getAll(SEL.dropdown).forEach(dd => {
                if (!isSupportedDropdown(dd)) return;
                dd.querySelectorAll(SEL.category).forEach(cat => {
                    const span = cat.querySelector(SEL.text);
                    if (!span || !ALL_KEYWORDS.some(kw => span.textContent.includes(kw))) return;
                    if (!cat.querySelector(SEL.btn)) {
                        Object.assign(span.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' });
                        span.appendChild(createBtn(cat, dd));
                    }
                    updateBtn(cat, dd, cat.querySelector(SEL.btn));
                });
                observeDropdown(dd);
            });
        };

        return {
            inject,
            startObserver: () => {
                new MutationObserver(throttle(inject, 200)).observe(document.body, { childList: true, subtree: true });
            }
        };
    })();

    // ============================================
    // 📞 MODULE : STANDARDISATION DES NUMÉROS DE TÉLÉPHONE
    // ============================================

    /**
     * Module de standardisation des numéros de téléphone
     * @namespace PhoneModule
     */
    const PhoneModule = (() => {
        const SEL = {
            containers: '[id^="control_group_phone-"], .fieldtype-phonenumber',
            telLink: 'a[href^="tel:"]'
        };
        const CLS = { std: 'euridis-phone-standardized', flag: 'euridis-phone-flag', num: 'euridis-phone-number', invalid: 'euridis-phone-invalid' };

        // Mapping pays (indicatif → métadonnées avec code ISO)
        const COUNTRIES = Object.freeze({
            '33': { iso: 'fr', name: 'France', isNational: true },
            '32': { iso: 'be', name: 'Belgique' }, '41': { iso: 'ch', name: 'Suisse' },
            '352': { iso: 'lu', name: 'Luxembourg' }, '49': { iso: 'de', name: 'Allemagne' },
            '34': { iso: 'es', name: 'Espagne' }, '39': { iso: 'it', name: 'Italie' },
            '31': { iso: 'nl', name: 'Pays-Bas' }, '43': { iso: 'at', name: 'Autriche' },
            '351': { iso: 'pt', name: 'Portugal' }, '44': { iso: 'gb', name: 'Royaume-Uni' },
            '353': { iso: 'ie', name: 'Irlande' }, '45': { iso: 'dk', name: 'Danemark' },
            '46': { iso: 'se', name: 'Suède' }, '47': { iso: 'no', name: 'Norvège' },
            '358': { iso: 'fi', name: 'Finlande' }, '354': { iso: 'is', name: 'Islande' },
            '373': { iso: 'md', name: 'Moldavie' }, '370': { iso: 'lt', name: 'Lituanie' },
            '371': { iso: 'lv', name: 'Lettonie' }, '372': { iso: 'ee', name: 'Estonie' },
            '48': { iso: 'pl', name: 'Pologne' }, '380': { iso: 'ua', name: 'Ukraine' },
            '375': { iso: 'by', name: 'Biélorussie' }, '420': { iso: 'cz', name: 'Tchéquie' },
            '421': { iso: 'sk', name: 'Slovaquie' }, '36': { iso: 'hu', name: 'Hongrie' },
            '40': { iso: 'ro', name: 'Roumanie' }, '359': { iso: 'bg', name: 'Bulgarie' },
            '30': { iso: 'gr', name: 'Grèce' }, '385': { iso: 'hr', name: 'Croatie' },
            '386': { iso: 'si', name: 'Slovénie' }, '381': { iso: 'rs', name: 'Serbie' },
            '382': { iso: 'me', name: 'Monténégro' }, '383': { iso: 'xk', name: 'Kosovo' },
            '389': { iso: 'mk', name: 'Macédoine du Nord' }, '355': { iso: 'al', name: 'Albanie' },
            '262': { iso: 're', name: 'Réunion' }, '590': { iso: 'gp', name: 'Guadeloupe' },
            '596': { iso: 'mq', name: 'Martinique' }, '594': { iso: 'gf', name: 'Guyane' },
            '508': { iso: 'pm', name: 'Saint-Pierre-et-Miquelon' }, '681': { iso: 'wf', name: 'Wallis-et-Futuna' },
            '687': { iso: 'nc', name: 'Nouvelle-Calédonie' }, '689': { iso: 'pf', name: 'Polynésie française' },
            '212': { iso: 'ma', name: 'Maroc' }, '213': { iso: 'dz', name: 'Algérie' },
            '216': { iso: 'tn', name: 'Tunisie' }, '218': { iso: 'ly', name: 'Libye' },
            '20': { iso: 'eg', name: 'Égypte' }, '221': { iso: 'sn', name: 'Sénégal' },
            '225': { iso: 'ci', name: 'Côte d\'Ivoire' }, '237': { iso: 'cm', name: 'Cameroun' },
            '226': { iso: 'bf', name: 'Burkina Faso' }, '223': { iso: 'ml', name: 'Mali' },
            '227': { iso: 'ne', name: 'Niger' }, '228': { iso: 'tg', name: 'Togo' },
            '229': { iso: 'bj', name: 'Bénin' }, '241': { iso: 'ga', name: 'Gabon' },
            '242': { iso: 'cg', name: 'Congo-Brazzaville' }, '243': { iso: 'cd', name: 'RD Congo' },
            '236': { iso: 'cf', name: 'Centrafrique' }, '235': { iso: 'td', name: 'Tchad' },
            '269': { iso: 'km', name: 'Comores' }, '261': { iso: 'mg', name: 'Madagascar' },
            '230': { iso: 'mu', name: 'Maurice' }, '248': { iso: 'sc', name: 'Seychelles' },
            '1': { iso: 'us', name: 'États-Unis/Canada' },
            '55': { iso: 'br', name: 'Brésil' }, '54': { iso: 'ar', name: 'Argentine' },
            '56': { iso: 'cl', name: 'Chili' }, '57': { iso: 'co', name: 'Colombie' },
            '51': { iso: 'pe', name: 'Pérou' }, '58': { iso: 've', name: 'Venezuela' },
            '86': { iso: 'cn', name: 'Chine' }, '91': { iso: 'in', name: 'Inde' },
            '81': { iso: 'jp', name: 'Japon' }, '82': { iso: 'kr', name: 'Corée du Sud' },
            '65': { iso: 'sg', name: 'Singapour' }, '60': { iso: 'my', name: 'Malaisie' },
            '66': { iso: 'th', name: 'Thaïlande' }, '84': { iso: 'vn', name: 'Vietnam' },
            '63': { iso: 'ph', name: 'Philippines' }, '62': { iso: 'id', name: 'Indonésie' },
            '971': { iso: 'ae', name: 'Émirats arabes unis' }, '966': { iso: 'sa', name: 'Arabie saoudite' },
            '974': { iso: 'qa', name: 'Qatar' }, '965': { iso: 'kw', name: 'Koweït' },
            '961': { iso: 'lb', name: 'Liban' }, '962': { iso: 'jo', name: 'Jordanie' },
            '972': { iso: 'il', name: 'Israël' }, '90': { iso: 'tr', name: 'Turquie' },
            '61': { iso: 'au', name: 'Australie' }, '64': { iso: 'nz', name: 'Nouvelle-Zélande' },
            '7': { iso: 'ru', name: 'Russie/Kazakhstan' }
        });

        /** Génère le HTML du drapeau depuis le code ISO */
        const getFlagHtml = (iso, name) => {
            if (!iso) return '';
            return `<img src="https://flagcdn.com/w20/${iso}.png" srcset="https://flagcdn.com/w40/${iso}.png 2x" width="20" height="15" alt="${name}" class="${CLS.flag}">`;
        };

        const SORTED_CODES = Object.keys(COUNTRIES).sort((a, b) => b.length - a.length);
        const FR_FIRST = new Set(['1', '2', '3', '4', '5', '6', '7', '9']);
        const FR_PREFIX = new Set(['01', '02', '03', '04', '05', '06', '07', '09']);

        /** Nettoie un numéro de téléphone */
        const clean = (str) => {
            if (!str || typeof str !== 'string') return '';
            let c = str.replace(/\(\s*0\s*\)/g, '').replace(/^00(\d+)/, '+$1');
            const hasPlus = c.trim().startsWith('+') || str.trim().startsWith('00');
            c = c.replace(/[^\d]/g, '');
            if (hasPlus) {
                c = '+' + c;
            } else if (!c.startsWith('0')) {
                for (const code of SORTED_CODES) {
                    if (c.startsWith(code) && c.length - code.length >= 4) { c = '+' + c; break; }
                }
            }
            return c;
        };

        /** Parse un numéro français */
        const parseFR = (str) => {
            const digits = str.replace(/\D/g, '');
            if (str.startsWith('+33') || str.startsWith('0033')) {
                const nat = str.replace(/^(\+33|0033)/, '').replace(/\D/g, '');
                if (nat.length !== 9 || !FR_FIRST.has(nat[0])) return null;
                return { code: '33', nat: '0' + nat, valid: true };
            }
            if (digits.length === 10 && digits.startsWith('0')) {
                if (!FR_PREFIX.has(digits.substring(0, 2))) return null;
                return { code: '33', nat: digits, valid: true };
            }
            if (digits.length === 9 && !digits.startsWith('0') && FR_FIRST.has(digits[0])) {
                return { code: '33', nat: '0' + digits, valid: true };
            }
            return null;
        };

        /** Détecte le pays d'un numéro international */
        const detectCountry = (str) => {
            if (!str.startsWith('+')) return null;
            const digits = str.substring(1);
            for (const code of SORTED_CODES) {
                if (digits.startsWith(code)) {
                    const nat = digits.substring(code.length);
                    if (nat.length >= 4) return { code, nat, country: COUNTRIES[code] };
                }
            }
            return null;
        };

        /** Formate les chiffres (groupes de 2) */
        const formatDigits = (d) => (d.match(/.{1,2}/g) || []).join(' ');

        /** Formate un numéro international */
        const formatIntl = (code, nat) => {
            const fmt = { '32': n => n.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4'),
                '41': n => n.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4'),
                '373': n => n.replace(/(\d{4})(\d{4})/, '$1 $2'),
                '370': n => n.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3'),
                '371': n => n.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3'),
                '372': n => n.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3') };
            return `+${code} ${fmt[code]?.(nat) || formatDigits(nat)}`;
        };

        /** Parse et valide un numéro complet */
        const parseValidate = (str) => {
            const cleaned = clean(str);
            if (!cleaned) return { valid: false, error: 'Numéro vide' };
            const digits = cleaned.replace(/\D/g, '');
            if (digits.length < 8 || digits.length > 15) return { valid: false, error: 'Longueur invalide' };

            const fr = parseFR(cleaned);
            if (fr?.valid) {
                const formatted = formatDigits(fr.nat);
                const tel = `+33${fr.nat.substring(1)}`;
                return { valid: true, code: '33', nat: fr.nat, formatted, tel, iso: COUNTRIES['33'].iso, name: 'France', tooltip: `${tel} (France)` };
            }
            if (cleaned.startsWith('+')) {
                const det = detectCountry(cleaned);
                if (det) {
                    const formatted = formatIntl(det.code, det.nat);
                    const tel = `+${det.code}${det.nat}`;
                    return { valid: true, code: det.code, nat: det.nat, formatted, tel, iso: det.country.iso, name: det.country.name, tooltip: `${tel} (${det.country.name})` };
                }
            }
            return { valid: false, error: 'Format non reconnu' };
        };

        /** Standardise l'affichage d'un conteneur téléphone */
        const standardizeDisplay = (container) => {
            if (container.classList.contains(CLS.std)) return;
            const link = container.querySelector(SEL.telLink);
            if (!link || link.classList.contains(CLS.std)) return;
            const original = link.textContent.trim();
            if (!original) return;

            const r = parseValidate(original);
            link.innerHTML = '';
            if (r.valid) {
                const flagHtml = getFlagHtml(r.iso, r.name);
                const numEl = document.createElement('span'); numEl.className = CLS.num; numEl.textContent = r.formatted;
                link.innerHTML = flagHtml;
                link.appendChild(numEl);
                link.href = `tel:${r.tel}`; link.title = r.tooltip;
            } else {
                const warn = document.createElement('span'); warn.className = CLS.invalid; warn.textContent = '⚠️ ';
                const numEl = document.createElement('span'); numEl.textContent = original; numEl.title = `Numéro invalide: ${r.error}`;
                link.append(warn, numEl);
            }
            container.classList.add(CLS.std);
            link.classList.add(CLS.std);
        };

        const standardizeAll = () => {
            DOMCache.getAll(SEL.containers).forEach(c => { try { standardizeDisplay(c); } catch(e) { console.error('[Euridis][Phone]', e); } });
        };

        const isPhoneMutation = (m) => {
            const t = m.target;
            if (t.nodeType !== Node.ELEMENT_NODE) return false;
            if (t.id?.startsWith('control_group_phone-') || t.classList?.contains('fieldtype-phonenumber') ||
                t.closest('[id^="control_group_phone-"]') || t.closest('.fieldtype-phonenumber')) return true;
            return [...m.addedNodes].some(n => n.nodeType === Node.ELEMENT_NODE &&
                (n.id?.startsWith('control_group_phone-') || n.classList?.contains('fieldtype-phonenumber') || n.querySelector?.(SEL.containers)));
        };

        const debouncedStd = debounce(standardizeAll, 150);

        return {
            standardize: standardizeAll,
            startObserver: () => {
                new MutationObserver(muts => { if (muts.some(isPhoneMutation)) debouncedStd(); })
                    .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'id', 'class'] });
            },
            reset: () => { DOMCache.getAll(`.${CLS.std}`).forEach(el => el.classList.remove(CLS.std)); }
        };
    })();

    // ============================================
    // 🗄️ GESTION DE L'ÉTAT GLOBAL
    // ============================================

    /**
     * État global de l'application
     * @namespace State
     */
    const State = {
        lastTabState: null,
        currentRecord: null,
        formInitialized: false,
        isApplying: false,
        isSaving: false,
        hasUserOpened: false,
        isEditMode: false,
        lastSnapshot: '',
        lastHtmlSnapshot: '',
        currentFormation: null,
        resizeListener: null,

        /** Réinitialise l'état pour un nouveau candidat */
        reset() {
            this.formInitialized = false;
            this.isApplying = false;
            this.currentFormation = null;
            this.isEditMode = false;
            this.isSaving = false;
            this.lastSnapshot = '';
            this.lastHtmlSnapshot = '';
            this.hasUserOpened = false;
        }
    };

    // Fonctions de synchronisation debounced
    const debouncedSync = debounce(() => {
        if (!State.hasUserOpened) return;
        const data = DataModule.collectData();
        const html = DataModule.buildHTML(data);
        SaveModule.scheduleSave(html);
    }, CONFIG.timing.sync);

    const debouncedSave = debounce((html) => {
        SaveModule.saveToServer(html);
    }, CONFIG.timing.save);

    // ============================================
    // 📄 MODULE : MANIPULATION DU CONTENU HTML
    // ============================================

    /**
     * Module de manipulation du contenu HTML (observations)
     * @namespace ContentModule
     */
    const ContentModule = (() => {
        const BLOCK_TAGS = ['h2', 'h3', 'div', 'p'];

        /** Récupère le HTML existant du champ observations */
        const getExistingHTML = () => {
            const obsGroup = DOMCache.get(`#control_group_${CONFIG.form.targetField}`);
            if (obsGroup) {
                const lbl = obsGroup.querySelector(`.readonly-label[for="${CONFIG.form.targetField}"]`);
                if (lbl?.innerHTML?.trim()) return lbl.innerHTML;
            }
            const form = DOMCache.get('#form_edit_agents');
            if (form) {
                const field = form.querySelector(`[name="${CONFIG.form.targetField}"]`);
                const val = typeof field?.value === 'string' ? field.value : field?.textContent;
                if (val?.trim()) return val;
            }
            return '';
        };

        /** Vérifie si un paragraphe est vide */
        const isPEmpty = (n) => !(n.innerHTML || '').replace(/&nbsp;|&#160;/gi, '').replace(/<br\s*\/?>/gi, '').trim();

        /** Supprime les paragraphes vides en fin de conteneur */
        const removeTrailingEmpty = (c) => {
            if (!c?.lastChild) return;
            let n = c.lastChild;
            while (n) {
                const isEmpty = (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) ||
                    (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'P' && isPEmpty(n));
                if (isEmpty) { const prev = n.previousSibling; c.removeChild(n); n = prev; }
                else break;
            }
        };

        /** Supprime les blocs générés par le script */
        const stripGeneratedBlocks = (html) => {
            if (!html) return '';
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            const txt = tmp.textContent || tmp.innerText || '';
            const idx = txt.indexOf(CONFIG.text.markerPrefix);
            if (idx === -1) { removeTrailingEmpty(tmp); return tmp.innerHTML.trim(); }

            const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent?.includes(CONFIG.text.markerPrefix)) {
                    let el = node.parentElement;
                    while (el && el !== tmp) {
                        const tag = el.tagName.toLowerCase();
                        if ((BLOCK_TAGS.includes(tag) && el.parentElement === tmp) || el.hasAttribute?.('data-euridis-cr-block')) break;
                        el = el.parentElement;
                    }
                    if (el && el !== tmp) { while (el) { const next = el.nextSibling; el.remove(); el = next; } }
                    break;
                }
            }
            removeTrailingEmpty(tmp);
            return tmp.innerHTML.trim();
        };

        /** Compose le contenu final avec le nouveau bloc */
        const composeFinal = (newBlock) => {
            const block = (newBlock || '').trim();
            if (!block) return '';
            const existing = getExistingHTML();
            let base = stripGeneratedBlocks(existing).trim();
            if (!base || base === '<p>&nbsp;</p>' || base === '&nbsp;') return block;
            const spacer = /<p>\s*(&nbsp;|&#160;|\s)*<\/p>\s*$/gi;
            while (spacer.test(base)) base = base.replace(spacer, '').trim();
            return base ? `${base}${BLOCK_SPACER}${block}` : block;
        };

        /** Rafraîchit les snapshots depuis le DOM */
        const refreshSnapshots = () => {
            State.lastHtmlSnapshot = getExistingHTML();
            State.lastSnapshot = normalizeHtml(State.lastHtmlSnapshot);
        };

        /** Convertit du HTML en texte brut */
        const htmlToText = (html) => {
            if (!html) return '';
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            tmp.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
            tmp.querySelectorAll('p, div, li').forEach(n => {
                const t = n.textContent || '';
                if (t && !t.endsWith('\n')) n.appendChild(document.createTextNode('\n'));
            });
            return (tmp.textContent || tmp.innerText || '').replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ').trim();
        };

        /** Lit les observations en texte brut */
        const readObservations = (forceRefresh = false) => {
            try {
                if (forceRefresh) {
                    DOMCache.invalidate(`#control_group_${CONFIG.form.targetField}`);
                    DOMCache.invalidate('#form_edit_agents');
                }

                const obsGroup = document.querySelector(`#control_group_${CONFIG.form.targetField}`);
                if (obsGroup) {
                    const lbl = obsGroup.querySelector(`.readonly-label[for="${CONFIG.form.targetField}"]`);
                    if (lbl?.innerHTML?.trim()) return htmlToText(lbl.innerHTML);
                }
                const form = document.querySelector('#form_edit_agents');
                if (form) {
                    const val = new FormData(form).get(CONFIG.form.targetField);
                    if (typeof val === 'string' && val.trim()) return val.includes('<') ? htmlToText(val) : val;
                }
            } catch (e) { /* ignore */ }
            return '';
        };

        return { getExistingHTML, stripGeneratedBlocks, composeFinal, refreshSnapshots, readObservations, htmlToPlainText: htmlToText };
    })();

    // ============================================
    // 🔍 MODULE : DÉTECTION D'ÉTAT
    // ============================================

    /**
     * Module de détection des états de l'application
     * @namespace DetectionModule
     */
    const DetectionModule = {
        /** Vérifie si le mode édition est actif */
        isInEditMode() {
            for (const btn of DOMCache.getAll('.editBtn')) {
                if ((btn.style.display || getComputedStyle(btn).display) === 'none') return true;
            }
            if (DOMCache.getAll('.mce-edit-area').length > 0) return true;
            const form = DOMCache.get('#form_edit_agents');
            if (form?.querySelectorAll('textarea:not([style*="display: none"]), input[type="text"]:not([style*="display: none"])').length > 5) return true;
            return false;
        },

        /** Vérifie si l'onglet commentaires est actif */
        isCommentsTabActive() {
            return document.querySelector(`a[href="#${CONFIG.form.buttonTab}"]`)?.closest('li')?.classList.contains('active') ?? false;
        },

        /** Récupère la signature unique du dossier actuel */
        getRecordSignature() {
            const form = DOMCache.get('#form_edit_agents');
            if (!form) return null;
            const idx = form.querySelector('input[name="index"]')?.value || '';
            const uid = document.getElementById('puzzle-edit')?.dataset?.idunique || '';
            return idx ? `${idx}::${uid}` : null;
        },

        /** Récupère le nom du candidat */
        getCandidateName() {
            const h = document.querySelector('#puzzle-header h1');
            if (!h) return '';
            const txt = h.textContent || '';
            const m = txt.match(/Candidat\s+(.+?)\s*\(\d+\s*ans?\)/i);
            return m?.[1]?.trim() || txt.split(' - ')[0]?.trim() || txt.trim();
        },

        /** Détecte la formation actuelle */
        detectFormation() {
            const lbl = document.querySelector('label[for="formation"] + div .readonly-label');
            State.currentFormation = (lbl?.textContent || '').trim();
            return State.currentFormation;
        }
    };

    // ============================================
    // 🎨 MODULE : STYLES CSS
    // ============================================

    /**
     * Module de gestion des styles CSS
     * @namespace StylesModule
     */
    const StylesModule = (() => {
        // Variables CSS pour faciliter la personnalisation
        const CSS_VARS = `
:root {
  --euridis-primary: #0066cc;
  --euridis-primary-dark: #0052a3;
  --euridis-primary-light: #2d91ff;
  --euridis-success: #28a745;
  --euridis-success-light: #20c997;
  --euridis-danger: #dc3545;
  --euridis-secondary: #6c757d;
  --euridis-text: #1f2a37;
  --euridis-text-muted: #555;
  --euridis-border: #dfe6f3;
  --euridis-bg-light: #f0f7ff;
  --euridis-shadow: rgba(0,0,0,.25);
  --euridis-radius: 6px;
  --euridis-transition: .2s ease;
}`;

        const STYLES = `
${CSS_VARS}
/* Container & Modal */
  #euridis-panel-container{position:fixed!important;top:0!important;left:0!important;width:0!important;height:0!important;z-index:10000!important;pointer-events:none!important}
  body.euridis-modal-open .editBtn{opacity:.3;pointer-events:none!important;user-select:none;filter:grayscale(80%);cursor:not-allowed!important;position:relative}
body.euridis-modal-open .editBtn::after{content:'';position:absolute;inset:0;background:rgba(200,200,200,.3);pointer-events:none}
  body.euridis-modal-open #control_group_observations{pointer-events:none!important;user-select:none}

/* Open Button */
  .euridis-open-modal-wrapper{margin:20px 0}
.euridis-open-modal-btn{background:var(--euridis-primary);color:#fff;border:none;border-radius:var(--euridis-radius);padding:12px 20px;font-size:16px;font-weight:600;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 10px 20px rgba(0,102,204,.15);transition:transform var(--euridis-transition),box-shadow var(--euridis-transition),background var(--euridis-transition)}
.euridis-open-modal-btn:hover{background:var(--euridis-primary-dark);transform:translateY(-1px);box-shadow:0 12px 24px rgba(0,102,204,.2)}
  .euridis-open-modal-btn:focus{outline:3px solid rgba(0,102,204,.35);outline-offset:2px}
  .euridis-open-modal-btn:disabled{background:#ccc;color:#666;cursor:not-allowed;opacity:0.6;box-shadow:none;transform:none}

/* Edit Mode Warning */
.euridis-edit-mode-warning{background:var(--euridis-danger);color:#fff;border:1px solid #c82333;border-radius:var(--euridis-radius);padding:12px 16px;margin:10px 0;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(220,53,69,.3)}
  .euridis-edit-mode-warning .icon{font-size:20px}

/* Panel */
.euridis-floating-panel{position:fixed;top:3vh;left:50%;transform:translateX(-50%);z-index:10000;background:#fff;width:clamp(320px,95vw,1100px);height:auto;max-height:94vh;min-height:400px;border-radius:10px;box-shadow:0 20px 45px var(--euridis-shadow);display:none;flex-direction:column;overflow:hidden;border:1px solid var(--euridis-border);resize:both;pointer-events:auto!important}
  .euridis-floating-panel.visible{display:flex}

/* Panel Header */
.euridis-panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,var(--euridis-primary) 0%,var(--euridis-primary-light) 100%);color:#fff;cursor:move;user-select:none;gap:10px}
  .euridis-panel-title{font-size:1.1rem;line-height:1.3;font-weight:600;flex:1}
.euridis-panel-close{background:rgba(255,255,255,.22);color:#fff;border:none;border-radius:50%;width:28px;height:28px;font-size:18px;cursor:pointer;transition:background var(--euridis-transition);display:flex;align-items:center;justify-content:center}
  .euridis-panel-close:hover{background:rgba(255,255,255,.32)}

/* Panel Body */
.euridis-panel-body{padding:12px 16px 20px;overflow-y:auto;flex:1;font-size:13px;line-height:1.5;color:var(--euridis-text)}
.euridis-form-container{background:transparent;padding:0;border:none;box-shadow:none}

/* Grid Layout */
.euridis-columns{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}

/* Sections */
.euridis-section{background:#fff;padding:10px 12px;margin:0 0 10px 0;border-radius:var(--euridis-radius);border-left:3px solid var(--euridis-primary);box-shadow:0 1px 3px rgba(0,0,0,.06)}
.euridis-section h3{color:var(--euridis-primary);margin:0 0 8px 0;font-size:0.95em;border-bottom:1px solid #e8e8e8;padding-bottom:6px;display:flex;align-items:center;gap:6px}
.euridis-section-conditional{display:none}
.euridis-section-conditional.visible{display:block}

/* Form Fields */
  .euridis-field{margin:8px 0}
  .euridis-field label{display:block;font-weight:600;margin-bottom:3px;color:#333;font-size:12px}
.euridis-field input[type=text],.euridis-field input[type=number],.euridis-field select,.euridis-field textarea{width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:4px;font-family:inherit;font-size:12px}
.euridis-field textarea{resize:vertical}
  .euridis-field textarea.textarea-small{min-height:90px;height:90px}
  .euridis-field textarea.textarea-medium{min-height:55px;height:55px}
  .euridis-field-inline{display:inline-block;margin-right:12px;vertical-align:top}
  .euridis-field-inline select{min-width:160px}
  #admisNonAdmis{min-width:180px}

/* Toggle Switches */
  .euridis-toggle-wrapper{display:flex;align-items:center;gap:8px;margin:6px 0}
.euridis-toggle-wrapper.hidden{display:none}
  .euridis-toggle-label{font-size:12px;color:#333;min-width:165px;flex-shrink:0}
  .euridis-toggle{position:relative;width:40px;height:20px;flex-shrink:0}
  .euridis-toggle input{opacity:0;width:0;height:0}
.euridis-toggle-slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:20px;transition:.3s}
  .euridis-toggle-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background:#fff;border-radius:50%;transition:.3s}
.euridis-toggle input:checked+.euridis-toggle-slider{background:var(--euridis-primary)}
  .euridis-toggle input:checked+.euridis-toggle-slider:before{transform:translateX(20px)}
  .euridis-toggle-text{font-size:11px;color:#666;min-width:28px}

/* Collapsible Sections */
.euridis-questions{background:var(--euridis-bg-light);padding:10px 12px;margin:6px 0;border-radius:4px;font-size:.85em;color:var(--euridis-text-muted);overflow:hidden;transition:max-height .3s,opacity .3s,padding .3s;max-height:500px}
  .euridis-questions.collapsed{max-height:0!important;opacity:0;padding:0 12px;margin:0}
.euridis-questions h4{margin:6px 0;color:var(--euridis-primary);font-size:.95em}
  .euridis-questions ul{margin-bottom:8px;padding-left:18px}
  .euridis-questions li{margin:2px 0}
.euridis-toggle-questions{background:var(--euridis-bg-light);border:1px solid var(--euridis-primary);color:var(--euridis-primary);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:500;margin:6px 0;transition:all var(--euridis-transition);display:inline-flex;align-items:center;gap:4px}
.euridis-toggle-questions:hover{background:var(--euridis-primary);color:#fff}
.euridis-toggle-questions .icon{transition:transform .3s;font-size:10px}
  .euridis-toggle-questions.active .icon{transform:rotate(180deg)}
.euridis-info{background:#e7f3ff;padding:8px 10px;border-radius:4px;margin-bottom:10px;border-left:3px solid var(--euridis-primary);font-size:.85em;line-height:1.5;overflow:hidden;transition:max-height .3s,opacity .3s,padding .3s;max-height:200px}
  .euridis-info.collapsed{max-height:0!important;opacity:0;padding:0 10px;margin:0;border:none}

/* Action Buttons */
  .euridis-footer-actions{display:flex;gap:16px;justify-content:center;align-items:center;padding:16px 0 8px;margin-top:16px;border-top:2px solid #e8e8e8}
.euridis-btn-save{background:linear-gradient(135deg,var(--euridis-success) 0%,var(--euridis-success-light) 100%);color:#fff;border:none;border-radius:10px;padding:18px 48px;font-size:18px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(40,167,69,.4);transition:all .3s;display:inline-flex;align-items:center;gap:10px;min-width:240px;justify-content:center}
  .euridis-btn-save:hover{background:linear-gradient(135deg,#218838 0%,#1aa179 100%);transform:translateY(-2px);box-shadow:0 8px 25px rgba(40,167,69,.5)}
  .euridis-btn-save:active{transform:translateY(0);box-shadow:0 3px 10px rgba(40,167,69,.3)}
.euridis-btn-reset{background:var(--euridis-secondary);color:#fff;border:none;border-radius:var(--euridis-radius);padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition);display:inline-flex;align-items:center;gap:6px}
  .euridis-btn-reset:hover{background:#5a6268;transform:translateY(-1px)}
  #puzzle-edit .btn-edit{display:none!important}

/* Scoring Emojis */
  .readonly-label.badge.euridis-emoji-replaced{font-size:18px;line-height:1.2;padding:4px 8px;background:transparent!important;border:none!important;box-shadow:none!important}

/* Phone Standardization */
[id^="control_group_phone-"] a[href^="tel:"],.fieldtype-phonenumber a[href^="tel:"]{display:inline-flex!important;align-items:center;text-decoration:none;color:inherit;transition:all var(--euridis-transition);white-space:nowrap}
[id^="control_group_phone-"] a[href^="tel:"]:hover .euridis-phone-number,.fieldtype-phonenumber a[href^="tel:"]:hover .euridis-phone-number{text-decoration:underline;color:var(--euridis-primary-dark)}
  .euridis-phone-flag{margin-right:6px;flex-shrink:0;vertical-align:middle;border-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,.15)}
.euridis-phone-number{color:var(--euridis-primary);font-weight:500;letter-spacing:0.3px;white-space:nowrap}
.euridis-phone-invalid{color:var(--euridis-danger);font-weight:600;margin-right:4px}

/* Formation Quick Select */
.euridis-quick-select-btn{background:var(--euridis-primary);color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition);white-space:nowrap;margin-left:10px;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 4px rgba(0,102,204,.2)}
.euridis-quick-select-btn:hover{background:var(--euridis-primary-dark);transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,102,204,.3)}
.euridis-quick-select-btn.deselect-mode{background:var(--euridis-secondary);box-shadow:0 2px 4px rgba(108,117,125,.2)}
.euridis-quick-select-btn.deselect-mode:hover{background:#5a6268}
  .bootstrap-select .dropdown-menu li.disabled a .text{display:flex!important;justify-content:space-between!important;align-items:center!important;width:100%!important}

/* History View */
.euridis-form-container{transition:transform .3s ease,opacity .3s ease}
.euridis-form-container.hidden{transform:translateX(-100%);opacity:0;position:absolute;pointer-events:none}
.euridis-history-view{display:none;flex-direction:column;height:100%;animation:slideInRight .3s ease}
.euridis-history-view.visible{display:flex}
@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}

.euridis-history-header{display:flex;align-items:center;gap:12px;padding:10px 0 16px;border-bottom:2px solid var(--euridis-border);margin-bottom:16px}
.euridis-history-back{background:var(--euridis-secondary);color:#fff;border:none;border-radius:var(--euridis-radius);padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition);display:inline-flex;align-items:center;gap:6px}
.euridis-history-back:hover{background:#5a6268;transform:translateX(-2px)}
.euridis-history-title{flex:1;margin:0;font-size:1.1em;color:var(--euridis-primary)}
.euridis-history-count{background:var(--euridis-primary);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}

.euridis-history-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;overflow-y:auto;padding-right:4px;flex:1;grid-auto-rows:min-content}
.euridis-history-empty{text-align:center;color:var(--euridis-text-muted);padding:40px;font-size:14px;grid-column:1/-1}

.euridis-history-card{background:#fff;border:1px solid var(--euridis-border);border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:all var(--euridis-transition)}
.euridis-history-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.12);transform:translateY(-2px)}

.euridis-card-header{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(135deg,var(--euridis-primary) 0%,var(--euridis-primary-light) 100%);color:#fff}
.euridis-version-badge{background:rgba(255,255,255,.25);padding:4px 10px;border-radius:12px;font-size:12px;font-weight:700}
.euridis-version-time{flex:1;font-size:12px;opacity:.9}

.euridis-card-info{padding:8px 12px;background:var(--euridis-bg-light);border-bottom:1px solid var(--euridis-border);font-size:12px;color:var(--euridis-text-muted)}
.euridis-card-formation{font-weight:500}

.euridis-card-preview{padding:12px;max-height:200px;overflow-y:auto;font-size:11px;line-height:1.4;border-bottom:1px solid var(--euridis-border)}
.euridis-preview-content{transform:scale(.85);transform-origin:top left;width:118%;pointer-events:none}
.euridis-preview-content h2,.euridis-preview-content h3{font-size:12px!important;margin:4px 0!important}
.euridis-preview-content p{margin:2px 0!important;font-size:10px!important}

.euridis-version-restore{display:block;width:100%;padding:10px;background:var(--euridis-success);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition)}
.euridis-version-restore:hover{background:#218838}

.euridis-btn-history{background:linear-gradient(135deg,#6c5ce7 0%,#a29bfe 100%);color:#fff;border:none;border-radius:var(--euridis-radius);padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition);display:inline-flex;align-items:center;gap:6px}
.euridis-btn-history:hover{background:linear-gradient(135deg,#5b4cdb 0%,#8c7ae6 100%);transform:translateY(-1px)}

/* Modal Confirm */
.euridis-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10001;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.euridis-modal-confirm{background:#fff;border-radius:10px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,.3);animation:scaleIn .2s ease}
@keyframes scaleIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
.euridis-modal-confirm h4{margin:0 0 12px;color:var(--euridis-text);font-size:16px}
.euridis-modal-confirm p{margin:0 0 20px;color:var(--euridis-text-muted);font-size:14px;line-height:1.5}
.euridis-modal-actions{display:flex;gap:12px;justify-content:flex-end}
.euridis-modal-cancel{background:var(--euridis-secondary);color:#fff;border:none;border-radius:var(--euridis-radius);padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition)}
.euridis-modal-cancel:hover{background:#5a6268}
.euridis-modal-ok{background:var(--euridis-primary);color:#fff;border:none;border-radius:var(--euridis-radius);padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;transition:all var(--euridis-transition)}
.euridis-modal-ok:hover{background:var(--euridis-primary-dark)}
.euridis-modal-danger{background:var(--euridis-danger)!important}
.euridis-modal-danger:hover{background:#c82333!important}

/* Responsive */
@media (max-width:900px){.euridis-columns{grid-template-columns:1fr}}
  @media (max-width:768px){
  .euridis-floating-panel{width:95vw;max-height:95vh}
  .euridis-panel-body{padding:10px 14px 16px}
  .euridis-section{padding:8px 10px;margin:0 0 8px 0}
  .euridis-section h3{font-size:.9em}
  .euridis-field-inline{display:block;margin-right:0;margin-bottom:10px}
  .euridis-field-inline select,#admisNonAdmis{min-width:100%;width:100%}
  .euridis-open-modal-btn{padding:10px 16px;font-size:14px}
  .euridis-panel-title{font-size:.95em}
  .euridis-footer-actions{flex-direction:column-reverse;gap:10px}
  .euridis-btn-save{min-width:100%;width:100%;padding:16px 40px;font-size:17px}
  .euridis-btn-reset{width:100%}
  .euridis-btn-history{width:100%}
  .euridis-history-grid{grid-template-columns:1fr}
  .euridis-history-header{flex-wrap:wrap}
  }
  @media (max-width:480px){
  .euridis-floating-panel{top:2vh;width:96vw;max-height:96vh;border-radius:8px;min-height:300px}
  .euridis-panel-header{padding:8px 10px}
  .euridis-panel-body{padding:8px 12px 14px}
  .euridis-section{padding:8px;margin:0 0 6px 0}
  .euridis-section h3{font-size:.85em;padding-bottom:5px}
  .euridis-field{margin:6px 0}
  .euridis-field label{font-size:11px}
  .euridis-field input,.euridis-field select,.euridis-field textarea{padding:4px 6px;font-size:11px}
  .euridis-open-modal-btn{padding:8px 12px;font-size:13px;gap:6px}
  .euridis-footer-actions{padding:12px 0 6px}
  .euridis-btn-save{padding:14px 32px;font-size:16px}
  .euridis-btn-reset{padding:8px 16px;font-size:12px}
}`;

        return {
            /** @returns {string} Les styles CSS complets */
            getStyles: () => STYLES,

            /** Injecte les styles dans le document */
            inject() {
                if (document.getElementById(CONFIG.dom.styleId)) return;

        const style = document.createElement('style');
                style.id = CONFIG.dom.styleId;
                style.textContent = STYLES;
        document.head.appendChild(style);
    }
        };
    })();

    // ============================================
    // 💾 MODULE : SAUVEGARDE
    // ============================================

    /**
     * Module de gestion de la sauvegarde des données
     * @namespace SaveModule
     */
    const SaveModule = {
        /** Sauvegarde les données vers le serveur */
        async saveToServer(html) {
            if (!html || State.isSaving) return;
            const form = DOMCache.get('#form_edit_agents');
            if (!form) return;

            // Inclure les données d'historique encodées
            let finalHtml = html;
            try {
                const versions = HistoryModule.getVersionsForServer();
                finalHtml = HistoryModule.insertIntoHtml(html, versions);
            } catch (e) {
                console.error('[Euridis][History] Erreur inclusion historique:', e);
            }

            const params = new URLSearchParams();
            const idx = form.querySelector('input[name="index"]')?.value;
            if (idx) params.set('index', idx);
            params.set('table', 'agents');
            params.set('formid', 'form_edit_agents');
            params.set('formMode', 'ajax');
            params.set('modulename', 'agents');
            params.set(CONFIG.form.targetField, finalHtml);

            try {
                State.isSaving = true;
                const res = await fetch(form.getAttribute('action') || location.href, {
                    method: 'POST',
                    body: params.toString(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                    credentials: 'include'
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                await res.text().catch(() => null);
                State.lastHtmlSnapshot = finalHtml;
                State.lastSnapshot = normalizeHtml(finalHtml);
                this.updateDisplay(finalHtml);
            } catch (e) {
                console.error('[Euridis] Erreur sauvegarde:', e);
                throw e;
            } finally {
                State.isSaving = false;
            }
        },

        /** Met à jour l'affichage du champ observations */
        updateDisplay(html) {
            if (!html) return;
            const grp = DOMCache.get(`#control_group_${CONFIG.form.targetField}`);
            if (!grp) return;
            let lbl = grp.querySelector(`.readonly-label[for="${CONFIG.form.targetField}"]`);
            if (!lbl) {
                const rt = grp.querySelector('.fieldtype-richtext');
                if (rt) { lbl = document.createElement('label'); lbl.className = 'readonly-label'; lbl.setAttribute('for', CONFIG.form.targetField); rt.appendChild(lbl); }
            }
            if (lbl) lbl.innerHTML = html;
        },

        /** Planifie une sauvegarde debounced */
        scheduleSave(blockHtml) {
            if (!blockHtml) return;
            const final = ContentModule.composeFinal(blockHtml);
            if (final && normalizeHtml(final) !== State.lastSnapshot) debouncedSave(final);
        }
    };

    // ============================================
    // 📝 MODULE : FORMULAIRE
    // ============================================

    /**
     * Module de gestion du formulaire de trame d'entretien
     * @namespace FormModule
     */
    const FormModule = (() => {
        /**
         * Génère les options de notes (20 à 1 par 0.5)
         * @returns {string} HTML des options
         */
        const generateNoteOptions = () => {
            let options = '';
            for (let i = 20; i >= 1; i -= 0.5) {
                options += `<option value="${i}">${i}</option>`;
            }
            return options;
        };

        /**
         * Génère le HTML du formulaire
         * @returns {string} HTML complet du formulaire
         */
        const createFormHTML = () => `
  <div class="euridis-form-container" id="euridisForm">
  <button class="euridis-toggle-questions" id="consignesToggle" data-action="toggle-consignes">
    <span class="icon">▼</span><span class="text">Consignes</span>
    </button>
    <div class="euridis-info collapsed" id="consignesInfo">
        <strong>Objectif :</strong> S'assurer que l'orientation que le candidat prend est cohérente avec son projet professionnel et déterminer si nous allons pouvoir l'accompagner.<br>
        <strong>Durée :</strong> 15 minutes<br>
        <strong>Déroulé :</strong> Pitch de l'étudiant / Q/R / Questions de l'étudiant / Rappel Next Step Coaching
    </div>
    <div class="euridis-columns">
      <div class="euridis-column">
        <div class="euridis-section">
            <h3>👤 Informations Générales</h3>
            <div class="euridis-field">
                <label for="nomEvaluateur">Nom de l'évaluateur :</label>
                <input type="text" id="nomEvaluateur" placeholder="Nom et prénom de l'évaluateur">
            </div>
            <div class="euridis-field euridis-field-inline">
                <label for="noteEntretien">Note d'entretien (sur 20) :</label>
          <select id="noteEntretien"><option value="">-- Sélectionner --</option>${generateNoteOptions()}</select>
            </div>
            <div class="euridis-field euridis-field-inline">
                <label for="admisNonAdmis">Décision :</label>
          <select id="admisNonAdmis"><option value="">-- Sélectionner --</option><option value="Admis">✅ Admis</option><option value="Non Admis">❌ Non Admis</option></select>
            </div>
        </div>
        <div class="euridis-section">
            <h3>💡 Profil & Motivation du candidat</h3>
        <button class="euridis-toggle-questions" data-action="toggle-questions"><span class="icon">▼</span><span class="text">Afficher les questions suggérées</span></button>
            <div class="euridis-questions collapsed">
          <h4>Objectif :</h4><p>Évaluer la cohérence entre parcours, motivation et posture du candidat pour valider son adéquation avec la formation.</p>
                <h4>Questions suggérées :</h4>
          <ul style="margin:5px 0;padding-left:20px"><li>Peux-tu me présenter ton parcours d'études actuel ?</li><li>Pourquoi avoir choisi ce parcours ?</li><li>Qu'as-tu retenu ou appris de plus utile pour la formation que tu vises ?</li><li>Quelles compétences ou connaissances penses-tu pouvoir valoriser ?</li><li>Pourquoi avoir choisi de candidater pour cette formation ?</li><li>Quels sont les défis que tu vas devoir relever pour réussir dans cette formation ?</li><li>Quelles sont selon toi tes qualités et axes d'amélioration par rapport à cette formation ?</li><li>Quels sont tes centres d'intérêt ou tes passions ?</li></ul>
            </div>
        <div class="euridis-field"><label for="profilMotivation">Notes - Profil & Motivation :</label><textarea id="profilMotivation" class="textarea-medium" placeholder="Entrez vos observations sur le profil et la motivation du candidat..."></textarea></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">✓ Maîtrise du français (comprendre et parler)</span><label class="euridis-toggle"><input type="checkbox" id="maitriseFrancais" checked><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="maitriseFrancaisText">Oui</span></div>
            </div>
        <div class="euridis-section">
            <h3>🏫 Perception et choix de l'école</h3>
        <button class="euridis-toggle-questions" data-action="toggle-questions"><span class="icon">▼</span><span class="text">Afficher les questions suggérées</span></button>
            <div class="euridis-questions collapsed">
          <h4>Objectif :</h4><p>Analyser la perception, les motivations et le positionnement du candidat pour mesurer l'attractivité réelle d'Euridis.</p>
                <h4>Questions suggérées :</h4>
          <ul style="margin:5px 0;padding-left:20px"><li>Comment as-tu connu Euridis ?</li><li>Qu'est-ce qui t'a donné envie de postuler chez nous ?</li><li>Qu'as-tu compris de notre positionnement et de ce qui nous différencie des autres écoles ?</li><li>T'es-tu renseigné sur Euridis avant cet entretien ? Si oui, comment ?</li><li>As-tu candidaté dans d'autres établissements ? Lesquels ?</li><li>Quelles autres formations ou domaines vises-tu actuellement ?</li><li>Selon toi, en quoi Euridis correspond à ton projet professionnel ?</li><li>Si tu devais classer tes choix de formation, où placerais-tu Euridis ?</li></ul>
            </div>
        <div class="euridis-field"><label for="perceptionEcole">Notes - Perception de l'école :</label><textarea id="perceptionEcole" class="textarea-small" placeholder="Entrez vos observations sur la perception et le choix de l'école..."></textarea></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">⭐ Euridis est le choix n°1 du candidat</span><label class="euridis-toggle"><input type="checkbox" id="euridisChoix1"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="euridisChoix1Text">Non</span></div>
            </div>
            </div>
      <div class="euridis-column">
        <div class="euridis-section">
            <h3>🎯 Projet professionnel & alternance</h3>
        <button class="euridis-toggle-questions" data-action="toggle-questions"><span class="icon">▼</span><span class="text">Afficher les questions suggérées</span></button>
            <div class="euridis-questions collapsed">
          <h4>Objectif :</h4><p>Évaluer la clarté, la maturité et la cohérence du projet professionnel du candidat en lien avec l'alternance et ses expériences professionnelles.</p>
                <h4>Questions suggérées :</h4>
          <ul style="margin:5px 0;padding-left:20px"><li>Peux-tu me parler de tes expériences professionnelles (stage/alternance/CDD/CDI)?</li><li>Lesquels ont, selon toi, le plus de lien avec ton projet actuel ?</li><li>Pourquoi souhaites-tu suivre ta formation en alternance ?</li><li>Qu'as-tu compris du fonctionnement tripartite (école / étudiant / entreprise) ?</li><li>As-tu déjà commencé à chercher une entreprise ? Si oui, comment t'y prends-tu ?</li><li>As-tu déjà trouvé une entreprise ? (Si oui, indiquez le nom et les coordonnées.)</li><li>Quels secteurs d'activité t'intéressent particulièrement, et pourquoi ?</li><li>Quels métiers ou missions vises-tu à travers cette formation ?</li><li>Quelle est ta zone de recherche géographique ? As-tu le permis B ?</li><li>Comment te projettes-tu après la formation : poursuite d'études, entrée sur le marché du travail ?</li><li>Et si on se revoit dans 5 ans, où te vois-tu professionnellement ?</li><li>Quelles sont tes disponibilités pour démarrer les coachings et la recherche d'entreprise ?</li></ul>
            </div>
        <div class="euridis-field"><label for="projetPro">Notes - Projet professionnel :</label><textarea id="projetPro" class="textarea-small" placeholder="Entrez vos observations sur le projet professionnel et l'alternance..."></textarea></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">🚗 Permis de conduire</span><label class="euridis-toggle"><input type="checkbox" id="permis"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="permisText">Non</span></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">💼 A déjà son alternance</span><label class="euridis-toggle"><input type="checkbox" id="alternance"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="alternanceText">Non</span></div>
            </div>
        <div class="euridis-section">
            <h3>📊 Synthèse du profil</h3>
        <button class="euridis-toggle-questions" data-action="toggle-questions"><span class="icon">▼</span><span class="text">Afficher les exemples</span></button>
            <div class="euridis-questions collapsed">
          <h4>Objectif :</h4><p>Synthétiser les forces et axes d'amélioration du candidat pour orienter la décision et le coaching.</p>
                <h4>Exemples :</h4>
          <ul style="margin:5px 0;padding-left:20px"><li><strong>Points forts :</strong> Motivé, clair dans son discours, bonne posture, projet cohérent, dynamique, curieux.</li><li><strong>Points à travailler :</strong> Manque de maturité pro, projet flou, discours à structurer, confiance à renforcer.</li></ul>
            </div>
        <div class="euridis-field"><label for="syntheseProfil">Synthèse :</label><textarea id="syntheseProfil" class="textarea-small" placeholder="Résumez les points forts et axes d'amélioration du candidat..."></textarea></div>
            </div>
        <div class="euridis-section euridis-section-conditional" id="sectionBtsCI">
            <h3>🌍 Pré-requis spécifiques au BTS CI</h3>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">🇬🇧 Anglais (nv B1/B2)</span><label class="euridis-toggle"><input type="checkbox" id="anglaisBTS"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="anglaisBTSText">Non</span></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">🇪🇸 Espagnol (nv A2/B1)</span><label class="euridis-toggle"><input type="checkbox" id="espagnolBTS"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="espagnolBTSText">Non</span></div>
            </div>
        <div class="euridis-section euridis-section-conditional" id="sectionBachelorMastere">
            <h3 id="sectionBachelorMastereTitle">🎓 Pré-requis spécifiques Bachelor/Mastère</h3>
        <div class="euridis-toggle-wrapper" id="wrapperAnglaisBachelor"><span class="euridis-toggle-label">🇬🇧 Bachelor : niveau A2 en anglais (B1 minimum pour les bachelors CI)</span><label class="euridis-toggle"><input type="checkbox" id="anglaisBachelor"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="anglaisBachelorText">Non</span></div>
        <div class="euridis-toggle-wrapper" id="wrapperAnglaisMastere"><span class="euridis-toggle-label">🇬🇧 Mastère : niveau B1 en anglais (B2 idéal pour les mastères internationaux)</span><label class="euridis-toggle"><input type="checkbox" id="anglaisMastere"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="anglaisMastereText">Non</span></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">💻 Intéressé par les nouvelles technologies</span><label class="euridis-toggle"><input type="checkbox" id="technologie"><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="technologieText">Non</span></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">💼 Intéressé par le commerce, la vente et la négociation</span><label class="euridis-toggle"><input type="checkbox" id="commerce" checked><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="commerceText">Oui</span></div>
        <div class="euridis-toggle-wrapper"><span class="euridis-toggle-label">💻 Maîtrise de la bureautique et d'internet</span><label class="euridis-toggle"><input type="checkbox" id="bureautique" checked><span class="euridis-toggle-slider"></span></label><span class="euridis-toggle-text" id="bureautiqueText">Oui</span></div>
            </div>
            </div>
            </div>
    <div class="euridis-footer-actions">
    <button type="button" class="euridis-btn-reset" id="euridisBtnReset" data-action="reset">🔄 Réinitialiser</button>
    <button type="button" class="euridis-btn-history" id="euridisBtnHistory" data-action="history">📜 Historique</button>
    <button type="button" class="euridis-btn-save" id="euridisBtnSave" data-action="save">💾 Sauvegarder</button>
    </div>
</div>`;

        return {
            createFormHTML,
            generateNoteOptions
        };
    })();

    // ============================================
    // 🖼️ MODULE : PANNEAU UI
    // ============================================

    /**
     * Module de gestion du panneau flottant
     * @namespace PanelModule
     */
    const PanelModule = (() => {
        /** Crée le panneau flottant s'il n'existe pas */
        const create = () => {
            if (document.getElementById(CONFIG.dom.panelId)) return;
            let container = document.getElementById(CONFIG.dom.panelContainerId);
            if (!container) {
                container = document.createElement('div');
                container.id = CONFIG.dom.panelContainerId;
                Object.assign(container.style, { position: 'fixed', top: '0', left: '0', width: '0', height: '0', zIndex: '10000', pointerEvents: 'none' });
                (document.documentElement || document.body).appendChild(container);
            }
            const div = document.createElement('div');
            div.innerHTML = `<div class="euridis-floating-panel" id="${CONFIG.dom.panelId}">
                <div class="euridis-panel-header" id="euridisPanelHeader">
                    <div class="euridis-panel-title">📋 Trame d'entretien Euridis</div>
                    <button type="button" class="euridis-panel-close" id="euridisPanelClose" data-action="close">&times;</button>
                </div>
                <div class="euridis-panel-body">${FormModule.createFormHTML()}</div>
            </div>`;
            const panel = div.firstElementChild;
            panel.style.pointerEvents = 'auto';
            container.appendChild(panel);
            setupControls();
            syncContext();
        };

        /** Configure les contrôles du panneau */
        const setupControls = () => {
            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;
            panel.addEventListener('click', handleClick);
            panel.addEventListener('keydown', e => e.key === 'Escape' && close());
            setupDrag(panel, panel.querySelector('#euridisPanelHeader'));
            panel.addEventListener('change', handleChange);
        };

        /** Gère les clics sur le panneau */
        const handleClick = (e) => {
            const t = e.target.closest('[data-action]');
            if (!t) return;
            const a = t.dataset.action;
            if (a === 'close') close();
            else if (a === 'save') forceSave();
            else if (a === 'reset') resetForm();
            else if (a === 'toggle-questions') toggleQuestions(t);
            else if (a === 'toggle-consignes') toggleConsignes(t);
            else if (a === 'history') showHistory();
            else if (a === 'back-to-form') hideHistory();
            else if (a === 'restore-version') handleRestoreVersion(t.dataset.versionId);
        };

        /** Gère les changements de toggles */
        const handleChange = (e) => {
            if (e.target.type === 'checkbox' && ALL_TOGGLES.includes(e.target.id)) {
                const txt = document.getElementById(`${e.target.id}Text`);
                if (txt) txt.textContent = e.target.checked ? 'Oui' : 'Non';
                if (!State.isApplying && FIELD_ID_SET.has(e.target.id)) debouncedSync();
            }
        };

        /** Bascule l'affichage d'une section de questions */
        const toggleQuestions = (btn) => {
            const div = btn.nextElementSibling, icon = btn.querySelector('.icon'), txt = btn.querySelector('.text');
            if (!div || !icon || !txt) return;
            const collapsed = div.classList.contains('collapsed');
            const lbl = txt.textContent.trim();
            if (collapsed) {
                div.style.maxHeight = (div.scrollHeight + 30) + 'px';
                div.classList.remove('collapsed'); btn.classList.add('active');
                icon.textContent = '▲';
                txt.textContent = lbl.includes('exemples') ? 'Masquer les exemples' : 'Masquer les questions suggérées';
            } else {
                div.style.maxHeight = '0'; div.classList.add('collapsed'); btn.classList.remove('active');
                icon.textContent = '▼';
                txt.textContent = btn.closest('.euridis-section')?.querySelector('h3')?.textContent?.includes('Synthèse') ? 'Afficher les exemples' : 'Afficher les questions suggérées';
            }
        };

        /** Bascule l'affichage des consignes */
        const toggleConsignes = (btn) => {
            const div = document.getElementById('consignesInfo'), icon = btn.querySelector('.icon'), txt = btn.querySelector('.text');
            if (!div || !icon || !txt) return;
            if (div.classList.contains('collapsed')) {
                div.style.maxHeight = (div.scrollHeight + 20) + 'px'; div.classList.remove('collapsed'); btn.classList.add('active');
                icon.textContent = '▲'; txt.textContent = 'Masquer';
            } else {
                div.style.maxHeight = '0'; div.classList.add('collapsed'); btn.classList.remove('active');
                icon.textContent = '▼'; txt.textContent = 'Consignes';
            }
        };

        /** Configure le drag & drop */
        const setupDrag = (panel, handle) => {
            if (!panel || !handle) return;
            let dragging = false, sX = 0, sY = 0, iL = 0, iT = 0;
            const onMove = (e) => {
                if (!dragging) return;
                e.preventDefault();
                const mL = Math.max(0, innerWidth - panel.offsetWidth), mT = Math.max(0, innerHeight - 40);
                panel.style.left = `${Math.max(0, Math.min(iL + e.clientX - sX, mL))}px`;
                panel.style.top = `${Math.max(0, Math.min(iT + e.clientY - sY, mT))}px`;
            };
            const stop = () => { if (!dragging) return; dragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', stop); };
            handle.addEventListener('mousedown', (e) => {
                if (e.target.closest('button') || e.button !== 0) return;
                dragging = true; sX = e.clientX; sY = e.clientY;
                const r = panel.getBoundingClientRect(); iL = r.left; iT = r.top;
                panel.style.transform = 'none'; panel.style.left = `${r.left}px`; panel.style.top = `${r.top}px`;
                document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', stop);
            });
        };

        /** Synchronise le contexte du candidat */
        const syncContext = () => {
            const name = DetectionModule.getCandidateName();
            const title = name ? `Trame d'entretien Euridis de ${name}` : `Trame d'entretien Euridis`;
            const titleNode = document.querySelector(`#${CONFIG.dom.panelId} .euridis-panel-title`);
            if (titleNode) titleNode.textContent = title;
            const btnTxt = document.querySelector('#euridisOpenModal .euridis-button-text');
            if (btnTxt) btnTxt.textContent = title;
            DetectionModule.detectFormation();
            updateConditionalSections();
        };

        /** Met à jour les sections conditionnelles selon la formation */
        const updateConditionalSections = () => {
            const f = (State.currentFormation || DetectionModule.detectFormation() || '').toLowerCase();
            const isBach = f.startsWith('bachelor'), isMast = f.startsWith('mastère') || f.startsWith('mastere'), isMBA = f.includes('mba');
            document.getElementById('sectionBtsCI')?.classList.toggle('visible', f.startsWith('bts ci'));
            const sec = document.getElementById('sectionBachelorMastere');
            if (sec) {
                const show = isBach || isMast || isMBA;
                sec.classList.toggle('visible', show);
                const tit = document.getElementById('sectionBachelorMastereTitle');
                if (show && tit) tit.textContent = isBach ? '🎓 Pré-requis spécifiques Bachelor' : isMBA ? '🎓 Pré-requis spécifiques MBA' : '🎓 Pré-requis spécifiques Mastère';
                document.getElementById('wrapperAnglaisBachelor')?.classList.toggle('hidden', !isBach);
                document.getElementById('wrapperAnglaisMastere')?.classList.toggle('hidden', !(isMast || isMBA));
            }
        };

        /** Met à jour les textes de tous les toggles */
        const updateToggleTexts = () => {
            ALL_TOGGLES.forEach(id => {
                const cb = document.getElementById(id), txt = document.getElementById(`${id}Text`);
                if (cb && txt) txt.textContent = cb.checked ? 'Oui' : 'Non';
            });
        };

        /** Réinitialise la taille et la position du panneau */
        const resetSize = (panel) => {
            if (!panel) return;
            const w = innerWidth <= 480 ? innerWidth * 0.96 : Math.min(1100, innerWidth * 0.95);
            const h = Math.min(innerHeight * 0.90, 850);
            Object.assign(panel.style, { width: `${w}px`, height: `${h}px`, left: '50%', top: '3vh', transform: 'translateX(-50%)' });
        };

        /** Configure le listener de redimensionnement */
        const setupResize = () => {
            if (State.resizeListener) return;
            State.resizeListener = debounce(() => {
                const p = document.getElementById(CONFIG.dom.panelId);
                if (p?.classList.contains('visible')) resetSize(p);
            }, 150);
            window.addEventListener('resize', State.resizeListener);
        };

        /** Réinitialise les sections collapsées */
        const resetCollapsed = () => {
            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;
            panel.querySelectorAll('.euridis-questions.collapsed').forEach(d => d.style.maxHeight = '0');
            const ci = document.getElementById('consignesInfo');
            if (ci?.classList.contains('collapsed')) ci.style.maxHeight = '0';
        };

        /** Attend que le contenu des observations soit chargé */
        const waitForObservationsContent = (maxAttempts = 15, delay = 200) => {
            return new Promise((resolve) => {
                let attempts = 0;
                const checkContent = () => {
                    attempts++;
                    DOMCache.invalidate(`#control_group_${CONFIG.form.targetField}`);
                    const obsGroup = document.querySelector(`#control_group_${CONFIG.form.targetField}`);
                    if (obsGroup) {
                        const lbl = obsGroup.querySelector(`.readonly-label[for="${CONFIG.form.targetField}"]`);
                        if (lbl && lbl.innerHTML && lbl.innerHTML.includes(CONFIG.text.markerPrefix)) {
                            resolve(true);
                            return;
                        }
                    }
                    if (attempts >= maxAttempts) {
                        resolve(false);
                        return;
                    }
                    setTimeout(checkContent, delay);
                };
                checkContent();
            });
        };

        /** Recharge les données du formulaire depuis les observations */
        const reloadFormData = async () => {
            await waitForObservationsContent();
            DOMCache.invalidate();
            ContentModule.refreshSnapshots();
            const obs = ContentModule.readObservations(true);

            if (obs?.includes(CONFIG.text.markerPrefix)) {
                const parsed = DataModule.parseObservations(obs);
                if (parsed) {
                    State.isApplying = true;
                    DataModule.applyData(parsed);
                    State.isApplying = false;
                    updateToggleTexts();
                    updateConditionalSections();
                    return;
                }
            }

            State.isApplying = true;
            DataModule.ensureDefaultCheckboxes();
            State.isApplying = false;
            updateToggleTexts();
            updateConditionalSections();
        };

        /** Snapshot des données à l'ouverture pour détecter les changements */
        let openSnapshot = null;

        /** Ouvre le panneau */
        const open = async () => {
            if (DetectionModule.isInEditMode()) return;
            State.hasUserOpened = true;
            StylesModule.inject(); create(); syncContext();

            // Attendre le chargement des données avant d'ouvrir
            await reloadFormData();

            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;
            resetSize(panel); setupResize();
            document.body.classList.add('euridis-modal-open');
            panel.classList.add('visible'); panel.setAttribute('aria-hidden', 'false');
            resetCollapsed(); updateToggleTexts(); updateConditionalSections();
            setTimeout(() => (document.getElementById('nomEvaluateur') || panel).focus(), 10);

            // Stocker un snapshot des données à l'ouverture (pour comparaison à la fermeture)
            openSnapshot = JSON.stringify(DataModule.collectData());
        };

        /** Affiche la modale de confirmation */
        const showConfirmModal = (title, message, onConfirm, isDanger = false) => {
            const overlay = document.createElement('div');
            overlay.className = 'euridis-modal-overlay';
            overlay.innerHTML = `
                <div class="euridis-modal-confirm">
                    <h4>${escapeHtml(title)}</h4>
                    <p>${escapeHtml(message)}</p>
                    <div class="euridis-modal-actions">
                        <button type="button" class="euridis-modal-cancel">Annuler</button>
                        <button type="button" class="euridis-modal-ok ${isDanger ? 'euridis-modal-danger' : ''}">Confirmer</button>
                    </div>
                </div>
            `;

            const closeModal = () => overlay.remove();
            overlay.querySelector('.euridis-modal-cancel').addEventListener('click', closeModal);
            overlay.querySelector('.euridis-modal-ok').addEventListener('click', () => {
                closeModal();
                onConfirm();
            });
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

            document.body.appendChild(overlay);
        };

        /** Affiche la vue historique */
        const showHistory = () => {
            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;

            const body = panel.querySelector('.euridis-panel-body');
            if (!body) return;

            // Cacher le formulaire
            const form = body.querySelector('.euridis-form-container');
            if (form) form.classList.add('hidden');

            // Supprimer l'ancienne vue historique si elle existe
            const oldHistory = body.querySelector('.euridis-history-view');
            if (oldHistory) oldHistory.remove();

            // Créer et afficher la vue historique
            const historyHtml = HistoryModule.renderHistoryView();
            body.insertAdjacentHTML('beforeend', historyHtml);

            const historyView = body.querySelector('.euridis-history-view');
            if (historyView) {
                setTimeout(() => historyView.classList.add('visible'), 10);
            }
        };

        /** Cache la vue historique et revient au formulaire */
        const hideHistory = () => {
            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;

            const body = panel.querySelector('.euridis-panel-body');
            if (!body) return;

            // Supprimer la vue historique
            const historyView = body.querySelector('.euridis-history-view');
            if (historyView) historyView.remove();

            // Réafficher le formulaire
            const form = body.querySelector('.euridis-form-container');
            if (form) form.classList.remove('hidden');
        };

        /** Gère la restauration d'une version */
        const handleRestoreVersion = (versionId) => {
            if (!versionId) return;

            showConfirmModal(
                '🔄 Restaurer cette version ?',
                'Les données actuelles du formulaire seront remplacées par cette version.',
                () => {
                    const version = HistoryModule.getVersionById(versionId);
                    if (!version) {
                        alert('❌ Version introuvable');
                        return;
                    }

                    // Appliquer les données de la version
                    State.isApplying = true;
                    DataModule.applyData(version.formData);
                    State.isApplying = false;
                    updateToggleTexts();
                    updateConditionalSections();

                    // Créer une nouvelle version après restauration
                    HistoryModule.createVersion(version.formData, true);

                    // Mettre à jour le snapshot pour éviter un doublon à la fermeture
                    openSnapshot = JSON.stringify(version.formData);

                    // Revenir au formulaire
                    hideHistory();

                    // Sauvegarder sur le serveur
                    const html = DataModule.buildHTML(version.formData);
                    const final = ContentModule.composeFinal(html);
                    if (final) {
                        SaveModule.saveToServer(final)
                            .then(() => alert('✅ Version restaurée avec succès !'))
                            .catch(() => alert('❌ Erreur lors de la sauvegarde'));
                    }
                }
            );
        };

        /** Ferme le panneau */
        const close = () => {
            const panel = document.getElementById(CONFIG.dom.panelId);
            if (!panel) return;

            // Créer une version à la fermeture SEULEMENT si des modifications ont été faites
            const currentData = DataModule.collectData();
            const currentSnapshot = JSON.stringify(currentData);
            if (openSnapshot && currentSnapshot !== openSnapshot) {
                HistoryModule.createVersion(currentData);
            }
            openSnapshot = null; // Réinitialiser le snapshot

            // Fermer la vue historique si ouverte
            hideHistory();

            document.body.classList.remove('euridis-modal-open');
            panel.classList.remove('visible'); panel.setAttribute('aria-hidden', 'true');
        };

        /** Réinitialise le formulaire */
        const resetForm = () => {
            if (!confirm('Réinitialiser tous les champs ?')) return;
            DataModule.clearForm(true);
            // Mettre à jour le snapshot après réinitialisation
            openSnapshot = JSON.stringify(DataModule.collectData());
            alert('✅ Formulaire réinitialisé !');
        };

        /** Force la sauvegarde */
        const forceSave = () => {
            const data = DataModule.collectData();
            const html = DataModule.buildHTML(data);
            const final = ContentModule.composeFinal(html);
            if (!final) { alert('❌ Aucune donnée à sauvegarder'); return; }

            // Créer une version lors de la sauvegarde manuelle
            HistoryModule.createVersion(data);

            // Mettre à jour le snapshot pour éviter un doublon à la fermeture
            openSnapshot = JSON.stringify(data);

            debouncedSync.cancel(); debouncedSave.cancel();
            SaveModule.saveToServer(final).then(() => alert('✅ Sauvegarde effectuée avec succès !')).catch(() => alert('❌ Erreur lors de la sauvegarde'));
        };

        /** Crée le bouton d'ouverture */
        const createOpenButton = () => {
            const edit = DetectionModule.isInEditMode();
            const warn = edit ? `<div class="euridis-edit-mode-warning"><span class="icon">⚠️</span><span>La trame d'entretien Euridis n'est pas disponible en mode édition. Merci de quitter le mode édition pour pouvoir ouvrir la trame.</span></div>` : '';
            return `<div class="euridis-open-modal-wrapper">${warn}<button type="button" class="euridis-open-modal-btn" id="euridisOpenModal" ${edit ? 'disabled' : ''}><span>📝</span><span class="euridis-button-text">Trame d'entretien Euridis</span></button></div>`;
        };

        return { create, open, close, createOpenButton, syncContext, updateConditionalSections, updateToggleTexts, reloadFormData, showHistory, hideHistory, waitForObservationsContent };
    })();

    // ============================================
    // 📊 MODULE : DONNÉES DU FORMULAIRE
    // ============================================

    /**
     * Module de gestion des données du formulaire
     * @namespace DataModule
     */
    const DataModule = (() => {
        /**
         * Collecte les données du formulaire
         * @returns {Object} Données collectées
         */
        const collectData = () => {
        const data = {};
        FIELD_KEYS.forEach(key => {
            const cfg = CONFIG.fields[key];
            const el = document.getElementById(cfg.id);
                data[key] = !el
                    ? (cfg.type === 'checkbox' ? false : '')
                    : (cfg.type === 'checkbox' ? el.checked : (el.value || ''));
        });
        return data;
        };

        /**
         * Applique les données au formulaire
         * @param {Object} data - Données à appliquer
         */
        const applyData = (data) => {
        if (!data) {
            ensureDefaultCheckboxes();
            return;
        }

        const defaultChecked = ['maitriseFrancais', 'commerce', 'bureautique'];

        FIELD_KEYS.forEach(key => {
            const cfg = CONFIG.fields[key];
            const el = document.getElementById(cfg.id);
            if (!el) return;

            if (key in data) {
                const val = data[key];
                if (cfg.type === 'checkbox') {
                    el.checked = Boolean(val);
                } else if (val != null && val !== '') {
                    el.value = val;
                    if (el.tagName === 'SELECT') el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (cfg.type === 'checkbox' && defaultChecked.includes(key)) {
                el.checked = true;
            }
        });
        };

        /**
         * Applique les valeurs par défaut aux checkboxes
         */
        const ensureDefaultCheckboxes = () => {
            Object.entries(CONFIG.defaults).forEach(([key, value]) => {
            const el = document.getElementById(CONFIG.fields[key]?.id || key);
                if (el?.type === 'checkbox') {
                    el.checked = !!value;
                }
            });
        };

        /**
         * Efface le formulaire
         * @param {boolean} triggerSync - Déclencher la synchronisation
         */
        const clearForm = (triggerSync = false) => {
            const form = document.getElementById('euridisForm');
            if (!form) return;

            State.isApplying = true;

            form.querySelectorAll('input, textarea, select').forEach(field => {
                const key = FIELD_ID_TO_KEY[field.id];
                const defaultVal = CONFIG.defaults[key];

                if (field.type === 'checkbox') {
                    field.checked = !!defaultVal;
                } else if (field.tagName === 'SELECT') {
                    field.value = defaultVal || '';
                    field.dispatchEvent(new Event('change'));
                } else {
                    field.value = defaultVal || '';
                }
            });

            ensureDefaultCheckboxes();
            State.isApplying = false;
            PanelModule.updateToggleTexts();

            if (triggerSync) debouncedSync();
        };

        /**
         * Construit le HTML du rapport
         * @param {Object} data - Données du formulaire
         * @returns {string} HTML du rapport
         */
        const buildHTML = (data) => {
        const p = [];
        const multi = (v) => {
            const t = (v || '').trim();
            if (!t) return '<p style="margin:0;padding:0;">-</p>';
                return t.split('\n').map(l => `<p style="margin:0;padding:0;">${escapeHtml(l)}</p>`).join('');
        };
            const bool = (v) => v
                ? '<strong style="color:#28a745;">✅ OUI</strong>'
                : '<strong style="color:#dc3545;">❌ NON</strong>';

        const titleStyle = 'style="color:#0066cc;font-size:18px;font-weight:bold;margin:0 0 10px 0;"';
        const sectionStyle = 'style="color:#333;font-size:14px;font-weight:bold;background:#f0f7ff;padding:8px 12px;margin:12px 0 8px 0;border-left:3px solid #0066cc;"';
        const labelStyle = 'style="font-weight:bold;color:#555;"';
        const valueStyle = 'style="margin:2px 0;"';

            const candidateName = DetectionModule.getCandidateName();
        const titleText = candidateName
            ? `===== COMPTE-RENDU D'ENTRETIEN EURIDIS DE ${candidateName.toUpperCase()} =====`
                : CONFIG.text.marker;

            p.push(`<h2 ${titleStyle}>${titleText}</h2>`);
        p.push(`<h3 ${sectionStyle}>■ INFORMATIONS GÉNÉRALES</h3>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Évaluateur :</span> ${escapeHtml(data.nomEvaluateur || 'Non renseigné')}</p>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Note d'entretien :</span> ${data.noteEntretien ? `<strong>${data.noteEntretien}/20</strong>` : 'Non renseignée'}</p>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Décision :</span> <strong>${escapeHtml(data.admisNonAdmis || 'Non renseignée')}</strong></p>`);

        p.push(`<h3 ${sectionStyle}>► ${CONFIG.sections.profilMotivation}</h3>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Notes :</span></p>`);
        p.push(multi(data.profilMotivation));
        p.push(`<p ${valueStyle}><span ${labelStyle}>Maîtrise du français :</span> ${bool(data.maitriseFrancais)}</p>`);

        p.push(`<h3 ${sectionStyle}>► ${CONFIG.sections.projetPro}</h3>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Notes :</span></p>`);
        p.push(multi(data.projetPro));
        p.push(`<p ${valueStyle}><span ${labelStyle}>Permis de conduire :</span> ${bool(data.permis)}</p>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Alternance déjà trouvée :</span> ${bool(data.alternance)}</p>`);

        p.push(`<h3 ${sectionStyle}>► ${CONFIG.sections.perceptionEcole}</h3>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Notes :</span></p>`);
        p.push(multi(data.perceptionEcole));
        p.push(`<p ${valueStyle}><span ${labelStyle}>Euridis choix n°1 :</span> ${bool(data.euridisChoix1)}</p>`);

        p.push(`<h3 ${sectionStyle}>► ${CONFIG.sections.syntheseProfil}</h3>`);
        p.push(`<p ${valueStyle}><span ${labelStyle}>Notes :</span></p>`);
        p.push(multi(data.syntheseProfil));

            const formation = (State.currentFormation || DetectionModule.detectFormation() || '').toLowerCase();
        const isBtsCI = formation.startsWith('bts ci');
        const isBachelor = formation.startsWith('bachelor');
        const isMastere = formation.startsWith('mastère') || formation.startsWith('mastere');
        const isMBA = formation.includes('mba');

        if (isBtsCI) {
            p.push(`<h3 ${sectionStyle}>► ${CONFIG.sections.btsPrereq}</h3>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Anglais (B1/B2) :</span> ${bool(data.anglaisBTS)}</p>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Espagnol (A2/B1) :</span> ${bool(data.espagnolBTS)}</p>`);
        }

            if (isBachelor || isMastere || isMBA) {
                const sectionTitle = isBachelor ? 'PRÉ-REQUIS BACHELOR' : isMBA ? 'PRÉ-REQUIS MBA' : 'PRÉ-REQUIS MASTÈRE';
            p.push(`<h3 ${sectionStyle}>► ${sectionTitle}</h3>`);
                p.push(`<p ${valueStyle}><span ${labelStyle}>${isBachelor ? 'Niveau anglais Bachelor (A2/B1)' : 'Niveau anglais Mastère (B1/B2)'} :</span> ${bool(isBachelor ? data.anglaisBachelor : data.anglaisMastere)}</p>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Intéressé par les nouvelles technologies :</span> ${bool(data.technologie)}</p>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Intéressé par le commerce, la vente et la négociation :</span> ${bool(data.commerce)}</p>`);
            p.push(`<p ${valueStyle}><span ${labelStyle}>Maîtrise de la bureautique et d'internet :</span> ${bool(data.bureautique)}</p>`);
        }

        return p.join('');
        };

        /**
         * Parse les observations sauvegardées
         * @param {string} text - Texte brut des observations
         * @returns {Object|null} Données parsées ou null
         */
        const parseObservations = (text) => {
            const markerIdx = text.lastIndexOf(CONFIG.text.markerPrefix);
        if (markerIdx === -1) return null;

        const block = text.slice(markerIdx).trim();
        const data = {};
        let hasValue = false;

        const extract = (label) => {
            const escapedLabel = label.includes('\\(') ? label : escapeRegExp(label);
            const regex = new RegExp(`${escapedLabel}\\s*:\\s*([^\\n]+)`, 'i');
            const m = regex.exec(block);
            return m ? m[1].trim() : '';
        };

        const extractBool = (label) => {
            const val = extract(label);
            if (!val) return undefined;

            // Détecter les émojis
            if (val.includes('✅')) return true;
            if (val.includes('❌')) return false;

            // Fallback: recherche textuelle
            const norm = val.replace(/[^\w]/g, ' ').trim().toLowerCase();
            if (norm.includes('oui') || norm.includes('true')) return true;
            if (norm.includes('non') || norm.includes('false')) return false;

            return undefined;
        };

        const extractSec = (title) => {
            // Chercher avec le nouveau format (►)
            const headerNew = `► ${title}`;
            let regex = new RegExp(`${escapeRegExp(headerNew)}\\s*([\\s\\S]*?)(?=\\n► |\\n■ |$)`, 'i');
            let m = regex.exec(block);
            if (m) return m[1].trim();

            // Fallback: ancien format (====)
            const headerOld = `==== ${title} ====`;
            regex = new RegExp(`${escapeRegExp(headerOld)}\\s*([\\s\\S]*?)(?=\\n==== |$)`, 'i');
            m = regex.exec(block);
            return m ? m[1].trim() : '';
        };

        const extractNotes = (secBlock, stopList) => {
            if (!secBlock) return '';
            const lines = secBlock.split('\n').map(l => l.trim()).filter(l => l);

            // Chercher la ligne "Notes :"
            const start = lines.findIndex(l => /^notes\s*:?\s*$/i.test(l));

            if (start === -1) {
                // Si pas de ligne "Notes :", prendre tout le contenu sauf les lignes de stop
                const collected = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.includes('IMPORTANT') && line.includes('historique')) continue;
                    if (line.includes('[EHIST:')) break;
                    if (stopList.some(r => r.test(line))) break;
                    collected.push(line);
                }
                const content = collected.join('\n').trim();
                return content === '—' || content === '-' ? '' : content;
            }

            // Collecter les lignes après "Notes :"
            const collected = [];
            for (let i = start + 1; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('IMPORTANT') && line.includes('historique')) continue;
                if (line.includes('[EHIST:')) break;
                if (stopList.some(r => r.test(line))) break;
                collected.push(line);
            }
            const content = collected.join('\n').trim();
            return content === '—' || content === '-' ? '' : content;
        };

        // Parse info générales
        const evaluateur = extract('Evaluateur') || extract('Évaluateur');
        if (evaluateur) { data.nomEvaluateur = evaluateur; hasValue = true; }

        const note = extract("Note d'entretien");
        if (note) {
            const match = note.match(/(\d+(?:\.\d+)?)/);
            if (match) { data.noteEntretien = match[1]; hasValue = true; }
        }

        const dec = extract('Decision') || extract('Décision');
        if (dec) { data.admisNonAdmis = dec.replace(/[✅❌]/g, '').trim(); hasValue = true; }

        // Parse sections
        const profil = extractSec(CONFIG.sections.profilMotivation);
        if (profil) {
            const notes = extractNotes(profil, [/^Maitrise du francais/i, /^Maîtrise du français/i]);
            if (notes) { data.profilMotivation = notes; hasValue = true; }
            const boolVal = extractBool('Maitrise du francais') || extractBool('Maîtrise du français');
            if (typeof boolVal === 'boolean') { data.maitriseFrancais = boolVal; hasValue = true; }
        }

        const projet = extractSec(CONFIG.sections.projetPro);
        if (projet) {
            const notes = extractNotes(projet, [/^Permis de conduire/i, /^Alternance/i]);
            if (notes) { data.projetPro = notes; hasValue = true; }
            const permis = extractBool('Permis de conduire');
            if (typeof permis === 'boolean') { data.permis = permis; hasValue = true; }
            const alt = extractBool('Alternance deja trouvee') || extractBool('Alternance déjà trouvée');
            if (typeof alt === 'boolean') { data.alternance = alt; hasValue = true; }
        }

        const perception = extractSec(CONFIG.sections.perceptionEcole);
        if (perception) {
            const notes = extractNotes(perception, [/^Euridis choix/i]);
            if (notes) { data.perceptionEcole = notes; hasValue = true; }
            const choix = extractBool('Euridis choix n°1') || extractBool('Euridis choix');
            if (typeof choix === 'boolean') { data.euridisChoix1 = choix; hasValue = true; }
        }

        const synthese = extractSec(CONFIG.sections.syntheseProfil);
        if (synthese) {
            const notes = extractNotes(synthese, []);
            if (notes) { data.syntheseProfil = notes; hasValue = true; }
        }

        // Parse pré-requis BTS CI
        const anglaisBTS = extractBool('Anglais \\(B1/B2\\)') || extractBool('Anglais');
        if (typeof anglaisBTS === 'boolean') { data.anglaisBTS = anglaisBTS; hasValue = true; }

        const espagnolBTS = extractBool('Espagnol \\(A2/B1\\)') || extractBool('Espagnol');
        if (typeof espagnolBTS === 'boolean') { data.espagnolBTS = espagnolBTS; hasValue = true; }

        // Parse pré-requis Bachelor/Mastère
        const anglaisBachelor = extractBool('Niveau anglais Bachelor') || extractBool('Bachelor : niveau A2 en anglais');
        if (typeof anglaisBachelor === 'boolean') { data.anglaisBachelor = anglaisBachelor; hasValue = true; }

        let anglaisMastere = extractBool('Niveau anglais Mastère \\(B1/B2\\)');
        if (typeof anglaisMastere !== 'boolean') anglaisMastere = extractBool('Niveau anglais Mastere \\(B1/B2\\)');
        if (typeof anglaisMastere !== 'boolean') anglaisMastere = extractBool('Niveau anglais Mastère');
        if (typeof anglaisMastere !== 'boolean') anglaisMastere = extractBool('Niveau anglais Mastere');
        if (typeof anglaisMastere === 'boolean') { data.anglaisMastere = anglaisMastere; hasValue = true; }

        let technologie = extractBool('Intéressé par les nouvelles technologies');
        if (typeof technologie !== 'boolean') technologie = extractBool('Interessé par les nouvelles technologies');
        if (typeof technologie === 'boolean') { data.technologie = technologie; hasValue = true; }

        let commerce = extractBool('Intéressé par le commerce, la vente et la négociation');
        if (typeof commerce !== 'boolean') commerce = extractBool('Intéressé par le commerce');
        if (typeof commerce !== 'boolean') commerce = extractBool('Interessé par le commerce');
        if (typeof commerce === 'boolean') { data.commerce = commerce; hasValue = true; }

        let bureautique = extractBool('Maîtrise de la bureautique et d\'internet');
        if (typeof bureautique !== 'boolean') bureautique = extractBool('Maîtrise de la bureautique');
        if (typeof bureautique !== 'boolean') bureautique = extractBool('Maitrise de la bureautique');
        if (typeof bureautique === 'boolean') { data.bureautique = bureautique; hasValue = true; }

            return hasValue ? data : null;
        };

        return {
            collectData,
            applyData,
            ensureDefaultCheckboxes,
            clearForm,
            buildHTML,
            parseObservations
        };
    })();

    // ============================================
    // 📜 MODULE : HISTORIQUE DES VERSIONS
    // ============================================

    /**
     * Module de gestion de l'historique des versions des trames d'entretien
     * @namespace HistoryModule
     */
    const HistoryModule = (() => {
        /**
         * Génère un UUID v4 simple
         * @returns {string}
         */
        const generateId = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

        /**
         * Calcule le temps relatif depuis une date
         * @param {string} timestamp - Date ISO 8601
         * @returns {string} Temps relatif formaté
         */
        const getRelativeTime = (timestamp) => {
            const now = new Date();
            const date = new Date(timestamp);
            const diff = now.getTime() - date.getTime();

            if (diff < 60000) return "À l'instant";
            if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;

            // Vérifier si c'est hier
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) return "Hier";

            if (diff < 604800000) return `${Math.floor(diff / 86400000)}j`;
            if (diff < 2592000000) return `${Math.floor(diff / 604800000)} sem.`;

            // Format date complète
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        /**
         * Récupère la clé de stockage pour le candidat actuel
         * @returns {string|null}
         */
        const getStorageKey = () => {
            const sig = DetectionModule.getRecordSignature();
            return sig ? `${CONFIG.history.storagePrefix}${sig.replace(/[^a-zA-Z0-9]/g, '_')}` : null;
        };

        /**
         * Récupère les versions depuis le localStorage
         * @returns {Array}
         */
        const getLocalVersions = () => {
            const key = getStorageKey();
            if (!key) return [];
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error('[Euridis][History] Erreur lecture localStorage:', e);
                return [];
            }
        };

        /**
         * Sauvegarde les versions dans le localStorage
         * @param {Array} versions
         */
        const saveLocalVersions = (versions) => {
            const key = getStorageKey();
            if (!key) return;
            try {
                localStorage.setItem(key, JSON.stringify(versions));
            } catch (e) {
                console.error('[Euridis][History] Erreur écriture localStorage:', e);
            }
        };

        /**
         * Encode les versions en base64 pour stockage serveur
         * @param {Array} versions
         * @returns {string}
         */
        const encodeVersions = (versions) => {
            try {
                const json = JSON.stringify(versions);
                return btoa(unescape(encodeURIComponent(json)));
            } catch (e) {
                console.error('[Euridis][History] Erreur encodage:', e);
                return '';
            }
        };

        /**
         * Décode les versions depuis le base64
         * @param {string} encoded
         * @returns {Array}
         */
        const decodeVersions = (encoded) => {
            try {
                const json = decodeURIComponent(escape(atob(encoded)));
                return JSON.parse(json);
            } catch (e) {
                console.error('[Euridis][History] Erreur décodage:', e);
                return [];
            }
        };

        /**
         * Extrait les versions depuis le HTML des observations
         * Supporte plusieurs formats pour rétrocompatibilité
         * @param {string} html
         * @returns {Array}
         */
        const extractFromHtml = (html) => {
            if (!html) return [];

            // Format actuel : [EHIST:BASE64]
            const textMarker = CONFIG.history.textMarker;
            const markerIdx = html.lastIndexOf(textMarker);
            if (markerIdx !== -1) {
                const afterMarker = html.substring(markerIdx + textMarker.length);
                const endMatch = afterMarker.match(/^([A-Za-z0-9+/=]+)\]/);
                if (endMatch && endMatch[1]) {
                    console.log('[Euridis][History] Format [EHIST:] détecté, données:', endMatch[1].substring(0, 50) + '...');
                    const decoded = decodeVersions(endMatch[1].trim());
                    if (decoded.length > 0) {
                        console.log('[Euridis][History] Versions serveur chargées:', decoded.length);
                        return decoded;
                    }
                }
            }

            // Legacy : ancien format avec emoji (🔧 Historique: ou ???? Historique:)
            const emojiMarker = CONFIG.history.legacyEmojiMarker;
            const emojiIdx = html.lastIndexOf(emojiMarker);
            if (emojiIdx !== -1) {
                const afterEmoji = html.substring(emojiIdx + emojiMarker.length);
                const emojiMatch = afterEmoji.match(/^([A-Za-z0-9+/=]+)/);
                if (emojiMatch && emojiMatch[1]) {
                    console.log('[Euridis][History] Format emoji legacy détecté');
                    const decoded = decodeVersions(emojiMatch[1].trim());
                    if (decoded.length > 0) return decoded;
                }
            }

            // Legacy : ancien format commentaire HTML
            const legacyStart = CONFIG.history.legacyMarker;
            const legacyEnd = CONFIG.history.legacyEndMarker;
            const startIdx = html.lastIndexOf(legacyStart);
            if (startIdx !== -1) {
                const endIdx = html.indexOf(legacyEnd, startIdx);
                if (endIdx !== -1) {
                    console.log('[Euridis][History] Format commentaire legacy détecté');
                    const encoded = html.substring(startIdx + legacyStart.length, endIdx).trim();
                    return decodeVersions(encoded);
                }
            }

            console.log('[Euridis][History] Aucun historique trouvé dans le HTML serveur');
            return [];
        };

        /**
         * Insère les données d'historique dans le HTML
         * @param {string} html - HTML existant
         * @param {Array} versions
         * @returns {string} HTML avec historique encodé
         */
        const insertIntoHtml = (html, versions) => {
            let cleanHtml = html || '';

            // Supprimer tous les anciens formats

            // 1. Supprimer l'ancien format commentaire HTML
            const legacyStart = CONFIG.history.legacyMarker;
            const legacyEnd = CONFIG.history.legacyEndMarker;
            const legacyStartIdx = cleanHtml.lastIndexOf(legacyStart);
            if (legacyStartIdx !== -1) {
                const legacyEndIdx = cleanHtml.indexOf(legacyEnd, legacyStartIdx);
                if (legacyEndIdx !== -1) {
                    cleanHtml = cleanHtml.substring(0, legacyStartIdx) + cleanHtml.substring(legacyEndIdx + legacyEnd.length);
                }
            }

            // 2. Supprimer les anciens formats avec data-euridis-history
            cleanHtml = cleanHtml.replace(/<(div|span)[^>]*data-euridis-history[^>]*>[^<]*<\/\1>/gi, '');

            // 3. Supprimer le format texte avec emoji (🔧 Historique: ou caractères corrompus)
            cleanHtml = cleanHtml.replace(/<p[^>]*>[^<]*Historique:\s*[A-Za-z0-9+/=]+<\/p>/gi, '');

            // 4. Supprimer le format actuel [EHIST:...]
            cleanHtml = cleanHtml.replace(/<p[^>]*>\[EHIST:[A-Za-z0-9+/=]+\]<\/p>/gi, '');

            // 5. Supprimer la ligne d'avertissement
            cleanHtml = cleanHtml.replace(/<p[^>]*>---[^<]*historique[^<]*---<\/p>/gi, '');

            // Ajouter le nouveau bloc d'historique (format texte visible discret)
            if (versions && versions.length > 0) {
                const encoded = encodeVersions(versions);
                if (encoded) {
                    console.log('[Euridis][History] Sauvegarde de', versions.length, 'versions');
                    cleanHtml += `${CONFIG.history.warningLine}${CONFIG.history.tagOpen}${encoded}${CONFIG.history.tagClose}`;
                }
            }

            return cleanHtml;
        };

        /**
         * Fusionne les versions locales et serveur
         * @param {Array} localVersions
         * @param {Array} serverVersions
         * @returns {Array}
         */
        const mergeVersions = (localVersions, serverVersions) => {
            const merged = new Map();

            // Ajouter les versions serveur (prioritaires)
            serverVersions.forEach(v => {
                merged.set(v.id, v);
            });

            // Ajouter les versions locales non présentes
            localVersions.forEach(v => {
                if (!merged.has(v.id)) {
                    // Vérifier qu'il n'y a pas de doublon par timestamp et contenu
                    const isDuplicate = [...merged.values()].some(existing =>
                        existing.timestamp === v.timestamp &&
                        JSON.stringify(existing.formData) === JSON.stringify(v.formData)
                    );
                    if (!isDuplicate) {
                        merged.set(v.id, v);
                    }
                }
            });

            // Convertir en tableau, trier et limiter
            let versions = [...merged.values()]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, CONFIG.history.maxVersions);

            // Renuméroter les versions
            versions = versions.map((v, idx) => ({
                ...v,
                version: versions.length - idx
            }));

            return versions;
        };

        /**
         * Charge toutes les versions (fusion locale + serveur)
         * @returns {Array}
         */
        const loadAllVersions = () => {
            const localVersions = getLocalVersions();
            const serverHtml = ContentModule.getExistingHTML();
            console.log('[Euridis][History] HTML serveur lu:', serverHtml ? serverHtml.length + ' chars' : 'vide');
            console.log('[Euridis][History] Versions locales:', localVersions.length);
            const serverVersions = extractFromHtml(serverHtml);
            console.log('[Euridis][History] Versions serveur:', serverVersions.length);
            const merged = mergeVersions(localVersions, serverVersions);
            console.log('[Euridis][History] Versions fusionnées:', merged.length);
            return merged;
        };

        /**
         * Vérifie si les données du formulaire sont différentes de la dernière version
         * @param {Object} formData
         * @param {Array} versions
         * @returns {boolean}
         */
        const isDifferentFromLast = (formData, versions) => {
            if (!versions || versions.length === 0) return true;
            const lastVersion = versions.reduce((a, b) =>
                new Date(a.timestamp) > new Date(b.timestamp) ? a : b
            );
            return JSON.stringify(formData) !== JSON.stringify(lastVersion.formData);
        };

        /**
         * Crée une nouvelle version
         * @param {Object} formData
         * @param {boolean} force - Force la création même si identique
         * @returns {Object|null} La version créée ou null
         */
        const createVersion = (formData, force = false) => {
            const versions = loadAllVersions();

            if (!force && !isDifferentFromLast(formData, versions)) {
                return null; // Pas de changement
            }

            const newVersion = {
                id: generateId(),
                version: versions.length + 1,
                timestamp: new Date().toISOString(),
                formation: State.currentFormation || DetectionModule.detectFormation() || '',
                formData: { ...formData }
            };

            const updatedVersions = [newVersion, ...versions]
                .slice(0, CONFIG.history.maxVersions)
                .map((v, idx, arr) => ({ ...v, version: arr.length - idx }));

            // Sauvegarder localement
            saveLocalVersions(updatedVersions);

            return newVersion;
        };

        /**
         * Génère le HTML d'une carte de version
         * @param {Object} version
         * @returns {string}
         */
        const renderVersionCard = (version) => {
            const relativeTime = getRelativeTime(version.timestamp);
            const previewHtml = DataModule.buildHTML(version.formData);

            return `
                <div class="euridis-history-card" data-version-id="${escapeHtml(version.id)}">
                    <div class="euridis-card-header">
                        <span class="euridis-version-badge">v${version.version}</span>
                        <span class="euridis-version-time">${escapeHtml(relativeTime)}</span>
                    </div>
                    <div class="euridis-card-info">
                        <span class="euridis-card-formation">${escapeHtml(version.formation || 'Formation non spécifiée')}</span>
                    </div>
                    <div class="euridis-card-preview">
                        <div class="euridis-preview-content">${previewHtml}</div>
                    </div>
                    <button type="button" class="euridis-version-restore" data-action="restore-version" data-version-id="${escapeHtml(version.id)}">🔄 Restaurer</button>
                </div>
            `;
        };

        /**
         * Génère le HTML de la vue historique
         * @returns {string}
         */
        const renderHistoryView = () => {
            const versions = loadAllVersions();
            const cardsHtml = versions.length > 0
                ? versions.map(renderVersionCard).join('')
                : '<div class="euridis-history-empty">Aucune version sauvegardée</div>';

            return `
                <div class="euridis-history-view" id="euridisHistoryView">
                    <div class="euridis-history-header">
                        <button type="button" class="euridis-history-back" data-action="back-to-form">◀ Retour</button>
                        <h3 class="euridis-history-title">📜 Historique des versions</h3>
                        <span class="euridis-history-count">${versions.length} version${versions.length > 1 ? 's' : ''}</span>
                    </div>
                    <div class="euridis-history-grid">
                        ${cardsHtml}
                    </div>
                </div>
            `;
        };

        /**
         * Rafraîchit l'affichage de la vue historique
         */
        const refreshHistoryView = () => {
            refreshHistoryViewWithVersions(loadAllVersions());
        };

        /**
         * Rafraîchit l'affichage de la vue historique avec des versions spécifiques
         * @param {Array} versions - Versions à afficher
         */
        const refreshHistoryViewWithVersions = (versions) => {
            const container = document.getElementById('euridisHistoryView');
            if (!container) return;

            const grid = container.querySelector('.euridis-history-grid');
            const count = container.querySelector('.euridis-history-count');

            if (grid) {
                const cardsHtml = versions.length > 0
                    ? versions.map(renderVersionCard).join('')
                    : '<div class="euridis-history-empty">Aucune version sauvegardée</div>';
                grid.innerHTML = cardsHtml;
            }

            if (count) {
                count.textContent = `${versions.length} version${versions.length > 1 ? 's' : ''}`;
            }
        };

        /**
         * Récupère une version par son ID
         * @param {string} versionId
         * @returns {Object|null}
         */
        const getVersionById = (versionId) => {
            const versions = loadAllVersions();
            return versions.find(v => v.id === versionId) || null;
        };

        /**
         * Récupère les versions encodées pour sauvegarde serveur
         * @returns {Array}
         */
        const getVersionsForServer = () => {
            return loadAllVersions();
        };

        return {
            generateId,
            getRelativeTime,
            getStorageKey,
            getLocalVersions,
            saveLocalVersions,
            encodeVersions,
            decodeVersions,
            extractFromHtml,
            insertIntoHtml,
            mergeVersions,
            loadAllVersions,
            isDifferentFromLast,
            createVersion,
            renderVersionCard,
            renderHistoryView,
            refreshHistoryView,
            refreshHistoryViewWithVersions,
            getVersionById,
            getVersionsForServer
        };
    })();

    // ============================================
    // 🏷️ MODULE : SCORING (émojis)
    // ============================================

    /**
     * Module de remplacement des badges de scoring par des émojis
     * @namespace ScoringModule
     */
    const ScoringModule = (() => {
        const SEL = {
            badges: '[id^="control_group_scoringAgent"] .readonly-label.badge[data-name="scoringAgent"]',
            dropdown: '.dropdown-menu.inner li[data-original-index] a span.text'
        };

        /** Remplace les badges de scoring par des émojis */
        const replace = () => {
            DOMCache.getAll(SEL.badges).forEach(b => {
                const v = (b.getAttribute('data-value') || '').toLowerCase().trim();
                const e = CONFIG.scoringEmojis[v];
                if (e && b.textContent.trim() !== e) { b.textContent = e; b.classList.add('euridis-emoji-replaced'); }
            });
            DOMCache.getAll(SEL.dropdown).forEach(s => {
                const t = s.textContent.trim().toLowerCase();
                const e = CONFIG.scoringEmojis[t];
                if (e && s.textContent.trim() !== e) s.textContent = e;
            });
        };

        const debouncedReplace = debounce(replace, 100);

        const isScoreMutation = (m) => {
            const t = m.target;
            if (t.nodeType !== Node.ELEMENT_NODE) return false;
            if (t.matches?.('[id^="control_group_scoringAgent"]') || t.closest?.('[id^="control_group_scoringAgent"]') || t.classList?.contains('dropdown-menu')) return true;
            return [...m.addedNodes].some(n => n.nodeType === Node.ELEMENT_NODE && (n.matches?.('[id^="control_group_scoringAgent"]') || n.querySelector?.('[id^="control_group_scoringAgent"]') || n.classList?.contains('dropdown-menu')));
        };

        return {
            replace,
            startObserver: () => {
                new MutationObserver(muts => { if (muts.some(isScoreMutation)) debouncedReplace(); })
                    .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-value', 'class'] });
            }
        };
    })();

    // ============================================
    // 📅 MODULE : JOURS RESTANTS (FIN D'ACCOMPAGNEMENT)
    // ============================================

    /**
     * Module d'affichage des jours restants pour les dates de fin d'accompagnement
     * @namespace DateRemainingModule
     */
    const DateRemainingModule = (() => {
        const SEL = {
            cells: '.tdData_dateFinaccompagnement',
            label: '.readonly-label',
            statusCell: '.tdData_status .readonly-label'
        };
        const CLS = { processed: 'euridis-date-remaining' };

        // Statuts où le décompte ne doit PAS s'afficher
        const EXCLUDED_STATUSES = [
            // Cycle prospect (tous)
            'prospect', 'relance', 'rdv', 'candidature',
            // Cycle concours spécifiques
            'convoqué', 'convoqu', 'pas intéressé inscrit', 'pas venu', 'refus suite à entretien', 'refus suite entretien',
            // Statuts finaux (décompte disparaît)
            'désistement', 'desistement', 'placé', 'place', 'abandon', 'abandon rupture',
            'renvoyé', 'renvoye', 'diplômé', 'diplome', 'non diplômé bts', 'non diplome bts', 'ancien'
        ];

        /** Parse une date au format JJ/MM/AAAA */
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            const parts = dateStr.trim().split('/');
            if (parts.length !== 3) return null;
            const [day, month, year] = parts.map(Number);
            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            return new Date(year, month - 1, day);
        };

        /** Calcule le nombre de jours restants */
        const getDaysRemaining = (targetDate) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const diff = targetDate - now;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        };

        /** Récupère le statut du candidat depuis la ligne du tableau */
        const getStatusFromRow = (cell) => {
            const row = cell.closest('tr');
            if (!row) return null;
            const statusLabel = row.querySelector(SEL.statusCell);
            if (!statusLabel) return null;
            return statusLabel.textContent.trim().toLowerCase();
        };

        /** Vérifie si le statut nécessite un décompte */
        const shouldShowCountdown = (status) => {
            if (!status) return true; // Par défaut, afficher le décompte
            const normalizedStatus = status.toLowerCase().trim();

            // Vérifier si le statut est explicitement exclu
            if (EXCLUDED_STATUSES.some(excluded => normalizedStatus.includes(excluded))) {
                return false;
            }

            // Par défaut, afficher le décompte pour tous les autres statuts
            return true;
        };

        /** Formate l'affichage des jours restants */
        const formatRemaining = (days, originalDate) => {
            let text, bgColor;
            if (days < 0) {
                text = `${Math.abs(days)} J passé${Math.abs(days) > 1 ? 's' : ''}`;
                bgColor = '#dc3545'; // Rouge
            } else if (days === 0) {
                text = "Aujourd'hui";
                bgColor = '#dc3545'; // Rouge
            } else if (days <= 44) {
                text = `${days} J`;
                bgColor = '#dc3545'; // Rouge (en dessous de 44 jours)
            } else if (days <= 89) {
                text = `${days} J`;
                bgColor = '#fd7e14'; // Orange (entre 45 et 89 jours)
            } else {
                text = `${days} J`;
                bgColor = '#28a745'; // Vert (au dessus de 90 jours)
            }
            return `<span class="${CLS.processed}" style="display:inline-block;background-color:${bgColor};color:#fff;font-weight:600;font-size:13px;padding:4px 10px;border-radius:12px;white-space:nowrap;" title="Date: ${originalDate}">${text}</span>`;
        };

        /** Vérifie si on est dans une fiche candidat (vue détaillée) */
        const isInCandidateDetailView = () => {
            // On est dans la fiche candidat si on trouve l'élément #puzzle-edit
            return document.getElementById('puzzle-edit') !== null;
        };

        /** Remplace les dates par les jours restants */
        const replace = () => {
            // Ne pas appliquer les modifications dans la fiche candidat
            if (isInCandidateDetailView()) {
                return;
            }

            document.querySelectorAll(SEL.cells).forEach(cell => {
                const label = cell.querySelector(SEL.label);
                if (!label) return;

                // Vérifier le statut du candidat
                const status = getStatusFromRow(cell);

                // Si le statut ne nécessite pas de décompte, vider le label
                if (!shouldShowCountdown(status)) {
                    // Ne rien afficher si déjà traité ou vide
                    if (label.querySelector(`.${CLS.processed}`) || !label.textContent.trim()) {
                        return;
                    }
                    // Vider le contenu si un décompte était affiché
                    label.innerHTML = '';
                    return;
                }

                // Si déjà traité, ne pas retraiter
                if (label.querySelector(`.${CLS.processed}`)) return;

                const originalText = label.textContent.trim();
                const targetDate = parseDate(originalText);
                if (!targetDate) return;

                const days = getDaysRemaining(targetDate);
                label.innerHTML = formatRemaining(days, originalText);
            });
        };

        const debouncedReplace = debounce(replace, 150);

        return {
            replace,
            startObserver: () => {
                new MutationObserver(() => debouncedReplace())
                    .observe(document.body, { childList: true, subtree: true });
            }
        };
    })();

    // ============================================
    // 🚀 MODULE : INITIALISATION ET WATCHERS
    // ============================================

    /**
     * Module d'initialisation et de gestion des watchers
     * @namespace AppModule
     */
    const AppModule = (() => {
        let tabWatcher = null, recordWatcher = null, editWatcher = null;

        /** Gère la visibilité du wrapper */
        const setWrapperVisibility = (v) => {
            const w = document.getElementById(CONFIG.dom.wrapperId);
            if (w) w.style.display = v ? '' : 'none';
        };

        /** Met à jour l'état du bouton d'ouverture */
        const updateButtonState = () => {
            const w = document.getElementById(CONFIG.dom.wrapperId);
            if (!w) return;
            State.isEditMode = DetectionModule.isInEditMode();
            w.innerHTML = PanelModule.createOpenButton();
            const btn = document.getElementById('euridisOpenModal');
            if (btn && !State.isEditMode) btn.addEventListener('click', PanelModule.open);
        };

        /** Insère le wrapper dans le DOM */
        const insertWrapper = () => {
            let w = document.getElementById(CONFIG.dom.wrapperId);
            if (w) { updateButtonState(); setWrapperVisibility(DetectionModule.isCommentsTabActive()); return true; }
            StylesModule.inject(); PanelModule.create();
            const tab = document.getElementById(CONFIG.form.buttonTab);
            if (!tab) return false;
            const lbl = tab.querySelector('label[for="notes"]');
            const parent = lbl?.closest('.form-group');
            if (!parent?.parentNode) return false;
            w = document.createElement('div'); w.id = CONFIG.dom.wrapperId;
            w.innerHTML = PanelModule.createOpenButton();
            parent.parentNode.insertBefore(w, parent);
            const btn = document.getElementById('euridisOpenModal');
            if (btn && !DetectionModule.isInEditMode()) btn.addEventListener('click', PanelModule.open);
            setWrapperVisibility(DetectionModule.isCommentsTabActive());
            initFormSync(); PanelModule.syncContext();
            return true;
        };

        /** Initialise la synchronisation du formulaire */
        const initFormSync = async () => {
            if (State.formInitialized) return;
            const form = document.getElementById('euridisForm');
            if (!form) return;
            State.formInitialized = true;
            form.addEventListener('input', (e) => { if (!State.isApplying && FIELD_ID_SET.has(e.target.id)) debouncedSync(); }, true);
            form.addEventListener('change', (e) => {
                if (!State.isApplying && FIELD_ID_SET.has(e.target.id)) {
                    debouncedSync();
                    if (e.target.type === 'checkbox' && ALL_TOGGLES.includes(e.target.id)) {
                        const txt = document.getElementById(`${e.target.id}Text`);
                        if (txt) txt.textContent = e.target.checked ? 'Oui' : 'Non';
                    }
                }
            }, true);

            // Attendre que le contenu soit chargé
            await PanelModule.waitForObservationsContent();

            ContentModule.refreshSnapshots();
            const obs = ContentModule.readObservations();
            if (obs?.includes(CONFIG.text.markerPrefix)) {
                const parsed = DataModule.parseObservations(obs);
                if (parsed) { State.isApplying = true; DataModule.applyData(parsed); State.isApplying = false; PanelModule.updateToggleTexts(); return; }
            }
            State.isApplying = true; DataModule.ensureDefaultCheckboxes(); State.isApplying = false;
            PanelModule.updateToggleTexts();
        };

        /** Démarre le watcher des onglets */
        const startTabWatcher = () => {
            if (tabWatcher) return;
            tabWatcher = setInterval(() => {
                const active = DetectionModule.isCommentsTabActive();
                if (active !== State.lastTabState) {
                    State.lastTabState = active;
                    active ? (insertWrapper(), setWrapperVisibility(true)) : setWrapperVisibility(false);
                } else if (active && !document.getElementById(CONFIG.dom.wrapperId)) insertWrapper();
            }, CONFIG.timing.tabCheck);
        };

        /** Démarre le watcher du mode édition */
        const startEditWatcher = () => {
            if (editWatcher) return;
            editWatcher = setInterval(() => {
                const edit = DetectionModule.isInEditMode();
                if (edit !== State.isEditMode) {
                    State.isEditMode = edit; updateButtonState();
                    if (edit) {
                        const p = document.getElementById(CONFIG.dom.panelId);
                        if (p?.classList.contains('visible')) {
                            const html = ContentModule.composeFinal(DataModule.buildHTML(DataModule.collectData()));
                            if (html) SaveModule.saveToServer(html).catch(() => {});
                            PanelModule.close();
                        }
                    }
                }
            }, CONFIG.timing.editWatch);
        };

        /** Gère le changement de fiche candidat */
        const handleRecordChange = () => {
            State.reset(); debouncedSync.cancel(); debouncedSave.cancel();
            DataModule.clearForm(false); PanelModule.close();
            document.getElementById(CONFIG.dom.wrapperId)?.remove();
            PhoneModule.reset(); DOMCache.invalidate();
            setTimeout(() => { insertWrapper(); PhoneModule.standardize(); FormationModule.inject(); }, 100);
        };

        /** Démarre le watcher des changements de fiche */
        const startRecordWatcher = () => {
            if (recordWatcher) return;
            State.currentRecord = DetectionModule.getRecordSignature();
            recordWatcher = setInterval(() => {
                const det = DetectionModule.getRecordSignature();
                if ((det && State.currentRecord && det !== State.currentRecord) || (!State.currentRecord && det)) {
                    State.currentRecord = det; handleRecordChange();
                }
            }, CONFIG.timing.recordWatch);
        };

        /** Initialise l'application */
        const init = () => {
            StylesModule.inject(); PanelModule.create(); insertWrapper();
            startTabWatcher(); startRecordWatcher(); startEditWatcher();
            // Modules périodiques
            ScoringModule.replace(); ScoringModule.startObserver();
            PhoneModule.standardize(); PhoneModule.startObserver();
            DateRemainingModule.replace(); DateRemainingModule.startObserver();
            setTimeout(FormationModule.inject, 500); FormationModule.startObserver();
            setInterval(() => { ScoringModule.replace(); PhoneModule.standardize(); FormationModule.inject(); DateRemainingModule.replace(); }, CONFIG.timing.periodic);
        };

        return { init };
    })();

    // ============================================
    // 🏁 DÉMARRAGE
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', AppModule.init);
    } else {
        AppModule.init();
    }
  })();

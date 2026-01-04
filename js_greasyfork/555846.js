// ==UserScript==
// @name         CAT Script v3
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  CAT Script call tracking
// @author       JESUUS
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      51.178.26.139
// @connect      localhost
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555846/CAT%20Script%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/555846/CAT%20Script%20v3.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let wasInactiveLastCheck = false;

    function checkUrl() {
        const currentHash = window.location.hash;
        // Allow: #/, #/war, #/war/rank, #/war/attacks, etc. - but block #/tab=
        const isAllowed = !currentHash.includes('tab=') && (currentHash.startsWith('#/war') || currentHash === '#/');

        if (!isAllowed) {
            wasInactiveLastCheck = true;
            // Supprimer le CSS injecté
            const styleElement = document.getElementById('faction-war-enhancer-styles');
            if (styleElement) {
                styleElement.remove();
            }
        } else {
            // Si on revient après avoir été désactivé, réinjecter le CSS
            if (wasInactiveLastCheck) {
                if (window.FactionWarEnhancer && window.FactionWarEnhancer.cssManager) {
                    const cssManager = window.FactionWarEnhancer.cssManager;
                    // Recréer le styleElement s'il n'existe pas
                    if (!document.getElementById('faction-war-enhancer-styles')) {
                        cssManager.createStyleElement();
                    }
                    cssManager.injectCSS();
                }
            }
            wasInactiveLastCheck = false;
        }

        return isAllowed;
    }

    // Wait for DOM to be ready, then listen for URL changes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                checkUrl();
                window.addEventListener('hashchange', checkUrl);
            }, 50);
        });
    } else {
        // DOM is already ready
        setTimeout(() => {
            checkUrl();
            window.addEventListener('hashchange', checkUrl);
        }, 50);
    }

    // Configuration object for easy scalability
    const CONFIG = {
        selectors: {
            descWrap: '.desc-wrap',
            factionWar: '.desc-wrap .f-war-list',
            member: '.desc-wrap .member___fZiTx, .desc-wrap [class*="member___"]',
            level: '.desc-wrap .level___g3CWR, .desc-wrap [class*="level___"]',
            points: '.desc-wrap .points___TQbnu, .desc-wrap [class*="points___"]',
            status: '.desc-wrap [class*="status___"]',
            attackButton: '.desc-wrap .attack',
            callButton: '.desc-wrap .call-button',
            bspColumn: '#faction_war_list_id .bsp-column',
            bspStats: '#faction_war_list_id .iconStats',
            factionName: '.desc-wrap .faction-name, .desc-wrap [class*="name___"]',
            factionImage: '.desc-wrap .faction-image, .desc-wrap [class*="image___"]',
            memberRow: '.desc-wrap li[class*="member"]',
            factionBlock: '.desc-wrap .f-war-list'
        },
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#f093fb',
            success: '#4ecdc4',
            warning: '#ffe066',
            danger: '#ff6b6b',
            dark: '#1a1a2e',
            darkSecondary: '#16213e',
            light: '#ffffff',
            lightSecondary: '#f8f9fa',
            enemyFaction: '#FF794C',
            yourFaction: '#86B202'
        },
        animations: {
            duration: '0.3s',
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    };


    // Storage utility - uses localStorage instead of GM_* functions
    const StorageUtil = {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return defaultValue;
                // Try to parse as JSON, but if it fails, return as-is (string)
                try {
                    return JSON.parse(value);
                } catch (e) {
                    // Not JSON, return as string
                    return value;
                }
            } catch (e) {
                console.warn(`Error reading from localStorage [${key}]:`, e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                // Store strings directly, objects as JSON
                if (typeof value === 'string') {
                    localStorage.setItem(key, value);
                } else if (value === null || value === undefined) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, JSON.stringify(value));
                }
                return true;
            } catch (e) {
                console.warn(`Error writing to localStorage [${key}]:`, e);
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn(`Error removing from localStorage [${key}]:`, e);
                return false;
            }
        }
    };

        // CSS Manager for scalable styling
    class CSSManager {
        constructor() {
            this.styleElement = null;
            this.init();
        }

        init() {
            this.createStyleElement();
            this.injectCSS();
        }

        createStyleElement() {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'faction-war-enhancer-styles';
            document.head.appendChild(this.styleElement);
        }

        injectCSS() {
            const css = this.generateCSS();
            this.styleElement.textContent = css;
        }

        generateCSS() {
            return `
                /* API Key Modal */
                .torn-api-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .torn-api-modal-content {
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    border: 2px solid #667eea;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .torn-api-modal-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 15px;
                    text-align: center;
                }

                .torn-api-modal-subtitle {
                    font-size: 14px;
                    color: #b0b0b0;
                    text-align: center;
                    margin-bottom: 25px;
                    line-height: 1.6;
                }

                .torn-api-modal-input-group {
                    margin-bottom: 20px;
                }

                .torn-api-modal-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #f0f0f0;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .torn-api-modal-input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #667eea;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    color: #ffffff;
                    font-size: 14px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }

                .torn-api-modal-input:focus {
                    outline: none;
                    border-color: #f093fb;
                    background: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 10px rgba(240, 147, 251, 0.3);
                }

                .torn-api-modal-link {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s ease;
                }

                .torn-api-modal-link:hover {
                    color: #f093fb;
                }

                .torn-api-modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 25px;
                }

                .torn-api-modal-btn {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .torn-api-modal-btn-confirm {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .torn-api-modal-btn-confirm:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
                }

                .torn-api-modal-btn-confirm:active {
                    transform: translateY(0);
                }

                .torn-api-modal-btn-cancel {
                    background: rgba(255, 255, 255, 0.1);
                    color: #b0b0b0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .torn-api-modal-btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #ffffff;
                }

                .torn-api-modal-error {
                    color: #ff6b6b;
                    font-size: 12px;
                    margin-top: 8px;
                    display: none;
                }

                .torn-api-modal-error.show {
                    display: block;
                }

                /* Main call buttons styling */
                .desc-wrap .call-button {
                    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
                    background: linear-gradient(135deg, ${CONFIG.colors.dark}, ${CONFIG.colors.darkSecondary}) !important;
                    border-radius: 16px !important;
                    box-shadow:
                        0 20px 40px rgba(0,0,0,0.3),
                        0 8px 16px rgba(0,0,0,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.1) !important;
                    border: none !important;
                    padding: 20px !important;
                    margin: 2px 0 !important;
                    position: relative !important;
                    transition: all ${CONFIG.animations.duration} ${CONFIG.animations.easing} !important;
                }

                .desc-wrap .f-war-list::before {
                    content: '' !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    height: 2px !important;
                    background: linear-gradient(90deg, ${CONFIG.colors.primary}, ${CONFIG.colors.accent}) !important;
                }


                /* Enemy faction names */
                .desc-wrap .f-war-list .faction-name,
                .desc-wrap .f-war-list [class*="name___"] {
                    color: ${CONFIG.colors.enemyFaction} !important;
                    text-shadow: 0 0 8px rgba(255, 121, 76, 0.4) !important;
                    font-size: 1.5em !important;
                    font-weight: 700 !important;
                    margin-bottom: 16px !important;
                }

                /* Your faction names */
                .your-faction .faction-name,
                .your-faction [class*="name___"],
                [class*="your-faction"] .faction-name,
                [class*="your-faction"] [class*="name___"] {
                    color: ${CONFIG.colors.yourFaction} !important;
                    text-shadow: 0 0 8px rgba(134, 178, 2, 0.4) !important;
                    font-size: 1.5em !important;
                    font-weight: 700 !important;
                    margin-bottom: 16px !important;
                }

                /* Member list styling - ONLY in desc-wrap */
                .desc-wrap li.member___fZiTx, .desc-wrap li[class*="member___"] {
                    background: rgba(255,255,255,0.05) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 12px !important;
                    margin: 6px 0 !important;
                    transition: all ${CONFIG.animations.duration} ${CONFIG.animations.easing} !important;
                    backdrop-filter: blur(10px) !important;
                    position: relative !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    flex-wrap: nowrap !important;
                    min-height: 50px !important;
                }

                .desc-wrap li.member___fZiTx:hover, .desc-wrap li[class*="member___"]:hover {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: ${CONFIG.colors.primary} !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15) !important;
                }

                /* Level styling - ONLY in desc-wrap - minimalist design */
                .desc-wrap .level___g3CWR, .desc-wrap [class*="level___"] {
                    background: rgba(255,255,255,0.08) !important;
                    color: ${CONFIG.colors.light} !important;
                    padding: 2px 4px !important;
                    border-radius: 4px !important;
                    font-size: 1em !important;
                    font-weight: 500 !important;
                    display: inline-block !important;
                    margin-right: 3px !important;
                    border: none !important;
                    min-width: 22px !important;
                    max-width: 30px !important;
                    text-align: center !important;
                    font-family: 'Monaco', 'Menlo', monospace !important;
                    flex-shrink: 0 !important;
                }

                /* Points/Score styling - ONLY in desc-wrap */
                .desc-wrap .points___TQbnu, .desc-wrap [class*="points___"] {
                    color: ${CONFIG.colors.accent} !important;
                    margin-top: -0.2em !important;
                    font-weight: 600 !important;
                    font-size: 1em !important;
                    text-shadow: 0 0 8px rgba(240, 147, 251, 0.4) !important;
                }

                /* Status indicators - ONLY in desc-wrap */
                .desc-wrap [class*="status___"], .desc-wrap .status {
                    padding: 3px 6px !important;
                    border-radius: 6px !important;
                    font-size: 0.85em !important;
                    font-weight: 500 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.3px !important;
                    display: inline-block !important;
                }

                /* Status colors - ONLY in desc-wrap */
                .desc-wrap [class*="status___"]:contains("Online"), .desc-wrap .status:contains("Online") {
                    background: ${CONFIG.colors.success} !important;
                    color: ${CONFIG.colors.dark} !important;
                }

                .desc-wrap [class*="status___"]:contains("Offline"), .desc-wrap .status:contains("Offline") {
                    background: rgba(255,255,255,0.15) !important;
                    color: ${CONFIG.colors.lightSecondary} !important;
                }

                .desc-wrap [class*="status___"]:contains("Hospital"), .desc-wrap .status:contains("Hospital") {
                    background: ${CONFIG.colors.danger} !important;
                    color: ${CONFIG.colors.light} !important;
                }

                .desc-wrap [class*="status___"]:contains("Traveling"), .desc-wrap .status:contains("Traveling") {
                    background: ${CONFIG.colors.warning} !important;
                    color: ${CONFIG.colors.dark} !important;
                }

                .desc-wrap [class*="status___"]:contains("Idle"), .desc-wrap .status:contains("Idle") {
                    background: #ffa726 !important;
                    color: ${CONFIG.colors.dark} !important;
                }

                .desc-wrap [class*="status___"]:contains("Abroad"), .desc-wrap .status:contains("Abroad") {
                    background: #ab47bc !important;
                    color: ${CONFIG.colors.light} !important;
                }

                .desc-wrap [class*="status___"]:contains("Jail"), .desc-wrap .status:contains("Jail") {
                    background: #8d6e63 !important;
                    color: ${CONFIG.colors.light} !important;
                }

                /* Attack buttons - ONLY in desc-wrap */



                /* Attack container - ensure proper spacing for both buttons */
                .desc-wrap li[class*="member___"] .attack:has(.call-button),
                .desc-wrap li[class*="member___"] .attack,
                .desc-wrap .call-attack-container {
                    flex-wrap: nowrap !important;
                    overflow: visible !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    justify-content: flex-start !important;
                    min-width: 90px !important;
                    width: 90px !important;
                    flex: 0 0 90px !important;
                }

                /* Attack column header styling */
                .desc-wrap .attack___wBWp2.tab___UztMc,
                .desc-wrap [class*="attack___"].tab___UztMc,
                .desc-wrap .attack.tab,
                .desc-wrap .attack-header {
                    min-width: 90px !important;
                    width: 90px !important;
                    flex: 0 0 90px !important;
                    text-align: center !important;
                }

                /* BSP column styling - clean minimal design */
                #faction_war_list_id .bsp-column {
                    color: ${CONFIG.colors.light} !important;
                    padding: 2px 4px !important;
                    font-size: 1em !important;
                    margin-top: 10px !important;
                    font-weight: 700 !important;
                    display: inline-block !important;
                    min-width: 32px !important;
                    max-width: 32px !important;
                    text-align: center !important;
                    font-family: 'Monaco', 'Menlo', monospace !important;
                    flex-shrink: 0 !important;
                }

                /* BSP column header - inherits from uniform header styling above, with specific overrides */
                #faction_war_list_id .bsp-header {
                    min-width: 32px !important;
                    width: 32px !important;
                    flex: 0 0 32px !important;
                    margin-right: 2px !important;
                    background: none !important;
                    border: none !important;
                    cursor: pointer !important;
                    transition: color 0.2s ease !important;
                }

                #faction_war_list_id .bsp-header:hover {
                    color: ${CONFIG.colors.accent} !important;
                    text-shadow: 0 0 8px rgba(240, 147, 251, 0.4) !important;
                }

                /* Reduce Status column width in your-faction only */
                .your-faction [class*="status___"],
                [class*="your-faction"] [class*="status___"] {
                    flex: 0 0 auto !important;
                    max-width: 60px !important;
                    width: 60px !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }

                /* Uniform styling for all faction table headers - font only */
                .white-grad > div[class*="tab___"],
                .white-grad > [class*="member___"],
                .white-grad > [class*="level___"],
                .white-grad > [class*="points___"],
                .white-grad > [class*="status___"],
                #faction_war_list_id .white-grad > .bsp-header {
                    font-family: 'Inter', 'Roboto', 'Arial', sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 0.9em !important;
                    letter-spacing: 0.3px !important;
                    text-transform: uppercase !important;
                    color: ${CONFIG.colors.light} !important;
                }

                /* Center text content only */
                .white-grad > div[class*="tab___"],
                .white-grad > [class*="member___"],
                .white-grad > [class*="level___"],
                .white-grad > [class*="points___"],
                .white-grad > [class*="status___"] {
                    text-align: center !important;
                }

                /* Center span elements inside headers */
                .white-grad > div[class*="tab___"] > span,
                .white-grad > [class*="member___"] > span,
                .white-grad > [class*="level___"] > span,
                .white-grad > [class*="points___"] > span,
                .white-grad > [class*="status___"] > span {
                    display: block !important;
                    text-align: center !important;
                    width: 100% !important;
                }

                /* Force Score header alignment in enemy-faction */
                .white-grad > [class*="points___"],
                .white-grad > div[class*="points___"] {
                    text-align: center !important;
                    position: relative !important;
                    padding-left: 6px !important;
                    margin-right: -6px !important;
                }

                /* Hide sort arrow in Score header */
                .white-grad > [class*="points___"] > i,
                .white-grad > div[class*="points___"] > i {
                    display: none !important;
                }

                /* Remove all borders from faction war tables */
                .desc-wrap * {
                    border: none !important;
                }

                .desc-wrap .f-war-list,
                .desc-wrap .f-war-list *,
                .desc-wrap ul,
                .desc-wrap li,
                .desc-wrap div {
                    border: none !important;
                    border-top: none !important;
                    border-bottom: none !important;
                    border-left: none !important;
                    border-right: none !important;
                }

                /* Fine-tune vertical alignment for specific headers */
                #faction_war_list_id .white-grad > .bsp-header {
                    padding-top: 10px !important;
                }

                .white-grad > [class*="member___"] {
                    padding-top: 4px !important;
                }

                .white-grad > [class*="points___"] {
                    padding-top: 4px !important;
                    text-align: center !important;
                }



                /* Attack header styling only for enemy factions (not your-faction) */
                .white-grad > [class*="attack___"]:not(.your-faction *):not([class*="your-faction"] *) {
                    font-family: 'Inter', 'Roboto', 'Arial', sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 0.9em !important;
                    margin-top: 0.2em !important;
                    letter-spacing: 0.3px !important;
                    text-transform: uppercase !important;
                    color: ${CONFIG.colors.light} !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    display: inline-block !important;
                }

                /* Hide Attack header in your-faction */
                .your-faction .white-grad > [class*="attack___"],
                [class*="your-faction"] .white-grad > [class*="attack___"] {
                    display: none !important;
                }

                /* BSP value styling - inherit from column */
                #faction_war_list_id .bsp-value {
                    font-weight: 600 !important;
                    display: inline !important;

                }

                /* BSP value colors - all official BSP colors */
                #faction_war_list_id .bsp-value.bsp-red {
                    color: #FF0000 !important; /* BSP red - highest threat */
                }

                #faction_war_list_id .bsp-value.bsp-orange {
                    color: #FFB30F !important; /* BSP orange - high threat */
                }

                #faction_war_list_id .bsp-value.bsp-blue {
                    color: #47A6FF !important; /* BSP blue - medium threat */
                }

                #faction_war_list_id .bsp-value.bsp-green {
                    color: #73DF5D !important; /* BSP green - low threat */
                }

                #faction_war_list_id .bsp-value.bsp-white {
                    color: #FFFFFF !important; /* BSP white - very low threat */
                }

                #faction_war_list_id .bsp-value.bsp-gray {
                    color: #949494 !important; /* BSP gray - minimal threat */
                }

                #faction_war_list_id .bsp-value.bsp-default {
                    color: ${CONFIG.colors.light} !important; /* Default white */
                }

                /* Hide original BSP elements and their containers */
                #faction_war_list_id .iconStats {
                    z-index: -999 !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    display: none !important;
                }

                /* Hide BSP parent containers */
                div[style*="position: absolute"][style*="z-index: 100"] {
                    z-index: -999 !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    display: none !important;
                }

                /* More specific targeting for BSP containers */
                .TDup_ColoredStatsInjectionDiv {
                    z-index: -999 !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    display: none !important;
                }

                /* Call column - ONLY in desc-wrap for enemy faction */
                .desc-wrap .call-column {
                    display: inline-block !important;
                    width: 50px !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    margin-right: 8px !important;
                    flex-shrink: 0 !important;
                    order: -1 !important;
                    position: relative !important;
                }

                .desc-wrap .call-button {
                    background: linear-gradient(135deg, #2196f3, #1976d2) !important;
                    color: ${CONFIG.colors.light} !important;
                    border: none !important;
                    padding: 4px 6px !important;
                    border-radius: 4px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all ${CONFIG.animations.duration} ${CONFIG.animations.easing} !important;
                    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3) !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1px !important;
                    font-size: 0.75em !important;
                    width: auto !important;
                    min-width: 35px !important;
                    max-width: 45px !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    text-align: center !important;
                    display: inline-block !important;
                    flex: 0 0 auto !important;
                    order: -1 !important;
                    margin-left: 8px !important;
                    margin-right: 4px !important;
                    vertical-align: middle !important;
                    z-index: 1000 !important;
                    position: relative !important;
                }

                .desc-wrap .call-button:hover {
                    transform: translateY(-1px) scale(1.02) !important;
                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4) !important;
                    background: linear-gradient(135deg, #1976d2, #1565c0) !important;
                }

                .desc-wrap .call-button:active {
                    transform: translateY(0) scale(1.01) !important;
                }

                /* Call button color states - MUST be more specific than .call-button */
                .desc-wrap .call-button[class*="my-call"],
                .desc-wrap .call-button.my-call {
                    background: linear-gradient(135deg, #86B300, #6d8a00) !important;
                }

                .desc-wrap .call-button[class*="my-call"]:hover,
                .desc-wrap .call-button.my-call:hover {
                    background: linear-gradient(135deg, #86B300, #6d8a00) !important;
                }

                .desc-wrap .call-button[class*="other-call"],
                .desc-wrap .call-button.other-call {
                    background: linear-gradient(135deg, #F3754B, #e35a36) !important;
                    opacity: 0.7 !important;
                    cursor: not-allowed !important;
                    pointer-events: auto !important;
                }

                .desc-wrap .call-button[class*="other-call"]:hover,
                .desc-wrap .call-button.other-call:hover {
                    background: linear-gradient(135deg, #F3754B, #e35a36) !important;
                    transform: none !important;
                    box-shadow: 0 2px 4px rgba(243, 117, 75, 0.3) !important;
                }

                /* Custom tooltip for call buttons */
                .desc-wrap .call-button:hover::after {
                    content: attr(data-tooltip) !important;
                    position: absolute !important;
                    background: #333 !important;
                    color: #fff !important;
                    padding: 6px 10px !important;
                    border-radius: 4px !important;
                    font-size: 0.8em !important;
                    font-weight: 500 !important;
                    white-space: nowrap !important;
                    bottom: 130% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    z-index: 2000 !important;
                    pointer-events: none !important;
                    opacity: 1 !important;
                    animation: tooltipFade 0.2s ease-in !important;
                }

                .desc-wrap .call-button:hover::before {
                    content: '' !important;
                    position: absolute !important;
                    bottom: 120% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    border: 4px solid transparent !important;
                    border-top-color: #333 !important;
                    z-index: 2000 !important;
                    pointer-events: none !important;
                }

                @keyframes tooltipFade {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                /* Faction images - ONLY in desc-wrap */
                .desc-wrap .faction-image, .desc-wrap [class*="image___"] {
                    border-radius: 12px !important;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
                    border: none !important;
                    transition: all ${CONFIG.animations.duration} ${CONFIG.animations.easing} !important;
                }

                .desc-wrap .faction-image:hover, .desc-wrap [class*="image___"]:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
                }

                /* Honor badges enhancement - ONLY in desc-wrap */
                .desc-wrap img[src*="honor"] {
                    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) !important;
                    transition: filter ${CONFIG.animations.duration} !important;
                }

                .desc-wrap img[src*="honor"]:hover {
                    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8)) !important;
                }

                /* Responsive design - ONLY in desc-wrap */
                @media (max-width: 768px) {
                    .desc-wrap .f-war-list {
                        padding: 16px !important;
                        margin: 2px 0 !important;
                    }

                    .desc-wrap li[class*="member___"] {
                        padding: 12px !important;
                    }

                    .desc-wrap .faction-name, .desc-wrap [class*="name___"] {
                        font-size: 1.2em !important;
                    }
                }

                /* Dark mode enhancements - ONLY in desc-wrap */
                @media (prefers-color-scheme: dark) {
                    .desc-wrap .f-war-list {
                        box-shadow:
                            0 20px 40px rgba(0,0,0,0.5),
                            0 8px 16px rgba(0,0,0,0.3),
                            inset 0 1px 0 rgba(255,255,255,0.05) !important;
                    }
                }

                /* Animation keyframes */
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                }

                /* Apply entrance animation to members - ONLY in desc-wrap */
                .desc-wrap li.member___fZiTx, .desc-wrap li[class*="member___"] {
                    animation: slideIn 0.5s ${CONFIG.animations.easing} !important;
                }

                /* Preserve original table/list structure - ONLY in desc-wrap */
                .desc-wrap ul, .desc-wrap ol, .desc-wrap li {
                    list-style: none !important;
                }

                /* Hide faction logo - scalable approach */
                .factionWrap___GhZMa.flexCenter___bV1QP.customBlockWrap___AtrOa,
                [class*="factionWrap___"][class*="flexCenter___"][class*="customBlockWrap___"],
                .faction-logo-wrap {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }

                /* Hide honor image only - not the whole wrap - use opacity to preserve layout */
                .honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa img,
                .honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa .honor-text-wrap img,
                [class*="honorWrap___"][class*="flexCenter___"][class*="customBlockWrap___"] img,
                .honor-wrap img,
                .honor-image-wrap img {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }

                /* Scalable hiding classes */
                .hide-faction-logo,
                .hide-honor-image,
                .logo-hidden,
                .honor-hidden {
                    display: none !important;
                }

                /* Ensure content visibility - ONLY in desc-wrap */
                .desc-wrap * {
                    opacity: 1 !important;
                    visibility: visible !important;
                }

                /* Override any hiding styles - ONLY in desc-wrap */
                .desc-wrap .f-war-list * {
                    display: revert !important;
                }

                /* Exception: keep logo and honor images hidden even in desc-wrap */
                .desc-wrap .factionWrap___GhZMa.flexCenter___bV1QP.customBlockWrap___AtrOa,
                .desc-wrap [class*="factionWrap___"][class*="flexCenter___"][class*="customBlockWrap___"],
                .desc-wrap .faction-logo-wrap,
                .desc-wrap .hide-faction-logo,
                .desc-wrap .logo-hidden {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }

                /* Honor images in desc-wrap - use opacity to preserve layout */
                .desc-wrap .honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa img,
                .desc-wrap .honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa .honor-text-wrap img,
                .desc-wrap [class*="honorWrap___"][class*="flexCenter___"][class*="customBlockWrap___"] img,
                .desc-wrap .honor-wrap img,
                .desc-wrap .honor-image-wrap img,
                .desc-wrap .hide-honor-image,
                .desc-wrap .honor-hidden {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }

                /* Honor text styling - improved layout and typography */
                .desc-wrap .honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa,
                .desc-wrap [class*="honorWrap___"][class*="flexCenter___"][class*="customBlockWrap___"] {
                    justify-content: flex-start !important;
                    text-align: left !important;
                    padding: 2px 6px !important;
                    margin: 0 4px 0 0 !important;
                    min-width: auto !important;
                    width: auto !important;
                    flex-shrink: 1 !important;
                }

                /* Force style ALL honor text elements with stronger selectors */
                .desc-wrap .honorWrap___BHau4 *,
                .desc-wrap [class*="honorWrap___"] *,
                .desc-wrap .honorWrap___BHau4 .honor-text-wrap *,
                .desc-wrap [class*="honorWrap___"] .honor-text-wrap *,
                .desc-wrap .honorWrap___BHau4 .honor-text,
                .desc-wrap .honorWrap___BHau4 .honor-text-svg,
                .desc-wrap [class*="honorWrap___"] .honor-text,
                .desc-wrap [class*="honorWrap___"] .honor-text-svg,
                .desc-wrap .honorTextSymbol___PGzDa,
                .desc-wrap [class*="honorTextSymbol___"] {
                    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    color: ${CONFIG.colors.light} !important;
                    text-align: left !important;
                    line-height: 1.2 !important;
                }

                /* Hide SVG symbols version and keep only plain text */
                .desc-wrap .honorWrap___BHau4 .honor-text-svg,
                .desc-wrap [class*="honorWrap___"] .honor-text-svg {
                    display: none !important;
                }

                /* REMOVED PROBLEMATIC STYLES - keeping original layout */

                /* Member name column - reduce width and add truncation */
                .desc-wrap li[class*="member___"] {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 8px !important;
                }

                /* Member info container - limit width and add truncation */
                .desc-wrap li[class*="member___"] > *:first-child,
                .desc-wrap li[class*="member___"] .userInfoBox___LRjPl {
                    flex: 0 1 120px !important;
                    min-width: 80px !important;
                    max-width: 120px !important;
                    overflow: hidden !important;
                    white-space: nowrap !important;
                    text-overflow: ellipsis !important;
                }

                /* Honor wrap inside member - further limit width */
                .desc-wrap li[class*="member___"] .honorWrap___BHau4,
                .desc-wrap li[class*="member___"] [class*="honorWrap___"] {
                    max-width: 80px !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }

                /* Ensure other elements don't shrink */
                .desc-wrap li[class*="member___"] > *:not(:first-child) {
                    flex-shrink: 0 !important;
                }

                /* Header column - Members column width */
                .desc-wrap .member___fZiTx.tab___UztMc,
                .desc-wrap [class*="member___"].tab___UztMc {
                    width: 120px !important;
                    max-width: 120px !important;
                    min-width: 120px !important;
                    flex: 0 0 120px !important;
                }

                /* Data rows - Members column width - NUCLEAR APPROACH */
                ul.members-list.membersCont___USwcq li.enemy___uiAJH div.member.icons.left.member___fZiTx,
                .desc-wrap ul li div.member___fZiTx,
                .desc-wrap .member___fZiTx:not(.tab___UztMc),
                .desc-wrap [class*="member___"]:not(.tab___UztMc),
                div.member.icons.left.member___fZiTx,
                .member___fZiTx.icons.left,
                .member___fZiTx {
                    width: 120px !important;
                    max-width: 120px !important;
                    min-width: 120px !important;
                    flex: 0 0 120px !important;
                    overflow: hidden !important;
                    white-space: nowrap !important;
                    text-overflow: ellipsis !important;
                    box-sizing: border-box !important;
                }

                /* Force apply to any element with member class - ultimate fallback */
                [class*="member___fZiTx"] {
                    width: 120px !important;
                    max-width: 120px !important;
                    min-width: 120px !important;
                    flex: 0 0 120px !important;
                }

                /* Force parent containers to not override */
                .desc-wrap * {
                    flex-grow: 0 !important;
                }

                .desc-wrap ul li div {
                    flex-basis: auto !important;
                }

                /* Hide call buttons if API key not configured */
                body.hide-call-buttons .call-button {
                    display: none !important;
                }
            `;
        }

        updateColors(newColors) {
            Object.assign(CONFIG.colors, newColors);
            this.injectCSS();
        }

        // Scalable logo hiding functionality
        addLogoHidingClass(element) {
            if (element && element.classList) {
                element.classList.add('hide-faction-logo');
            }
        }

        hideLogoBySelector(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => this.addLogoHidingClass(element));
        }

        // Toggle logo visibility
        toggleLogoVisibility(show = false) {
            const logoSelectors = [
                '.factionWrap___GhZMa.flexCenter___bV1QP.customBlockWrap___AtrOa',
                '[class*="factionWrap___"][class*="flexCenter___"][class*="customBlockWrap___"]',
                '.faction-logo-wrap'
            ];

            logoSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (show) {
                        element.classList.remove('hide-faction-logo');
                        element.style.display = '';
                    } else {
                        element.classList.add('hide-faction-logo');
                    }
                });
            });
        }

        // Toggle honor image visibility (only images, not text) - use opacity
        toggleHonorVisibility(show = false) {
            const honorImageSelectors = [
                '.honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa img',
                '.honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH.customBlockWrap___AtrOa .honor-text-wrap img',
                '[class*="honorWrap___"][class*="flexCenter___"][class*="customBlockWrap___"] img',
                '.honor-wrap img',
                '.honor-image-wrap img'
            ];

            honorImageSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (show) {
                        element.style.opacity = '1';
                        element.style.pointerEvents = 'auto';
                    } else {
                        element.style.opacity = '0';
                        element.style.pointerEvents = 'none';
                    }
                });
            });
        }
    }

    // Dynamic Enhancement Manager
    class EnhancementManager {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            this.setupMutationObserver();
            this.enhanceExistingElements();

            // Inject tabs menu after elements are enhanced
            setTimeout(() => {
                this.injectTabsMenu();
            }, 500);

            // Keep checking for faction war info and inject tabs if missing (for dynamic loading)
            setInterval(() => {
                if (document.querySelector('.faction-war-info, [class*="factionWarInfo"]')) {
                    if (!document.getElementById('custom-tabs-menu')) {
                        this.injectTabsMenu();
                    }
                }
            }, 300);

            // Load calls from database after a delay to ensure buttons are created
            setTimeout(() => {
                this.loadCallsFromDatabase();
            }, 1000);

            // Restore saved sort preference after page loads and elements are ready
            setTimeout(() => {
                this.restoreSavedSort();
            }, 1500);

            // Also try again after 3 seconds in case elements load slowly
            setTimeout(() => {
                this.restoreSavedSort();
            }, 3000);
        }

        setupMutationObserver() {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // If node is a list (ul/ol), add BSP column with slight delay for stability
                                if (node.matches('ul') || node.matches('ol')) {
                                    // Add small delay to ensure all li elements are rendered
                                    setTimeout(() => {
                                        const hasMembers = node.querySelectorAll('li').length >= 3;
                                        if (hasMembers && !node.hasAttribute('data-enhanced')) {
                                            // Check if this list is inside your-faction or has the right classes
                                            const isYourFaction = node.closest('.your-faction') !== null ||
                                                                node.className.includes('membersCont');
                                            if (isYourFaction) {
                                                this.addBspToYourFaction(node);
                                            } else {
                                                this.addBspColumn(node);
                                            }
                                        }
                                    }, 50);
                                }

                                // Only enhance if it's inside desc-wrap or is a faction war container
                                if (node.closest('.desc-wrap') || node.querySelector('.desc-wrap') ||
                                    node.matches('.f-war-list') || node.querySelector('.f-war-list')) {
                                    this.enhanceElement(node);
                                }
                            }
                        });
                    }
                });
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        enhanceExistingElements() {

            // Updated selectors based on actual page structure
            const factionWarSelectors = [
                '[class*="membersWrap"]',           // membersWrap___NbYLx
                '[class*="factionWar"]',            // factionWar___FYhsP
                '.faction-war',
                '[class*="faction-war"]',
                '.desc-wrap',
                '[class*="desc"]'
            ];


            factionWarSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    elements.forEach((element, index) => {
                        this.enhanceElement(element);
                    });
                }
            });

            // Global search: look for any elements containing members with attack buttons

            // Look for containers with multiple members (list items or member elements)
            const potentialContainers = document.querySelectorAll('div, ul, section');
            potentialContainers.forEach((container) => {
                const memberElements = container.querySelectorAll('li, [class*="member"]');
                const attackElements = container.querySelectorAll('[class*="attack"], a[href*="attack"], button[onclick*="attack"]');

                // If container has multiple members and attack elements, it's likely a faction war table
                if (memberElements.length >= 3 && attackElements.length >= 1) {
                    this.enhanceElement(container);
                }
            });

            // Look specifically for desc-wrap (legacy support)
            const descWrap = document.querySelector('.desc-wrap');
            if (descWrap) {
                const factionWarElements = descWrap.querySelectorAll('.f-war-list, ul, [class*="list"]');

                factionWarElements.forEach((list, index) => {
                    // Try to enhance any list that contains member-like elements
                    const members = list.querySelectorAll('li, [class*="member"]');
                    if (members.length > 0) {
                        this.enhanceElement(list);
                    }
                });

                // Also try to enhance any existing elements that might have been missed
                setTimeout(() => {
                    const newElements = descWrap.querySelectorAll('.f-war-list:not([data-enhanced]), ul:not([data-enhanced]), ol:not([data-enhanced])');
                    newElements.forEach((element, index) => {
                        this.enhanceElement(element);
                    });
                }, 1000);
            } else {
                // Fallback: look for any war-related content
                const warElements = document.querySelectorAll('[class*="war"], [class*="faction"]');
                if (warElements.length > 0) {
                    warElements.forEach(element => {
                        if (element.querySelectorAll('li, [class*="member"]').length > 0) {
                            this.enhanceElement(element);
                        }
                    });
                }
            }

            // Special search for your own faction (specific targeting)
            // Try with multiple delays to handle different loading speeds
            const checkYourFaction = () => {
                const yourFactionContainer = document.querySelector('.your-faction[class*="tabMenuCont"]');
                if (yourFactionContainer) {
                    const yourFactionLists = yourFactionContainer.querySelectorAll('ul, ol');
                    yourFactionLists.forEach(list => {
                        const hasMembers = list.querySelectorAll('li').length >= 3;
                        const hasLevels = list.querySelector('[class*="level"]');

                        if (hasMembers && hasLevels && !list.hasAttribute('data-enhanced')) {
                            this.addBspToYourFaction(list);
                            // Change Level to Lvl after processing
                            setTimeout(() => this.changeLevelToLvl(), 100);
                        }
                    });
                }
            };

            // Check early at 500ms
            setTimeout(checkYourFaction, 500);

            // Check again at 1500ms as fallback
            setTimeout(checkYourFaction, 1500);

            // **NEW: Continuous check for dynamically opened lists every 200ms**
            setInterval(checkYourFaction, 200);

            // Global search for any container with member-like elements (only in desc-wrap)
            const fallbackContainers = document.querySelectorAll('.desc-wrap div, .desc-wrap ul, .desc-wrap ol');
            let memberContainers = [];

            fallbackContainers.forEach(container => {
                const members = container.querySelectorAll('li, [class*="member"]');
                if (members.length > 5) {
                    // Check if it looks like a faction war container
                    const hasAttackElements = container.querySelectorAll('[class*="attack"], a[href*="attack"]').length > 0;
                    const hasStatusElements = container.querySelectorAll('[class*="status"]').length > 0;

                    if (hasAttackElements || hasStatusElements) {
                        memberContainers.push({
                            container: container,
                            members: members.length,
                            hasAttacks: hasAttackElements,
                            hasStatus: hasStatusElements
                        });
                    }
                }
            });

            memberContainers.forEach((item, index) => {
                this.enhanceElement(item.container);
            });

        }

        enhanceElement(element) {
            // Skip SVG elements, scripts, and other non-container elements immediately
            if (element.matches && (
                element.matches('svg') ||
                element.matches('script') ||
                element.matches('style') ||
                element.matches('.call-column') ||
                element.closest('.call-column')
            )) {
                return;
            }


            // Only enhance container elements, not individual items or call columns
            const isValidContainer = element.matches && (
                element.matches('.f-war-list') ||
                element.matches('ul.members-list') ||
                element.matches('ol.members-list') ||
                element.matches('.faction-war') ||
                element.matches('[class*="membersWrap"]') ||
                element.matches('[class*="factionWar"]') ||
                (element.matches('ul') && element.querySelectorAll('li').length > 5 && element.closest('.desc-wrap')) ||
                (element.matches('ol') && element.querySelectorAll('li').length > 5 && element.closest('.desc-wrap')) ||
                (element.matches('div') && element.querySelectorAll('li, [class*="member"]').length > 5 && element.closest('.desc-wrap'))
            );

            if (isValidContainer) {
                if (!element.hasAttribute('data-enhanced')) {
                    element.setAttribute('data-enhanced', 'true');

                    // Add loading animation
                    this.addLoadingAnimation(element);

                    // Enhance member cards with staggered animation
                    const members = element.querySelectorAll('li');

                    members.forEach((member, index) => {
                        member.style.animationDelay = `${index * 0.1}s`;
                    });
                }

                // Always try to add call buttons and BSP column (even if already enhanced)
                this.addBspHeader(element);
                this.addBspColumn(element);
                this.addCallButtons(element);
                this.addStatusHeaderSorting(element);
                // Change Level to Lvl after processing
                setTimeout(() => this.changeLevelToLvl(), 100);
            }
        }

        addBspToYourFaction(factionList) {
            // Mark as enhanced
            factionList.setAttribute('data-enhanced', 'true');

            // Add header first
            this.addBspHeaderToYourFaction(factionList);

            // Add columns
            this.addBspColumnToYourFaction(factionList);
        }

        addBspHeaderToYourFaction(factionList) {
            if (factionList.querySelector('.bsp-header')) {
                return;
            }

            // Find the white-grad header container - may be outside factionList
            let headerContainer = factionList.querySelector('.white-grad');

            // If not found in factionList, search in parent elements or siblings
            if (!headerContainer) {
                // Search in parent container
                const parentContainer = factionList.closest('.your-faction') || factionList.parentElement;
                if (parentContainer) {
                    headerContainer = parentContainer.querySelector('.white-grad');
                }
            }

            // If still not found, search more broadly around the faction area
            if (!headerContainer) {
                // Look for white-grad anywhere in the page near your faction
                const allWhiteGrad = document.querySelectorAll('.white-grad');
                for (let container of allWhiteGrad) {
                    if (container.querySelector('.level___g3CWR')) {
                        // Check if this white-grad is in the same general area as factionList
                        const containerParent = container.closest('.your-faction') || container.closest('[class*="faction"]');
                        const factionParent = factionList.closest('.your-faction') || factionList.closest('[class*="faction"]');
                        if (containerParent === factionParent ||
                            (containerParent && factionParent && containerParent.contains(factionList)) ||
                            container.parentElement === factionList.parentElement) {
                            headerContainer = container;
                            break;
                        }
                    }
                }
            }

            let levelHeaderElement = null;

            if (headerContainer) {
                // Look for level header within white-grad - search for exact class
                levelHeaderElement = headerContainer.querySelector('.level.left.level___g3CWR.tab___UztMc');
                if (!levelHeaderElement) {
                    // Fallback search
                    levelHeaderElement = headerContainer.querySelector('.level___g3CWR');
                }
                if (!levelHeaderElement) {
                    // Even broader search in white-grad
                    const elements = headerContainer.querySelectorAll('*');
                    for (let element of elements) {
                        if (element.textContent?.trim() === 'Level') {
                            levelHeaderElement = element;
                            break;
                        }
                    }
                }
                if (levelHeaderElement) {
                }
            }

            if (!levelHeaderElement) {
            }

            if (levelHeaderElement) {
                const bspHeader = document.createElement('div');
                bspHeader.className = 'bsp-header left level___g3CWR tab___UztMc';
                bspHeader.textContent = 'BSP';
                bspHeader.style.cssText = `
                    min-width: 38px !important;
                    width: 38px !important;
                    text-align: center !important;
                    font-weight: 900 !important;
                    color: #ffffff !important;
                    font-size: 1em !important;
                    margin-right: 3px !important;
                    display: inline-block !important;
                    padding: 2px !important;
                `;

                // Add click event for sorting
                bspHeader.style.cursor = 'pointer';
                bspHeader.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.sortByBSP(factionList, bspHeader);
                });

                // Insert BSP header right after the level header element in the same container
                if (levelHeaderElement.nextSibling) {
                    levelHeaderElement.parentNode.insertBefore(bspHeader, levelHeaderElement.nextSibling);
                } else {
                    levelHeaderElement.parentNode.appendChild(bspHeader);
                }
            } else {
            }
        }

        addBspColumnToYourFaction(factionList) {
            const members = factionList.querySelectorAll('li');

            members.forEach((member) => {
                if (!member.querySelector('.bsp-column')) {
                    // Look for existing BSP data in iconStats (même logique que pour les ennemis)
                    const bspElement = member.querySelector('.iconStats');

                    // Skip if no BSP data found
                    if (!bspElement) {
                        return;
                    }

                    let bspValue = bspElement.textContent.trim();
                    let bspClass = 'bsp-default';

                    // Use BSP's original color directly
                    const bspStyle = bspElement.style.background || bspElement.style.backgroundColor;
                    if (bspStyle.includes('#FF0000') || bspStyle.includes('rgb(255, 0, 0)')) {
                        bspClass = 'bsp-red';
                    } else if (bspStyle.includes('#FFB30F') || bspStyle.includes('rgb(255, 179, 15)')) {
                        bspClass = 'bsp-orange';
                    } else if (bspStyle.includes('#47A6FF') || bspStyle.includes('rgb(71, 166, 255)')) {
                        bspClass = 'bsp-blue';
                    } else if (bspStyle.includes('#73DF5D') || bspStyle.includes('rgb(115, 223, 93)')) {
                        bspClass = 'bsp-green';
                    } else if (bspStyle.includes('#FFFFFF') || bspStyle.includes('rgb(255, 255, 255)')) {
                        bspClass = 'bsp-white';
                    } else if (bspStyle.includes('#949494') || bspStyle.includes('rgb(148, 148, 148)')) {
                        bspClass = 'bsp-gray';
                    } else {
                        bspClass = 'bsp-default';
                    }

                    const bspColumn = document.createElement('div');
                    bspColumn.className = 'bsp-column left';
                    bspColumn.innerHTML = `<span class="bsp-value ${bspClass}">${bspValue}</span>`;
                    bspColumn.style.cssText = `
                        color: #ffffff !important;
                        padding: 2px 4px !important;
                        font-size: 1em !important;
                        font-weight: 700 !important;
                        display: inline-block !important;
                        margin-right: 3px !important;
                        min-width: 35px !important;
                        max-width: 35px !important;
                        text-align: center !important;
                        font-family: 'Monaco', 'Menlo', monospace !important;
                    `;

                    let levelDiv = member.querySelector('[class*="level___"], .level');
                    if (levelDiv) {
                        if (levelDiv.nextSibling) {
                            levelDiv.parentNode.insertBefore(bspColumn, levelDiv.nextSibling);
                        } else {
                            levelDiv.parentNode.appendChild(bspColumn);
                        }
                    } else {
                        member.appendChild(bspColumn);
                    }
                }
            });
        }

        addBspColumn(factionList) {
            // Find all member rows
            const memberSelectors = [
                'li[class*="member"]',
                'li[class*="enemy"]',
                'li',
                '[class*="member"]',
                'tr[class*="member"]',
                'div[class*="member"]'
            ];

            let members = [];
            memberSelectors.forEach(selector => {
                const found = factionList.querySelectorAll(selector);
                if (found.length > 0 && members.length === 0) {
                    members = found;
                }
            });

            members.forEach((member) => {
                // SKIP if member has memberRowWp class with enemy
                if (member.className.includes('memberRowWp') && member.className.includes('enemy')) {
                    return; // Skip this member
                }

                // Check if BSP column already exists
                if (!member.querySelector('.bsp-column')) {
                    // Look for existing BSP data in iconStats
                    const bspElement = member.querySelector('.iconStats');

                    // Skip if no BSP data found
                    if (!bspElement) {
                        return;
                    }

                    let bspValue = bspElement.textContent.trim();
                    let bspClass = 'low';

                    // Use BSP's original color directly - all BSP colors
                    const bspStyle = bspElement.style.background || bspElement.style.backgroundColor;
                    if (bspStyle.includes('#FF0000') || bspStyle.includes('rgb(255, 0, 0)')) {
                        bspClass = 'bsp-red';
                    } else if (bspStyle.includes('#FFB30F') || bspStyle.includes('rgb(255, 179, 15)')) {
                        bspClass = 'bsp-orange';
                    } else if (bspStyle.includes('#47A6FF') || bspStyle.includes('rgb(71, 166, 255)')) {
                        bspClass = 'bsp-blue';
                    } else if (bspStyle.includes('#73DF5D') || bspStyle.includes('rgb(115, 223, 93)')) {
                        bspClass = 'bsp-green';
                    } else if (bspStyle.includes('#FFFFFF') || bspStyle.includes('rgb(255, 255, 255)')) {
                        bspClass = 'bsp-white';
                    } else if (bspStyle.includes('#949494') || bspStyle.includes('rgb(148, 148, 148)')) {
                        bspClass = 'bsp-gray';
                    } else {
                        bspClass = 'bsp-default';
                    }

                    // Create BSP column
                    const bspColumn = document.createElement('div');
                    bspColumn.className = 'bsp-column left';
                    bspColumn.innerHTML = `<span class="bsp-value ${bspClass}">${bspValue}</span>`;

                    // Insert BSP column after the level column

                    // Try multiple strategies to find the level element
                    let levelDiv = member.querySelector('.level___g3CWR, [class*="level___"], .level');

                    // If no direct level div, look for div containing level text
                    if (!levelDiv) {
                        const allDivs = member.querySelectorAll('div');
                        for (let div of allDivs) {
                            if (div.textContent && /^\d+$/.test(div.textContent.trim()) && div.classList.contains('left')) {
                                levelDiv = div;
                                break;
                            }
                        }
                    }

                    if (levelDiv) {
                        // Insert after level column in the same parent
                        if (levelDiv.nextSibling) {
                            levelDiv.parentNode.insertBefore(bspColumn, levelDiv.nextSibling);
                        } else {
                            levelDiv.parentNode.appendChild(bspColumn);
                        }
                    } else {
                        // Fallback: try to find points column and insert before it
                        const pointsDiv = member.querySelector('.points___TQbnu, [class*="points___"], .points');
                        if (pointsDiv) {
                            pointsDiv.parentNode.insertBefore(bspColumn, pointsDiv);
                        } else {
                            // Last fallback: look for the second div.left (usually level)
                            const leftDivs = member.querySelectorAll('div.left');
                            if (leftDivs.length >= 2) {
                                const secondDiv = leftDivs[1]; // Usually level is second
                                if (secondDiv.nextSibling) {
                                    secondDiv.parentNode.insertBefore(bspColumn, secondDiv.nextSibling);
                                } else {
                                    secondDiv.parentNode.appendChild(bspColumn);
                                }
                            } else {
                                member.appendChild(bspColumn);
                            }
                        }
                    }
                }
            });
        }

        parseBspValue(value) {
            // Convert BSP string values to numbers for comparison
            const cleanValue = value.toLowerCase().replace(/[^0-9.kmb]/g, '');
            let multiplier = 1;

            if (cleanValue.includes('k')) {
                multiplier = 1000;
            } else if (cleanValue.includes('m')) {
                multiplier = 1000000;
            } else if (cleanValue.includes('b')) {
                multiplier = 1000000000;
            }

            const numericValue = parseFloat(cleanValue.replace(/[kmb]/g, ''));
            return numericValue * multiplier;
        }

        addBspHeader(factionList) {
            // SKIP ONLY if it's an enemy faction with title white-grad clearfix classes
            const titleContainer = factionList.querySelector('.title.white-grad.clearfix') ||
                                 factionList.closest('.title.white-grad.clearfix');
            const isYourFaction = factionList.closest('.your-faction') ||
                                factionList.closest('[class*="your-faction"]') ||
                                factionList.querySelector('[class*="your-faction"]');

            if (titleContainer && !isYourFaction) {
                return; // Skip adding BSP header only for enemy factions
            }

            // More comprehensive header detection

            // Try to find any element with "Level" text that might be a header
            const allElements = factionList.querySelectorAll('*');
            let levelHeaderElement = null;

            for (let element of allElements) {
                const text = element.textContent?.trim().toLowerCase();
                if (text === 'level' || element.classList.contains('level___g3CWR') || element.getAttribute('class')?.includes('level___')) {
                    levelHeaderElement = element;
                    break;
                }
            }

            // If we found a level header and BSP doesn't exist yet
            if (levelHeaderElement && !factionList.querySelector('.bsp-header')) {

                // Create BSP header
                const bspHeader = document.createElement('div');
                bspHeader.className = 'bsp-header left';
                bspHeader.textContent = 'BSP';

                // Copy classes from level header to match styling
                if (levelHeaderElement.className) {
                    const levelClasses = levelHeaderElement.className.split(' ').filter(cls =>
                        !cls.includes('level') && cls !== 'left'
                    );
                    bspHeader.className += ' ' + levelClasses.join(' ');
                }

                bspHeader.style.cssText = `
                    min-width: 32px !important;
                    width: 32px !important;
                    flex: 0 0 32px !important;
                    text-align: center !important;
                    font-weight: 700 !important;
                    color: #ffffff !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.3px !important;
                    font-size: 1em !important;
                    margin-right: 3px !important;
                    display: inline-block !important;
                    vertical-align: middle !important;
                    padding: 2px !important;
                    background: none !important;
                    border: none !important;
                `;

                // Add click event for sorting on enemy factions
                bspHeader.style.cursor = 'pointer';
                bspHeader.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Try to find the correct container for enemy members
                    let memberContainer = factionList;

                    // If factionList is not the member container, try to find it
                    if (!memberContainer.querySelector('li[class*="member"], li.enemy, li[class*="enemy"]')) {
                        // Look for member container in parent elements
                        memberContainer = factionList.closest('.f-war-list') ||
                                        factionList.querySelector('.f-war-list') ||
                                        factionList.parentElement ||
                                        factionList;
                    }

                    this.sortByBSP(memberContainer, bspHeader);
                });

                // Try different insertion strategies
                if (levelHeaderElement.nextSibling) {
                    levelHeaderElement.parentNode.insertBefore(bspHeader, levelHeaderElement.nextSibling);
                } else {
                    levelHeaderElement.parentNode.appendChild(bspHeader);
                }
            } else if (!levelHeaderElement) {
            } else {
            }
        }

        addCallButtons(factionList) {

            // Enhanced detection for attack buttons - try multiple selectors
            const attackSelectors = [
                'a[href*="getInAttack"]',
                'a[href*="attack"]',
                'button[onclick*="attack"]',
                '.attack a',
                'a[href*="/loader.php?sid=attack"]',
                'a[href*="loader2.php?sid=getInAttack"]'
            ];

            let activeAttackButtons = [];
            attackSelectors.forEach(selector => {
                const found = factionList.querySelectorAll(selector);
                if (found.length > 0) {
                    activeAttackButtons.push(...found);
                }
            });

            // Remove duplicates
            activeAttackButtons = [...new Set(activeAttackButtons)];

            // Better detection: check for enemy-specific classes or attack buttons
            const hasEnemyElements = factionList.querySelectorAll('[class*="enemy"]').length > 0;
            const hasEnemyMembers = factionList.querySelectorAll('li[class*="enemy"]').length > 0;
            const hasAttackDivs = factionList.querySelectorAll('.attack').length > 0;
            const hasAttackButtons = activeAttackButtons.length > 0;

            // Additional check: ensure we're not in our own faction context
            const isOwnFactionContext = factionList.closest('[class*="own"]') ||
                                      factionList.closest('[class*="friendly"]') ||
                                      factionList.querySelector('[class*="own"]') ||
                                      factionList.querySelector('[class*="friendly"]');

            const isEnemyFaction = (hasAttackDivs || hasAttackButtons) &&
                                 (hasEnemyElements || hasEnemyMembers) &&
                                 !isOwnFactionContext;


            // Enhanced member detection
            const memberSelectors = [
                'li[class*="member"]',
                'li[class*="enemy"]',
                'li',
                '[class*="member"]',
                'tr[class*="member"]',
                'div[class*="member"]'
            ];

            let members = [];
            memberSelectors.forEach(selector => {
                const found = factionList.querySelectorAll(selector);
                if (found.length > 0) {
                    if (members.length === 0) { // Use first successful selector
                        members = found;
                    }
                }
            });

            if (members.length === 0) {
                return;
            }

            if (isEnemyFaction) {

                // For enemy faction: add call button in same cell as attack button
                members.forEach((member, index) => {

                    // SKIP if member has memberRowWp class with enemy
                    if (member.className.includes('memberRowWp') && member.className.includes('enemy')) {
                        return; // Skip this member
                    }

                    // Check if call button already exists
                    if (!member.querySelector('.call-button')) {
                        // Always find the attack div, regardless of status
                        let attackDiv = member.querySelector('.attack');

                        // Find the attack element (link or span) within that div
                        let attackElement = null;
                        if (attackDiv) {
                            // Look for both active links and disabled spans
                            attackElement = attackDiv.querySelector('a') || attackDiv.querySelector('span');
                        }

                        // If that fails, try the old method
                        if (!attackElement) {
                            attackSelectors.forEach(selector => {
                                if (!attackElement) {
                                    attackElement = member.querySelector(selector);
                                }
                            });
                        }


                        if (attackDiv) {
                            // Use the attack div we already found
                            let attackContainer = attackDiv;

                            // Create call button
                            const callButton = document.createElement('button');
                            callButton.className = 'call-button';
                            callButton.textContent = 'Call';
                            callButton.style.cssText = `
                                background: linear-gradient(135deg, #2196f3, #1976d2) !important;
                                color: #ffffff !important;
                                border: none !important;
                                padding: 4px 6px !important;
                                border-radius: 4px !important;
                                font-weight: 600 !important;
                                cursor: pointer !important;
                                font-size: 0.75em !important;
                                text-align: center !important;
                                display: inline-block !important;
                                margin-right: 4px !important;
                                z-index: 1000 !important;
                                vertical-align: middle !important;
                                width: auto !important;
                                min-width: 35px !important;
                                max-width: 45px !important;
                                text-transform: uppercase !important;
                                letter-spacing: 0.1px !important;
                            `;

                            callButton.onclick = async function(e) {
                                e.preventDefault();
                                e.stopPropagation();

                                // Get the API manager from the enhancer
                                const enhancer = window.FactionWarEnhancer;
                                if (!enhancer || !enhancer.apiManager) {
                                    alert('API non initialisé');
                                    return;
                                }

                                // Check if this is an uncall (button has a callId)
                                const existingCallId = callButton.getAttribute('data-callId');
                                if (existingCallId) {
                                    // This is an UNCALL - try with retry logic
                                    callButton.disabled = true;
                                    callButton.style.opacity = '0.5';
                                    callButton.textContent = '...';

                                    // Try to cancel the call
                                    let result = await enhancer.apiManager.cancelCall(existingCallId);

                                    // If failed, retry once after 500ms
                                    if (!result || !result.success) {
                                        console.warn('⚠️ [UNCALL] First attempt failed, retrying in 500ms...');
                                        callButton.textContent = 'Retry';
                                        await new Promise(resolve => setTimeout(resolve, 500));
                                        result = await enhancer.apiManager.cancelCall(existingCallId);
                                    }

                                    if (result && result.success) {
                                        // Reset button to Call immediately
                                        callButton.textContent = 'Call';
                                        callButton.style.setProperty('background', 'linear-gradient(135deg, #2196f3, #1976d2)', 'important');
                                        callButton.style.setProperty('color', '#ffffff', 'important');
                                        callButton.style.setProperty('opacity', '1', 'important');
                                        callButton.classList.remove('my-call', 'other-call');
                                        callButton.removeAttribute('data-callId');
                                        callButton.disabled = false;
                                    } else {
                                        // If retry also failed, force refresh from server to resync
                                        console.error('❌ [UNCALL] Both attempts failed, forcing refresh from server...');
                                        callButton.textContent = 'Sync...';

                                        // Force refresh calls from server
                                        await enhancer.updateCallButtonsFromServer();

                                        // Show error notification
                                        enhancer.apiManager.showNotification('Uncall failed. Refreshed from server.', 'error');
                                    }
                                    return;
                                }


                                // Get member name - only the first text node (name only, not level/BSP)
                                const memberRow = callButton.closest('li') || callButton.closest('tr');
                                let memberName = 'Unknown';
                                let memberId = null;

                                if (memberRow) {
                                    const memberElement = memberRow.querySelector('[class*="member___"], .member');
                                    if (memberElement) {
                                        // Extract only the member name part (first text before any nested elements)
                                        const textNodes = Array.from(memberElement.childNodes).filter(n => n.nodeType === 3);
                                        if (textNodes.length > 0) {
                                            memberName = textNodes[0].textContent.trim();
                                        } else {
                                            // Fallback to just the direct text content
                                            memberName = memberElement.textContent.trim().split('\n')[0];
                                        }
                                    }

                                    // Extract member ID from attack link (more reliable than profile link)
                                    // Links look like: "loader2.php?sid=getInAttack&user2ID=213416"
                                    const attackLink = memberRow.querySelector('a[href*="getInAttack"], a[href*="user2ID"]');
                                    if (attackLink) {
                                        const match = attackLink.href.match(/user2ID=(\d+)/);
                                        if (match) {
                                            memberId = match[1];
                                        }
                                    }
                                }



                                // Send call to server
                                callButton.disabled = true;
                                callButton.style.opacity = '0.5';
                                callButton.textContent = '...';

                                const result = await enhancer.apiManager.callMember(memberName, memberId, callButton);


                                if (result && result.success) {
                                    // Store the callId and memberId for later uncall
                                    const callId = result.data.id;
                                    const returnedMemberId = result.data.member_id;
                                    const callerName = result.data.caller_name || enhancer.apiManager.playerName;


                                    callButton.setAttribute('data-callId', callId);
                                    callButton.setAttribute('data-memberId', returnedMemberId || memberId || '');
                                    // Update button immediately with green color
                                    callButton.textContent = callerName;
                                    callButton.classList.add('my-call');
                                    // Apply green color immediately without waiting for server response
                                    callButton.style.setProperty('background', 'linear-gradient(135deg, #86B300, #6d8a00)', 'important');
                                    callButton.style.setProperty('color', '#ffffff', 'important');
                                    callButton.disabled = false;

                                } else {
                                    // Don't show duplicate alert if already_called error (notification already shown by showNotification)
                                    if (!result || result.error !== 'already_called') {
                                        alert('Erreur lors de l\'enregistrement du call');
                                    }
                                    callButton.disabled = false;
                                    callButton.style.opacity = '1';
                                    callButton.textContent = 'Call';
                                }
                            };

                            // Configure the attack container to hold both buttons
                            attackContainer.style.display = 'flex';
                            attackContainer.style.alignItems = 'center';
                            attackContainer.style.gap = '4px';
                            attackContainer.style.justifyContent = 'flex-start';
                            attackContainer.style.flexWrap = 'nowrap';
                            attackContainer.style.overflow = 'visible';

                            // Insert call button before the attack link (or at the beginning if no link)
                            if (attackElement) {
                                attackContainer.insertBefore(callButton, attackElement);
                            } else {
                                // For disabled attacks (hospital, etc.), just append to the container
                                attackContainer.appendChild(callButton);
                            }
                        }
                    }
                });
            } else {
                // Ne pas toucher au tableau de notre propre faction
            }
        }


        sortByBSP(factionList, headerElement) {

            // Get current sort state from header
            const currentSort = headerElement.getAttribute('data-sort') || 'none';
            let newSort = 'asc';

            if (currentSort === 'asc') {
                newSort = 'desc';
            } else if (currentSort === 'desc') {
                newSort = 'asc';
            }

            // Update header sort state (no visual indicator)
            headerElement.setAttribute('data-sort', newSort);
            headerElement.textContent = 'BSP';

            // Get all member rows - try multiple selectors
            let members = Array.from(factionList.querySelectorAll('li[class*="member"], li.enemy, li[class*="enemy"]'));
            if (members.length === 0) {
                // Try broader search
                members = Array.from(factionList.querySelectorAll('li'));
            }

            if (members.length === 0) {
                return;
            }

            // Sort members based on BSP values
            members.sort((a, b) => {
                const bspA = this.getBSPValue(a);
                const bspB = this.getBSPValue(b);

                if (newSort === 'asc') {
                    // Ascending: smaller values first (moins au plus)
                    return bspA - bspB;
                } else {
                    // Descending: larger values first (plus au moins)
                    return bspB - bspA;
                }
            });

            // Get the parent container
            const memberContainer = members[0].parentNode;

            // Re-append sorted members
            members.forEach(member => {
                memberContainer.appendChild(member);
            });
        }

        getBSPValue(memberElement) {
            // Try to get BSP from our custom column first
            const bspColumn = memberElement.querySelector('.bsp-column, .bsp-value');
            if (bspColumn) {
                let text = bspColumn.textContent.trim();
                if (text && text !== 'N/A' && text !== '') {
                    return this.parseBSPText(text);
                }
            }

            // Fallback to original BSP element
            const bspElement = memberElement.querySelector('.iconStats');
            if (bspElement) {
                let text = bspElement.textContent.trim();
                if (text && text !== 'N/A' && text !== '') {
                    return this.parseBSPText(text);
                }
            }
            // Return a very high number for elements without BSP so they go to the end
            return 999999;
        }

        parseBSPText(text) {
            // Handle values like "106m", "69k", "1.5b", etc.
            const originalText = text;
            text = text.toLowerCase().trim();

            // Extract number and unit
            const match = text.match(/^([0-9.,-]+)([kmbt]?)$/);
            if (!match) {
                return 999999;
            }

            const numberPart = parseFloat(match[1].replace(/,/g, ''));
            const unit = match[2];

            let multiplier = 1;
            switch(unit) {
                case 'k': multiplier = 1000; break;
                case 'm': multiplier = 1000000; break;
                case 'b': multiplier = 1000000000; break;
                case 't': multiplier = 1000000000000; break;
                default: multiplier = 1; break;
            }

            const value = numberPart * multiplier;
            return value;
        }

        addStatusHeaderSorting(factionList) {
            // Only add sorting to enemy faction (not your faction)
            const isYourFaction = factionList.closest('.your-faction') ||
                                factionList.closest('[class*="your-faction"]') ||
                                factionList.querySelector('[class*="your-faction"]');

            if (isYourFaction) {
                return; // Skip for your faction
            }

            // Find the Status header element - try multiple strategies
            let statusHeader = factionList.querySelector('.white-grad [class*="status___"]');

            if (!statusHeader) {
                // Try looking in parent/sibling elements
                const parentContainer = factionList.closest('.f-war-list') || factionList.parentElement;
                if (parentContainer) {
                    statusHeader = parentContainer.querySelector('.white-grad [class*="status___"]');
                }
            }

            if (!statusHeader) {
                // Last resort: search globally for Status header in enemy faction area
                const allStatusHeaders = document.querySelectorAll('.white-grad [class*="status___"]');
                for (const header of allStatusHeaders) {
                    // Check if this header is in the enemy faction (not your faction)
                    const isInYourFaction = header.closest('.your-faction') || header.closest('[class*="your-faction"]');
                    if (!isInYourFaction) {
                        statusHeader = header;
                        break;
                    }
                }
            }

            if (statusHeader && !statusHeader.hasAttribute('data-sort-enabled')) {
                // Mark as enhanced
                statusHeader.setAttribute('data-sort-enabled', 'true');

                // Make it clickable
                statusHeader.style.cursor = 'pointer';

                // Add click handler
                statusHeader.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Try to find the correct container for enemy members
                    let memberContainer = factionList;

                    // If factionList is not the member container, try to find it
                    if (!memberContainer.querySelector('li[class*="member"], li.enemy, li[class*="enemy"]')) {
                        memberContainer = factionList.closest('.f-war-list') ||
                                        factionList.querySelector('.f-war-list') ||
                                        factionList.parentElement ||
                                        factionList;
                    }

                    this.sortByStatus(memberContainer, statusHeader);
                });
            }
        }

        restoreSavedSort() {
            // Restore saved sort preference after page load
            const savedSort = StorageUtil.get('cat_sort_preference', null);
            if (!savedSort || savedSort.column !== 'status') {
                return;
            }

            // Find the Status header in enemy faction
            let statusHeader = null;
            const allStatusHeaders = document.querySelectorAll('.white-grad [class*="status___"]');
            for (const header of allStatusHeaders) {
                const isInYourFaction = header.closest('.your-faction') || header.closest('[class*="your-faction"]');
                if (!isInYourFaction) {
                    statusHeader = header;
                    break;
                }
            }

            if (!statusHeader) {
                return;
            }

            // Find the member container
            const memberContainer = statusHeader.closest('.f-war-list') ||
                                  statusHeader.closest('ul') ||
                                  document.querySelector('.enemy-faction ul') ||
                                  document.querySelector('ul.membersCont');

            if (memberContainer) {
                // Apply the saved sort
                statusHeader.setAttribute('data-sort', savedSort.direction);
                this.sortByStatus(memberContainer, statusHeader, savedSort.direction);
            }
        }

        sortByStatus(factionList, headerElement, forcedDirection = null) {
            // Get current sort state from header
            const currentSort = headerElement.getAttribute('data-sort') || 'none';
            let newSort = forcedDirection || 'asc';

            if (!forcedDirection) {
                if (currentSort === 'none') {
                    newSort = 'asc';
                } else if (currentSort === 'asc') {
                    newSort = 'desc';
                } else {
                    newSort = 'asc';
                }
            }

            // Update header sort state
            headerElement.setAttribute('data-sort', newSort);

            // Save sort preference to localStorage
            StorageUtil.set('cat_sort_preference', {
                column: 'status',
                direction: newSort
            });

            // Get all member rows - try multiple selectors
            let members = Array.from(factionList.querySelectorAll('li[class*="member"], li.enemy, li[class*="enemy"]'));
            if (members.length === 0) {
                members = Array.from(factionList.querySelectorAll('li'));
            }

            if (members.length === 0) {
                return;
            }

            // Sort members based on status values
            members.sort((a, b) => {
                const statusA = this.getStatusValue(a);
                const statusB = this.getStatusValue(b);

                if (newSort === 'asc') {
                    // Ascending: Hospital first (with shortest time), then others
                    return statusA - statusB;
                } else {
                    // Descending: Others first, then Hospital (with longest time)
                    return statusB - statusA;
                }
            });

            // Get the parent container
            const memberContainer = members[0].parentNode;

            // Re-append sorted members
            members.forEach(member => {
                memberContainer.appendChild(member);
            });
        }

        getStatusValue(memberElement) {
            // Find the status element
            const statusElement = memberElement.querySelector('.status.left, [class*="status___"]');
            if (!statusElement) {
                return 999999; // No status, put at end
            }

            const statusText = statusElement.textContent.trim();

            // Status priority order (lower number = higher priority in asc sort)
            // Hospital members with timers get special treatment
            if (statusText.includes('Hospital')) {
                // Extract timer from status (format: "Hospital XX:XX:XX")
                const timerMatch = statusText.match(/(\d+):(\d+):(\d+)/);
                if (timerMatch) {
                    const hours = parseInt(timerMatch[1]);
                    const minutes = parseInt(timerMatch[2]);
                    const seconds = parseInt(timerMatch[3]);
                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    // Return value between 0-999 for hospital (shortest time = smallest value)
                    return totalSeconds;
                }
                // Hospital without timer
                return 1000;
            } else if (statusText.includes('Jail')) {
                const timerMatch = statusText.match(/(\d+):(\d+):(\d+)/);
                if (timerMatch) {
                    const hours = parseInt(timerMatch[1]);
                    const minutes = parseInt(timerMatch[2]);
                    const seconds = parseInt(timerMatch[3]);
                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    return 10000 + totalSeconds;
                }
                return 10000;
            } else if (statusText.includes('Traveling')) {
                return 20000;
            } else if (statusText.includes('Abroad')) {
                return 30000;
            } else if (statusText.includes('Okay') || statusText.includes('Online')) {
                return 40000;
            } else if (statusText.includes('Offline')) {
                return 50000;
            } else if (statusText.includes('Idle')) {
                return 60000;
            } else {
                // Unknown status
                return 70000;
            }
        }

        changeLevelToLvl() {
            // Find all level headers in faction tables and change "Level" to "Lvl"
            const levelHeaders = document.querySelectorAll('.white-grad .level___g3CWR, [class*="white-grad"] .level___g3CWR');

            levelHeaders.forEach(header => {
                if (header.textContent.includes('Level')) {
                    // Preserve the inner structure but change only the text node
                    const span = header.querySelector('span');
                    if (span && span.textContent === 'Level') {
                        span.textContent = 'Lvl';
                    } else if (header.childNodes.length > 0) {
                        // Find the text node and replace it
                        for (let node of header.childNodes) {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Level') {
                                node.textContent = 'Lvl';
                                break;
                            }
                        }
                    }
                }
            });
        }

        addLoadingAnimation(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = `all ${CONFIG.animations.duration} ${CONFIG.animations.easing}`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }

        injectTabsMenu() {
            // Inject custom tab menu above faction-war-info
            const factionWarInfo = document.querySelector('.faction-war-info, [class*="factionWarInfo"]');

            // If already injected, don't do it again
            if (document.getElementById('custom-tabs-menu')) {
                return;
            }

            // If element doesn't exist yet, retry with polling
            if (!factionWarInfo) {
                setTimeout(() => {
                    this.injectTabsMenu();
                }, 200);
                return;
            }

            // Create tabs container
            const tabsMenu = document.createElement('div');
            tabsMenu.id = 'custom-tabs-menu';
            tabsMenu.style.cssText = `
                display: flex;
                width: 100%;
                border-bottom: 1px solid #222222;
                margin: 0;
                background: linear-gradient(to bottom, #2a2a2a, #1f1f1f);
                border-radius: 5px;
                position: relative;
                z-index: 100;
                gap: 0;
                box-sizing: border-box;
            `;

            // Add styles for tabs
            const tabStyles = document.createElement('style');
            tabStyles.innerHTML = `
                @keyframes blinking {
                    0% {
                        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
                    }
                    50% {
                        background: linear-gradient(135deg, #FFD700, #FFA500);
                    }
                    100% {
                        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
                    }
                }

                .custom-tab-btn {
                    padding: 12px 20px !important;
                    background: linear-gradient(to bottom, #646464, #343434);
                    color: white !important;
                    border: none !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                    flex: 1 !important;
                    min-width: 0 !important;
                    font-weight: bold !important;
                    transition: all 0.2s ease !important;
                    position: relative !important;
                    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.75) !important;
                    user-select: none !important;
                }

                .custom-tab-btn:not(.blinking):not(.active) {
                    background: linear-gradient(to bottom, #646464, #343434) !important;
                }

                .custom-tab-btn.blinking {
                    animation: blinking 0.8s ease-in-out infinite !important;
                    transition: none !important;
                    color: #ffffff !important;
                    font-weight: bold !important;
                    text-shadow: none !important;
                }

                .custom-tab-btn:hover:not(.active) {
                    background: linear-gradient(to bottom, #707070, #3a3a3a) !important;
                    transform: translateY(-1px) !important;
                }

                .custom-tab-btn.active {
                    background: linear-gradient(to bottom, #232323, #444444) !important;
                    color: #ffffff !important;
                    animation: none !important;
                }

                .custom-tab-btn:first-child {
                    border-radius: 5px 0 0 0 !important;
                }

                .custom-tab-btn:last-child {
                    border-radius: 0 5px 0 0 !important;
                }

                .custom-tab-btn:not(:last-child) {
                    border-right: 1px solid rgba(0, 0, 0, 0.3) !important;
                }

                .custom-tab-content {
                    display: none !important;
                    padding: 15px;
                    background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
                    color: #e0e0e0;
                    border-radius: 0 0 5px 5px;
                    margin: 0 0 15px 0;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }

                .custom-tab-content.active {
                    display: block !important;
                    visibility: visible !important;
                    height: auto !important;
                    overflow: visible !important;
                    padding: 15px !important;
                    margin: 0 0 15px 0 !important;
                }

                .api-key-input::placeholder {
                    color: #ffffff !important;
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(tabStyles);

            // Create tabs
            const tabs = ['Faction', 'Help', 'Settings'];
            const tabContents = {};
            const enhancer = this; // Capture the context

            tabs.forEach((tabName) => {
                const btn = document.createElement('button');
                btn.className = 'custom-tab-btn';
                btn.textContent = tabName;
                btn.dataset.tab = tabName.toLowerCase();

                // Add ID to Settings button for easy reference
                if (tabName.toLowerCase() === 'settings') {
                    btn.id = 'settings-tab-btn';
                    // Check if API key is configured
                    const apiKey = StorageUtil.get('cat_api_key_script', '');
                    if (!apiKey || apiKey.trim() === '') {
                        btn.classList.add('blinking');
                    }
                }

                // Create content container for each tab
                const content = document.createElement('div');
                content.className = 'custom-tab-content';
                content.dataset.tab = tabName.toLowerCase();
                content.style.display = 'none';
                content.style.padding = '15px';
                content.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)';
                content.style.color = '#e0e0e0';
                content.style.borderRadius = '0 0 5px 5px';
                content.style.marginTop = '0';

                tabContents[tabName.toLowerCase()] = content;

                // Add Settings content
                if (tabName.toLowerCase() === 'settings') {
                    const currentKey = StorageUtil.get('cat_api_key_script', '');
                    content.innerHTML = `
                        <div style="padding: 0;">
                            <div style="margin-bottom: 15px; padding: 12px; background: rgba(102, 126, 234, 0.15); border-left: 3px solid #667eea; border-radius: 4px;">
                                <p style="margin: 0 0 5px 0; font-size: 13px; color: #a0aec0; font-weight: 500;">🔑 Torn API Key Configuration</p>
                                <p style="margin: 0; font-size: 12px; color: #718096;">Enter your API key from Torn.com profile</p>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #cbd5e0; font-size: 13px;">API KEY</label>
                                <input type="password" id="tab-setting-torn-apikey" placeholder="Paste your PUBLIC API key here" value="${currentKey}"
                                    style="width: 100%; padding: 10px 12px; border: 1px solid #4a5568; border-radius: 4px; box-sizing: border-box; font-size: 13px; background: #1a202c; color: #e2e8f0; transition: all 0.2s ease;" class="api-key-input">
                                <p style="margin: 6px 0 0 0; font-size: 11px; color: #718096;">Stored locally in your browser only</p>
                                <div id="tab-setting-api-validation" style="margin-top: 8px; font-size: 12px; display: none; padding: 8px; border-radius: 4px; background: rgba(0,0,0,0.2);"></div>
                            </div>

                            <div style="display: flex; gap: 10px; justify-content: space-between; margin-top: 15px;">
                                <button id="tab-setting-clear-cache" style="padding: 10px 14px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 4px; cursor: pointer; font-weight: 500; color: #fc8181; font-size: 12px; transition: all 0.2s ease;">🗑️ Clear Cache</button>
                                <button id="tab-setting-save" style="padding: 10px 18px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.2s ease;">Save API Key</button>
                            </div>
                        </div>
                    `;
                } else if (tabName.toLowerCase() === 'help') {
                    content.innerHTML = `
                        <div style="padding: 0; font-size: 13px; line-height: 1.6;">
                            <div style="margin-bottom: 12px;">
                                <p style="margin: 0 0 6px 0; color: #cbd5e0; font-weight: 600;">📖 How to Use</p>
                                <p style="margin: 0; color: #a0aec0;">Click the 'Call' button to register your call. Other faction members will see who called the target in real-time.</p>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <p style="margin: 0 0 6px 0; color: #cbd5e0; font-weight: 600;">⚙️ First Time Setup</p>
                                <p style="margin: 0; color: #a0aec0;">Enter your Torn API key in Settings to enable call tracking. Find it on your profile page at the bottom left.</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 6px 0; color: #cbd5e0; font-weight: 600;">🔄 Syncing</p>
                                <p style="margin: 0; color: #a0aec0;">Calls sync automatically. Your faction members will see your calls instantly.</p>
                            </div>
                        </div>
                    `;
                } else if (tabName.toLowerCase() === 'faction') {
                    content.innerHTML = `
                        <div style="padding: 0; font-size: 13px;">
                            <div id="faction-stats-loader" style="text-align: center; padding: 20px 0;">
                                <p style="margin: 0; color: #cbd5e0;">📊 Loading faction stats...</p>
                            </div>
                            <div id="faction-stats-container" style="display: none;"></div>
                        </div>
                    `;
                }

                btn.onclick = (e) => {
                    e.preventDefault();

                    // Toggle: if already active, close it
                    if (btn.classList.contains('active')) {
                        btn.classList.remove('active');
                        content.classList.remove('active');
                    } else {
                        // Remove active class from all tabs and contents
                        document.querySelectorAll('.custom-tab-btn').forEach(b => b.classList.remove('active'));
                        document.querySelectorAll('.custom-tab-content').forEach(c => c.classList.remove('active'));

                        // Add active class to clicked tab
                        btn.classList.add('active');
                        content.classList.add('active');

                        // Load faction stats if this is faction tab
                        if (tabName.toLowerCase() === 'faction' && !window._factionStatsLoaded) {
                            window._factionStatsLoaded = true;
                            (async () => {
                                const loader = document.getElementById('faction-stats-loader');
                                const container = document.getElementById('faction-stats-container');
                                const enhancerInstance = window.FactionWarEnhancer || enhancer;
                                const enemyFactionId = enhancerInstance.apiManager.factionId;
                                const userFactionId = StorageUtil.get('cat_user_faction_id', null);


                                if (enemyFactionId && userFactionId) {
                                    const enemyFactionInfo = await enhancerInstance.apiManager.getFactionInfo(enemyFactionId);
                                    const userFactionInfo = await enhancerInstance.apiManager.getFactionInfo(userFactionId);
                                    if (enemyFactionInfo && userFactionInfo) {
                                        await enhancerInstance.renderDualFactionStats(enemyFactionInfo, userFactionInfo, container, loader);
                                    } else {
                                        loader.innerHTML = '<p style="color: #ef5350;">Failed to load faction stats. Make sure API key is configured.</p>';
                                    }
                                } else if (enemyFactionId) {
                                    const factionInfo = await enhancerInstance.apiManager.getFactionInfo(enemyFactionId);
                                    if (factionInfo) {
                                        enhancerInstance.renderFactionStats(factionInfo, container, loader);
                                    } else {
                                        loader.innerHTML = '<p style="color: #ef5350;">Failed to load faction stats. Make sure API key is configured.</p>';
                                    }
                                } else {
                                    loader.innerHTML = '<p style="color: #ffa726;">Faction not detected. Go to faction war page first.</p>';
                                }
                            })();
                        }

                        // Set up Settings tab event listeners if this is Settings tab
                        if (tabName.toLowerCase() === 'settings') {
                            setTimeout(() => {
                                enhancer.setupSettingsTabHandlers();
                            }, 100);
                        }
                    }
                };

                tabsMenu.appendChild(btn);
            });

            // Insert tabs menu before faction-war-info
            factionWarInfo.parentNode.insertBefore(tabsMenu, factionWarInfo);

            // Append all content containers after tabs menu
            Object.values(tabContents).forEach(content => {
                factionWarInfo.parentNode.insertBefore(content, factionWarInfo);
            });
        }

        setupSettingsTabHandlers() {
            const saveBtn = document.getElementById('tab-setting-save');
            const clearCacheBtn = document.getElementById('tab-setting-clear-cache');
            const apiKeyInput = document.getElementById('tab-setting-torn-apikey');
            const validationDiv = document.getElementById('tab-setting-api-validation');
            const enhancer = this;

            if (!saveBtn || !apiKeyInput) return;

            // Clear Cache button
            if (clearCacheBtn) {
                clearCacheBtn.onclick = () => {
                    if (confirm('⚠️ This will clear all cached data. Continue?')) {
                        StorageUtil.remove('cat_api_key_script');
                        StorageUtil.remove('cat_user_info');
                        StorageUtil.remove('cat_user_faction_id');
                        StorageUtil.remove('cat_enemy_faction_id');
                        apiKeyInput.value = '';

                        // Add blinking animation back to Settings tab
                        const settingsBtn = document.getElementById('settings-tab-btn');
                        if (settingsBtn) {
                            settingsBtn.classList.add('blinking');
                        }

                        validationDiv.textContent = '✅ Cache cleared!';
                        validationDiv.style.color = '#68d391';
                        validationDiv.style.display = 'block';

                        // Refresh the page after 2 seconds
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }
                };
            }

            // Save button
            saveBtn.onclick = async () => {
                const newKey = apiKeyInput.value.trim();

                if (!newKey) {
                    validationDiv.style.color = '#fc8181';
                    validationDiv.textContent = '❌ Please enter an API key!';
                    validationDiv.style.display = 'block';
                    return;
                }

                // Show loading state
                saveBtn.disabled = true;
                const originalText = saveBtn.textContent;
                saveBtn.textContent = 'Validating...';
                validationDiv.style.color = '#63b3ed';
                validationDiv.textContent = '⏳ Checking API key...';
                validationDiv.style.display = 'block';

                try {
                    // Test the API key
                    const response = await enhancer.apiManager.gmFetch(
                        `https://api.torn.com/v2/user/profile?striptags=true&key=${newKey}`,
                        { method: 'GET' }
                    );


                    if (response.ok) {
                        const data = await response.json();

                        if (data.profile && data.profile.name) {
                            // Valid API key
                            StorageUtil.set('cat_api_key_script', newKey);
                            enhancer.apiManager.torn_apikey = newKey;

                            // Log profile data

                            // Save user info - include player ID for identification
                            const userInfo = {
                                id: data.profile.id,
                                name: data.profile.name,
                                faction_id: data.profile.faction_id || null,
                                faction_name: 'Your Faction'
                            };
                            StorageUtil.set('cat_user_info', userInfo);

                            // Update API manager with player info
                            enhancer.apiManager.playerId = data.profile.id;
                            enhancer.apiManager.playerName = data.profile.name;

                            // Remove blinking animation from Settings tab
                            const settingsBtn = document.getElementById('settings-tab-btn');
                            if (settingsBtn) {
                                settingsBtn.classList.remove('blinking');
                            }

                            validationDiv.style.color = '#68d391';
                            validationDiv.textContent = `✅ Success! Welcome ${data.profile.name}`;
                            validationDiv.style.display = 'block';

                            // Refresh the page after 2 seconds to load call buttons
                            setTimeout(() => {
                                location.reload();
                            }, 2000);
                        } else {
                            throw new Error('Invalid API response');
                        }
                    } else {
                        validationDiv.style.color = '#fc8181';
                        validationDiv.textContent = '❌ Invalid API key!';
                        validationDiv.style.display = 'block';
                    }
                } catch (error) {
                    console.error('API Validation error:', error);
                    console.error('Error stack:', error.stack);
                    validationDiv.style.color = '#fc8181';
                    validationDiv.textContent = '❌ Error validating API key: ' + error.message;
                    validationDiv.style.display = 'block';
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.textContent = originalText;
                }
            };

            // Allow Enter key to submit
            apiKeyInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    saveBtn.click();
                }
            };
        }

        async loadCallsFromDatabase() {
            // Load calls from database and update call buttons
            try {
                const enhancer = window.FactionWarEnhancer;

                if (!enhancer || !enhancer.apiManager) {
                    console.warn('API Manager not ready');
                    return;
                }

                const calls = await enhancer.apiManager.getCalls();

                if (!calls || calls.length === 0) {
                    return;
                }

                // For each call, find the corresponding button and update it
                const callButtons = document.querySelectorAll('.call-button');

                calls.forEach(callData => {
                    // Find the call button for this member
                    callButtons.forEach(btn => {
                        // Get member info from the button's row
                        const memberRow = btn.closest('li') || btn.closest('tr');
                        if (memberRow) {
                            const memberElement = memberRow.querySelector('[class*="member___"], .member');
                            if (memberElement) {
                                const textNodes = Array.from(memberElement.childNodes).filter(n => n.nodeType === 3);
                                let memberName = '';
                                if (textNodes.length > 0) {
                                    memberName = textNodes[0].textContent.trim();
                                } else {
                                    memberName = memberElement.textContent.trim().split('\n')[0];
                                }

                                // Try to extract member ID from attack link (more reliable)
                                let memberId = null;
                                const attackLink = memberRow.querySelector('a[href*="getInAttack"], a[href*="user2ID"]');
                                if (attackLink) {
                                    const match = attackLink.href.match(/user2ID=(\d+)/);
                                    if (match) {
                                        memberId = match[1];
                                    }
                                }

                                // Match by member_id first (more reliable), then by name
                                const isMatch = (callData.member_id && memberId && callData.member_id === memberId) ||
                                               (memberName === callData.member_name);

                                // If this button's member matches a call, update it
                                if (isMatch) {
                                    btn.setAttribute('data-callId', callData.id);
                                    btn.setAttribute('data-memberId', callData.member_id || '');
                                    btn.textContent = callData.caller_name;
                                    btn.classList.add('my-call');
                                }
                            }
                        }
                    });
                });

            } catch (error) {
                console.warn('Error loading calls from database:', error);
            }
        }
    }

    // Performance Manager
    class PerformanceManager {
        constructor() {
            this.throttleTimeout = null;
        }

        throttle(func, delay) {
            return (...args) => {
                if (this.throttleTimeout) return;

                this.throttleTimeout = setTimeout(() => {
                    func.apply(this, args);
                    this.throttleTimeout = null;
                }, delay);
            };
        }

        debounce(func, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        }
    }

    // API Manager for VPS communication
    class APIManager {
        constructor() {
            this.serverUrl = 'http://51.178.26.139:3000'; // Change to your VPS IP/domain
            this.authToken = '4ac2a01d3c6781ff914326a3dded949428fc9220b52f073c19c9105c982861cd'; // Your server auth token
            this.factionId = null; // Will be auto-detected
            this.playerName = 'Unknown';
            this.playerId = null; // Will be auto-detected
            this.torn_apikey = this.getTornApiKeyFromStorage(); // Get from localStorage using cat_api_key_script
            this.isCallsFetching = false; // Flag to prevent simultaneous getCalls() requests
            this.lastValidCalls = []; // Cache last valid response to prevent oscillation on empty responses

            // Note: Fetch method detection is now done at request time in gmFetch()
            // This allows TornPDA to load customFetch after script initialization

            // Load stored user info if available
            this.loadUserInfoFromStorage();

            // Auto-detect faction on init (async, don't block constructor)
            setTimeout(() => this.detectFactionAutomatically(), 100);
        }

        loadUserInfoFromStorage() {
            // Try to load stored user info from Tampermonkey storage
            try {
                const storedInfo = StorageUtil.get('cat_user_info', null);
                if (storedInfo) {
                    // If it's already an object (from StorageUtil), use it directly
                    if (typeof storedInfo === 'object' && storedInfo !== null) {
                        this.playerName = storedInfo.name || 'Unknown';
                        this.playerId = storedInfo.id || null;
                    } else {
                        // Otherwise try to parse it
                        const userInfo = JSON.parse(storedInfo);
                        this.playerName = userInfo.name || 'Unknown';
                        this.playerId = userInfo.id || null;
                    }
                }
            } catch (e) {
                // Ignore parsing errors
                console.warn('Error parsing stored user info');
            }

            // Fallback to page extraction if not found in storage
            if (this.playerName === 'Unknown' || !this.playerId) {
                this.playerName = this.getPlayerName();
                // Try to extract player ID from page if we don't have it
                if (!this.playerId) {
                    this.playerId = this.extractPlayerIdFromPage();
                }
            }

            // After 500ms, fetch fresh user info from API if we have the key and ID
            setTimeout(() => {
                if (this.torn_apikey && this.playerId) {
                    this.fetchUserInfoFromTornAPI().catch(e => console.warn('Could not fetch user info from API:', e));
                }
            }, 500);
        }

        setServerUrl(url) {
            this.serverUrl = url;
        }

        setAuthToken(token) {
            this.authToken = token;
        }

        setFactionId(id) {
            this.factionId = id;
        }

        getPlayerName() {
            // Try to extract player name from the page

            // Method 1: Check page title which often contains player name (BEST)
            // Format is usually: "PlayerName - Torn"
            const titleMatch = document.title.match(/(.+?)\s*-\s*Torn/);
            if (titleMatch && titleMatch[1]) {
                const name = titleMatch[1].trim();
                if (name && name.length > 0 && name !== 'Torn') {
                    return name;
                }
            }

            // Method 2: Search for player name in common locations
            let playerElement = document.querySelector('[class*="player-name"], [class*="username"], .user-name');
            if (playerElement) {
                return playerElement.textContent.trim();
            }

            // Method 3: Check meta tags for player info
            const userMeta = document.querySelector('meta[name="user"]') ||
                           document.querySelector('meta[property="user"]');
            if (userMeta) {
                const content = userMeta.getAttribute('content');
                if (content) return content.trim();
            }

            return 'Unknown';
        }

        getTornApiKeyFromStorage() {
            // Try to get API key from Tampermonkey storage
            try {
                const apiKey = StorageUtil.get('cat_api_key_script', null);
                if (apiKey) {
                    return apiKey;
                }
            } catch (e) {
                console.warn('Error accessing localStorage');
            }

            console.warn('⚠️  API Key non trouvée. Veuillez la configurer.');
            return null;
        }

        saveTornApiKey(apiKey) {
            // Save API key to Tampermonkey storage
            try {
                StorageUtil.set('cat_api_key_script', apiKey);
                this.torn_apikey = apiKey;
                return true;
            } catch (e) {
                console.error('Erreur lors de la sauvegarde:', e);
            }
            return false;
        }

        promptForApiKey() {
            // Show prompt to user for API key
            const apiKey = prompt(
                'Entrez votre API Key Torn:\n\n' +
                '(Vous la trouverez sur https://www.torn.com/preferences.php#tab=api)\n\n' +
                'Votre clé sera stockée localement dans le navigateur.',
                ''
            );

            if (apiKey && apiKey.trim().length > 0) {
                if (this.saveTornApiKey(apiKey.trim())) {
                    alert('✅ API Key sauvegardée avec succès!');
                    // Reload user info and faction detection
                    this.loadUserInfoFromStorage();
                    this.detectFactionAutomatically();
                    return true;
                }
            }

            return false;
        }

        showApiKeyModal() {
            // Create and show styled modal for API key input (same style as settings modal)
            return new Promise((resolve) => {
                // Remove existing modal if present
                const existingModal = document.getElementById('torn-api-key-modal');
                if (existingModal) {
                    existingModal.remove();
                }

                // Create modal container
                const modal = document.createElement('div');
                modal.id = 'torn-api-key-modal';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                `;

                const content = document.createElement('div');
                content.style.cssText = `
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    max-width: 450px;
                    width: 90%;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;

                content.innerHTML = `
                    <h2 style="margin-top: 0; color: #333;">⚙️ Settings</h2>

                    <div style="margin-bottom: 15px; padding: 12px; background: #f0f8ff; border-left: 4px solid #667eea; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #555;">Enter your Torn.com API key:</p>
                        <p style="margin: 0; font-size: 12px; color: #888;">You'll find it on your Torn profile settings</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">🔑 Torn API Key:</label>
                        <input type="password" id="torn-api-key-input" placeholder="Paste your API key here"
                            style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
                        <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">Key stored locally in your browser only</p>
                        <div id="torn-api-error" style="margin-top: 8px; font-size: 12px; display: none;"></div>
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="torn-api-cancel" style="padding: 10px 20px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-weight: 500;">Skip</button>
                        <button id="torn-api-confirm" style="padding: 10px 20px; background: #4ecdc4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Save</button>
                    </div>
                `;

                modal.appendChild(content);
                document.body.appendChild(modal);

                // Focus on input
                const input = document.getElementById('torn-api-key-input');
                setTimeout(() => input.focus(), 100);

                // Handle confirm button
                const confirmBtn = document.getElementById('torn-api-confirm');
                confirmBtn.addEventListener('click', async () => {
                    const apiKey = input.value.trim();
                    const errorDiv = document.getElementById('torn-api-error');

                    if (!apiKey) {
                        errorDiv.style.color = '#d32f2f';
                        errorDiv.textContent = '❌ Please enter an API key!';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    // Show loading state
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = 'Validating...';
                    errorDiv.style.color = '#1976d2';
                    errorDiv.textContent = '⏳ Checking API key...';
                    errorDiv.style.display = 'block';

                    try {
                        // Test the API key by calling Torn API
                        const response = await this.gmFetch(
                            `https://api.torn.com/v2/user/self/basic?key=${apiKey}`,
                            { method: 'GET' }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            if (data.profile && data.profile.name) {
                                // Valid API key
                                if (this.saveTornApiKey(apiKey)) {
                                    errorDiv.style.color = '#2e7d32';
                                    errorDiv.textContent = `✅ Valid API key! Welcome ${data.profile.name}`;
                                    errorDiv.style.display = 'block';

                                    // Load user info immediately
                                    this.playerName = data.profile.name;
                                    this.playerId = data.profile.id;

                                    // Re-enable call buttons and restart refresh
                                    const enhancer = window.factionWarEnhancer;
                                    if (enhancer) {
                                        enhancer.enableAllCallButtons();
                                        if (!enhancer.refreshInterval) {
                                            enhancer.startCallRefresh();
                                        }
                                    }

                                    // Close modal after 1.5 seconds
                                    setTimeout(() => {
                                        modal.remove();
                                        resolve(true);
                                    }, 1500);
                                } else {
                                    errorDiv.style.color = '#d32f2f';
                                    errorDiv.textContent = '❌ Error saving API key';
                                    errorDiv.style.display = 'block';
                                }
                            } else {
                                // Response OK but invalid structure
                                errorDiv.style.color = '#d32f2f';
                                errorDiv.textContent = '❌ Invalid API response';
                                errorDiv.style.display = 'block';
                            }
                        } else {
                            // API call failed - invalid key
                            errorDiv.style.color = '#d32f2f';
                            errorDiv.textContent = '❌ Invalid API key or API is unreachable';
                            errorDiv.style.display = 'block';
                        }
                    } catch (error) {
                        console.error('API validation error:', error);
                        errorDiv.style.color = '#d32f2f';
                        errorDiv.textContent = '❌ Error validating API key';
                        errorDiv.style.display = 'block';
                    } finally {
                        // Restore button
                        confirmBtn.disabled = false;
                        confirmBtn.textContent = 'Save';
                    }
                });

                // Handle cancel button
                const cancelBtn = document.getElementById('torn-api-cancel');
                cancelBtn.addEventListener('click', () => {
                    modal.remove();
                    resolve(false);
                });

                // Allow Enter key to confirm
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        confirmBtn.click();
                    }
                });

                // Close modal on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && document.getElementById('torn-api-key-modal')) {
                        document.getElementById('torn-api-key-modal').remove();
                        resolve(false);
                    }
                });
            });
        }

        async fetchUserInfoFromTornAPI() {
            // Fetch user info from Torn API and store it
            if (!this.torn_apikey) {
                return null;
            }

            try {
                // Use 'self' to get the profile of the API key owner, not a random extracted ID
                const apiUrl = `https://api.torn.com/v2/user/self/basic?key=${this.torn_apikey}`;
                const response = await this.gmFetch(apiUrl, { method: 'GET' });

                if (response.ok) {
                    const data = await response.json();
                    if (data.profile && data.profile.name) {
                        const userInfo = {
                            id: data.profile.id,
                            name: data.profile.name,
                            level: data.profile.level,
                            gender: data.profile.gender,
                            status: data.profile.status?.state
                        };

                        // Store in localStorage via Tampermonkey
                        try {
                            StorageUtil.set('cat_user_info', userInfo);
                        } catch (e) {
                            // Ignore GM errors
                        }

                        // Update player name and ID
                        this.playerName = userInfo.name;
                        this.playerId = userInfo.id;

                        return userInfo;
                    }
                }
            } catch (error) {
                // Silently fail if API call doesn't work
            }

            return null;
        }

        async fetchEnemyFactionIdFromAPI() {
            // Fetch faction wars info and extract enemy faction ID

            if (!this.torn_apikey) {
                console.warn('❌ [fetchEnemyFactionIdFromAPI] Missing API key');
                return null;
            }

            try {

                // Step 1: Check localStorage for user faction ID
                let userFactionId = StorageUtil.get('cat_user_faction_id', null);

                if (userFactionId) {
                } else {
                    // Step 2: If not in localStorage, fetch from API
                    const userUrl = `https://api.torn.com/v2/user?key=${this.torn_apikey}`;
                    const userResponse = await this.gmFetch(userUrl, { method: 'GET' });

                    if (!userResponse.ok) {
                        console.warn('❌ [Step 2] Failed to fetch user. Status:', userResponse.status);
                        return null;
                    }

                    const userData = await userResponse.json();

                    // The faction ID is at userData.profile.faction_id
                    userFactionId = userData.profile?.faction_id;


                    if (!userFactionId) {
                        console.warn('❌ [Step 2] No faction ID found in user response');
                        return null;
                    }

                    // Save to localStorage
                    StorageUtil.set('cat_user_faction_id', userFactionId);
                }

                // Step 3: Get the wars for this faction
                const warsUrl = `https://api.torn.com/v2/faction/${userFactionId}/wars?key=${this.torn_apikey}`;
                const warsResponse = await this.gmFetch(warsUrl, { method: 'GET' });

                if (!warsResponse.ok) {
                    console.warn('❌ [Step 3] Failed to fetch faction wars. Status:', warsResponse.status);
                    return null;
                }


                const warsData = await warsResponse.json();

                // Extract enemy faction ID from the ranked war
                if (warsData.wars && warsData.wars.ranked && warsData.wars.ranked.factions) {
                    const factions = warsData.wars.ranked.factions;

                    // Find the faction that is NOT ours
                    const enemyFaction = factions.find(f => f.id !== userFactionId);

                    if (enemyFaction) {
                        const enemyId = `faction-${enemyFaction.id}`;

                        // Save to localStorage with 1 hour expiration
                        const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now
                        StorageUtil.set('cat_enemy_faction_id', {
                            id: enemyId,
                            name: enemyFaction.name,
                            expiresAt: expiresAt
                        });

                        this.factionId = enemyId;
                        return enemyId;
                    }
                }

                console.warn('⚠️ [Step 3] No active war found');
                return null;
            } catch (error) {
                console.error('❌ Error fetching enemy faction ID:', error);
                return null;
            }
        }

        async getFactionInfo(factionId) {
            try {
                if (!this.torn_apikey) {
                    return null;
                }

                // Extract numeric faction ID - handle both string and number inputs
                let numericId = factionId;
                if (typeof factionId === 'string') {
                    numericId = factionId.replace('faction-', '');
                }
                // Convert to number and back to string to ensure it's clean
                numericId = String(parseInt(numericId));

                const url = `https://api.torn.com/v2/faction/${numericId}?key=${this.torn_apikey}&selections=basic`;
                const response = await this.gmFetch(url, { method: 'GET' });

                if (!response.ok) {
                    console.warn('Failed to fetch faction info:', response.status);
                    return null;
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching faction info:', error);
                return null;
            }
        }

        async getUserInfo(userId) {
            try {
                if (!this.torn_apikey) {
                    return null;
                }

                const url = `https://api.torn.com/v2/user/${userId}?key=${this.torn_apikey}&selections=profile`;
                const response = await this.gmFetch(url, { method: 'GET' });

                if (!response.ok) {
                    console.warn('Failed to fetch user info:', response.status);
                    return null;
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching user info:', error);
                return null;
            }
        }

        async detectFactionAutomatically() {
            try {
                // Try to extract player ID from the page (optional, not always available)
                this.playerId = this.extractPlayerIdFromPage();


                // If no API key, user should configure it in the Settings tab
                if (!this.torn_apikey) {
                    // No API key configured - user can set it in the Settings tab
                    this.factionId = this.playerId ? `player-${this.playerId}` : 'unknown-faction';
                    return;
                }

                // Check if we have a cached enemy faction ID that's not expired
                const cachedEnemyFaction = StorageUtil.get('cat_enemy_faction_id', null);
                if (cachedEnemyFaction && cachedEnemyFaction.expiresAt && cachedEnemyFaction.expiresAt > Date.now()) {
                    this.factionId = cachedEnemyFaction.id;
                    return;
                }

                // Fetch enemy faction ID from Torn API (this works even without playerId)
                const enemyFactionId = await this.fetchEnemyFactionIdFromAPI();
                if (enemyFactionId) {
                    return;
                }

                // Fallback: Try to extract enemy faction ID from the page
                const pageEnemyFactionId = this.extractEnemyFactionIdFromPage();
                if (pageEnemyFactionId) {
                    this.factionId = pageEnemyFactionId;
                    return;
                }

                // Fallback: use player ID as faction identifier if available
                if (this.playerId) {
                    this.factionId = `player-${this.playerId}`;
                } else {
                    this.factionId = 'unknown-faction';
                }
            } catch (error) {
                console.error('Error in detectFactionAutomatically:', error);
                // Try to extract from page as last resort
                const enemyFactionId = this.extractEnemyFactionIdFromPage();
                if (enemyFactionId) {
                    this.factionId = enemyFactionId;
                } else {
                    this.factionId = `player-${this.playerId || 'unknown'}`;
                }
            }
        }

        extractEnemyFactionIdFromPage() {
            // Try to extract enemy faction ID from the page
            // Look for faction data in various places on the Torn faction war page

            // Method 1: Check for faction info in the page content
            const factionLinks = document.querySelectorAll('a[href*="faction.php?step=profile"]');
            for (const link of factionLinks) {
                const url = link.getAttribute('href');
                const match = url.match(/ID=(\d+)/);
                if (match && match[1]) {
                    return `faction-${match[1]}`;
                }
            }

            // Method 2: Look in any element with faction data
            const factionElements = document.querySelectorAll('[class*="faction"], [data-faction-id]');
            for (const el of factionElements) {
                if (el.dataset.factionId) {
                    return `faction-${el.dataset.factionId}`;
                }
                // Try to extract from href
                const link = el.querySelector('a');
                if (link) {
                    const href = link.getAttribute('href');
                    if (href && href.includes('faction.php')) {
                        const match = href.match(/ID=(\d+)/);
                        if (match && match[1]) {
                            return `faction-${match[1]}`;
                        }
                    }
                }
            }

            return null;
        }

        extractPlayerIdFromPage() {
            // Essayer plusieurs méthodes pour extraire l'ID joueur

            // Méthode 1: Chercher dans les attributs data
            const playerElement = document.querySelector('[data-player-id], [data-userid], [data-user-id]');
            if (playerElement) {
                const id = playerElement.dataset.playerId ||
                          playerElement.dataset.userid ||
                          playerElement.dataset.userId;
                if (id) return id;
            }

            // Méthode 2: Chercher dans l'URL
            const urlMatch = window.location.href.match(/ID=(\d+)/);
            if (urlMatch) {
                return urlMatch[1];
            }

            // Méthode 3: Chercher dans les liens avec profil
            const profileLinks = document.querySelectorAll('a[href*="step=profile"]');
            for (let link of profileLinks) {
                const match = link.href.match(/ID=(\d+)/);
                if (match) {
                    return match[1];
                }
            }

            // Méthode 4: Chercher dans le texte du joueur
            const navUserElements = document.querySelectorAll('[class*="player"], [class*="user"], [class*="username"]');
            for (let elem of navUserElements) {
                const text = elem.textContent;
                const match = text.match(/\[(\d+)\]/);
                if (match) {
                    return match[1];
                }
            }

            return null;
        }

        // Detect if running on TornPDA or Tampermonkey
        isTornPDA() {
            if (typeof GM_info !== 'undefined' && GM_info.scriptHandler && GM_info.scriptHandler.includes('PDA')) {
                return true;
            }
            if (typeof window.flutter_inappwebview !== 'undefined' || typeof window.PDA_httpGet !== 'undefined') {
                return true;
            }
            if (typeof customFetch !== 'undefined') {
                return true;
            }
            return false;
        }

        // Wrapper for requests - uses customFetch for PDA, GM_xmlhttpRequest for Tampermonkey
        gmFetch(url, options = {}) {
            return new Promise((resolve, reject) => {
                // Check for customFetch availability at request time (not just at startup)
                // TornPDA might load it after script initialization
                let actualCustomFetch = null;
                if (typeof customFetch !== 'undefined' && typeof customFetch === 'function') {
                    actualCustomFetch = customFetch;
                } else if (typeof window !== 'undefined' && typeof window.customFetch === 'function') {
                    actualCustomFetch = window.customFetch;
                } else if (typeof globalThis !== 'undefined' && typeof globalThis.customFetch === 'function') {
                    actualCustomFetch = globalThis.customFetch;
                }

                // If customFetch is available, use ONLY that on TornPDA
                if (actualCustomFetch && typeof actualCustomFetch === 'function') {
                    try {
                        actualCustomFetch(url, options)
                            .then(response => {
                                // Normalize PDA response to match fetch API
                                // PDA customFetch returns: { ok: boolean, status?: number, statusText?: string, text?: string, responseText?: string }
                                const status = response?.status ?? (response?.ok ? 200 : 400);
                                const normalizedResponse = {
                                    ok: response?.ok ?? (status >= 200 && status < 300),
                                    status: status,
                                    statusText: response?.statusText ?? 'OK',
                                    text: () => {
                                        const textContent = response?.text ?? response?.responseText ?? '';
                                        return Promise.resolve(textContent);
                                    },
                                    json: () => {
                                        try {
                                            const text = response?.text ?? response?.responseText ?? '{}';
                                            const parsed = typeof text === 'string' ? JSON.parse(text) : text;
                                            return Promise.resolve(parsed);
                                        } catch (e) {
                                            console.error('PDA JSON parse error:', e);
                                            return Promise.reject(e);
                                        }
                                    }
                                };
                                resolve(normalizedResponse);
                            })
                            .catch(error => {
                                console.error('customFetch failed:', error.message);
                                // On TornPDA, don't fall back to GM_xmlhttpRequest - just fail gracefully
                                resolve({
                                    ok: false,
                                    status: 0,
                                    text: () => Promise.resolve(''),
                                    json: () => Promise.resolve({})
                                });
                            });
                    } catch (e) {
                        console.error('customFetch setup error:', e.message);
                        // On TornPDA, don't fall back to GM_xmlhttpRequest
                        resolve({
                            ok: false,
                            status: 0,
                            text: () => Promise.resolve(''),
                            json: () => Promise.resolve({})
                        });
                    }
                    return;
                }

                // On Tampermonkey, use GM_xmlhttpRequest
                this._useGMXmlHttpRequest(url, options, resolve, reject);
            });
        }

        _useGMXmlHttpRequest(url, options, resolve, reject) {
            // This method should only be called if useTornPDAFetch is false
            // Never use GM_xmlhttpRequest if customFetch is available (TornPDA)

            if (typeof GM_xmlhttpRequest === 'undefined') {
                // GM_xmlhttpRequest not available - fallback to standard fetch
                fetch(url, options)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
                return;
            }


            const details = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                timeout: 10000,
                onload: (response) => {
                    try {

                        // Ensure we have a valid status code
                        const status = response?.status ?? 200;
                        const ok = status >= 200 && status < 300;

                        resolve({
                            ok: ok,
                            status: status,
                            statusText: response?.statusText || (ok ? 'OK' : 'Error'),
                            text: () => Promise.resolve(response?.responseText || ''),
                            json: () => {
                                try {
                                    const text = response?.responseText || '{}';
                                    const parsed = JSON.parse(text);
                                    return Promise.resolve(parsed);
                                } catch (e) {
                                    console.error('JSON parse error in GM_xmlhttpRequest:', e, 'text:', response?.responseText);
                                    return Promise.reject(e);
                                }
                            }
                        });
                    } catch (e) {
                        console.error('Error in GM_xmlhttpRequest onload:', e);
                        reject(e);
                    }
                },
                onerror: (error) => {
                    console.error('GM_xmlhttpRequest onerror:', error);
                    reject(new Error(`GM_xmlhttpRequest failed`));
                },
                ontimeout: () => {
                    reject(new Error('GM_xmlhttpRequest timeout'));
                }
            };

            if (options.body) {
                details.data = options.body;
            }

            try {
                GM_xmlhttpRequest(details);
            } catch (e) {
                reject(new Error(`GM_xmlhttpRequest setup failed: ${e.message}`));
            }
        }

        async callMember(memberName, memberId = null, callButton = null) {
            try {
                // Extract target's status from the page
                let targetStatus = null;


                // If button is provided, use it to find the status element
                if (callButton) {
                    const memberRow = callButton.closest('li');

                    if (memberRow) {
                        // Look for the status div - find divs with both "status" and "left" classes
                        const statusDivs = memberRow.querySelectorAll('[class*="status"]');
                        let statusElement = null;

                        for (let div of statusDivs) {
                            // Find the one with class "status left" (the player state, not online/offline)
                            if (div.className.includes('status') && div.className.includes('left') &&
                                !div.className.includes('StatusWrap')) {
                                statusElement = div;
                                break;
                            }
                        }

                        if (statusElement) {
                            targetStatus = statusElement.textContent.trim();
                        } else {
                        }
                    } else {
                    }
                } else {
                }

                const requestBody = {
                    factionId: this.factionId,
                    memberName: memberName,
                    memberId: memberId || undefined,
                    callerName: this.playerName,
                    targetStatus: targetStatus
                };


                const response = await this.gmFetch(`${this.serverUrl}/api/call`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.authToken}`
                    },
                    body: JSON.stringify(requestBody)
                });


                const data = await response.json();

                // Check for application-level error (e.g., already_called)
                if (!response.ok || data.error) {
                    if (data.error === 'already_called' && data.targetName) {
                        // Show notification pop-up for already called target
                        this.showNotification(`You already called ${data.targetName.replace(/^\d*\.?\d+[kmbt]/i, '')}`, 'warning');
                        return { success: false, error: data.error, message: data.message };
                    }
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }

                return data;
            } catch (error) {
                console.error('Erreur lors du call:', error);
                return null;
            }
        }

        async getCalls() {
            // Prevent simultaneous requests - return empty if already fetching
            if (this.isCallsFetching) {
                return [];
            }

            try {
                this.isCallsFetching = true;

                // Use /api/calls endpoint without factionId to get all active calls
                // This is more robust than /api/calls/:factionId because factionId detection can be unstable
                const response = await this.gmFetch(`${this.serverUrl}/api/calls`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`
                    }
                });


                // Defensive check - response might not have expected structure
                if (!response) {
                    throw new Error('Response is null or undefined');
                }

                if (response.ok === false || (response.status && response.status >= 400)) {
                    console.error('[getCalls] HTTP error detected - status:', response.status, 'ok:', response.ok);
                    throw new Error(`HTTP error! status: ${response.status ?? 'unknown'}`);
                }

                // Get raw text first to debug what we're receiving
                const text = await response.text();

                // Log detailed info about the response

                // Check if response looks like valid JSON
                if (!text || !text.trim().startsWith('{')) {
                    console.warn('[getCalls] Invalid response (not JSON) - status:', response.status, 'text:', text.substring(0, 100));
                    // Use cache on invalid response to prevent flicker
                    if (this.lastValidCalls && this.lastValidCalls.length > 0) {
                        return this.lastValidCalls;
                    }
                    return [];
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseErr) {
                    console.error('Failed to parse JSON from getCalls. Raw text:', text.substring(0, 500));
                    // Use cache on parse error to prevent flicker
                    if (this.lastValidCalls && this.lastValidCalls.length > 0) {
                        return this.lastValidCalls;
                    }
                    return [];
                }

                const calls = data.data || [];

                // Toujours mettre à jour le cache avec les données fraîches du serveur
                this.lastValidCalls = calls;

                return calls;
            } catch (error) {
                console.error('Erreur lors de la récupération des calls:', error);
                // On error, return cache instead of empty array to prevent button flicker
                if (this.lastValidCalls && this.lastValidCalls.length > 0) {
                    return this.lastValidCalls;
                }
                // No cache available
                return [];
            } finally {
                this.isCallsFetching = false;
            }
        }

        showNotification(message, type = 'info') {
            // Create toast notification container if it doesn't exist
            let container = document.getElementById('faction-war-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'faction-war-toast-container';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }

            // Create toast element
            const toast = document.createElement('div');
            toast.style.cssText = `
                background: #FF794C;
                color: #4a5568;
                border-radius: 8px;
                padding: 16px 24px;
                margin-bottom: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 300px;
                pointer-events: auto;
                animation: slideInRight 0.3s ease-out;
            `;

            // Set emoji based on type (border color remains constant)
            let emoji = 'ℹ️';
            if (type === 'warning') {
                emoji = '⚠️';
            } else if (type === 'error') {
                emoji = '❌';
            } else if (type === 'success') {
                emoji = '✅';
            }

            toast.style.borderLeft = `4px solid #E55100`; // Darker orange for border
            toast.innerHTML = `<span style="font-size: 18px;">${emoji}</span><span>${message}</span>`;

            container.appendChild(toast);

            // Auto remove toast after 4 seconds
            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 4000);
        }

        async cancelCall(callId) {
            try {
                const response = await this.gmFetch(`${this.serverUrl}/api/call/${callId}/cancel`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Vider le cache pour que le polling récupère les données fraîches
                if (result && result.success) {
                    this.lastValidCalls = [];
                }

                return result;
            } catch (error) {
                console.error('Erreur lors de l\'annulation du call:', error);
                return null;
            }
        }

        async updateTargetStatus(callId, targetStatus) {
            try {
                const response = await this.gmFetch(`${this.serverUrl}/api/call/${callId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.authToken}`
                    },
                    body: JSON.stringify({ targetStatus })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Erreur lors de la mise à jour du status:', error);
                return null;
            }
        }
    }

    // Main App Class
    class FactionWarEnhancer {
        constructor() {
            this.cssManager = null;
            this.enhancementManager = null;
            this.performanceManager = new PerformanceManager();
            this.apiManager = new APIManager();
            this.refreshInterval = null;
            this.isUpdatingButtons = false; // Prevent simultaneous button updates
            this.lastStatusUpdate = {}; // Track last status update time for each call ID
            this.hospTime = {}; // Store hospitalization end times by user ID
            this.hospNodes = []; // Store [id, nodeElement] pairs for hospitalization timers
            this.hospLoopCounter = 0; // Counter for optimization of timer updates
            this.init();
        }

        // Format number to KMBT format (6.5B, 3.2M, 500K, etc)
        formatNumber(num) {
            if (!num || isNaN(num)) return '0';

            const number = parseFloat(num);
            if (number === 0) return '0';

            const absNum = Math.abs(number);

            if (absNum >= 1e9) {
                return (number / 1e9).toFixed(1) + 'B';
            } else if (absNum >= 1e6) {
                return (number / 1e6).toFixed(1) + 'M';
            } else if (absNum >= 1e3) {
                return (number / 1e3).toFixed(1) + 'K';
            } else {
                return number.toFixed(0);
            }
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        }

        async start() {

            this.cssManager = new CSSManager();

            // Hide call buttons immediately if API key is not configured
            // This must be done before EnhancementManager creates buttons
            if (!this.apiManager.torn_apikey) {
                this.disableAllCallButtons();
            }

            this.enhancementManager = new EnhancementManager();
            this.enhancementManager.apiManager = this.apiManager;

            // Add global event listeners
            this.setupEventListeners();

            // Try to enhance periodically for dynamic content
            this.startPeriodicEnhancement();

            // Detect faction FIRST before making any API calls to the server
            await this.apiManager.detectFactionAutomatically();

            // Start the refresh loop for calls
            this.startCallRefresh();

            // Start background BSP scraping (sends BSP data to server independently)
            this.startBackgroundBspScraping();

        }

        startPeriodicEnhancement() {
            // Disable periodic enhancement to prevent infinite loops
            // Only enhance on initial load and when explicitly triggered
        }

        // Register a hospital status node for timer updates
        registerHospNode(id, node) {
            if (!node || !id) return;
            if (this.hospNodes.find((h) => h[0] == id)) return;
            this.hospNodes.push([id, node]);
        }

        // Scan the page for hospitalized members and register their status nodes
        scanHospitalizedMembers() {
            const statusNodes = document.querySelectorAll('[class*="status___"], .status.left');
            let foundCount = 0;
            statusNodes.forEach(statusNode => {
                const text = statusNode.textContent.trim();
                if (text === 'Hospital') {
                    foundCount++;
                    const memberRow = statusNode.closest('li') || statusNode.closest('tr');
                    if (memberRow) {
                        // Try to get the member ID from the attack link
                        const attackLink = memberRow.querySelector('a[href*="user2ID"]');
                        if (attackLink) {
                            const match = attackLink.href.match(/user2ID=(\d+)/);
                            if (match) {
                                const memberId = match[1];
                                this.registerHospNode(memberId, statusNode);
                            }
                        }
                    }
                }
            });
            if (foundCount > 0) {
            }
        }

        // Update hospitalization timers (called every second)
        updateHospTimers() {
            if (this.hospNodes.length === 0) return;

            for (let i = 0; i < this.hospNodes.length; i++) {
                const [id, node] = this.hospNodes[i];
                if (!node) {
                    console.warn(`⚠️ Node missing for hospital member ${id}`);
                    continue;
                }
                if (!this.hospTime[id]) {
                    continue;
                }

                // Handle both milliseconds and seconds timestamps
                let endTime = this.hospTime[id];
                // If it's a large number (13+ digits), it's probably milliseconds
                if (endTime > 9999999999) {
                    endTime = endTime; // already in ms
                } else {
                    endTime = endTime * 1000; // convert seconds to ms
                }

                let totalSeconds = (endTime - new Date().getTime()) / 1000;

                if (!totalSeconds || totalSeconds <= 0) {
                    node.textContent = '00:00:00'; // They left hospital
                    continue;
                }

                let hours = Math.floor(totalSeconds / 3600);
                let remaining = totalSeconds % 3600;
                let minutes = Math.floor(remaining / 60);
                let seconds = Math.floor(remaining % 60);

                const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                node.textContent = timeStr;

                if (this.hospLoopCounter % 60 === 0) {
                }
            }
            if (this.hospNodes.length > 0) this.hospLoopCounter++;
        }

        startCallRefresh() {
            // Check if API key is configured
            if (!this.apiManager.torn_apikey) {
                console.warn('⚠️ API key not configured - call refresh disabled');
                this.disableAllCallButtons();
                return;
            }

            // Refresh every second to check for new calls and update target status
            this.refreshInterval = setInterval(async () => {
                await this.updateCallButtonsFromServer();
                await this.updateTargetStatusesFromPage();
                this.scanHospitalizedMembers();
                this.updateHospTimers();
            }, 1000);
        }

        async performBspScraping(forceUpdate = false) {
            // Scrape BSP data from the DOM and send to server
            try {

                // Get user's own faction ID from localStorage (stored when fetching wars in detectFactionAutomatically)
                const userFactionIdRaw = StorageUtil.get('cat_user_faction_id', null);

                // Get enemy faction ID from cache
                const enemyFactionIdRaw = StorageUtil.get('cat_enemy_faction_id')?.id;


                if (!userFactionIdRaw || !enemyFactionIdRaw) {
                    console.warn('⚠️ [BSP] Missing faction IDs - aborting BSP scraping');
                    return;
                }

                // Strip "faction-" prefix if present and convert to number
                const userFactionId = typeof userFactionIdRaw === 'string' && userFactionIdRaw.startsWith('faction-')
                    ? parseInt(userFactionIdRaw.replace('faction-', ''))
                    : parseInt(userFactionIdRaw);

                const enemyFactionId = typeof enemyFactionIdRaw === 'string' && enemyFactionIdRaw.startsWith('faction-')
                    ? parseInt(enemyFactionIdRaw.replace('faction-', ''))
                    : parseInt(enemyFactionIdRaw);


                // Detect if this is a NEW war by checking if enemy faction changed
                const lastEnemyFaction = StorageUtil.get('cat_last_enemy_faction_id', null);
                const isNewWar = lastEnemyFaction !== enemyFactionIdRaw;


                if (isNewWar) {
                    forceUpdate = true;
                    // Store the new enemy faction ID
                    StorageUtil.set('cat_last_enemy_faction_id', enemyFactionIdRaw);
                }

                // Scrape BSP data from DOM
                const enemyUsers = this.scrapeBspFromDOM('enemy');

                const userUsers = this.scrapeBspFromDOM('user');

                if (enemyUsers.length === 0 && userUsers.length === 0) {
                    console.warn('⚠️ [BSP] No BSP data found for either faction - aborting');
                    return;
                }

                // Send to server with force flag if new war
                await this.sendBspToServer(enemyUsers, userUsers, enemyFactionId, userFactionId, forceUpdate);
            } catch (error) {
                console.error('❌ [BSP] Error in performBspScraping:', error);
            }
        }

        startBackgroundBspScraping() {
            // Scrape and send BSP data in the background
            // NOTE: BSP data only visible when on Faction tab - will be empty otherwise
            // Server will only update if user hasn't been updated in 6+ hours

            const performBspScraping = async () => {
                try {
                    await this.performBspScraping();
                } catch (error) {
                    console.error('❌ [BSP] Error in background BSP scraping:', error);
                }
            };

            // Run immediately on startup (with delay to let Faction tab potentially load)
            setTimeout(() => {
                performBspScraping();
            }, 5000);

            // Then run every hour (3600000 ms) - server will handle 6h+ rate limiting
            setInterval(performBspScraping, 3600000);
        }

        scrapeBspFromDOM(factionType) {
            try {
                const users = [];

                // Sélectionner le conteneur de faction approprié
                let factionContainer;
                if (factionType === 'enemy') {
                    factionContainer = document.querySelector('.enemy-faction.left');
                } else {
                    factionContainer = document.querySelector('.your-faction');
                }


                if (!factionContainer) {
                    console.warn(`❌ [BSP-DOM] Faction container not found for ${factionType}`);
                    return users;
                }

                // Récupérer tous les éléments de membre
                // Enemy faction uses li.enemy, our faction uses li.your
                let selector;
                if (factionType === 'enemy') {
                    selector = 'li.enemy';
                } else {
                    selector = 'li.your';
                }

                const memberElements = factionContainer.querySelectorAll(selector);

                memberElements.forEach((memberEl, idx) => {
                    try {
                        // Extraire l'user ID depuis le lien du profil
                        const profileLink = memberEl.querySelector('a[href*="/profiles.php?XID="]');
                        if (!profileLink) {
                            console.warn(`⚠️ [BSP-DOM] No profile link found for member ${idx}`);
                            return;
                        }

                        const xidMatch = profileLink.href.match(/XID=(\d+)/);
                        const userId = xidMatch ? xidMatch[1] : null;

                        if (!userId) {
                            console.warn(`⚠️ [BSP-DOM] No user ID found for member ${idx}`);
                            return;
                        }

                        // Extraire le username
                        const usernameEl = memberEl.querySelector('.honor-text');
                        const username = usernameEl ? usernameEl.textContent.trim() : `User${userId}`;

                        // Extraire le BSP
                        const bspEl = memberEl.querySelector('.bsp-value');
                        const bsp = bspEl ? bspEl.textContent.trim() : 'N/A';


                        if (bsp !== 'N/A') {
                            users.push({
                                user_id: userId,
                                username: username,
                                bsp: bsp
                            });
                        } else {
                            console.warn(`⚠️ [BSP-DOM] Skipped user ${userId} - BSP is N/A`);
                        }
                    } catch (e) {
                        console.warn(`❌ [BSP-DOM] Error parsing member element ${idx}:`, e);
                    }
                });

                return users;
            } catch (error) {
                console.error('❌ [BSP-DOM] Error scraping BSP:', error);
                return [];
            }
        }

        async sendBspToServer(enemyUsers, userUsers, enemyFactionId, userFactionId, force = false) {
            try {

                if (enemyUsers.length === 0 && userUsers.length === 0) {
                    console.warn('⚠️ [BSP-SEND] No users to send - aborting');
                    return null;
                }

                // Envoyer les données de faction ennemie
                if (enemyUsers.length > 0) {
                    const response = await this.apiManager.gmFetch(`${this.apiManager.serverUrl}/api/users/bsp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiManager.authToken}`
                        },
                        body: JSON.stringify({
                            users: enemyUsers,
                            faction_id: enemyFactionId,
                            force: force
                        })
                    });
                    const data = await response.json();
                }

                // Envoyer les données de sa faction
                if (userUsers.length > 0) {
                    const response = await this.apiManager.gmFetch(`${this.apiManager.serverUrl}/api/users/bsp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiManager.authToken}`
                        },
                        body: JSON.stringify({
                            users: userUsers,
                            faction_id: userFactionId,
                            force: force
                        })
                    });
                    const data = await response.json();
                }

                return true;
            } catch (error) {
                console.error('❌ [BSP-SEND] Error sending BSP to server:', error);
                return null;
            }
        }

        async getPredictions(enemyFactionId, userFactionId, enemyWins = 0, enemyLosses = 0, userWins = 0, userLosses = 0) {
            try {
                const params = new URLSearchParams({
                    enemyWins: enemyWins || 0,
                    enemyLosses: enemyLosses || 0,
                    userWins: userWins || 0,
                    userLosses: userLosses || 0
                });
                const url = `${this.apiManager.serverUrl}/api/predictions/${enemyFactionId}/${userFactionId}?${params.toString()}`;

                const response = await this.apiManager.gmFetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.apiManager.authToken}`
                    }
                });


                if (!response.ok) {
                    console.warn('❌ Failed to fetch predictions:', response.status);
                    return null;
                }

                const data = await response.json();
                return data.success ? data : null;
            } catch (error) {
                console.error('❌ Error getting predictions:', error);
                return null;
            }
        }

        renderFactionStats(factionInfo, container, loader) {
            try {
                // Hide loader, show container
                loader.style.display = 'none';
                container.style.display = 'block';

                const data = (factionInfo && factionInfo.basic) || {};
                const name = data.name || 'Unknown';
                const leader = data.leader_id || 'Unknown';
                const coLeader = data.co_leader_id || 'Unknown';
                const memberCount = data.members || 0;
                const founded = data.days_old ? `${data.days_old} days` : 'Unknown';
                const wins = (data.rank && data.rank.wins) || 0;
                const losses = 0; // losses not available in basic selection
                const bestWin = data.best_chain || 0;

                container.innerHTML = `
                    <div style="padding: 0;">
                        <!-- Faction Name -->
                        <div style="margin-bottom: 15px; padding: 12px; background: rgba(102, 126, 234, 0.15); border-left: 3px solid #667eea; border-radius: 4px;">
                            <p style="margin: 0 0 3px 0; font-size: 12px; color: #a0aec0; font-weight: 500;">FACTION NAME</p>
                            <p style="margin: 0; font-size: 15px; color: #cbd5e0; font-weight: 600;">${name}</p>
                        </div>

                        <!-- Leadership -->
                        <div style="margin-bottom: 15px; padding: 12px; background: rgba(255, 121, 76, 0.1); border-left: 3px solid #FF794C; border-radius: 4px;">
                            <p style="margin: 0 0 8px 0; font-size: 11px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">👥 Leadership</p>
                            <div style="margin-bottom: 6px;">
                                <p style="margin: 0 0 2px 0; font-size: 11px; color: #90caf9;">Leader</p>
                                <p style="margin: 0; font-size: 12px; color: #cbd5e0;">${leader}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 2px 0; font-size: 11px; color: #90caf9;">Co-Leader</p>
                                <p style="margin: 0; font-size: 12px; color: #cbd5e0;">${coLeader}</p>
                            </div>
                        </div>

                        <!-- Faction Stats -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                            <div style="padding: 10px; background: rgba(76, 205, 196, 0.1); border-left: 2px solid #4ecdc4; border-radius: 3px;">
                                <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">MEMBERS</p>
                                <p style="margin: 0; font-size: 16px; color: #4ecdc4; font-weight: 700;">${memberCount}</p>
                            </div>
                            <div style="padding: 10px; background: rgba(255, 193, 7, 0.1); border-left: 2px solid #ffc107; border-radius: 3px;">
                                <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">FOUNDED</p>
                                <p style="margin: 0; font-size: 12px; color: #ffc107; font-weight: 600;">${founded}</p>
                            </div>
                        </div>

                        <!-- War Stats -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                            <div style="padding: 10px; background: rgba(76, 175, 80, 0.1); border-left: 2px solid #4caf50; border-radius: 3px;">
                                <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">WINS</p>
                                <p style="margin: 0; font-size: 16px; color: #4caf50; font-weight: 700;">${wins}</p>
                            </div>
                            <div style="padding: 10px; background: rgba(244, 67, 54, 0.1); border-left: 2px solid #f44336; border-radius: 3px;">
                                <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">LOSSES</p>
                                <p style="margin: 0; font-size: 16px; color: #f44336; font-weight: 700;">${losses}</p>
                            </div>
                            <div style="padding: 10px; background: rgba(156, 39, 176, 0.1); border-left: 2px solid #9c27b0; border-radius: 3px;">
                                <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">BEST WIN</p>
                                <p style="margin: 0; font-size: 16px; color: #9c27b0; font-weight: 700;">${bestWin}</p>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error rendering faction stats:', error);
                loader.innerHTML = '<p style="color: #ef5350;">Error rendering faction stats</p>';
            }
        }

        async renderDualFactionStats(enemyFactionInfo, userFactionInfo, container, loader) {
            try {

                // Hide loader, show container
                loader.style.display = 'none';
                container.style.display = 'block';

                const getStatsFromData = (factionInfo) => {
                    const data = (factionInfo && factionInfo.basic) || {};
                    return {
                        name: data.name || 'Unknown',
                        leader_id: data.leader_id || null,
                        coLeader_id: data.co_leader_id || null,
                        memberCount: data.members || 0,
                        founded: data.days_old ? `${data.days_old} days` : 'Unknown',
                        wins: (data.rank && data.rank.wins) || 0,
                        bestWin: data.best_chain || 0
                    };
                };

                const getLeaderHtml = async (leaderId) => {
                    if (!leaderId) return '<span style="color: #cbd5e0;">Unknown</span>';

                    try {
                        const userInfo = await this.apiManager.getUserInfo(leaderId);
                        let username = null;

                        // Try multiple paths to find the username
                        if (userInfo) {
                            username = userInfo.profile?.name ||
                                      userInfo.profile?.username ||
                                      userInfo.username ||
                                      userInfo.name ||
                                      null;
                        }

                        if (username) {
                            return `<a href="https://www.torn.com/profiles.php?XID=${leaderId}" target="_blank" style="color: #74BEF9; text-decoration: none; cursor: pointer;">${username}</a>`;
                        }
                    } catch (e) {
                        console.warn('Error fetching user info for', leaderId, e);
                    }

                    return `<a href="https://www.torn.com/profiles.php?XID=${leaderId}" target="_blank" style="color: #74BEF9; text-decoration: none; cursor: pointer;">[ID: ${leaderId}]</a>`;
                };

                const enemy = getStatsFromData(enemyFactionInfo);
                const user = getStatsFromData(userFactionInfo);

                // Fetch leader info concurrently
                const enemyLeaderHtml = await getLeaderHtml(enemy.leader_id);
                const enemyCoLeaderHtml = await getLeaderHtml(enemy.coLeader_id);
                const userLeaderHtml = await getLeaderHtml(user.leader_id);
                const userCoLeaderHtml = await getLeaderHtml(user.coLeader_id);

                container.innerHTML = `
                    <div style="width: 100%; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <!-- Enemy Faction -->
                        <div style="padding: 0; box-sizing: border-box;">
                            <h3 style="margin: 0 0 15px 0; color: #FF794C; font-size: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">${enemy.name}</h3>

                            <div style="margin-bottom: 15px; padding: 12px; background: rgba(255, 121, 76, 0.15); border-left: 3px solid #FF794C; border-radius: 4px;">
                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #a0aec0; font-weight: 500;">FACTION NAME</p>
                                <p style="margin: 0; font-size: 15px; color: #cbd5e0; font-weight: 600;">${enemy.name}</p>
                            </div>

                            <div style="margin-bottom: 15px; padding: 12px; background: rgba(255, 121, 76, 0.08); border-left: 3px solid #FF794C; border-radius: 4px;">
                                <p style="margin: 0 0 8px 0; font-size: 11px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">👥 Leadership</p>
                                <div style="margin-bottom: 6px;">
                                    <p style="margin: 0; font-size: 12px;"><span style="color: #a0aec0;">Leader:</span> ${enemyLeaderHtml}</p>
                                </div>
                                <div>
                                    <p style="margin: 0; font-size: 12px;"><span style="color: #a0aec0;">Co-Leader:</span> ${enemyCoLeaderHtml}</p>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                <div style="padding: 10px; background: rgba(76, 205, 196, 0.1); border-left: 2px solid #4ecdc4; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">MEMBERS</p>
                                    <p style="margin: 0; font-size: 16px; color: #4ecdc4; font-weight: 700;">${enemy.memberCount}</p>
                                </div>
                                <div style="padding: 10px; background: rgba(255, 193, 7, 0.1); border-left: 2px solid #ffc107; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">FOUNDED</p>
                                    <p style="margin: 0; font-size: 12px; color: #ffc107; font-weight: 600;">${enemy.founded}</p>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="padding: 10px; background: rgba(76, 175, 80, 0.1); border-left: 2px solid #4caf50; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">WINS</p>
                                    <p style="margin: 0; font-size: 16px; color: #4caf50; font-weight: 700;">${enemy.wins}</p>
                                </div>
                                <div style="padding: 10px; background: rgba(156, 39, 176, 0.1); border-left: 2px solid #9c27b0; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">BEST CHAIN</p>
                                    <p style="margin: 0; font-size: 16px; color: #9c27b0; font-weight: 700;">${enemy.bestWin}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Your Faction -->
                        <div style="padding: 0; box-sizing: border-box;">
                            <h3 style="margin: 0 0 15px 0; color: #86B202; font-size: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">${user.name}</h3>

                            <div style="margin-bottom: 15px; padding: 12px; background: rgba(134, 178, 2, 0.15); border-left: 3px solid #86B202; border-radius: 4px;">
                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #a0aec0; font-weight: 500;">FACTION NAME</p>
                                <p style="margin: 0; font-size: 15px; color: #cbd5e0; font-weight: 600;">${user.name}</p>
                            </div>

                            <div style="margin-bottom: 15px; padding: 12px; background: rgba(134, 178, 2, 0.08); border-left: 3px solid #86B202; border-radius: 4px;">
                                <p style="margin: 0 0 8px 0; font-size: 11px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">👥 Leadership</p>
                                <div style="margin-bottom: 6px;">
                                    <p style="margin: 0; font-size: 12px;"><span style="color: #a0aec0;">Leader:</span> ${userLeaderHtml}</p>
                                </div>
                                <div>
                                    <p style="margin: 0; font-size: 12px;"><span style="color: #a0aec0;">Co-Leader:</span> ${userCoLeaderHtml}</p>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                <div style="padding: 10px; background: rgba(76, 205, 196, 0.1); border-left: 2px solid #4ecdc4; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">MEMBERS</p>
                                    <p style="margin: 0; font-size: 16px; color: #4ecdc4; font-weight: 700;">${user.memberCount}</p>
                                </div>
                                <div style="padding: 10px; background: rgba(255, 193, 7, 0.1); border-left: 2px solid #ffc107; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">FOUNDED</p>
                                    <p style="margin: 0; font-size: 12px; color: #ffc107; font-weight: 600;">${user.founded}</p>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="padding: 10px; background: rgba(76, 175, 80, 0.1); border-left: 2px solid #4caf50; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">WINS</p>
                                    <p style="margin: 0; font-size: 16px; color: #4caf50; font-weight: 700;">${user.wins}</p>
                                </div>
                                <div style="padding: 10px; background: rgba(156, 39, 176, 0.1); border-left: 2px solid #9c27b0; border-radius: 3px;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; color: #a0aec0; font-weight: 600;">BEST CHAIN</p>
                                    <p style="margin: 0; font-size: 16px; color: #9c27b0; font-weight: 700;">${user.bestWin}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Extract faction IDs from the faction info
                const enemyFactionId = enemyFactionInfo?.basic?.id || enemyFactionInfo?.id;
                const userFactionId = userFactionInfo?.basic?.id || userFactionInfo?.id;


                // Fetch predictions asynchronously (BSP scraping is done in background)
                if (enemyFactionId && userFactionId) {
                    (async () => {
                        try {

                            // Get predictions (BSP data already sent in background)
                            const predictions = await this.getPredictions(enemyFactionId, userFactionId, enemy.wins, 0, user.wins, 0);


                            // If we got predictions, render them
                            if (predictions && predictions.success) {
                                const enemyWinChance = predictions.enemy.winChance;
                                const userWinChance = predictions.user.winChance;
                                const prediction = predictions.prediction;

                                // Format Avg BSP numbers for display
                                const enemyAvgBspFormatted = this.formatNumber(predictions.enemy.avgBsp);
                                const userAvgBspFormatted = this.formatNumber(predictions.user.avgBsp);


                                // Create prediction HTML
                                const predictionHtml = `
                                    <div style="width: 100%; box-sizing: border-box; padding-top: 20px; border-top: 2px solid #3a4556; grid-column: 1 / -1;">
                                        <h3 style="margin: 0 0 15px 0; color: #90caf9; font-size: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">⚔️ WAR PREDICTION</h3>

                                        <div style="width: 100%; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                            <!-- Enemy Stats -->
                                            <div style="padding: 0; box-sizing: border-box;">
                                                <div style="padding: 15px; background: rgba(255, 121, 76, 0.15); border: 2px solid #FF794C; border-radius: 4px;">
                                                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">Enemy Faction</p>
                                                    <p style="margin: 0 0 10px 0; font-size: 36px; color: #FF794C; font-weight: 700; text-align: center;">${enemyWinChance}%</p>
                                                    <div style="background: #2a3f5f; border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 10px;">
                                                        <div style="height: 100%; width: ${enemyWinChance}%; background: linear-gradient(90deg, #FF794C, #FF9E7B); transition: width 0.3s;"></div>
                                                    </div>

                                                    <div style="font-size: 11px; color: #cbd5e0; line-height: 1.6;">
                                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                                                            <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px; text-align: center;">
                                                                <p style="margin: 0 0 2px 0; color: #90caf9; font-weight: 600;">Score</p>
                                                                <p style="margin: 0 0 4px 0; font-size: 22px; color: #FF794C; font-weight: 700;">${predictions.enemy.score}</p>
                                                            </div>
                                                            <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; text-align: center;">
                                                                <p style="margin: 0 0 2px 0; color: #90caf9; font-weight: 600;">Members</p>
                                                                <p style="margin: 0; font-size: 18px; color: #FF794C;">${predictions.enemy.members}</p>
                                                            </div>
                                                        </div>

                                                        <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; margin-bottom: 6px;">
                                                            <p style="margin: 0 0 8px 0; color: #a0aec0;">📊 BSP Stats</p>
                                                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; text-align: center;">
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Avg</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #FF794C; font-weight: 600;">${enemyAvgBspFormatted}</p>
                                                                </div>
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Best</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #86B202; font-weight: 600;">${this.formatNumber(predictions.enemy.maxBsp)}</p>
                                                                </div>
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Min</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #7c8a9a;">${this.formatNumber(predictions.enemy.minBsp)}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 10px; color: #7c8a9a;">
                                                            <p style="margin: 0; padding: 0;">Data samples: ${predictions.enemy.bspDataCount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Your Stats -->
                                            <div style="padding: 0; box-sizing: border-box;">
                                                <div style="padding: 15px; background: rgba(134, 178, 2, 0.15); border: 2px solid #86B202; border-radius: 4px;">
                                                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">Your Faction</p>
                                                    <p style="margin: 0 0 10px 0; font-size: 36px; color: #86B202; font-weight: 700; text-align: center;">${userWinChance}%</p>
                                                    <div style="background: #2a3f5f; border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 10px;">
                                                        <div style="height: 100%; width: ${userWinChance}%; background: linear-gradient(90deg, #86B202, #a8c81d); transition: width 0.3s;"></div>
                                                    </div>

                                                    <div style="font-size: 11px; color: #cbd5e0; line-height: 1.6;">
                                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                                                            <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px; text-align: center;">
                                                                <p style="margin: 0 0 2px 0; color: #90caf9; font-weight: 600;">Score</p>
                                                                <p style="margin: 0 0 4px 0; font-size: 22px; color: #86B202; font-weight: 700;">${predictions.user.score}</p>
                                                            </div>
                                                            <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; text-align: center;">
                                                                <p style="margin: 0 0 2px 0; color: #90caf9; font-weight: 600;">Members</p>
                                                                <p style="margin: 0; font-size: 18px; color: #86B202;">${predictions.user.members}</p>
                                                            </div>
                                                        </div>

                                                        <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; margin-bottom: 6px;">
                                                            <p style="margin: 0 0 8px 0; color: #a0aec0;">📊 BSP Stats</p>
                                                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; text-align: center;">
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Avg</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #86B202; font-weight: 600;">${userAvgBspFormatted}</p>
                                                                </div>
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Best</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #86B202; font-weight: 600;">${this.formatNumber(predictions.user.maxBsp)}</p>
                                                                </div>
                                                                <div>
                                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #cbd5e0;">Min</p>
                                                                    <p style="margin: 0; font-size: 16px; color: #7c8a9a;">${this.formatNumber(predictions.user.minBsp)}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style="background: rgba(0,0,0,0.2); padding: 6px; border-radius: 3px; font-size: 10px; color: #7c8a9a;">
                                                            <p style="margin: 0; padding: 0;">Data samples: ${predictions.user.bspDataCount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Overall Prediction -->
                                        <div style="width: 100%; box-sizing: border-box; margin-top: 15px; padding: 15px; background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196f3; border-radius: 4px;">
                                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #a0aec0; font-weight: 600; text-transform: uppercase;">Overall Verdict</p>
                                            <p style="margin: 0 0 12px 0; font-size: 20px; color: #90caf9; font-weight: 600; text-align: center;">${prediction}</p>

                                        </div>
                                    </div>
                                `;

                                // Append predictions to container
                                const styledContainer = container.querySelector('div');
                                styledContainer.innerHTML += predictionHtml;
                            }
                        } catch (error) {
                            console.warn('Error fetching predictions:', error);
                            // Silently fail - predictions are optional
                        }
                    }).call(this);
                }
            } catch (error) {
                console.error('Error rendering dual faction stats:', error);
                loader.innerHTML = '<p style="color: #ef5350;">Error rendering faction stats</p>';
            }
        }

        disableAllCallButtons() {
            // Hide all call buttons since no API key is configured
            document.body.classList.add('hide-call-buttons');

            // Also directly hide existing buttons with inline style
            const callButtons = document.querySelectorAll('.call-button');
            callButtons.forEach(button => {
                button.style.setProperty('display', 'none', 'important');
            });

            // Watch for new buttons being added and hide them too
            if (!this.callButtonObserver) {
                this.callButtonObserver = new MutationObserver(() => {
                    const newButtons = document.querySelectorAll('.call-button');
                    newButtons.forEach(button => {
                        if (button.style.display !== 'none') {
                            button.style.setProperty('display', 'none', 'important');
                        }
                    });
                });
                this.callButtonObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        enableAllCallButtons() {
            // Show all call buttons after API key has been configured
            document.body.classList.remove('hide-call-buttons');

            // Also directly show existing buttons by removing inline style
            const callButtons = document.querySelectorAll('.call-button');
            callButtons.forEach(button => {
                button.style.removeProperty('display');
            });

            // Stop watching for new buttons
            if (this.callButtonObserver) {
                this.callButtonObserver.disconnect();
                this.callButtonObserver = null;
            }
        }

        async updateCallButtonsFromServer() {
            // Prevent simultaneous updates to button states
            if (this.isUpdatingButtons) {
                return;
            }

            try {
                this.isUpdatingButtons = true;
                let calls = await this.apiManager.getCalls();

                // If we got an empty response (invalid response from server), use the cache instead
                // Only update buttons if we got valid data (non-empty array)
                if (!calls || calls.length === 0) {
                    // Use last valid calls if available to prevent button flicker
                    if (this.apiManager.lastValidCalls && this.apiManager.lastValidCalls.length > 0) {
                        calls = this.apiManager.lastValidCalls;
                    } else {
                        // No cache available - truly empty calls list
                        calls = [];
                    }
                } else {
                    // Filter calls to only show those for the current faction we're at war with
                    const currentFactionId = this.apiManager.factionId;

                    calls = calls.filter(call => call.faction_id === currentFactionId);
                }

                // Create a map by member_id AND member_name for backward compatibility
                const callMapById = {};
                const callMapByName = {};

                calls.forEach(call => {
                    if (call.member_id) {
                        callMapById[call.member_id] = {
                            callerName: call.caller_name,
                            callId: call.id,
                            memberId: call.member_id,
                            memberName: call.member_name
                        };
                    }
                    // Fallback: also map by name
                    callMapByName[call.member_name] = {
                        callerName: call.caller_name,
                        callId: call.id,
                        memberId: call.member_id,
                        memberName: call.member_name
                    };
                });

                // Update all call buttons on the page
                const callButtons = document.querySelectorAll('.call-button');
                callButtons.forEach(button => {
                    // Get the member info from the button's context
                    const memberRow = button.closest('li') || button.closest('tr');
                    if (memberRow) {
                        const memberNameElement = memberRow.querySelector('[class*="member___"], .member');
                        if (memberNameElement) {
                            const memberName = memberNameElement.textContent.trim();

                            // Try to extract member ID from attack link (more reliable)
                            let memberId = null;
                            const attackLink = memberRow.querySelector('a[href*="getInAttack"], a[href*="user2ID"]');
                            if (attackLink) {
                                const match = attackLink.href.match(/user2ID=(\d+)/);
                                if (match) {
                                    memberId = match[1];
                                }
                            }

                            // Prefer matching by member_id, fallback to member_name
                            let callData = null;
                            if (memberId && callMapById[memberId]) {
                                callData = callMapById[memberId];
                            } else if (callMapByName[memberName]) {
                                callData = callMapByName[memberName];
                            }

                            // Create new state object
                            let newState = null;
                            if (callData) {
                                // Simple: if the caller_name from server matches our name, it's our call
                                // Use case-insensitive comparison and trim whitespace for robustness
                                const isMyCall = callData.callerName && this.apiManager.playerName &&
                                    callData.callerName.trim().toLowerCase() === this.apiManager.playerName.trim().toLowerCase();

                                newState = {
                                    text: callData.callerName,
                                    callId: callData.callId,
                                    memberId: callData.memberId || '',
                                    isMyCall: isMyCall
                                };
                            } else {
                                newState = {
                                    text: 'Call',
                                    callId: null,
                                    memberId: '',
                                    isMyCall: false
                                };
                            }

                            // Update button text and styling
                            button.textContent = newState.text;
                            button.dataset.tooltip = newState.text; // Tooltip with full caller name

                            // Remove all state classes
                            button.classList.remove('my-call', 'other-call');

                            if (newState.isMyCall) {
                                // GREEN - My own call
                                button.classList.add('my-call');
                                button.classList.remove('other-call');
                                button.style.setProperty('background', 'linear-gradient(135deg, #86B300, #6d8a00)', 'important');
                                button.style.setProperty('color', '#ffffff', 'important');
                                button.disabled = false;
                                button.dataset.callId = newState.callId;
                                button.dataset.memberId = newState.memberId;
                            } else if (callData) {
                                // RED - Someone else's call
                                button.classList.add('other-call');
                                button.classList.remove('my-call');
                                button.style.setProperty('background', 'linear-gradient(135deg, #F3754B, #e35a36)', 'important');
                                button.style.setProperty('color', '#ffffff', 'important');
                                button.style.setProperty('opacity', '0.7', 'important');
                                button.disabled = true;
                                delete button.dataset.callId;
                                delete button.dataset.memberId;
                            } else {
                                // BLUE - No call (default)
                                button.classList.remove('my-call', 'other-call');
                                button.style.setProperty('background', 'linear-gradient(135deg, #2196f3, #1976d2)', 'important');
                                button.style.setProperty('color', '#ffffff', 'important');
                                button.style.setProperty('opacity', '1', 'important');
                                button.disabled = false;
                                delete button.dataset.callId;
                                delete button.dataset.memberId;
                                button.dataset.tooltip = 'Click to call';
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error updating call buttons:', error);
            } finally {
                this.isUpdatingButtons = false;
            }
        }

        async updateTargetStatusesFromPage() {
            try {
                // Get current active calls from server
                const allCalls = await this.apiManager.getCalls();
                if (!allCalls || allCalls.length === 0) {
                    return;
                }

                // Filter calls for current faction only
                const currentFactionId = this.apiManager.factionId;
                const calls = allCalls.filter(call => call.faction_id === currentFactionId);

                if (calls.length === 0) {
                    return;
                }

                const now = Date.now();
                const THROTTLE_INTERVAL = 5000; // 5 seconds

                // For each call, find the target on the page and update their status
                calls.forEach(call => {
                    // Throttle: only update once per 5 seconds per call ID
                    const lastUpdate = this.lastStatusUpdate[call.id] || 0;
                    if (now - lastUpdate < THROTTLE_INTERVAL) {
                        return; // Skip this call, too soon since last update
                    }


                    // Find the call button ONLY by member_id - do NOT rely on name matching
                    // The button stores the member_id as data-memberid attribute
                    let callButton = null;
                    if (call.member_id) {
                        callButton = document.querySelector(`button[data-memberid="${call.member_id}"]`);
                    }

                    if (!callButton) {
                        return;
                    }


                    // If we found the button, navigate up to the member row
                    const memberRow = callButton.closest('li') || callButton.closest('tr');
                    if (!memberRow) {
                        return;
                    }

                    const statusEl = memberRow.querySelector('.status.left');
                    if (!statusEl) {
                        return;
                    }

                    const currentStatus = statusEl.textContent.trim();

                    // Register hospital node for timer updates
                    if (currentStatus === 'Hospital') {
                        this.registerHospNode(call.member_id, statusEl);
                    }

                    // Only update if status changed
                    if (currentStatus !== call.target_status) {
                        // AUTO-UNCALL LOGIC: If target was "Okay" and is now something else, auto-uncall
                        if (call.target_status === 'Okay' && currentStatus !== 'Okay') {
                            this.apiManager.cancelCall(call.id);
                        } else {
                            // Normal status update
                            this.apiManager.updateTargetStatus(call.id, currentStatus);
                        }
                        this.lastStatusUpdate[call.id] = now; // Record this update
                    } else {
                    }
                });
            } catch (error) {
                console.error('Erreur dans updateTargetStatusesFromPage:', error);
            }
        }

        setupEventListeners() {
            // Handle page visibility changes for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });

            // Setup tooltips for call buttons
            this.setupCallButtonTooltips();
        }

        setupCallButtonTooltips() {
            document.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('call-button') && e.target.dataset.tooltip) {
                    this.showTooltip(e.target);
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (e.target.classList.contains('call-button')) {
                    this.hideTooltip();
                }
            });
        }

        showTooltip(button) {
            // Remove old tooltip if exists
            this.hideTooltip();

            const tooltip = document.createElement('div');
            tooltip.className = 'call-button-tooltip';
            tooltip.textContent = button.dataset.tooltip;
            tooltip.style.cssText = `
                position: fixed;
                background: #333;
                color: #fff;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                animation: tooltipFadeIn 0.2s ease-in;
            `;

            document.body.appendChild(tooltip);
            this.currentTooltip = tooltip;

            // Position tooltip above the button
            const rect = button.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            const left = rect.left + (rect.width - tooltipRect.width) / 2;
            const top = rect.top - tooltipRect.height - 8;

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }

        hideTooltip() {
            if (this.currentTooltip) {
                this.currentTooltip.remove();
                this.currentTooltip = null;
            }
        }

        pause() {
            if (this.enhancementManager.observer) {
                this.enhancementManager.observer.disconnect();
            }
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
        }

        resume() {
            if (this.enhancementManager) {
                this.enhancementManager.setupMutationObserver();
            }
            this.startCallRefresh();
        }

        // Public API for customization
        updateTheme(colors) {
            if (this.cssManager) {
                this.cssManager.updateColors(colors);
            }
        }

        // Public API for configuration
        configure(config) {
            if (config.serverUrl) {
                this.apiManager.setServerUrl(config.serverUrl);
            }
            if (config.authToken) {
                this.apiManager.setAuthToken(config.authToken);
            }
            if (config.factionId) {
                this.apiManager.setFactionId(config.factionId);
            }
        }
    }

    // Initialize the enhancer
    const enhancer = new FactionWarEnhancer();

    // Expose to global scope for customization
    window.FactionWarEnhancer = enhancer;

    // Intercept WebSocket for real-time war data (use unsafeWindow to reach the real page context)
    const targetWindow = window.unsafeWindow || window;
    const oldWebSocket = targetWindow.WebSocket;
    targetWindow.WebSocket = function(...args) {
        const socket = new oldWebSocket(...args);
        socket.addEventListener('message', (event) => {
            try {
                const json = JSON.parse(event.data);

                // Check for war status updates
                const respUser = json?.push?.pub?.data?.message?.namespaces?.users;
                const statusUpdate = respUser?.actions?.updateStatus;

                if (statusUpdate?.status) {
                    const id = statusUpdate.userId;
                    const status = statusUpdate.status;

                    if (status.text === 'Hospital') {
                        enhancer.hospTime[id] = status.updateAt;
                    } else {
                        delete enhancer.hospTime[id];
                    }
                }
            } catch (e) {
                // Not JSON, ignore
            }
        });
        return socket;
    };

    // Also intercept fetch as backup
    const oldFetch = targetWindow.fetch;
    targetWindow.fetch = async (...args) => {
        const url = (args[0]?.url) || args[0];
        const response = await oldFetch(...args);

        // Check if this is a war data fetch
        if (typeof url === 'string' && (url.includes('step=getwarusers') || url.includes('step=getProcessBarRefreshData'))) {
            const clone = response.clone();
            clone.json().then((json) => {
                let members = null;
                if (json.warDesc) members = json.warDesc.members;
                else if (json.userStatuses) members = json.userStatuses;
                else return;

                Object.keys(members).forEach((id) => {
                    const status = members[id].status || members[id];
                    const userId = members[id].userID || id;
                    if (status.text === 'Hospital') {
                        enhancer.hospTime[userId] = status.updateAt;
                    } else {
                        delete enhancer.hospTime[userId];
                    }
                });
            }).catch(e => console.log('Hospital timer parse error:', e));
        }

        return response;
    };

    // Expose API key configuration function
    window.setTornApiKey = function(apiKey) {
        if (enhancer.apiManager) {
            enhancer.apiManager.saveTornApiKey(apiKey);
            // Re-detect faction with new API key
            enhancer.apiManager.detectFactionAutomatically();
        }
    };

    window.getTornApiKey = function() {
        if (enhancer.apiManager) {
            return enhancer.apiManager.torn_apikey ? '✅ API Key est configurée' : '❌ API Key non configurée';
        }
    };

    window.resetTornApiKey = function() {
        StorageUtil.remove('cat_api_key_script');
    };

    window.showBspCacheKeys = function() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('bsp') || key.includes('cache') || key.includes('battle') || key.includes('stats')) {
                const size = localStorage.getItem(key).length;
            }
        }
    };

    window.clearFactionCache = function() {
        StorageUtil.remove('cat_enemy_faction_id');
        return 'Faction cache cleared. Reload the page to re-detect faction.';
    };

    window.getFactionCacheStatus = function() {
        const cached = StorageUtil.get('cat_enemy_faction_id', null);
        if (!cached) {
            return { status: 'no_cache', message: 'No faction cache found' };
        }
        const now = Date.now();
        const remaining = cached.expiresAt - now;
        const remainingMinutes = Math.round(remaining / 60000);
        if (remaining > 0) {
            return {
                status: 'valid',
                id: cached.id,
                name: cached.name,
                expiresIn: `${remainingMinutes} minutes`
            };
        } else {
            return { status: 'expired', message: 'Cache has expired' };
        }
    };
})();
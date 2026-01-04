// ==UserScript==
// @name         Dead Frontier – Market / Scrap Ratio (SilverScripts Addon)
// @namespace    df-market-scrap-ratio
// @version      2.6.2
// @description  Highlights items based on Market Price / Scrap Value ratio with stats & scrap multipliers
// @author       Cezinha
//
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
//
// @require      https://update.greasyfork.org/scripts/441829/1630783/Dead%20Frontier%20-%20API.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/561093/Dead%20Frontier%20%E2%80%93%20Market%20%20Scrap%20Ratio%20%28SilverScripts%20Addon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561093/Dead%20Frontier%20%E2%80%93%20Market%20%20Scrap%20Ratio%20%28SilverScripts%20Addon%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============================================
    // GLOBAL CONSTANTS
    // ============================================
    // Contains fixed values used throughout the script: ratio tiers, scrap multipliers, and valid tradezones
    const GLOBAL_CONSTANTS = {
        TIERS: [
            { max: 0, color: '#8B4513' },
            { max: 0.99, color: '#8B0000' },
            { max: 1, color: '#696969' },
            { max: 2, color: '#A9A9A9' },
            { max: 5, color: '#32CD32' },
            { max: 10, color: '#1E90FF' },
            { max: 20, color: '#9370DB' },
            { max: 35, color: '#8A2BE2' },
            { max: 55, color: '#FF8C00' },
            { max: 90, color: '#FFD700' },
            { max: 120, color: '#00CED1' },
            { max: 160, color: '#20B2AA' },
            { max: 200, color: '#FF4500' },
            { max: 300, color: '#FF1493' },
            { max: Infinity, color: '#FF00FF' }
        ],

        SCRAP_MULTIPLIERS: [
            { minScrap: 15, multiplier: 0.3 },
            { minScrap: 100, multiplier: 0.5 },
            { minScrap: 1000, multiplier: 0.8 },
            { minScrap: 3000, multiplier: 1.2 },
            { minScrap: 11000, multiplier: 1.5 },
            { minScrap: 19450, multiplier: 2 },
            { minScrap: 40000, multiplier: 3 },
            { minScrap: 75000, multiplier: 5 },
            { minScrap: 125000, multiplier: 8 },
            { minScrap: 200000, multiplier: 12 },
            { minScrap: 350000, multiplier: 15 },
            { minScrap: 500000, multiplier: 25 },
            { minScrap: 1000000, multiplier: 40 },
            { minScrap: 2000000, multiplier: 60 }
        ],

        VALID_TRADEZONES: ['21', '22', '10', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    };

    // ============================================
    // CONFIGURATION MANAGER
    // ============================================
    const ConfigManager = (function() {
        const CONFIG = {
            ignoreLocked: false,
            ignoreAmmo: false,
            ignoreMC: false,
            ignoreNT: false,
            minScrapValue: 0.01,
            minEffectiveScrap: 500,
            language: 'en-us'  //en-us, pt-br
        };

        return {
            get: (key) => CONFIG[key],
            set: (key, value) => { CONFIG[key] = value; },
            getAll: () => ({...CONFIG})
        };
    })();

    // ============================================
    // REGEX SERVICE
    // ============================================
    // Handles regular expression patterns for parsing item types, stats, and tradezone data
    const RegexService = (function() {
        const PATTERNS = {
            STATS: /_stats(\d+)/i,
            AMMO_SUFFIX: /(?:ammo|rounds|bullets|shells|handgun|rifle|gauge|grenades|gasoline|biomass|cell)$/i,
            TYPE_CLEANUP: /_stats\d+|_nt|_colour\w+|_name[^_]*/gi,
            TRADEZONE_PARAM: /tradezone=(\d+)/,
            NUMBERS: /\d+/g
        };

        return {
            STATS: PATTERNS.STATS,
            getStatsCode: (type) => {
                const match = PATTERNS.STATS.exec(type);
                return match ? match[1] : null;
            },
            isMastercrafted: (type) => PATTERNS.STATS.test(type),
            normalizeType: (type) => type.replace(PATTERNS.TYPE_CLEANUP, '').toLowerCase(),
            getTradezoneFromData: (data) => {
                const match = PATTERNS.TRADEZONE_PARAM.exec(data);
                return match ? match[1] : null;
            },
            getNumbers: (str) => str.match(PATTERNS.NUMBERS)?.[0] || '',
            getStatsFormat: (stats) => {
                if (!stats) return 'none';
                const digits = (stats.match(PATTERNS.NUMBERS)?.[0] || '');

                if (digits.length === 1) return 'single';
                if (digits.length === 3) return 'triple';
                if (digits.length === 4) return 'quad';

                return 'unknown';
            }
        };
    })();

    // ============================================
    // LOCALIZATION SERVICE
    // ============================================
    // Provides localized text for UI elements, labels, and tooltips in multiple languages
    const LocalizationService = (function() {
        const LOCALIZATION = {
            'en-us': {
                tradezoneNames: {
                    '21': 'Outpost', '22': 'Camp Valcrest', '10': 'Wastelands',
                    '1': 'Northwest', '2': 'North', '3': 'Northeast', '4': 'West',
                    '5': 'Central', '6': 'East', '7': 'Southwest', '8': 'South', '9': 'Death Row'
                },
                tierLabels: [
                    '⚠️ No Market Data',
                    '📉 Street Trash',
                    '🗑️ Basic Scrap',
                    '⚙️ Simple Part',
                    '📦 Common Scrap',
                    '🔵 Field Components',
                    '💎 Recovered Equipment',
                    '⭐ Restored Components',
                    '🔶 Valuable Equipment',
                    '👑 Secronom Find',
                    '💠 Death Row Find',
                    '🔥 Wasteland Find',
                    '🛡️ Raven Ridge Find',
                    '🌟 Experimental Component',
                    '🏆 Legendary Artifact'
                ],
                scrapLabels: [
                    'Useless Junk',
                    'Simple Scrap',
                    'Scavenger Scrap',
                    'Field Scrap',
                    'Reinforced Scrap',
                    'Quality Components',
                    'Market Components',
                    'Rare Components',
                    'Secronom Treasures',
                    'Wasteland Treasures',
                    'Death Row Treasures',
                    'Raven Ridge Treasures',
                    'Experimental Components',
                    'Legendary Artifacts'
                ],
                statsLabels: {
                    godcrafted: 'Godcrafted',
                    nearGodcrafted: 'Near Godcrafted',
                    angelcrafted: 'Angelcrafted',
                    hellcrafted: 'Hellcrafted',
                    mastercrafted: 'Mastercrafted',
                    mastercraftedMin: 'Mastercrafted (Min)',
                    normal: 'Normal'
                },
                statsShortLabels: {
                    godcrafted: 'GC',
                    nearGodcrafted: 'NGC',
                    angelcrafted: 'AC',
                    hellcrafted: 'HC',
                    mastercrafted: 'MC',
                    normal: ''
                },
                formatNames: {
                    single: '1-digit',
                    triple: '3-digit',
                    quad: '4-digit',
                    none: 'None',
                    unknown: 'Unknown'
                },
                tooltipTexts: {
                    scaleRange: 'Scale: 1.0x to 2.5x',
                    points: 'pts',
                    minimum: 'MIN',
                    maximum: 'MAX',
                    percentage: '%',
                    format: 'Format',
                    threshold: 'Threshold'
                },
                texts: {
                    market: 'Market',
                    scrap: 'Scrap',
                    baseRatio: 'Base Ratio',
                    stats: 'Stats',
                    scrapMultiplier: 'Scrap',
                    final: 'Final',
                    tradezone: 'Tradezone',
                    notAvailable: 'N/A',
                    forced: 'FORCED',
                    innerCity: 'INNER CITY',
                    actual: 'ACTUAL'
                }
            },
            'pt-br': {
                tradezoneNames: {
                    '21': 'Posto Avançado', '22': 'Acampamento Valcrest', '10': 'Wastelands',
                    '1': 'Noroeste', '2': 'Norte', '3': 'Nordeste', '4': 'Oeste',
                    '5': 'Central', '6': 'Leste', '7': 'Sudoeste', '8': 'Sul', '9': 'Death Row'
                },
                tierLabels: [
                    '⚠️ Sem Dados de Mercado',
                    '📉 Lixo de Rua',
                    '🗑️ Sucata Básica',
                    '⚙️ Peça Simples',
                    '📦 Sucata Comum',
                    '🔵 Componentes de Campo',
                    '💎 Equipamento Recuperado',
                    '⭐ Componentes Restaurados',
                    '🔶 Equipamento Valioso',
                    '👑 Achado do Secronom',
                    '💠 Achado da Death Row',
                    '🔥 Achado da Wasteland',
                    '🛡️ Achado de Raven Ridge',
                    '🌟 Componente Experimental',
                    '🏆 Artefato Lendário'
                ],
                scrapLabels: [
                    'Lixo Inutil',
                    'Sucatas Simples',
                    'Sucatas de Catador',
                    'Sucatas de Campo',
                    'Sucatas Reforçada',
                    'Componentes de Qualidade',
                    'Componentes de Mercado',
                    'Componentes Raros',
                    'Tesouros da Secronom',
                    'Tesouros da Wasteland',
                    'Tesouros da Death Row',
                    'Tesouros de Raven Ridge',
                    'Componente Experimentais',
                    'Artefatos Lendários'
                ],
                statsLabels: {
                    godcrafted: 'Godcrafted',
                    nearGodcrafted: 'Near Godcrafted',
                    angelcrafted: 'Angelcrafted',
                    hellcrafted: 'Hellcrafted',
                    mastercrafted: 'Mastercrafted',
                    mastercraftedMin: 'Mastercrafted (Mínimo)',
                    normal: 'Normal'
                },
                statsShortLabels: {
                    godcrafted: 'GC',
                    nearGodcrafted: 'NGC',
                    angelcrafted: 'AC',
                    hellcrafted: 'HC',
                    mastercrafted: 'MC',
                    normal: ''
                },
                formatNames: {
                    single: '1-dígito',
                    triple: '3-dígitos',
                    quad: '4-dígitos',
                    none: 'Nenhum',
                    unknown: 'Desconhecido'
                },
                tooltipTexts: {
                    scaleRange: 'Escala: 1.0x a 2.5x',
                    points: 'pts',
                    minimum: 'MÍN',
                    maximum: 'MÁX',
                    percentage: '%',
                    format: 'Formato',
                    threshold: 'Limite'
                },
                texts: {
                    market: 'Mercado',
                    scrap: 'Sucata',
                    baseRatio: 'Razão Base',
                    stats: 'Atributos',
                    scrapMultiplier: 'Sucata',
                    final: 'Valor Final',
                    tradezone: 'Zona',
                    notAvailable: 'Indisponível',
                    forced: 'FORÇADA',
                    innerCity: 'CENTRO',
                    actual: 'REAL'
                }
            }
        };

    const language = ConfigManager.get('language');
    const currentLang = LOCALIZATION[language] || LOCALIZATION['en-us'];

    return {
        getText: (key) => currentLang.texts[key],
        getStatsLabel: (key) => currentLang.statsLabels[key],
        getStatsShortLabel: (key) => currentLang.statsShortLabels[key],
        getFormatName: (key) => currentLang.formatNames[key],
        getTooltipText: (key) => currentLang.tooltipTexts[key],
        getTierLabel: (index) => currentLang.tierLabels[index] || currentLang.tierLabels[0],
        getScrapLabel: (index) => currentLang.scrapLabels[index] || currentLang.scrapLabels[0],
        getTradezoneName: (id) => currentLang.tradezoneNames[id] || 'Unknown',

        getTier: (ratio, market) => {
            const tiers = GLOBAL_CONSTANTS.TIERS;

            if (market <= 0) {
                return {
                    max: tiers[0].max,
                    color: tiers[0].color,
                    label: currentLang.tierLabels[0]
                };
            }

            for (let i = 0; i < tiers.length; i++) {
                if (ratio <= tiers[i].max) {
                    return {
                        max: tiers[i].max,
                        color: tiers[i].color,
                        label: currentLang.tierLabels[i]
                    };
                }
            }

            const lastIndex = tiers.length - 1;
            return {
                max: tiers[lastIndex].max,
                color: tiers[lastIndex].color,
                label: currentLang.tierLabels[lastIndex]
            };
        },

        getTiers: () => GLOBAL_CONSTANTS.TIERS.map((tier, index) => ({
            max: tier.max,
            color: tier.color,
            label: currentLang.tierLabels[index]
        })),

        getScrapMultiplierData: () => GLOBAL_CONSTANTS.SCRAP_MULTIPLIERS.map((data, index) => ({
            minScrap: data.minScrap,
            multiplier: data.multiplier,
            label: currentLang.scrapLabels[index]
        })),

        getAllTexts: () => ({...currentLang.texts}),
        getAllTooltipTexts: () => ({...currentLang.tooltipTexts})
    };
})();

    // ============================================
    // TRADEZONE MANAGER
    // ============================================
    // Manages tradezone detection ONLY for inner city inventory
    const TradezoneManager = (function() {
        const isInventoryPage = window.location.href.includes('DF3D_InventoryPage.php?page=31');
        const isMarketplacePage = window.location.href.includes('index.php?page=35');

        let tradezoneForced = false;

        function getCurrentTradezoneFromSilverScripts() {
            if (unsafeWindow.userVars?.DFSTATS_df_tradezone) {
                return unsafeWindow.userVars.DFSTATS_df_tradezone.toString();
            }
            if (unsafeWindow.userData?.tradezone) {
                return unsafeWindow.userData.tradezone.toString();
            }
            if (unsafeWindow.DFAPI?.userData?.tradezone) {
                return unsafeWindow.DFAPI.userData.tradezone.toString();
            }
            return '21';
        }

        function getTargetTradezone() {
            if (isMarketplacePage) {
                return getCurrentTradezoneFromSilverScripts();
            }
            if (isInventoryPage) {
                return '21';
            }
            return getCurrentTradezoneFromSilverScripts();
        }

        function shouldForceTradezone() {
            return isInventoryPage && !isMarketplacePage;
        }

        function forceTradezone(targetTradezone) {
            if (!targetTradezone || isMarketplacePage) return;

            const currentSilverTradezone = getCurrentTradezoneFromSilverScripts();
            const currentName = LocalizationService.getTradezoneName(currentSilverTradezone);
            const targetName = LocalizationService.getTradezoneName(targetTradezone);

            if (currentSilverTradezone !== targetTradezone) {
                if (unsafeWindow.userData) {
                    unsafeWindow.userData.tradezone = targetTradezone;
                }
                if (unsafeWindow.userVars?.DFSTATS_df_tradezone) {
                    unsafeWindow.userVars.DFSTATS_df_tradezone = targetTradezone;
                }
                if (unsafeWindow.DFAPI?.userData) {
                    unsafeWindow.DFAPI.userData.tradezone = targetTradezone;
                }

                tradezoneForced = true;
                console.log(`✅ Inner City: Tradezone forced from ${currentSilverTradezone} (${currentName}) to Outpost (21)`);
            } else {
                console.log(`ℹ️ Inner City: Already using Outpost (21)`);
            }
        }

        function interceptXHR() {
            const originalXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
            const originalXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;

            unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this._url = url;
                return originalXHROpen.call(this, method, url, ...args);
            };

            unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
                if (this._url?.includes('trade_search.php') && data && typeof data === 'string' && shouldForceTradezone()) {
                    const targetTradezone = getTargetTradezone();
                    const match = RegexService.getTradezoneFromData(data);

                    if (match && match !== targetTradezone) {
                        data = data.replace(RegexService.TRADEZONE_PARAM, `tradezone=${targetTradezone}`);
                        console.log(`🔄 XHR Intercepted: ${match} → Outpost (21) for inner city`);
                    }

                    try {
                        const params = new URLSearchParams(data);
                        if (params.has('tradezone') && params.get('tradezone') !== targetTradezone) {
                            params.set('tradezone', targetTradezone);
                            data = params.toString();
                        }
                    } catch (e) {
                    }
                }
                return originalXHRSend.call(this, data);
            };
        }

        function getCurrentTradezoneInfo() {
            const actualTradezoneId = getCurrentTradezoneFromSilverScripts();
            const actualTradezoneName = LocalizationService.getTradezoneName(actualTradezoneId);

            const targetTradezone = getTargetTradezone();
            const shouldForce = shouldForceTradezone();

            let reason = 'normal';
            if (isMarketplacePage) {
                reason = 'marketplace';
            } else if (isInventoryPage) {
                reason = 'innerCity';
            }

            const displayTradezoneName = LocalizationService.getTradezoneName(targetTradezone);

            return {
                displayId: targetTradezone,
                displayName: displayTradezoneName,
                actualId: actualTradezoneId,
                actualName: actualTradezoneName,
                forced: shouldForce,
                reason: reason,
                showActual: shouldForce && actualTradezoneId !== targetTradezone
            };
        }

        function init() {
            /*console.log('🚀 TradezoneManager initializing...');
            console.log(`📍 Page detection - Inventory: ${isInventoryPage}, Marketplace: ${isMarketplacePage}`);*/

            if (isMarketplacePage) {
                //console.log('🛒 Marketplace detected - Showing ACTUAL tradezone prices');
                interceptXHR();
                return;
            }

            if (isInventoryPage) {
                //console.log('🏙️ Inner City Inventory detected - Forcing to Outpost for scrap ratios');
                const targetTradezone = getTargetTradezone();

                setTimeout(() => {
                    forceTradezone(targetTradezone);
                }, 1500);

                const forceInterval = setInterval(() => {
                    if (!tradezoneForced) {
                        forceTradezone(targetTradezone);
                    }
                }, 500);

                /*setTimeout(() => {
                    clearInterval(forceInterval);
                    if (!tradezoneForced) {
                        console.warn('⚠️ Could not force tradezone to Outpost');
                    }
                }, 10000);*/

                interceptXHR();
            } else {
                //console.log('📊 Normal page - Using ACTUAL tradezone');
                interceptXHR();
            }
        }

        return {
            init,
            getCurrentTradezoneInfo,
            isForcing: () => shouldForceTradezone(),
            getReason: () => {
                if (isMarketplacePage) return 'Marketplace - Actual prices';
                if (isInventoryPage) return 'Inner City - Forced to Outpost (21)';
                return 'Normal page - Actual tradezone';
            },
            isForced: () => tradezoneForced,
            isMarketplacePage: () => isMarketplacePage,
            getTargetTradezone
        };
    })();
    // ============================================
    // ITEM CALCULATION SERVICE
    // ============================================
    // Performs core calculations for market prices, scrap values, stats multipliers, and ratios
    const ItemCalculationService = (function() {
        const SPECIAL_STATS = {
            'GC': {
                patterns: ['3', '2424', '888'],
                labelKey: 'godcrafted'
            },
            'NGC': {
                patterns: ['2', '2324', '2423', '788', '878', '887'],
                labelKey: 'nearGodcrafted'
            },
            'AC': {
                patterns: ['777'],
                labelKey: 'angelcrafted'
            },
            'HC': {
                patterns: ['666'],
                labelKey: 'hellcrafted'
            }
        };

        const STATS_RANGES = {
            'single': {
                min: '0',
                max: '3',
                minPoints: 0,
                maxPoints: 3
            },
            'triple': {
                min: '000',
                max: '888',
                minPoints: 0,
                maxPoints: 24
            },
            'quad': {
                min: '0000',
                max: '2424',
                minPoints: 0,
                maxPoints: 48
            }
        };

        function parseStatsString(stats) {
            if (!stats) return {
                totalPoints: 0,
                digits: [],
                format: 'none',
                maxPoints: 0,
                minPoints: 0,
                isMinimum: false,
                isMaximum: false
            };

            const digits = RegexService.getNumbers(stats);
            const format = RegexService.getStatsFormat(stats);
            const range = STATS_RANGES[format];

            if (!range) {
                return {
                    totalPoints: 0,
                    digits: [],
                    format: 'unknown',
                    maxPoints: 0,
                    minPoints: 0,
                    isMinimum: false,
                    isMaximum: false
                };
            }

            const isMinimum = stats === range.min;
            const isMaximum = stats === range.max;

            let totalPoints = 0;
            let parsedDigits = [];

            if (format === 'single') {
                const points = parseInt(digits);
                totalPoints = points;
                parsedDigits = [points];
            }
            else if (format === 'triple') {
                const point1 = parseInt(digits.charAt(0));
                const point2 = parseInt(digits.charAt(1));
                const point3 = parseInt(digits.charAt(2));
                totalPoints = point1 + point2 + point3;
                parsedDigits = [point1, point2, point3];
            }
            else if (format === 'quad') {
                const point1 = parseInt(digits.substring(0, 2));
                const point2 = parseInt(digits.substring(2, 4));
                totalPoints = point1 + point2;
                parsedDigits = [point1, point2];
            }

            return {
                totalPoints,
                digits: parsedDigits,
                format: format,
                maxPoints: range.maxPoints,
                minPoints: range.minPoints,
                isMinimum: isMinimum,
                isMaximum: isMaximum,
                range: range
            };
        }

        function calculateMultiplier(parsedStats) {
            const { totalPoints, minPoints, maxPoints, isMinimum, isMaximum } = parsedStats;

            if (isMinimum) {
                return 1.0;
            }

            if (isMaximum) {
                return 2.5;
            }

            const percentage = (totalPoints - minPoints) / (maxPoints - minPoints);
            const multiplier = 1.0 + (percentage * 1.5);

            return Number(multiplier.toFixed(2));
        }

        function calculateProgressiveScrapMultiplier(scrap) {
            const scrapMultipliers = GLOBAL_CONSTANTS.SCRAP_MULTIPLIERS;

            if (scrap <= 0) return 0;

            if (scrap < scrapMultipliers[0].minScrap) {
                const percentage = scrap / scrapMultipliers[0].minScrap;
                return Number((percentage * scrapMultipliers[0].multiplier).toFixed(2));
            }

            let lowerPoint = scrapMultipliers[0];
            let upperPoint = scrapMultipliers[scrapMultipliers.length - 1];

            for (let i = 0; i < scrapMultipliers.length - 1; i++) {
                if (scrap >= scrapMultipliers[i].minScrap && scrap < scrapMultipliers[i + 1].minScrap) {
                    lowerPoint = scrapMultipliers[i];
                    upperPoint = scrapMultipliers[i + 1];
                    break;
                }
            }

            if (scrap >= scrapMultipliers[scrapMultipliers.length - 1].minScrap) {
                return scrapMultipliers[scrapMultipliers.length - 1].multiplier;
            }

            const scrapRange = upperPoint.minScrap - lowerPoint.minScrap;
            const multiplierRange = upperPoint.multiplier - lowerPoint.multiplier;

            if (scrapRange === 0) return lowerPoint.multiplier;

            const position = (scrap - lowerPoint.minScrap) / scrapRange;
            const multiplier = lowerPoint.multiplier + (multiplierRange * position);

            return Number(multiplier.toFixed(2));
        }

        function getStatsLabelAndShort(stats, parsedStats) {
            for (const [key, data] of Object.entries(SPECIAL_STATS)) {
                if (data.patterns.includes(stats)) {
                    return {
                        label: LocalizationService.getStatsLabel(data.labelKey),
                        shortLabel: LocalizationService.getStatsShortLabel(data.labelKey),
                        isSpecialVariant: true,
                        typeKey: data.labelKey
                    };
                }
            }

            if (stats === '1') {
                return {
                    label: LocalizationService.getStatsLabel('mastercrafted'),
                    shortLabel: LocalizationService.getStatsShortLabel('mastercrafted'),
                    isSpecialVariant: true,
                    typeKey: 'mastercrafted'
                };
            }

            const isMinimum = parsedStats.isMinimum;

            if (isMinimum) {
                return {
                    label: LocalizationService.getStatsLabel('mastercraftedMin'),
                    shortLabel: LocalizationService.getStatsShortLabel('mastercrafted'),
                    isSpecialVariant: false,
                    typeKey: 'mastercraftedMin'
                };
            }

            return {
                label: LocalizationService.getStatsLabel('mastercrafted'),
                shortLabel: LocalizationService.getStatsShortLabel('mastercrafted'),
                isSpecialVariant: false,
                typeKey: 'mastercrafted'
            };
        }

        function getStatsInfo(stats) {
            if (!stats) {
                return {
                    label: LocalizationService.getStatsLabel('normal'),
                    shortLabel: LocalizationService.getStatsShortLabel('normal'),
                    multiplier: 1,
                    isSpecialVariant: false,
                    points: 0,
                    maxPoints: 0,
                    minPoints: 0,
                    originalDigits: [],
                    format: 'none',
                    formatName: LocalizationService.getFormatName('none'),
                    statsCode: null,
                    percentage: 0,
                    isMinimum: false,
                    isMaximum: false
                };
            }

            const parsed = parseStatsString(stats);
            const multiplier = calculateMultiplier(parsed);
            const labelInfo = getStatsLabelAndShort(stats, parsed);
            const formatName = LocalizationService.getFormatName(parsed.format);

            const percentage = parsed.maxPoints > 0 ?
                Math.round(((parsed.totalPoints - parsed.minPoints) / (parsed.maxPoints - parsed.minPoints)) * 100) : 0;

            return {
                label: labelInfo.label,
                shortLabel: labelInfo.shortLabel,
                multiplier: multiplier,
                isSpecialVariant: labelInfo.isSpecialVariant,
                points: parsed.totalPoints,
                maxPoints: parsed.maxPoints,
                minPoints: parsed.minPoints,
                originalDigits: parsed.digits,
                format: parsed.format,
                formatName: formatName,
                statsCode: stats,
                percentage: percentage,
                isMinimum: parsed.isMinimum,
                isMaximum: parsed.isMaximum,
                typeKey: labelInfo.typeKey
            };
        }

        function getScrapMultiplier(scrap) {
            const scrapMultiplierData = LocalizationService.getScrapMultiplierData();

            const multiplier = calculateProgressiveScrapMultiplier(scrap);

            let labelIndex = 0;
            for (let i = 0; i < scrapMultiplierData.length; i++) {
                if (scrap >= scrapMultiplierData[i].minScrap) {
                    labelIndex = i;
                } else {
                    break;
                }
            }

            const label = LocalizationService.getScrapLabel(labelIndex);
            const minScrap = scrapMultiplierData[labelIndex]?.minScrap || 0;

            return {
                multiplier: multiplier,
                label: label,
                minScrap: minScrap
            };
        }

        function isAmmo(type) {
            if (!RegexService.AMMO_SUFFIX.test(type)) return false;

            const baseType = RegexService.normalizeType(type);
            const ammoTypes = [
                '32ammo','35ammo','357ammo','38ammo','40ammo','45ammo','50ammo',
                '55ammo','20gaugeammo','16gaugeammo','12gaugeammo','10gaugeammo',
                'grenadeammo','heavygrenadeammo','55rifleammo','75rifleammo',
                '9rifleammo','127rifleammo','14rifleammo','fuelammo'
            ];
            return ammoTypes.includes(baseType);
        }

        function isArmour(type) {
            const base = RegexService.normalizeType(type);
            const itemData = unsafeWindow.globalData?.[base];
            return itemData?.itemtype === 'armour';
        }

        function getMarketDB() {
            return unsafeWindow.getSilverItemsDataBank?.() || null;
        }

        function getMarketPrice(type, qty = 1) {
            const db = getMarketDB();
            if (!db) return 0;
            const base = RegexService.normalizeType(type);
            const item = db[base];
            if (!item) return 0;
            const price = item.bestPricePerUnit || item.averagePricePerUnit || 0;
            return isArmour(type) ? price : price * qty;
        }

        function getScrap(type, qty) {
            if (!unsafeWindow.scrapValue) return 0;
            if (isArmour(type)) {
                const base = RegexService.normalizeType(type);
                const data = unsafeWindow.globalData?.[base];
                if (data?.hp) return unsafeWindow.scrapValue(type, parseInt(data.hp));
            }
            return unsafeWindow.scrapValue(type, qty);
        }

        function getEffectiveScrap(scrap) {
            if (scrap <= 20) return scrap * 10000;
            if (scrap <= 500) return 500;
            return scrap;
        }


        function calculateRatios(market, scrap, statsMultiplier, scrapMultiplier, statsPresent, isSpecialVariant) {
            const effectiveScrapMultiplier = statsPresent ? 1 : scrapMultiplier;
            const effectiveScrap = getEffectiveScrap(scrap);
            const minEffectiveScrap = ConfigManager.get('minEffectiveScrap');

            const combinedValue = statsPresent ? (market + (scrap / statsMultiplier)) : market;

            const baseRatio = combinedValue > 0 ? (combinedValue / Math.max(effectiveScrap, minEffectiveScrap)) : 0;
            const totalMultiplier = statsMultiplier * effectiveScrapMultiplier;
            let finalRatio = baseRatio * totalMultiplier;

            const displayRatio = combinedValue > 0 ?
                (combinedValue / Math.max(effectiveScrap, minEffectiveScrap)) * statsMultiplier * effectiveScrapMultiplier : 0;

            return {
                baseRatio,
                totalMultiplier,
                finalRatio,
                displayRatio,
                effectiveScrapMultiplier,
                combinedValue,
                statsMultiplierApplied: statsPresent ? statsMultiplier : 1
            };
        }

        return {
            getStatsInfo,
            getScrapMultiplier,
            isAmmo,
            isArmour,
            getMarketPrice,
            getScrap,
            getEffectiveScrap,
            calculateRatios,
            isMastercrafted: RegexService.isMastercrafted,
            getStatsCode: RegexService.getStatsCode
        };
    })();

    // ============================================
    // UI MANAGER
    // ============================================
    // Handles tooltip creation, positioning, and visual styling for item highlighting
    const UIManager = (function() {
        let infoBox = null;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        const DRAG_THRESHOLD = 5;

        function createTooltip() {
            infoBox = document.createElement('div');
            infoBox.style.cssText = `
                position: absolute;
                pointer-events: none;
                background-color: rgba(0,0,0,0.9);
                color: #fff;
                padding: 10px 14px;
                border-radius: 6px;
                font-size: 12px;
                font-family: "Courier New", monospace;
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                z-index: 9999;
                display: none;
                white-space: nowrap;
                border: 2px solid transparent;
                line-height: 1.5em;
                min-width: 180px;
            `;
            document.body.appendChild(infoBox);

            setupDragDetection();

            return infoBox;
        }

        function setupDragDetection() {
            document.addEventListener('mousedown', (e) => {
                const item = e.target.closest('.item[data-type]');
                if (item) {
                    isDragging = false;
                    dragStartX = e.clientX;
                    dragStartY = e.clientY;

                    UIManager.hideTooltip();
                }
            }, true);

            // Listen for mousemove to detect dragging
            document.addEventListener('mousemove', (e) => {
                if (dragStartX !== 0 || dragStartY !== 0) {
                    const deltaX = Math.abs(e.clientX - dragStartX);
                    const deltaY = Math.abs(e.clientY - dragStartY);

                    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                        isDragging = true;
                        UIManager.hideTooltip();
                    }
                }
            }, true);

            document.addEventListener('mouseup', () => {
                isDragging = false;
                dragStartX = 0;
                dragStartY = 0;
            }, true);
        }

        function applySpecialBorders(item, tierColor, stats, market = 1) {
            item.style.border = '2px solid transparent';
            item.style.backgroundColor = '';
            item.style.boxShadow = '';

            if (!stats) {
                if (market <= 0) {
                    item.style.border = `1.8px dashed ${tierColor}`;
                    return '';
                }
                return null;
            }

            const statsInfo = ItemCalculationService.getStatsInfo(stats);
            const shortLabel = statsInfo.shortLabel;

            switch(shortLabel) {
                case 'GC':
                    item.style.border = `2px solid ${tierColor}`;
                    item.style.boxShadow = `1px 1px 5px 1px #FFD60050 inset`;
                    item.style.backgroundColor = `#FFD60025`;
                    break;
                case 'NGC':
                    item.style.border = `2px solid ${tierColor}`;
                    item.style.boxShadow = `1px 1px 5px 1px #FFFFFF50 inset`;
                    item.style.backgroundColor = `#FFFFFF35`;
                    break;
                case 'AC':
                    item.style.border = `2px solid ${tierColor}`;
                    item.style.boxShadow = `1px 1px 5px 1px #D4D4D450 inset`;
                    item.style.backgroundColor = `#D4D4D435`;
                    break;
                case 'HC':
                    item.style.border = `2px solid ${tierColor}`;
                    item.style.boxShadow = `1px 1px 5px 1px #D5000050 inset`;
                    item.style.backgroundColor = `#D5000035`;
                    break;
                case 'MC':
                default:
                    item.style.border = `2px solid ${tierColor}`;
                    item.style.boxShadow = `1px 1px 5px 1px #995A1A50 inset`;
                    item.style.backgroundColor = `#995A1A35`;
                    break;
            }

            return shortLabel;
        }

        function createTooltipHTML(itemData) {
            const {
                shortType, mcLabel, mcFullLabel, tier, tradezone, texts,
                market, scrap, baseRatio, statsMultiplier,
                statsLabel, points, maxPoints, minPoints, originalDigits, format, formatName, percentage, isMinimum, isMaximum,
                scrapMultiplier, scrapLabel, scrapMinScrap, totalMultiplier, finalRatio,
                scrapMultiplierStyle, stats, isSpecialVariant, combinedValue, showTilde
            } = itemData;

            const tooltipTexts = LocalizationService.getAllTooltipTexts();

            let displayIndicator = '';
            let displayColor = '';
            if (tradezone.forced) {
                if (tradezone.reason === 'innerCity') {
                    displayIndicator = `(${texts.innerCity})`;
                    displayColor = '#00CED1';
                } else {
                    displayIndicator = `(${texts.forced})`;
                    displayColor = '#FFD700';
                }
            }

            let tradezoneHtml = '';
            if (tradezone.showActual) {
                tradezoneHtml = `<div style="margin-bottom:3px;"><span style="color:#AAA">${texts.tradezone} (${texts.forced}) : </span><span style="color:#00BFFF">${tradezone.displayName}</span></div>`;
            } else {
                tradezoneHtml = `<div style="margin-bottom:3px;"><span style="color:#AAA">${texts.tradezone}: </span><span style="color:#00BFFF">${tradezone.displayName}</span>${displayIndicator ? '<span style="color:'+displayColor+';font-size:10px;font-weight:bold;"> '+displayIndicator+'</span>' : ''}</div>`;
            }

            const displayMarketValue = (showTilde ? '± ' : '') + Math.floor(combinedValue || market).toLocaleString();

            let statsDetails = '';
            let scaleInfo = '';

            if (stats && format !== 'none') {
                /*if (originalDigits.length > 0) {
                    if (format === 'triple') { statsDetails = ` (${originalDigits[0]}/${originalDigits[1]}/${originalDigits[2]})`;
                    } else if (format === 'quad') { statsDetails = ` (${originalDigits[0]}/${originalDigits[1]})`;
                    } else if (format === 'single') { statsDetails = ` (${originalDigits[0]})`;
                    }
                }*/

                if (isMinimum) {
                    statsDetails += ` - ${points}/${maxPoints} ${tooltipTexts.points}<!--(${tooltipTexts.minimum})-->`;
                    scaleInfo = tooltipTexts.scaleRange;
                } else
                  if (isMaximum) {
                    statsDetails += ` - ${points}/${maxPoints} ${tooltipTexts.points}<!--(${tooltipTexts.maximum})-->`;
                    scaleInfo = tooltipTexts.scaleRange;
                } else {
                    statsDetails += ` - ${points}/${maxPoints} ${tooltipTexts.points}`;
                    //if (percentage > 0) { statsDetails += ` (${percentage}${tooltipTexts.percentage})`;}
                    scaleInfo = tooltipTexts.scaleRange;
                }

                //if (formatName && formatName !== 'None' && formatName !== 'Nenhum') { statsDetails += ` [${formatName}]`;}
            }

            let scrapMultiplierInfo = '';
            if (!stats && scrapMultiplier !== 1) {
                const scrapValue = Math.floor(scrap).toLocaleString();
                const multiplierValue = scrapMultiplier.toFixed(2);
                scrapMultiplierInfo = `<div style="margin-bottom:1px;margin-left:12px;font-size:11px;${scrapMultiplierStyle}">↳ ${texts.scrapMultiplier}: ${multiplierValue}x</div>`;
                scrapMultiplierInfo += `<div style="margin-bottom:3px;margin-left:24px;font-size:10px;color:#888;">(${scrapLabel}<!-- - ${scrapValue} scrap-->)</div>`;

                //if (scrapMinScrap > 0) { scrapMultiplierInfo += `<div style="margin-bottom:3px;margin-left:32px;font-size:9px;color:#666;">${tooltipTexts.threshold}: ${scrapMinScrap.toLocaleString()}+</div>`;}
            }

            return `
                <div style="text-align:center;font-weight:bold;padding-bottom:6px;margin-bottom:6px;font-size:14px;border-bottom:1px solid #333;">
                    ${shortType}${mcLabel ? ' <span style="color:'+tier.color+'">['+mcLabel+']</span>' : ''}
                </div>
                <div style="text-align:left;font-size:12px;">
                    ${tradezoneHtml}
                    <div style="margin-bottom:3px;">
                        <span style="color:#AAA">${texts.market}:</span>
                        <span style="color:#4AF">${market > 0 ? displayMarketValue : texts.notAvailable}</span>
                        ${showTilde ? '<span style="color:#FFD700;margin-left:4px;" title="Market + Scrap value">⚠️</span>' : ''}
                    </div>
                    <div style="margin-bottom:3px;"><span style="color:#AAA">${texts.scrap}:</span> <span style="color:#F84">${Math.floor(scrap).toLocaleString()}</span></div>
                    <div style="margin-bottom:3px;"><span style="color:#AAA">${texts.baseRatio}:</span> <span style="color:#0F0;font-weight:bold">${market > 0 ? baseRatio.toFixed(2)+'x' : '?'}</span></div>
                    ${market > 0 && statsMultiplier > 1 ? `<div style="margin-bottom:1px;margin-left:12px;font-size:11px;color:#FFD700">↳ ${texts.stats}: ${statsMultiplier}x</div>` : ''}
                    ${market > 0 && statsMultiplier > 1 ? `<div style="margin-bottom:3px;margin-left:24px;font-size:10px;color:#888;">(${mcFullLabel}${statsDetails})</div>` : ''}
                    ${scrapMultiplierInfo}
                    ${market > 0 && totalMultiplier !== 1 ? `<div style="margin-bottom:3px;margin-left:12px;font-size:11px;color:#00FF00;font-weight:bold;">↳ ${texts.final}: ${finalRatio.toFixed(2)}x</div>` : ''}
                    <div style="color:${tier.color};font-weight:bold;text-align:center;margin-top:6px;padding-top:6px;border-top:1px solid #333;">${tier.label}</div>
                </div>
            `;
        }

        return {
            init: createTooltip,
            applySpecialBorders,
            createTooltipHTML,
            getTooltip: () => infoBox,
            showTooltip: (html, tierColor) => {
                if (!infoBox || isDragging) return; // Don't show if dragging
                infoBox.innerHTML = html;
                infoBox.style.display = 'block';
                infoBox.style.border = `2px solid ${tierColor}`;
            },
            hideTooltip: () => {
                if (infoBox) infoBox.style.display = 'none';
            },
            positionTooltip: (x, y) => {
                if (!infoBox || isDragging) return; // Don't position if dragging
                infoBox.style.left = x + 'px';
                infoBox.style.top = y + 'px';
            },
            isDragging: () => isDragging
        };
    })();

    // ============================================
    // ITEM PROCESSOR
    // ============================================
    // Processes individual game items, applies visual effects, and attaches tooltip events
    const ItemProcessor = (function() {
        function processItem(item) {
            if (!item?.dataset?.type) return;

            const type = item.dataset.type;
            const qty = parseInt(item.dataset.quantity || 1, 10);
            const stats = ItemCalculationService.getStatsCode(type);

            const slot = item.closest('.validSlot');
            if (ConfigManager.get('ignoreLocked') && slot && slot.classList.contains('locked')) {
                item.style.border = '';
                item.style.boxShadow = '';
                item.style.backgroundColor = '';
                item.style.transform = '';
                item.style.zIndex = '';

                item.onmouseenter = null;
                item.onmousemove = null;
                item.onmouseleave = null;
                return;
            }

            if (ConfigManager.get('ignoreAmmo') && ItemCalculationService.isAmmo(type)) return;
            if (ConfigManager.get('ignoreMC') && ItemCalculationService.isMastercrafted(type)) return;

            const scrap = ItemCalculationService.getScrap(type, qty);
            if (scrap < ConfigManager.get('minScrapValue')) return;

            const market = ItemCalculationService.getMarketPrice(type, qty);
            if (ConfigManager.get('ignoreNT') && market <= 0 && !stats) return;

            const statsInfo = ItemCalculationService.getStatsInfo(stats);

            const scrapMultiplierData = ItemCalculationService.getScrapMultiplier(scrap);

            const ratios = ItemCalculationService.calculateRatios(
                market, scrap, statsInfo.multiplier, scrapMultiplierData.multiplier, !!stats, statsInfo.isSpecialVariant
            );

            const tier = LocalizationService.getTier(ratios.displayRatio, market);
            let mcLabel = UIManager.applySpecialBorders(item, tier.color, stats, market);

            if (!stats && market > 0) {
                item.style.border = `2px solid ${tier.color}`;
                item.style.boxShadow = 'none';
                item.style.backgroundColor = '';
            }

            const tradezone = TradezoneManager.getCurrentTradezoneInfo();
            const texts = LocalizationService.getAllTexts();
            const shortType = type.length > 25 ? type.substring(0, 22) + '...' : type;
            const scrapMultiplierStyle = scrapMultiplierData.multiplier < 1 ? 'color:#FF5555' : scrapMultiplierData.multiplier > 1 ? 'color:#FFD700' : 'color:#FFFFFF';

            const isTierZero = tier === LocalizationService.getTiers()[0];
            const showTildeWarning = !!stats && !isTierZero && market > 0;

            const tooltipData = {
                shortType,
                mcLabel: statsInfo.shortLabel,
                mcFullLabel: statsInfo.label,
                tier,
                tradezone,
                texts: texts,
                market,
                scrap,
                baseRatio: ratios.baseRatio,
                statsMultiplier: statsInfo.multiplier,
                statsLabel: statsInfo.label,
                points: statsInfo.points,
                maxPoints: statsInfo.maxPoints,
                minPoints: statsInfo.minPoints,
                originalDigits: statsInfo.originalDigits,
                format: statsInfo.format,
                formatName: statsInfo.formatName,
                percentage: statsInfo.percentage,
                isMinimum: statsInfo.isMinimum,
                isMaximum: statsInfo.isMaximum,
                scrapMultiplier: scrapMultiplierData.multiplier,
                scrapLabel: scrapMultiplierData.label,
                scrapMinScrap: scrapMultiplierData.minScrap,
                totalMultiplier: ratios.totalMultiplier,
                finalRatio: ratios.finalRatio,
                scrapMultiplierStyle,
                stats,
                isSpecialVariant: statsInfo.isSpecialVariant,
                combinedValue: ratios.combinedValue,
                showTilde: showTildeWarning
            };

            const html = UIManager.createTooltipHTML(tooltipData);

            item.onmouseenter = (e) => {
                if (UIManager.isDragging()) return;

                UIManager.showTooltip(html, tier.color);

                const ssTooltip = unsafeWindow.infoBox;
                if (ssTooltip && ssTooltip.style.display !== 'none') {
                    const rect = ssTooltip.getBoundingClientRect();
                    UIManager.positionTooltip(rect.right + 8 + window.scrollX, rect.top + window.scrollY);
                } else {
                    const rect = item.getBoundingClientRect();
                    UIManager.positionTooltip(rect.right + 8 + window.scrollX, rect.top + window.scrollY);
                }

                item.style.transform = 'scale(1.1)';
                item.style.zIndex = '1000';
            };

            item.onmousemove = (e) => {
                if (UIManager.isDragging()) return;

                const ssTooltip = unsafeWindow.infoBox;
                if (ssTooltip && ssTooltip.style.display !== 'none') {
                    const rect = ssTooltip.getBoundingClientRect();
                    UIManager.positionTooltip(rect.right + 8 + window.scrollX, rect.top + window.scrollY);
                } else {
                    const offset = 10;
                    UIManager.positionTooltip(e.pageX + offset, e.pageY + offset);
                }
            };

            item.onmouseleave = () => {
                UIManager.hideTooltip();
                item.style.transform = 'scale(1)';
                item.style.zIndex = '';
            };

            item.addEventListener('mousedown', () => {
                UIManager.hideTooltip();
            });
        }

        function processAll() {
            document.querySelectorAll('.item[data-type]').forEach(processItem);
        }

        return {
            processItem,
            processAll
        };
    })();

    // ============================================
    // MAIN INITIALIZATION
    // ============================================
    // Entry point that initializes all services and starts the item processing loop
    function init() {
        TradezoneManager.init();

        UIManager.init();

        let observerTimeout;
        const observer = new MutationObserver((mutations) => {
            const relevantMutations = mutations.filter(mutation => {
                return !mutation.target.closest?.('.locked');
            });

            if (relevantMutations.length > 0) {
                clearTimeout(observerTimeout);
                observerTimeout = setTimeout(() => {
                    ItemProcessor.processAll();
                }, 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        setTimeout(() => {
            ItemProcessor.processAll();

            const tradezoneInfo = TradezoneManager.getCurrentTradezoneInfo();

            console.log(`✅ Market / Scrap Ratio v2.6.2 loaded (${ConfigManager.get('language')})`);
            /*console.log(`📍 ACTUAL Tradezone (SilverScripts): ${tradezoneInfo.actualId} (${tradezoneInfo.actualName})`);
            console.log(`📍 DISPLAY Tradezone: ${tradezoneInfo.displayId} (${tradezoneInfo.displayName})`);
            console.log(`📍 FORCED: ${tradezoneInfo.forced ? 'YES' : 'NO'}`);
            console.log(`📍 Mode: ${TradezoneManager.isForcing() ? 'FORCING tradezone' : 'NORMAL (not forcing)'}`);
            if (TradezoneManager.isForcing()) {
                console.log(`📍 Reason: ${TradezoneManager.getReason()}`);
                console.log(`📍 Force Status: ${TradezoneManager.isForced() ? 'Success' : 'Failed'}`);
            }*/
        }, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
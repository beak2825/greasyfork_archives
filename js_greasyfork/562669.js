// ==UserScript==
// @name         [PokeChill] PokéDieu QoL Panel
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  PokéDieu by Noxray provides multiple QoL options to enjoy Pokechill without boring limitations
// @author       Noxray
// @match        https://play-pokechill.github.io/*
// @grant        unsafeWindow
// @license      CC-BY-ND-4.0
// @supportURL   https://www.paypal.com/paypalme/noxray
// @downloadURL https://update.greasyfork.org/scripts/562669/%5BPokeChill%5D%20Pok%C3%A9Dieu%20QoL%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/562669/%5BPokeChill%5D%20Pok%C3%A9Dieu%20QoL%20Panel.meta.js
// ==/UserScript==

/*
 * PokéDieu QoL Panel
 * Copyright (c) 2024 Noxray
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 International License.
 * 
 * You are free to:
 * - Share: copy and redistribute the material in any medium or format for any purpose, even commercially
 * 
 * Under the following terms:
 * - Attribution: You must give appropriate credit to Noxray, provide a link to the license,
 *   and indicate if changes were made (which are NOT allowed under this license)
 * - NoDerivatives: If you remix, transform, or build upon the material, you may not distribute
 *   the modified material. The script must remain unmodified.
 * 
 * Full license: https://creativecommons.org/licenses/by-nd/4.0/
 */

(function() {
    'use strict';

    const CONFIG = {
        speeds: {
            normal: 2000,
            fast: 1000,
            rapid: 500,
            veryRapid: 250,
            ultra: 1
        },
        currentSpeed: 2000,
        sectionsCollapsed: {
            combat: false,
            speed: false,
            genetics: false,
            settings: false,
            thanks: false
        },
        autoRebattleActive: false
    };

    const THEMES = {
        oled: {
            name: 'OLED (Économie écran)',
            background: '#000000',
            panel: '#0a0a0a',
            section: '#1a1a1a',
            sectionContent: '#0f0f0f',
            sectionText: '#e0e0e0',
            text: '#ffffff',
            border: '#333333',
            button: '#1a1a1a',
            buttonHover: '#2a2a2a'
        },
        dark: {
            name: 'Sombre',
            background: '#1a1a1a',
            panel: '#242424',
            section: '#2d2d2d',
            sectionContent: '#222222',
            sectionText: '#e0e0e0',
            text: '#ffffff',
            border: '#404040',
            button: '#2d2d2d',
            buttonHover: '#3d3d3d'
        },
        blue: {
            name: 'Bleu Nuit',
            background: '#0f1419',
            panel: '#1a2332',
            section: '#253142',
            sectionContent: '#1a2332',
            sectionText: '#a8c5e0',
            text: '#e1e8ed',
            border: '#38444d',
            button: '#253142',
            buttonHover: '#2d3e52'
        },
        purple: {
            name: 'Violet Profond',
            background: '#160f1f',
            panel: '#211a2d',
            section: '#2d2438',
            sectionContent: '#211a2d',
            sectionText: '#d4b5e8',
            text: '#e8dff5',
            border: '#3d2f52',
            button: '#2d2438',
            buttonHover: '#3d2f52'
        }
    };

    let currentTheme = localStorage.getItem('pokegod-theme') || 'oled';
    let currentLanguage = localStorage.getItem('pokegod-language') || 'fr';

    const TRANSLATIONS = {
        fr: {
            title: '⚡ PokéDieu by Noxray ⚡',
            autoCombat: '⚔️ Combat Automatique',
            autoRebattle: 'Recombattre automatiquement',
            combatSpeed: '⚡ Vitesse de Combat',
            normal: 'Normale (2000ms)',
            fast: 'Accélérée (1000ms)',
            rapid: 'Rapide (500ms)',
            veryRapid: 'Très Rapide (250ms)',
            ultra: 'Ultralumique (1ms)',
            genetics: '🧬 Génétique',
            endGenetics: 'Terminer la Génétique',
            settings: '⚙️ Paramètres',
            theme: 'Thème',
            language: 'Langue',
            thanks: '💖 Remercier le Dev',
            buyMeCoffee: '☕ Offrir un café à Noxray',
            themeOled: 'OLED (Économie écran)',
            themeDark: 'Sombre',
            themeBlue: 'Bleu Nuit',
            themePurple: 'Violet Profond'
        },
        en: {
            title: '⚡ PokéGod by Noxray ⚡',
            autoCombat: '⚔️ Auto Combat',
            autoRebattle: 'Auto Rebattle',
            combatSpeed: '⚡ Combat Speed',
            normal: 'Normal (2000ms)',
            fast: 'Fast (1000ms)',
            rapid: 'Rapid (500ms)',
            veryRapid: 'Very Rapid (250ms)',
            ultra: 'Ultraluminous (1ms)',
            genetics: '🧬 Genetics',
            endGenetics: 'End Genetics',
            settings: '⚙️ Settings',
            theme: 'Theme',
            language: 'Language',
            thanks: '💖 Thank the Dev',
            buyMeCoffee: '☕ Buy Noxray a Coffee',
            themeOled: 'OLED (Screen Save)',
            themeDark: 'Dark',
            themeBlue: 'Night Blue',
            themePurple: 'Deep Purple'
        },
        es: {
            title: '⚡ PokéDios by Noxray ⚡',
            autoCombat: '⚔️ Combate Automático',
            autoRebattle: 'Recombatir automáticamente',
            combatSpeed: '⚡ Velocidad de Combate',
            normal: 'Normal (2000ms)',
            fast: 'Rápida (1000ms)',
            rapid: 'Rápida (500ms)',
            veryRapid: 'Muy Rápida (250ms)',
            ultra: 'Ultraluminosa (1ms)',
            genetics: '🧬 Genética',
            endGenetics: 'Terminar Genética',
            settings: '⚙️ Configuración',
            theme: 'Tema',
            language: 'Idioma',
            thanks: '💖 Agradecer al Dev',
            buyMeCoffee: '☕ Invitar un café a Noxray',
            themeOled: 'OLED (Ahorro de pantalla)',
            themeDark: 'Oscuro',
            themeBlue: 'Azul Nocturno',
            themePurple: 'Violeta Profundo'
        },
        de: {
            title: '⚡ PokéGott by Noxray ⚡',
            autoCombat: '⚔️ Auto-Kampf',
            autoRebattle: 'Automatisch neu kämpfen',
            combatSpeed: '⚡ Kampfgeschwindigkeit',
            normal: 'Normal (2000ms)',
            fast: 'Schnell (1000ms)',
            rapid: 'Schnell (500ms)',
            veryRapid: 'Sehr Schnell (250ms)',
            ultra: 'Ultraluminös (1ms)',
            genetics: '🧬 Genetik',
            endGenetics: 'Genetik beenden',
            settings: '⚙️ Einstellungen',
            theme: 'Thema',
            language: 'Sprache',
            thanks: '💖 Dem Dev danken',
            buyMeCoffee: '☕ Noxray einen Kaffee ausgeben',
            themeOled: 'OLED (Bildschirmsparen)',
            themeDark: 'Dunkel',
            themeBlue: 'Nachtblau',
            themePurple: 'Tiefviolett'
        },
        it: {
            title: '⚡ PokéDio by Noxray ⚡',
            autoCombat: '⚔️ Combattimento Automatico',
            autoRebattle: 'Ricombatti automaticamente',
            combatSpeed: '⚡ Velocità di Combattimento',
            normal: 'Normale (2000ms)',
            fast: 'Veloce (1000ms)',
            rapid: 'Rapida (500ms)',
            veryRapid: 'Molto Rapida (250ms)',
            ultra: 'Ultraluminosa (1ms)',
            genetics: '🧬 Genetica',
            endGenetics: 'Termina Genetica',
            settings: '⚙️ Impostazioni',
            theme: 'Tema',
            language: 'Lingua',
            thanks: '💖 Ringrazia lo Dev',
            buyMeCoffee: '☕ Offri un caffè a Noxray',
            themeOled: 'OLED (Risparmio schermo)',
            themeDark: 'Scuro',
            themeBlue: 'Blu Notturno',
            themePurple: 'Viola Profondo'
        },
        ru: {
            title: '⚡ PokéБог by Noxray ⚡',
            autoCombat: '⚔️ Авто Бой',
            autoRebattle: 'Автоматический реванш',
            combatSpeed: '⚡ Скорость Боя',
            normal: 'Нормальная (2000ms)',
            fast: 'Быстрая (1000ms)',
            rapid: 'Стремительная (500ms)',
            veryRapid: 'Очень Быстрая (250ms)',
            ultra: 'Сверхсветовая (1ms)',
            genetics: '🧬 Генетика',
            endGenetics: 'Завершить Генетику',
            settings: '⚙️ Настройки',
            theme: 'Тема',
            language: 'Язык',
            thanks: '💖 Поблагодарить Разработчика',
            buyMeCoffee: '☕ Купить Noxray кофе',
            themeOled: 'OLED (Экономия экрана)',
            themeDark: 'Тёмная',
            themeBlue: 'Ночной Синий',
            themePurple: 'Глубокий Фиолетовый'
        },
        ko: {
            title: '⚡ 포케신 by Noxray ⚡',
            autoCombat: '⚔️ 자동 전투',
            autoRebattle: '자동으로 재대결',
            combatSpeed: '⚡ 전투 속도',
            normal: '보통 (2000ms)',
            fast: '빠름 (1000ms)',
            rapid: '급속 (500ms)',
            veryRapid: '매우 빠름 (250ms)',
            ultra: '초광속 (1ms)',
            genetics: '🧬 유전학',
            endGenetics: '유전학 종료',
            settings: '⚙️ 설정',
            theme: '테마',
            language: '언어',
            thanks: '💖 개발자에게 감사',
            buyMeCoffee: '☕ Noxray에게 커피 사주기',
            themeOled: 'OLED (화면 절약)',
            themeDark: '다크',
            themeBlue: '나이트 블루',
            themePurple: '딥 퍼플'
        },
        ja: {
            title: '⚡ ポケ神 by Noxray ⚡',
            autoCombat: '⚔️ 自動戦闘',
            autoRebattle: '自動的に再戦',
            combatSpeed: '⚡ 戦闘速度',
            normal: '通常 (2000ms)',
            fast: '速い (1000ms)',
            rapid: '高速 (500ms)',
            veryRapid: '超高速 (250ms)',
            ultra: '光速 (1ms)',
            genetics: '🧬 遺伝学',
            endGenetics: '遺伝学を終了',
            settings: '⚙️ 設定',
            theme: 'テーマ',
            language: '言語',
            thanks: '💖 開発者に感謝',
            buyMeCoffee: '☕ Noxrayにコーヒーを',
            themeOled: 'OLED (画面節約)',
            themeDark: 'ダーク',
            themeBlue: 'ナイトブルー',
            themePurple: 'ディープパープル'
        },
        zh: {
            title: '⚡ 宝可神 by Noxray ⚡',
            autoCombat: '⚔️ 自动战斗',
            autoRebattle: '自动重新战斗',
            combatSpeed: '⚡ 战斗速度',
            normal: '正常 (2000ms)',
            fast: '快速 (1000ms)',
            rapid: '迅速 (500ms)',
            veryRapid: '非常快 (250ms)',
            ultra: '超光速 (1ms)',
            genetics: '🧬 遗传学',
            endGenetics: '结束遗传学',
            settings: '⚙️ 设置',
            theme: '主题',
            language: '语言',
            thanks: '💖 感谢开发者',
            buyMeCoffee: '☕ 请Noxray喝咖啡',
            themeOled: 'OLED (省电)',
            themeDark: '暗黑',
            themeBlue: '夜蓝',
            themePurple: '深紫'
        },
        ar: {
            title: '⚡ بوكي إله by Noxray ⚡',
            autoCombat: '⚔️ قتال تلقائي',
            autoRebattle: 'إعادة القتال تلقائياً',
            combatSpeed: '⚡ سرعة القتال',
            normal: 'عادي (2000ms)',
            fast: 'سريع (1000ms)',
            rapid: 'سريع جداً (500ms)',
            veryRapid: 'سريع للغاية (250ms)',
            ultra: 'فائق السرعة (1ms)',
            genetics: '🧬 علم الوراثة',
            endGenetics: 'إنهاء علم الوراثة',
            settings: '⚙️ الإعدادات',
            theme: 'السمة',
            language: 'اللغة',
            thanks: '💖 شكر المطور',
            buyMeCoffee: '☕ اشتري قهوة لـ Noxray',
            themeOled: 'OLED (توفير الشاشة)',
            themeDark: 'داكن',
            themeBlue: 'أزرق ليلي',
            themePurple: 'بنفسجي عميق'
        }
    };

    function t(key) {
        return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS.fr[key];
    }

    function changeLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('pokegod-language', lang);
        updatePanelContent();
    }

    function changeTheme(themeName) {
        currentTheme = themeName;
        localStorage.setItem('pokegod-theme', themeName);
        updatePanelContent();
    }

    function updatePanelContent() {
        const panel = document.getElementById('pokegod-panel');
        if (panel) {
            panel.innerHTML = createPanelContent();
            attachEventListeners();
            checkFightAgainButton();
            checkGeneticsAbortButton();
        }
    }

    function isFightAgainButtonVisible() {
        const fightAgainDiv = document.getElementById('area-rejoin');
        if (!fightAgainDiv) return false;

        const style = window.getComputedStyle(fightAgainDiv);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function isGeneticsAbortButtonVisible() {
        const abortButton = document.getElementById('genetics-start');
        if (!abortButton) return false;

        const buttonText = abortButton.textContent.trim();
        if (buttonText !== 'Abort') return false;

        const style = window.getComputedStyle(abortButton);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function checkFightAgainButton() {
        const toggleContainer = document.getElementById('toggle-container');
        const toggle = document.getElementById('auto-rebattle-toggle');

        if (!toggleContainer || !toggle) return;

        const isVisible = isFightAgainButtonVisible();

        if (isVisible) {
            toggleContainer.style.cursor = 'pointer';
            toggleContainer.style.opacity = '1';
            toggleContainer.style.pointerEvents = 'auto';
        } else {
            toggleContainer.style.cursor = 'not-allowed';
            toggleContainer.style.opacity = '0.5';
            toggleContainer.style.pointerEvents = 'none';

            if (toggle.classList.contains('active')) {
                toggle.classList.remove('active');
                CONFIG.autoRebattleActive = false;
            }
        }
    }

    function checkGeneticsAbortButton() {
        const endGeneticsBtn = document.getElementById('end-genetics-btn');

        if (!endGeneticsBtn) return;

        const isVisible = isGeneticsAbortButtonVisible();

        if (isVisible) {
            endGeneticsBtn.style.cursor = 'pointer';
            endGeneticsBtn.style.opacity = '1';
            endGeneticsBtn.style.pointerEvents = 'auto';
            endGeneticsBtn.style.filter = 'none';
        } else {
            endGeneticsBtn.style.cursor = 'not-allowed';
            endGeneticsBtn.style.opacity = '0.5';
            endGeneticsBtn.style.pointerEvents = 'none';
            endGeneticsBtn.style.filter = 'grayscale(100%)';
        }
    }

    function setBattleSpeed(speed) {
        try {
            eval(`saved.overrideBattleTimer = ${speed}`);
            console.log(`✅ Battle speed set to ${speed}ms via console command: saved.overrideBattleTimer = ${speed}`);
            return true;
        } catch (error) {
            console.error('❌ Error setting battle speed:', error);
            return false;
        }
    }

    function endGenetics() {
        try {
            eval(`saved.geneticOperation = 1`);
            console.log('✅ Genetics operation ended via console command: saved.geneticOperation = 1');
            return true;
        } catch (error) {
            console.error('❌ Error ending genetics:', error);
            return false;
        }
    }

    function autoClickFightAgain() {
        if (!CONFIG.autoRebattleActive) return;

        const fightAgainDiv = document.getElementById('area-rejoin');
        if (!fightAgainDiv) return;

        const style = window.getComputedStyle(fightAgainDiv);
        if (style.display === 'flex' && style.visibility !== 'hidden' && style.opacity !== '0') {
            console.log('🔄 Auto-clicking Fight Again div...');

            fightAgainDiv.click();

            try {
                if (typeof unsafeWindow.rejoinArea === 'function') {
                    unsafeWindow.afkSeconds = 0;
                    unsafeWindow.storedAfkSeconds = 0;
                    unsafeWindow.rejoinArea();
                    console.log('✅ Fight Again executed via rejoinArea()');
                }
            } catch (error) {
                console.error('❌ Error executing rejoinArea:', error);
            }
        }
    }

    function createPanelContent() {
        const theme = THEMES[currentTheme];
        const isRTL = currentLanguage === 'ar' ? 'rtl' : 'ltr';

        return `
            <style>
                #pokegod-panel * {
                    box-sizing: border-box;
                }
                #pokegod-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${theme.panel};
                    border: 2px solid ${theme.border};
                    border-radius: 10px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    z-index: 999999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: ${theme.text};
                    width: 320px;
                    backdrop-filter: blur(10px);
                    max-height: 95vh;
                    display: flex;
                    flex-direction: column;
                    direction: ${isRTL};
                }
                .pokegod-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 12px;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: white;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    border-bottom: 2px solid ${theme.border};
                    margin: 0;
                    flex-shrink: 0;
                }
                .pokegod-content {
                    padding: 15px;
                    overflow-y: auto;
                    flex: 1;
                }
                .pokegod-content::-webkit-scrollbar {
                    width: 8px;
                }
                .pokegod-content::-webkit-scrollbar-track {
                    background: ${theme.background};
                    border-radius: 10px;
                }
                .pokegod-content::-webkit-scrollbar-thumb {
                    background: ${theme.border};
                    border-radius: 10px;
                }
                .pokegod-content::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                .section-header {
                    background: ${theme.section};
                    padding: 8px 10px;
                    border-radius: 5px 5px 0 0;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid ${theme.border};
                    border-bottom: none;
                    transition: background 0.2s;
                    min-height: 35px;
                    max-height: 35px;
                    height: 35px;
                }
                .section-header:hover {
                    background: ${theme.buttonHover};
                }
                .section-header > span:first-child {
                    font-weight: bold;
                    font-size: 13px;
                    color: ${theme.sectionText};
                    display: flex;
                    align-items: center;
                    flex: 1;
                    line-height: 1;
                }
                .section-arrow {
                    font-size: 12px !important;
                    color: ${theme.sectionText} !important;
                    line-height: 1 !important;
                    flex-shrink: 0 !important;
                    width: 16px !important;
                    text-align: center !important;
                    background: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    outline: none !important;
                }
                .section-content {
                    background: ${theme.sectionContent};
                    border: 1px solid ${theme.border};
                    border-top: none;
                    border-radius: 0 0 5px 5px;
                    padding: 10px;
                    margin-bottom: 12px;
                }
                .speed-button {
                    background: ${theme.button};
                    color: ${theme.text};
                    border: 1px solid ${theme.border};
                    padding: 8px;
                    margin: 4px 0;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                .speed-button:hover {
                    background: ${theme.buttonHover};
                    transform: translateX(5px);
                }
                .speed-button.active {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    border-color: #f5576c;
                    font-weight: bold;
                }
                .toggle-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: ${theme.button};
                    border-radius: 5px;
                    border: 1px solid ${theme.border};
                    transition: opacity 0.3s, cursor 0.3s;
                }
                .toggle-switch {
                    position: relative;
                    width: 50px;
                    height: 24px;
                    background: #4a4a4a;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background 0.3s;
                    flex-shrink: 0;
                }
                .toggle-switch.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .toggle-slider {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .toggle-switch.active .toggle-slider {
                    transform: translateX(26px);
                }
                #pokegod-panel select {
                    width: 100%;
                    padding: 8px;
                    margin: 8px 0;
                    background: ${theme.button};
                    color: ${theme.text};
                    border: 1px solid ${theme.border};
                    border-radius: 5px;
                    font-size: 12px;
                    cursor: pointer;
                }
                #pokegod-panel select option {
                    background: ${theme.panel};
                    color: ${theme.text};
                }
                .setting-label {
                    font-size: 12px;
                    display: block;
                    margin-bottom: 4px;
                    margin-top: 8px;
                    color: ${theme.sectionText};
                    font-weight: 500;
                }
                .genetics-button {
                    background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.3s;
                    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
                }
                .genetics-button:hover:not([style*="not-allowed"]) {
                    transform: scale(1.05);
                }
            </style>
            
            <div class="pokegod-header">
                ${t('title')}
            </div>
            
            <div class="pokegod-content">
                <!-- Section Combat Automatique -->
                <div>
                    <div class="section-header" id="combat-header">
                        <span>${t('autoCombat')}</span>
                        <span class="section-arrow" id="combat-arrow">${CONFIG.sectionsCollapsed.combat ? '▶' : '▼'}</span>
                    </div>
                    <div class="section-content" id="combat-content" style="display: ${CONFIG.sectionsCollapsed.combat ? 'none' : 'block'};">
                        <div class="toggle-container" id="toggle-container">
                            <span style="font-size: 12px;">${t('autoRebattle')}</span>
                            <div class="toggle-switch ${CONFIG.autoRebattleActive ? 'active' : ''}" id="auto-rebattle-toggle">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Vitesse de Combat -->
                <div>
                    <div class="section-header" id="speed-header">
                        <span>${t('combatSpeed')}</span>
                        <span class="section-arrow" id="speed-arrow">${CONFIG.sectionsCollapsed.speed ? '▶' : '▼'}</span>
                    </div>
                    <div class="section-content" id="speed-content" style="display: ${CONFIG.sectionsCollapsed.speed ? 'none' : 'block'};">
                        <button class="speed-button ${CONFIG.currentSpeed === 2000 ? 'active' : ''}" data-speed="2000">
                            ${t('normal')}
                        </button>
                        <button class="speed-button ${CONFIG.currentSpeed === 1000 ? 'active' : ''}" data-speed="1000">
                            ${t('fast')}
                        </button>
                        <button class="speed-button ${CONFIG.currentSpeed === 500 ? 'active' : ''}" data-speed="500">
                            ${t('rapid')}
                        </button>
                        <button class="speed-button ${CONFIG.currentSpeed === 250 ? 'active' : ''}" data-speed="250">
                            ${t('veryRapid')}
                        </button>
                        <button class="speed-button ${CONFIG.currentSpeed === 1 ? 'active' : ''}" data-speed="1">
                            ${t('ultra')}
                        </button>
                    </div>
                </div>

                <!-- Section Génétique -->
                <div>
                    <div class="section-header" id="genetics-header">
                        <span>${t('genetics')}</span>
                        <span class="section-arrow" id="genetics-arrow">${CONFIG.sectionsCollapsed.genetics ? '▶' : '▼'}</span>
                    </div>
                    <div class="section-content" id="genetics-content" style="display: ${CONFIG.sectionsCollapsed.genetics ? 'none' : 'block'};">
                        <button id="end-genetics-btn" class="genetics-button">
                            ${t('endGenetics')}
                        </button>
                    </div>
                </div>

                <!-- Section Paramètres -->
                <div>
                    <div class="section-header" id="settings-header">
                        <span>${t('settings')}</span>
                        <span class="section-arrow" id="settings-arrow">${CONFIG.sectionsCollapsed.settings ? '▶' : '▼'}</span>
                    </div>
                    <div class="section-content" id="settings-content" style="display: ${CONFIG.sectionsCollapsed.settings ? 'none' : 'block'};">
                        <label class="setting-label">${t('theme')}</label>
                        <select id="theme-select">
                            <option value="oled" ${currentTheme === 'oled' ? 'selected' : ''}>${t('themeOled')}</option>
                            <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>${t('themeDark')}</option>
                            <option value="blue" ${currentTheme === 'blue' ? 'selected' : ''}>${t('themeBlue')}</option>
                            <option value="purple" ${currentTheme === 'purple' ? 'selected' : ''}>${t('themePurple')}</option>
                        </select>
                        
                        <label class="setting-label">${t('language')}</label>
                        <select id="language-select">
                            <option value="fr" ${currentLanguage === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                            <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                            <option value="de" ${currentLanguage === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                            <option value="it" ${currentLanguage === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
                            <option value="ru" ${currentLanguage === 'ru' ? 'selected' : ''}>🇷🇺 Русский</option>
                            <option value="ko" ${currentLanguage === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
                            <option value="ja" ${currentLanguage === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
                            <option value="zh" ${currentLanguage === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
                            <option value="ar" ${currentLanguage === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
                        </select>
                    </div>
                </div>

                <!-- Section Remercier le Dev -->
                <div>
                    <div class="section-header" id="thanks-header">
                        <span>${t('thanks')}</span>
                        <span class="section-arrow" id="thanks-arrow">${CONFIG.sectionsCollapsed.thanks ? '▶' : '▼'}</span>
                    </div>
                    <div class="section-content" id="thanks-content" style="display: ${CONFIG.sectionsCollapsed.thanks ? 'none' : 'block'};">
                        <button onclick="window.open('https://www.paypal.com/paypalme/noxray', '_blank')" style="
                            background: linear-gradient(135deg, #FFDD00 0%, #FBB034 100%);
                            color: #000;
                            border: none;
                            padding: 8px;
                            border-radius: 5px;
                            cursor: pointer;
                            width: 100%;
                            font-size: 12px;
                            font-weight: bold;
                            transition: transform 0.1s;
                            box-shadow: 0 2px 8px rgba(255, 221, 0, 0.3);
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            ${t('buyMeCoffee')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function attachEventListeners() {
        ['combat', 'speed', 'genetics', 'settings', 'thanks'].forEach(section => {
            const header = document.getElementById(`${section}-header`);
            if (header) {
                header.addEventListener('click', () => {
                    CONFIG.sectionsCollapsed[section] = !CONFIG.sectionsCollapsed[section];
                    const content = document.getElementById(`${section}-content`);
                    const arrow = document.getElementById(`${section}-arrow`);

                    if (content && arrow) {
                        content.style.display = CONFIG.sectionsCollapsed[section] ? 'none' : 'block';
                        arrow.textContent = CONFIG.sectionsCollapsed[section] ? '▶' : '▼';
                    }
                });
            }
        });

        document.querySelectorAll('.speed-button').forEach(button => {
            button.addEventListener('click', function() {
                const speed = parseInt(this.dataset.speed);

                if (setBattleSpeed(speed)) {
                    CONFIG.currentSpeed = speed;

                    document.querySelectorAll('.speed-button').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });

        const toggleContainer = document.getElementById('toggle-container');
        if (toggleContainer) {
            toggleContainer.addEventListener('click', function() {
                if (!isFightAgainButtonVisible()) {
                    return;
                }

                const toggle = document.getElementById('auto-rebattle-toggle');
                if (toggle) {
                    toggle.classList.toggle('active');
                    CONFIG.autoRebattleActive = toggle.classList.contains('active');

                    console.log(`Auto Rebattle: ${CONFIG.autoRebattleActive ? 'Enabled ✅' : 'Disabled ❌'}`);
                }
            });
        }

        const endGeneticsBtn = document.getElementById('end-genetics-btn');
        if (endGeneticsBtn) {
            endGeneticsBtn.addEventListener('click', function() {
                if (!isGeneticsAbortButtonVisible()) {
                    return;
                }

                endGenetics();
            });
        }

        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', function() {
                changeTheme(this.value);
            });
        }

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', function() {
                changeLanguage(this.value);
            });
        }

        const fightAgainObserver = new MutationObserver(checkFightAgainButton);
        const fightAgainDiv = document.getElementById('area-rejoin');
        if (fightAgainDiv) {
            fightAgainObserver.observe(fightAgainDiv, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        const geneticsObserver = new MutationObserver(checkGeneticsAbortButton);
        const geneticsAbortButton = document.getElementById('genetics-start');
        if (geneticsAbortButton) {
            geneticsObserver.observe(geneticsAbortButton, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        setInterval(() => {
            checkFightAgainButton();
            checkGeneticsAbortButton();
            autoClickFightAgain();
        }, 500);

        checkFightAgainButton();
        checkGeneticsAbortButton();
    }

    function init() {
        const panel = document.createElement('div');
        panel.id = 'pokegod-panel';
        panel.innerHTML = createPanelContent();
        document.body.appendChild(panel);

        attachEventListeners();
    }

    function startScript() {
        init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }
})();

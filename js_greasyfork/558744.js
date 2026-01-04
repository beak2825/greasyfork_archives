// ==UserScript==
// @name         Discord Quest Filter
// @version      1.0
// @description  Colors and hides Discord quests based on conditions
// @author       Kriimaar
// @match        https://discord.com/quest-home*
// @match        https://*.discord.com/quest-home*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1547329
// @downloadURL https://update.greasyfork.org/scripts/558744/Discord%20Quest%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558744/Discord%20Quest%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Color definitions
    const colors = {
        blue: {
            primary: '#0066ff',
            secondary: '#0044aa',
            glow: 'rgba(0, 102, 255, 0.6)'
        },
        green: {
            primary: '#00ff88',
            secondary: '#00aa55',
            glow: 'rgba(0, 255, 136, 0.6)'
        },
        yellow: {
            primary: '#ffaa00',
            secondary: '#cc8800',
            glow: 'rgba(255, 170, 0, 0.6)'
        },
        red: {
            primary: '#ff0066',
            secondary: '#aa0044',
            glow: 'rgba(255, 0, 102, 0.6)'
        }
    };

    // Translations
    const translations = {
        de: {
            menuTitle: 'Quest Filter Einstellungen',
            sectionGeneral: 'Allgemein',
            sectionHide: 'Quests ausblenden',
            sectionColors: 'Farbcodierung',
            sectionLanguage: 'Sprache',
            
            enableColorCoding: 'Farbcodierung aktivieren',
            enableColorCodingDesc: 'Zeigt farbige Rahmen um Quests',
            autoSortNewest: 'Automatisch nach "Neueste" sortieren',
            autoSortNewestDesc: 'Ändert die Standard-Sortierung',
            
            hideExpired: 'Abgelaufene Quests ausblenden',
            hideExpiredDesc: 'Versteckt Quests deren Datum überschritten ist',
            hideClaimed: 'Beanspruchte Quests ausblenden',
            hideClaimedDesc: 'Versteckt bereits beanspruchte Quests',
            hideNoOrbs: 'Quests ohne Orbs ausblenden',
            hideNoOrbsDesc: 'Versteckt alle Quests die keine Orbs geben',
            hideWithOrbs: 'Quests mit Orbs ausblenden',
            hideWithOrbsDesc: 'Versteckt alle Quests die Orbs geben',
            
            yellowBorder: 'Gelber Rand',
            yellowBorderDesc: 'Quests mit Orbs + "Spielen"',
            redBorder: 'Roter Rand',
            redBorderDesc: 'Quests ohne Orbs als Belohnung',
            greenBorder: 'Grüner Rand',
            greenBorderDesc: 'Quests mit "Anschauen" Bedingung',
            blueBorder: 'Blauer Rand',
            blueBorderDesc: 'Fertige, nicht beanspruchte Quests',
            
            selectLanguage: 'Sprache auswählen',
            selectLanguageDesc: 'Ändere die Sprache der Benutzeroberfläche',
            
            buttonReset: 'Zurücksetzen',
            buttonApply: 'Übernehmen & Schließen',
            confirmReset: 'Möchtest du wirklich alle Einstellungen zurücksetzen?',
            buttonText: 'Quest Filter'
        },
        en: {
            menuTitle: 'Quest Filter Settings',
            sectionGeneral: 'General',
            sectionHide: 'Hide Quests',
            sectionColors: 'Color Coding',
            sectionLanguage: 'Language',
            
            enableColorCoding: 'Enable color coding',
            enableColorCodingDesc: 'Shows colored borders around quests',
            autoSortNewest: 'Automatically sort by "Newest"',
            autoSortNewestDesc: 'Changes the default sorting',
            
            hideExpired: 'Hide expired quests',
            hideExpiredDesc: 'Hides quests whose date has passed',
            hideClaimed: 'Hide claimed quests',
            hideClaimedDesc: 'Hides already claimed quests',
            hideNoOrbs: 'Hide quests without Orbs',
            hideNoOrbsDesc: 'Hides all quests that don\'t give Orbs',
            hideWithOrbs: 'Hide quests with Orbs',
            hideWithOrbsDesc: 'Hides all quests that give Orbs',
            
            yellowBorder: 'Yellow Border',
            yellowBorderDesc: 'Quests with Orbs + "Play"',
            redBorder: 'Red Border',
            redBorderDesc: 'Quests without Orbs as reward',
            greenBorder: 'Green Border',
            greenBorderDesc: 'Quests with "Watch" condition',
            blueBorder: 'Blue Border',
            blueBorderDesc: 'Completed, unclaimed quests',
            
            selectLanguage: 'Select Language',
            selectLanguageDesc: 'Change the interface language',
            
            buttonReset: 'Reset',
            buttonApply: 'Apply & Close',
            confirmReset: 'Do you really want to reset all settings?',
            buttonText: 'Quest Filter'
        },
        es: {
            menuTitle: 'Configuración del Filtro de Misiones',
            sectionGeneral: 'General',
            sectionHide: 'Ocultar Misiones',
            sectionColors: 'Codificación de Colores',
            sectionLanguage: 'Idioma',
            
            enableColorCoding: 'Activar codificación de colores',
            enableColorCodingDesc: 'Muestra bordes de colores alrededor de las misiones',
            autoSortNewest: 'Ordenar automáticamente por "Más reciente"',
            autoSortNewestDesc: 'Cambia el orden predeterminado',
            
            hideExpired: 'Ocultar misiones caducadas',
            hideExpiredDesc: 'Oculta misiones cuya fecha ha pasado',
            hideClaimed: 'Ocultar misiones reclamadas',
            hideClaimedDesc: 'Oculta misiones ya reclamadas',
            hideNoOrbs: 'Ocultar misiones sin Orbs',
            hideNoOrbsDesc: 'Oculta todas las misiones que no dan Orbs',
            hideWithOrbs: 'Ocultar misiones con Orbs',
            hideWithOrbsDesc: 'Oculta todas las misiones que dan Orbs',
            
            yellowBorder: 'Borde Amarillo',
            yellowBorderDesc: 'Misiones con Orbs + "Jugar"',
            redBorder: 'Borde Rojo',
            redBorderDesc: 'Misiones sin Orbs como recompensa',
            greenBorder: 'Borde Verde',
            greenBorderDesc: 'Misiones con condición "Ver"',
            blueBorder: 'Borde Azul',
            blueBorderDesc: 'Misiones completadas, no reclamadas',
            
            selectLanguage: 'Seleccionar Idioma',
            selectLanguageDesc: 'Cambiar el idioma de la interfaz',
            
            buttonReset: 'Restablecer',
            buttonApply: 'Aplicar y Cerrar',
            confirmReset: '¿Realmente quieres restablecer toda la configuración?',
            buttonText: 'Filtro de Misiones'
        },
        fr: {
            menuTitle: 'Paramètres du Filtre de Quêtes',
            sectionGeneral: 'Général',
            sectionHide: 'Masquer les Quêtes',
            sectionColors: 'Codage des Couleurs',
            sectionLanguage: 'Langue',
            
            enableColorCoding: 'Activer le codage des couleurs',
            enableColorCodingDesc: 'Affiche des bordures colorées autour des quêtes',
            autoSortNewest: 'Trier automatiquement par "Plus récent"',
            autoSortNewestDesc: 'Modifie le tri par défaut',
            
            hideExpired: 'Masquer les quêtes expirées',
            hideExpiredDesc: 'Masque les quêtes dont la date est dépassée',
            hideClaimed: 'Masquer les quêtes réclamées',
            hideClaimedDesc: 'Masque les quêtes déjà réclamées',
            hideNoOrbs: 'Masquer les quêtes sans Orbs',
            hideNoOrbsDesc: 'Masque toutes les quêtes qui ne donnent pas d\'Orbs',
            hideWithOrbs: 'Masquer les quêtes avec Orbs',
            hideWithOrbsDesc: 'Masque toutes les quêtes qui donnent des Orbs',
            
            yellowBorder: 'Bordure Jaune',
            yellowBorderDesc: 'Quêtes avec Orbs + "Jouer"',
            redBorder: 'Bordure Rouge',
            redBorderDesc: 'Quêtes sans Orbs comme récompense',
            greenBorder: 'Bordure Verte',
            greenBorderDesc: 'Quêtes avec condition "Regarder"',
            blueBorder: 'Bordure Bleue',
            blueBorderDesc: 'Quêtes terminées, non réclamées',
            
            selectLanguage: 'Sélectionner la Langue',
            selectLanguageDesc: 'Changer la langue de l\'interface',
            
            buttonReset: 'Réinitialiser',
            buttonApply: 'Appliquer et Fermer',
            confirmReset: 'Voulez-vous vraiment réinitialiser tous les paramètres ?',
            buttonText: 'Filtre de Quêtes'
        }
    };

    // Discord language keywords for detection
    const discordKeywords = {
        watch: ['Schau', 'anschauen', 'Anschauen', 'Watch', 'watch', 'Ver', 'ver', 'Regarder', 'regarder', '観る', '보기', 'Assistir', 'Guarda', 'Bekijk', 'Смотреть', 'İzle', 'Oglądaj', 'Tonton'],
        play: ['Spiele', 'spielen', 'Play', 'play', 'Jugar', 'jugar', 'Jouer', 'jouer', 'プレイ', '플레이', 'Jogar', 'Gioca', 'Speel', 'Играть', 'Oyna', 'Graj', 'Main'],
        claimed: ['beansprucht', 'claimed', 'reclamad', 'réclamé', '請求済み', '청구됨', 'reivindicad', 'riscosso', 'geclaimd', 'получено', 'talep edildi', 'odebrano', 'dituntut'],
        showCode: ['Code anzeigen', 'Show Code', 'Mostrar código', 'Afficher le code', 'コードを表示', '코드 표시', 'Mostrar código', 'Mostra codice', 'Code tonen', 'Показать код', 'Kodu göster', 'Pokaż kod', 'Tunjukkan kod'],
        claimReward: ['Belohnung anzeigen', 'Claim Reward', 'Reclamar recompensa', 'Réclamer la récompense', '報酬を請求', '보상 받기', 'Reivindicar recompensa', 'Riscuoti ricompensa', 'Beloning claimen', 'Получить награду', 'Ödülü talep et', 'Odbierz nagrodę', 'Tuntut ganjaran'],
        questAccepted: ['Quest angenommen', 'Quest accepted', 'Misión aceptada', 'Quête acceptée', 'クエスト受諾済み', '퀘스트 수락됨', 'Missão aceita', 'Quest accettata', 'Quest geaccepteerd', 'Задание принято', 'Görev kabul edildi', 'Zadanie zaakceptowane', 'Pencarian diterima'],
        ends: ['Endet', 'Ends', 'Termina', 'Se termine', '終了', '종료', 'Termina', 'Termina', 'Eindigt', 'Заканчивается', 'Bitiş', 'Kończy się', 'Berakhir'],
        questEndsOn: ['Quest endet am', 'Quest ends on', 'La misión termina el', 'La quête se termine le', 'クエスト終了日', '퀘스트 종료일', 'A missão termina em', 'La quest termina il', 'Quest eindigt op', 'Задание заканчивается', 'Görev bitiş tarihi', 'Zadanie kończy się', 'Pencarian berakhir pada'],
        suggested: ['Empfohlen', 'Suggested', 'Sugerido', 'Suggéré', 'おすすめ', '추천', 'Sugerido', 'Consigliato', 'Aanbevolen', 'Рекомендуемые', 'Önerilen', 'Sugerowane', 'Dicadangkan'],
        newest: ['Neueste', 'Most Recent', 'Más reciente', 'Plus récent', '最新', '최신', 'Mais recente', 'Più recente', 'Nieuwste', 'Самые новые', 'En yeni', 'Najnowsze', 'Terbaru'],
        rewardClaimed: ['Du hast diese Belohnung', 'You claimed this reward', 'Reclamaste esta recompensa', 'Vous avez réclamé cette récompense', 'この報酬を請求しました', '이 보상을 받았습니다', 'Você reivindicou esta recompensa', 'Hai riscosso questa ricompensa', 'Je hebt deze beloning geclaimd', 'Вы получили эту награду', 'Bu ödülü talep ettiniz', 'Odebrałeś tę nagrodę', 'Anda menuntut ganjaran ini']
    };

    // Default settings
    const defaultSettings = {
        colorCoding: true,
        hideExpired: true,
        hideClaimed: true,
        hideNoOrbs: false,
        hideWithOrbs: false,
        autoSortNewest: true,
        yellowBorder: true,
        redBorder: true,
        greenBorder: true,
        blueBorder: true,
        language: 'de'
    };

    // Load settings
    let settings = {};
    for (let key in defaultSettings) {
        settings[key] = GM_getValue(key, defaultSettings[key]);
    }

    let t = translations[settings.language] || translations.de;

    // Save settings
    function saveSetting(key, value) {
        settings[key] = value;
        GM_setValue(key, value);
        
        if (key === 'language') {
            t = translations[value] || translations.de;
        }
    }

    // Check if text contains any keyword
    function containsAnyKeyword(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    // Menu CSS
    const menuStyles = `
        #quest-filter-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2d31;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            min-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        }

        #quest-filter-menu.show {
            display: block;
        }

        #quest-filter-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: none;
        }

        #quest-filter-overlay.show {
            display: block;
        }

        .menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #404249;
        }

        .menu-title {
            font-size: 20px;
            font-weight: 600;
            color: #f2f3f5;
        }

        .menu-close {
            cursor: pointer;
            color: #b5bac1;
            font-size: 24px;
            line-height: 1;
            padding: 5px 10px;
        }

        .menu-close:hover {
            color: #f2f3f5;
        }

        .menu-section {
            margin-bottom: 20px;
        }

        .menu-section.collapsed .menu-section-content {
            display: none;
        }

        .menu-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #b5bac1;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .menu-section-content {
            transition: all 0.3s ease;
        }

        .menu-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #1e1f22;
            border-radius: 4px;
        }

        .menu-option:hover {
            background: #35373c;
        }

        .menu-option-label {
            color: #f2f3f5;
            font-size: 14px;
            flex: 1;
        }

        .menu-option-description {
            color: #949ba4;
            font-size: 12px;
            margin-top: 4px;
        }

        .toggle-switch {
            position: relative;
            width: 44px;
            height: 24px;
            background: #4e5058;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .toggle-switch.active {
            background: #5865f2;
        }

        .toggle-switch::after {
            content: '';
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            top: 3px;
            left: 3px;
            transition: left 0.2s;
        }

        .toggle-switch.active::after {
            left: 23px;
        }

        .color-preview {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            margin-right: 10px;
        }

        .menu-button-container {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #404249;
        }

        .menu-button {
            padding: 10px 16px;
            border-radius: 4px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }

        .menu-button-primary {
            background: #5865f2;
            color: white;
        }

        .menu-button-primary:hover {
            background: #4752c4;
        }

        .menu-button-secondary {
            background: #4e5058;
            color: white;
        }

        .menu-button-secondary:hover {
            background: #6d6f78;
        }

        #quest-filter-button-custom {
            margin-right: 8px;
        }

        #quest-filter-button-custom .icon_a22cb0 {
            transition: transform 0.2s;
        }

        #quest-filter-button-custom:hover .icon_a22cb0 {
            transform: rotate(90deg);
        }

        .language-select {
            width: 100%;
            padding: 8px 12px;
            background: #1e1f22;
            border: 1px solid #404249;
            border-radius: 4px;
            color: #f2f3f5;
            font-size: 14px;
            cursor: pointer;
        }

        .language-select:hover {
            border-color: #5865f2;
        }

        .language-select option {
            background: #2b2d31;
            color: #f2f3f5;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = menuStyles;
    document.head.appendChild(styleElement);

    // Menu creation
    function createMenu() {
        const overlay = document.createElement('div');
        overlay.id = 'quest-filter-overlay';
        overlay.addEventListener('click', closeMenu);

        const menu = document.createElement('div');
        menu.id = 'quest-filter-menu';
        updateMenuContent(menu);

        document.body.appendChild(overlay);
        document.body.appendChild(menu);

        setupMenuEventListeners(menu);
    }

    function updateMenuContent(menu) {
        menu.innerHTML = `
            <div class="menu-header">
                <div class="menu-title">${t.menuTitle}</div>
                <div class="menu-close">×</div>
            </div>

            <div class="menu-section">
                <div class="menu-section-title">${t.sectionLanguage}</div>
                <div class="menu-section-content">
                    <div class="menu-option">
                        <div style="flex: 1;">
                            <div class="menu-option-label">${t.selectLanguage}</div>
                            <div class="menu-option-description">${t.selectLanguageDesc}</div>
                        </div>
                    </div>
                    <select class="language-select" id="language-select">
                        <option value="de" ${settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Español</option>
                        <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                    </select>
                </div>
            </div>

            <div class="menu-section">
                <div class="menu-section-title">${t.sectionGeneral}</div>
                <div class="menu-section-content">
                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.enableColorCoding}</div>
                            <div class="menu-option-description">${t.enableColorCodingDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.colorCoding ? 'active' : ''}" data-setting="colorCoding"></div>
                    </div>

                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.autoSortNewest}</div>
                            <div class="menu-option-description">${t.autoSortNewestDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.autoSortNewest ? 'active' : ''}" data-setting="autoSortNewest"></div>
                    </div>
                </div>
            </div>

            <div class="menu-section">
                <div class="menu-section-title">${t.sectionHide}</div>
                <div class="menu-section-content">
                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.hideExpired}</div>
                            <div class="menu-option-description">${t.hideExpiredDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.hideExpired ? 'active' : ''}" data-setting="hideExpired"></div>
                    </div>

                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.hideClaimed}</div>
                            <div class="menu-option-description">${t.hideClaimedDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.hideClaimed ? 'active' : ''}" data-setting="hideClaimed"></div>
                    </div>

                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.hideNoOrbs}</div>
                            <div class="menu-option-description">${t.hideNoOrbsDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.hideNoOrbs ? 'active' : ''}" data-setting="hideNoOrbs"></div>
                    </div>

                    <div class="menu-option">
                        <div>
                            <div class="menu-option-label">${t.hideWithOrbs}</div>
                            <div class="menu-option-description">${t.hideWithOrbsDesc}</div>
                        </div>
                        <div class="toggle-switch ${settings.hideWithOrbs ? 'active' : ''}" data-setting="hideWithOrbs"></div>
                    </div>
                </div>
            </div>

            <div class="menu-section ${!settings.colorCoding ? 'collapsed' : ''}" id="color-section">
                <div class="menu-section-title">${t.sectionColors}</div>
                <div class="menu-section-content">
                    <div class="menu-option">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <div class="color-preview" style="background: linear-gradient(135deg, ${colors.green.primary}, ${colors.green.secondary}); border: 2px solid ${colors.green.secondary};"></div>
                            <div>
                                <div class="menu-option-label">${t.greenBorder}</div>
                                <div class="menu-option-description">${t.greenBorderDesc}</div>
                            </div>
                        </div>
                        <div class="toggle-switch ${settings.greenBorder ? 'active' : ''}" data-setting="greenBorder"></div>
                    </div>

                    <div class="menu-option">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <div class="color-preview" style="background: linear-gradient(135deg, ${colors.yellow.primary}, ${colors.yellow.secondary}); border: 2px solid ${colors.yellow.secondary};"></div>
                            <div>
                                <div class="menu-option-label">${t.yellowBorder}</div>
                                <div class="menu-option-description">${t.yellowBorderDesc}</div>
                            </div>
                        </div>
                        <div class="toggle-switch ${settings.yellowBorder ? 'active' : ''}" data-setting="yellowBorder"></div>
                    </div>

                    <div class="menu-option">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <div class="color-preview" style="background: linear-gradient(135deg, ${colors.red.primary}, ${colors.red.secondary}); border: 2px solid ${colors.red.secondary};"></div>
                            <div>
                                <div class="menu-option-label">${t.redBorder}</div>
                                <div class="menu-option-description">${t.redBorderDesc}</div>
                            </div>
                        </div>
                        <div class="toggle-switch ${settings.redBorder ? 'active' : ''}" data-setting="redBorder"></div>
                    </div>

                    <div class="menu-option">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <div class="color-preview" style="background: linear-gradient(135deg, ${colors.blue.primary}, ${colors.blue.secondary}); border: 2px solid ${colors.blue.secondary};"></div>
                            <div>
                                <div class="menu-option-label">${t.blueBorder}</div>
                                <div class="menu-option-description">${t.blueBorderDesc}</div>
                            </div>
                        </div>
                        <div class="toggle-switch ${settings.blueBorder ? 'active' : ''}" data-setting="blueBorder"></div>
                    </div>
                </div>
            </div>

            <div class="menu-button-container">
                <button class="menu-button menu-button-secondary" id="reset-settings">${t.buttonReset}</button>
                <button class="menu-button menu-button-primary" id="apply-settings">${t.buttonApply}</button>
            </div>
        `;
    }

    function setupMenuEventListeners(menu) {
        menu.querySelector('.menu-close').addEventListener('click', closeMenu);
        
        const languageSelect = menu.querySelector('#language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', function() {
                saveSetting('language', this.value);
                updateMenuContent(menu);
                setupMenuEventListeners(menu);
                updateButtonText();
            });
        }
        
        menu.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const setting = this.getAttribute('data-setting');
                const value = this.classList.contains('active');
                saveSetting(setting, value);
                
                if (setting === 'colorCoding') {
                    const colorSection = menu.querySelector('#color-section');
                    if (colorSection) {
                        if (value) {
                            colorSection.classList.remove('collapsed');
                        } else {
                            colorSection.classList.add('collapsed');
                        }
                    }
                }
            });
        });

        const applyButton = menu.querySelector('#apply-settings');
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                closeMenu();
                styleQuests();
            });
        }

        const resetButton = menu.querySelector('#reset-settings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm(t.confirmReset)) {
                    for (let key in defaultSettings) {
                        saveSetting(key, defaultSettings[key]);
                    }
                    closeMenu();
                    location.reload();
                }
            });
        }
    }

    function openMenu() {
        document.getElementById('quest-filter-overlay').classList.add('show');
        document.getElementById('quest-filter-menu').classList.add('show');
    }

    function closeMenu() {
        document.getElementById('quest-filter-overlay').classList.remove('show');
        document.getElementById('quest-filter-menu').classList.remove('show');
    }

    function updateButtonText() {
        const button = document.getElementById('quest-filter-button-custom');
        if (button) {
            const span = button.querySelector('.lineClamp1__4bd52');
            if (span) {
                span.textContent = t.buttonText;
            }
        }
    }

    // Add menu button
    function addMenuButton() {
        const headingControls = document.querySelector('.headingControls__57454');
        if (!headingControls || document.getElementById('quest-filter-button-custom')) return;

        const button = document.createElement('button');
        button.id = 'quest-filter-button-custom';
        button.setAttribute('data-mana-component', 'button');
        button.setAttribute('role', 'button');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-expanded', 'false');
        button.className = 'button_a22cb0 sm_a22cb0 secondary_a22cb0 hasText_a22cb0';
        
        button.innerHTML = `
            <div class="buttonChildrenWrapper_a22cb0">
                <div class="buttonChildren_a22cb0">
                    <span class="lineClamp1__4bd52 text-sm/medium_cf4812" data-text-variant="text-sm/medium">${t.buttonText}</span>
                    <svg class="icon_a22cb0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1Z" class=""></path>
                    </svg>
                </div>
            </div>
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMenu();
        });

        headingControls.insertBefore(button, headingControls.firstChild);
    }

    // Parse date (multi-language support)
    function parseEndDate(dateString) {
        const match = dateString.match(/(\d{1,2})[\.\/-](\d{1,2})[\.\/-]?(\d{2,4})?/);
        if (!match) return null;
        
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const currentYear = new Date().getFullYear();
        const year = match[3] ? (match[3].length === 2 ? 2000 + parseInt(match[3]) : parseInt(match[3])) : currentYear;
        
        const endDate = new Date(year, month, day, 23, 59, 59);
        
        return endDate;
    }

    // Check expired (multi-language)
    function isQuestExpired(tile) {
        if (!settings.hideExpired) return false;
        
        const now = new Date();
        const bottomRow = tile.querySelector('.bottomRow_b5b7aa');
        if (bottomRow) {
            const dateText = bottomRow.textContent;
            if (containsAnyKeyword(dateText, discordKeywords.ends)) {
                const endDate = parseEndDate(dateText);
                if (endDate && now > endDate) {
                    return true;
                }
            }
        }
        
        const buttons = tile.querySelectorAll('button');
        for (const button of buttons) {
            const text = button.textContent;
            if (containsAnyKeyword(text, discordKeywords.questEndsOn)) {
                const endDate = parseEndDate(text);
                if (endDate && now > endDate) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // Check claimed (multi-language)
    function isQuestClaimed(tile) {
        if (!settings.hideClaimed) return false;
        
        const description = tile.textContent;
        
        if (containsAnyKeyword(description, discordKeywords.rewardClaimed) && containsAnyKeyword(description, discordKeywords.claimed)) {
            return true;
        }
        
        const buttons = tile.querySelectorAll('button');
        for (const button of buttons) {
            const text = button.textContent;
            if (containsAnyKeyword(text, discordKeywords.showCode)) {
                return true;
            }
        }
        
        const confetti = tile.querySelector('.confetti__956c6');
        if (confetti) {
            return true;
        }
        
        const progressCircles = tile.querySelectorAll('.progress__146e2');
        for (const circle of progressCircles) {
            const style = circle.getAttribute('style');
            if (style && style.includes('stroke-dashoffset: 0') && 
                circle.getAttribute('stroke') === 'var(--green-330)') {
                return true;
            }
        }
        
        return false;
    }

    // Auto sort (multi-language)
    function changeDefaultSorting() {
        if (!settings.autoSortNewest) return;
        
        setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.textContent;
                if (containsAnyKeyword(text, discordKeywords.suggested)) {
                    btn.click();
                    
                    setTimeout(() => {
                        const menuItems = document.querySelectorAll('[role="menuitem"], [role="option"]');
                        menuItems.forEach(item => {
                            if (containsAnyKeyword(item.textContent, discordKeywords.newest)) {
                                item.click();
                            }
                        });
                    }, 200);
                }
            });
        }, 1500);
    }

    // Priority sorting (multi-language)
    function getQuestPriority(tile) {
        const description = tile.textContent;
        const hasOrbsImage = tile.querySelector('.orbIconSVG__85200, .orbsBalanceIcon__956c6, img[src*="39556a7eb79145be.svg"]');
        const hasOrbs = hasOrbsImage !== null;
        
        const rewardButton = tile.querySelector('button:not([disabled])');
        const isCompleted = rewardButton && containsAnyKeyword(rewardButton.textContent, discordKeywords.claimReward);
        
        const isWatch = containsAnyKeyword(description, discordKeywords.watch) || tile.querySelector('[aria-label*="lay"]') !== null;
        
        const isPlay = containsAnyKeyword(description, discordKeywords.play);
        
        if (isWatch && settings.greenBorder) return 1;
        if (hasOrbs && isPlay && settings.yellowBorder) return 2;
        if (!hasOrbs && settings.redBorder) return 3;
        if (isCompleted && settings.blueBorder) return 4;
        
        return 5;
    }

    // Style quests
    function styleQuests() {
        const questContainer = document.querySelector('.container__60f82');
        if (!questContainer) return;
        
        const questTiles = Array.from(document.querySelectorAll('[id^="quest-tile-"]'));
        
        questTiles.sort((a, b) => {
            const priorityA = getQuestPriority(a);
            const priorityB = getQuestPriority(b);
            return priorityA - priorityB;
        });
        
        questTiles.forEach((tile, index) => {
            const description = tile.textContent;
            
            const hasOrbsImage = tile.querySelector('.orbIconSVG__85200, .orbsBalanceIcon__956c6, img[src*="39556a7eb79145be.svg"]');
            const hasOrbs = hasOrbsImage !== null;
            
            const isClaimed = isQuestClaimed(tile);
            const isExpired = isQuestExpired(tile);
            
            if (isClaimed) {
                tile.style.display = 'none';
                return;
            }
            
            if (isExpired) {
                tile.style.display = 'none';
                return;
            }
            
            if (settings.hideNoOrbs && !hasOrbs) {
                tile.style.display = 'none';
                return;
            }
            
            if (settings.hideWithOrbs && hasOrbs) {
                tile.style.display = 'none';
                return;
            }
            
            tile.style.display = '';
            questContainer.appendChild(tile);
            
            if (!settings.colorCoding) {
                const container = tile.querySelector('.container_cec934') || tile;
                container.style.border = '';
                container.style.boxShadow = '';
                container.style.borderRadius = '';
                return;
            }
            
            const rewardButton = tile.querySelector('button:not([disabled])');
            const isCompleted = rewardButton && containsAnyKeyword(rewardButton.textContent, discordKeywords.claimReward);
            
            const isWatch = containsAnyKeyword(description, discordKeywords.watch) || tile.querySelector('[aria-label*="lay"]') !== null;
            
            const isPlay = containsAnyKeyword(description, discordKeywords.play);
            
            const container = tile.querySelector('.container_cec934') || tile;
            
            container.style.border = '';
            container.style.boxShadow = '';
            container.style.borderRadius = '';
            
            if (isWatch && settings.greenBorder) {
                container.style.border = `4px solid ${colors.green.primary}`;
                container.style.boxShadow = `0 0 15px ${colors.green.glow}`;
                container.style.borderRadius = '12px';
            } else if (hasOrbs && isPlay && settings.yellowBorder) {
                container.style.border = `4px solid ${colors.yellow.primary}`;
                container.style.boxShadow = `0 0 15px ${colors.yellow.glow}`;
                container.style.borderRadius = '12px';
            } else if (!hasOrbs && settings.redBorder) {
                container.style.border = `4px solid ${colors.red.primary}`;
                container.style.boxShadow = `0 0 15px ${colors.red.glow}`;
                container.style.borderRadius = '12px';
            } else if (isCompleted && settings.blueBorder) {
                container.style.border = `4px solid ${colors.blue.primary}`;
                container.style.boxShadow = `0 0 15px ${colors.blue.glow}`;
                container.style.borderRadius = '12px';
            }
        });
    }

    // Observer
    const observer = new MutationObserver((mutations) => {
        const hasNewQuests = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === 1) {
                    return node.id?.startsWith('quest-tile-') || 
                           node.querySelector?.('[id^="quest-tile-"]');
                }
                return false;
            });
        });
        
        if (hasNewQuests) {
            setTimeout(styleQuests, 300);
        }
        
        if (!document.getElementById('quest-filter-button-custom')) {
            addMenuButton();
        }
    });

    // Init
    function waitForQuests() {
        const questContainer = document.querySelector('.container__60f82');
        
        if (questContainer) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            styleQuests();
            changeDefaultSorting();
            
            setTimeout(addMenuButton, 500);
            
            let attempts = 0;
            const buttonInterval = setInterval(() => {
                if (document.getElementById('quest-filter-button-custom') || attempts > 10) {
                    clearInterval(buttonInterval);
                } else {
                    addMenuButton();
                    attempts++;
                }
            }, 1000);
        } else {
            setTimeout(waitForQuests, 500);
        }
    }

    createMenu();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForQuests);
    } else {
        waitForQuests();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/quest-home')) {
                setTimeout(() => {
                    waitForQuests();
                }, 1000);
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
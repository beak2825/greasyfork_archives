// ==UserScript==
// @name         LOLZ.live - Новогодний вайб ❄️🎄
// @namespace    https://lolz.live/
// @version      1.0.4
// @description  Добавляет снег, гирлянды и новогоднюю атмосферу на форум
// @author       Kefisto
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557989/LOLZlive%20-%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%B2%D0%B0%D0%B9%D0%B1%20%E2%9D%84%EF%B8%8F%F0%9F%8E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/557989/LOLZlive%20-%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%B2%D0%B0%D0%B9%D0%B1%20%E2%9D%84%EF%B8%8F%F0%9F%8E%84.meta.js
// ==/UserScript==

const XMAS_CONFIG = {
    // Снег
    snowflakeCount: 120,
    snowSpeed: { min: 0.4, max: 1.2 },
    snowSize: { min: 10, max: 22 },
    snowWind: 0.5,
    snowOpacity: { min: 0.4, max: 1 },
    snowEverywhere: false,

    // Границы контента (в процентах)
    contentZone: { left: 27, right: 73 },

    // Гирлянды
    enableGarland: true,
    garlandColors: ['#ff0000', '#ffd700', '#00ff00', '#00bfff', '#ff69b4', '#ff4500'],

    // Курсор-снежинка
    enableSnowCursor: false,

    // Следы от курсора
    enableCursorTrail: true,
};

// Загрузка сохранённых настроек
function xmasLoadSettings() {
    return {
        snow: GM_getValue('xmas_snow', true),
        snowEverywhere: GM_getValue('xmas_snowEverywhere', XMAS_CONFIG.snowEverywhere),
        garland: GM_getValue('xmas_garland', XMAS_CONFIG.enableGarland),
        cursor: GM_getValue('xmas_cursor', XMAS_CONFIG.enableSnowCursor),
        trail: GM_getValue('xmas_trail', XMAS_CONFIG.enableCursorTrail)
    };
}

// Сохранение настройки
function xmasSaveSetting(key, value) {
    GM_setValue('xmas_' + key, value);
}

// Состояние настроек (загружаем из хранилища)
const xmasSettingsState = xmasLoadSettings();

// Применяем загруженные настройки к конфигу
XMAS_CONFIG.snowEverywhere = xmasSettingsState.snowEverywhere;
XMAS_CONFIG.enableGarland = xmasSettingsState.garland;
XMAS_CONFIG.enableSnowCursor = xmasSettingsState.cursor;
XMAS_CONFIG.enableCursorTrail = xmasSettingsState.trail;

GM_addStyle(`
    /* Контейнер для снега */
    #xmas-snow-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
        overflow: hidden;
    }

    /* Снежинка */
    .xmas-snowflake {
        position: absolute;
        color: #fff;
        text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        user-select: none;
        animation: xmas-snowfall linear infinite, xmas-sway ease-in-out infinite;
        will-change: transform;
    }

    @keyframes xmas-snowfall {
        0% {
            transform: translateY(-30px) rotate(0deg);
            opacity: 0;
        }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% {
            transform: translateY(calc(100vh - 40px)) rotate(180deg);
            opacity: 0;
        }
    }

    @keyframes xmas-sway {
        0%, 100% { margin-left: 0; }
        20% { margin-left: 25px; }
        40% { margin-left: -15px; }
        60% { margin-left: 20px; }
        80% { margin-left: -20px; }
    }

    /* Гирлянда */
    #xmas-garland {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 45px;
        z-index: 99998;
        pointer-events: none;
        overflow: visible;
    }

    #xmas-garland-wire {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 35px;
    }

    #xmas-garland-wire path {
        fill: none;
        stroke: #1a3d0c;
        stroke-width: 2;
        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
    }

    #xmas-garland-lights {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 45px;
    }

    .xmas-garland-light {
        position: absolute;
        width: 10px;
        height: 14px;
        border-radius: 50% 50% 50% 50% / 55% 55% 45% 45%;
        animation: xmas-glow 0.8s ease-in-out infinite alternate;
        filter: blur(0.3px);
    }

    .xmas-garland-light::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 3px;
        height: 4px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        filter: blur(1px);
    }

    .xmas-garland-light::after {
        content: '';
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 5px;
        background: linear-gradient(to bottom, #4a7c23, #2d5016);
        border-radius: 2px 2px 0 0;
        box-shadow: inset 0 -1px 2px rgba(0,0,0,0.3);
    }

    .xmas-garland-light.color-red {
        background: radial-gradient(ellipse at 30% 30%, #ff6b6b, #ff0000 40%, #cc0000);
        box-shadow: 0 0 5px #ff0000, 0 0 10px rgba(255,0,0,0.5);
    }
    .xmas-garland-light.color-gold {
        background: radial-gradient(ellipse at 30% 30%, #fff4a3, #ffd700 40%, #daa520);
        box-shadow: 0 0 5px #ffd700, 0 0 10px rgba(255,215,0,0.5);
    }
    .xmas-garland-light.color-green {
        background: radial-gradient(ellipse at 30% 30%, #90ee90, #00ff00 40%, #00cc00);
        box-shadow: 0 0 5px #00ff00, 0 0 10px rgba(0,255,0,0.5);
    }
    .xmas-garland-light.color-blue {
        background: radial-gradient(ellipse at 30% 30%, #87ceeb, #00bfff 40%, #0099cc);
        box-shadow: 0 0 5px #00bfff, 0 0 10px rgba(0,191,255,0.5);
    }
    .xmas-garland-light.color-pink {
        background: radial-gradient(ellipse at 30% 30%, #ffb6c1, #ff69b4 40%, #ff1493);
        box-shadow: 0 0 5px #ff69b4, 0 0 10px rgba(255,105,180,0.5);
    }
    .xmas-garland-light.color-orange {
        background: radial-gradient(ellipse at 30% 30%, #ffc04d, #ff8c00 40%, #ff6600);
        box-shadow: 0 0 5px #ff8c00, 0 0 10px rgba(255,140,0,0.5);
    }

    @keyframes xmas-glow {
        0% { opacity: 0.7; filter: brightness(0.85) blur(0.3px); }
        100% { opacity: 1; filter: brightness(1.2) blur(0.3px); }
    }

    /* Курсор-снежинка */
    .xmas-snow-cursor, .xmas-snow-cursor * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='0' y='20' font-size='20'%3E❄️%3C/text%3E%3C/svg%3E") 12 12, auto !important;
    }

    /* След от курсора */
    .xmas-cursor-particle {
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        font-size: 14px;
        animation: xmas-particle-fade 1s ease-out forwards;
        user-select: none;
    }

    @keyframes xmas-particle-fade {
        0% { opacity: 1; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0.3) translateY(20px); }
    }

    /* Снежинки разных типов */
    .xmas-snowflake.type-1::before { content: '❄'; }
    .xmas-snowflake.type-2::before { content: '❅'; }
    .xmas-snowflake.type-3::before { content: '❆'; }
    .xmas-snowflake.type-4::before { content: '✻'; }
    .xmas-snowflake.type-5::before { content: '❄'; }
    .xmas-snowflake.type-6::before { content: '❅'; }

    /* ========== СТИЛИ ДЛЯ МОДАЛЬНОГО ОКНА НАСТРОЕК ========== */
    .xmas-settings-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .xmas-setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s;
    }

    .xmas-setting-row:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .xmas-setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #e0e0e0;
    }

    .xmas-setting-label span {
        font-size: 16px;
    }

    /* Компактный переключатель */
    .xmas-switch {
        position: relative;
        width: 36px;
        height: 20px;
    }

    .xmas-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .xmas-switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #3a3a3a;
        border-radius: 10px;
        transition: 0.2s;
    }

    .xmas-switch-slider::before {
        content: '';
        position: absolute;
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background: #888;
        border-radius: 50%;
        transition: 0.2s;
    }

    .xmas-switch input:checked + .xmas-switch-slider {
        background: #4CAF50;
    }

    .xmas-switch input:checked + .xmas-switch-slider::before {
        transform: translateX(16px);
        background: #fff;
    }

    /* Кнопка в меню настроек форума */
    #xmas-settings-link {
        position: relative;
        overflow: hidden;
    }

    #xmas-settings-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent);
        animation: xmas-menu-shimmer 3s infinite;
    }

    @keyframes xmas-menu-shimmer {
        0% { left: -100%; }
        50%, 100% { left: 100%; }
    }

    #xmas-settings-link .SvgIcon svg {
        color: #4CAF50 !important;
    }

    #xmas-settings-link:hover .SvgIcon svg {
        color: #8BC34A !important;
    }
`);

function xmasCreateSnowContainer() {
    const container = document.createElement('div');
    container.id = 'xmas-snow-container';
    document.body.appendChild(container);
    return container;
}

let xmasCachedContentBounds = null;

function xmasUpdateContentBounds() {
    const screenWidth = window.innerWidth;

    let contentLeft = screenWidth;
    let contentRight = 0;
    let foundElements = [];

    const contentElements = document.querySelectorAll('.mainContainer, .sidebar, #content > .pageContent, .p-body-main > .p-body-content');

    for (const el of contentElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 100) {
            contentLeft = Math.min(contentLeft, rect.left);
            contentRight = Math.max(contentRight, rect.right);
            foundElements.push(el.className.split(' ')[0]);
        }
    }

    if (contentLeft >= contentRight) {
        const mainContent = document.querySelector('#content, .p-body-main');
        if (mainContent) {
            const children = mainContent.children;
            for (const child of children) {
                const rect = child.getBoundingClientRect();
                const style = window.getComputedStyle(child);
                if (rect.width > 200 && rect.width < screenWidth * 0.95 && style.position !== 'fixed') {
                    contentLeft = Math.min(contentLeft, rect.left);
                    contentRight = Math.max(contentRight, rect.right);
                    foundElements.push(child.className.split(' ')[0] || child.tagName);
                }
            }
        }
    }

    if (contentLeft >= contentRight || contentRight - contentLeft > screenWidth * 0.9) {
        contentLeft = screenWidth * 0.15;
        contentRight = screenWidth * 0.85;
        console.log('🎄 Fallback bounds used');
    }

    console.log('🎄 Found elements:', foundElements.join(', '), '| Bounds:', Math.round(contentLeft), '-', Math.round(contentRight), 'px');

    xmasCachedContentBounds = {
        contentLeft: (contentLeft / screenWidth) * 100,
        contentRight: (contentRight / screenWidth) * 100,
        screenWidth: screenWidth
    };

    console.log('🎄 Snow zones: 0-' + xmasCachedContentBounds.contentLeft.toFixed(1) + '% and ' + xmasCachedContentBounds.contentRight.toFixed(1) + '-100%');

    return xmasCachedContentBounds;
}

function xmasGetSnowflakeX() {
    if (XMAS_CONFIG.snowEverywhere) {
        return Math.random() * 100;
    }

    if (!xmasCachedContentBounds || xmasCachedContentBounds.screenWidth !== window.innerWidth) {
        xmasUpdateContentBounds();
    }

    const bounds = xmasCachedContentBounds;

    const leftZoneEnd = Math.max(0, bounds.contentLeft - 1);
    const rightZoneStart = Math.min(100, bounds.contentRight + 1);
    const rightZoneWidth = 100 - rightZoneStart;

    const totalFreeSpace = leftZoneEnd + rightZoneWidth;

    if (totalFreeSpace < 3) {
        return Math.random() < 0.5 ? Math.random() * 3 : 97 + Math.random() * 3;
    }

    if (Math.random() < leftZoneEnd / totalFreeSpace) {
        return Math.random() * leftZoneEnd;
    } else {
        return rightZoneStart + Math.random() * rightZoneWidth;
    }
}

function xmasCreateSnowflake(container) {
    const snowflake = document.createElement('div');
    snowflake.className = `xmas-snowflake type-${Math.ceil(Math.random() * 6)}`;

    const size = XMAS_CONFIG.snowSize.min + Math.random() * (XMAS_CONFIG.snowSize.max - XMAS_CONFIG.snowSize.min);
    const speed = XMAS_CONFIG.snowSpeed.min + Math.random() * (XMAS_CONFIG.snowSpeed.max - XMAS_CONFIG.snowSpeed.min);
    const opacity = XMAS_CONFIG.snowOpacity.min + Math.random() * (XMAS_CONFIG.snowOpacity.max - XMAS_CONFIG.snowOpacity.min);
    const startX = xmasGetSnowflakeX();
    const delay = Math.random() * 10;
    const swayDuration = 3 + Math.random() * 4;

    snowflake.style.cssText = `
        left: ${startX}%;
        font-size: ${size}px;
        opacity: ${opacity};
        animation-duration: ${15 / speed}s, ${swayDuration}s;
        animation-delay: -${delay}s, -${Math.random() * swayDuration}s;
    `;

    container.appendChild(snowflake);
    return snowflake;
}

function xmasInitSnow() {
    const container = xmasCreateSnowContainer();
    for (let i = 0; i < XMAS_CONFIG.snowflakeCount; i++) {
        xmasCreateSnowflake(container);
    }
}

function xmasRegenerateSnow() {
    xmasCachedContentBounds = null;
    xmasUpdateContentBounds();

    const container = document.getElementById('xmas-snow-container');
    if (container) {
        container.innerHTML = '';
        for (let i = 0; i < XMAS_CONFIG.snowflakeCount; i++) {
            xmasCreateSnowflake(container);
        }
    }
}

function xmasCreateGarland() {
    if (!XMAS_CONFIG.enableGarland) return;

    const garland = document.createElement('div');
    garland.id = 'xmas-garland';

    const width = window.innerWidth;
    const segmentWidth = 50;
    const lightCount = Math.floor(width / segmentWidth);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.id = 'xmas-garland-wire';
    svg.setAttribute('viewBox', `0 0 ${width} 35`);
    svg.setAttribute('preserveAspectRatio', 'none');

    let pathD = `M 0 3`;
    for (let i = 0; i < lightCount; i++) {
        const x1 = i * segmentWidth + segmentWidth * 0.5;
        const x2 = (i + 1) * segmentWidth;
        const sag = 14 + Math.sin(i * 0.5) * 4;
        pathD += ` Q ${x1} ${sag}, ${x2} 3`;
    }

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute('d', pathD);
    svg.appendChild(path);
    garland.appendChild(svg);

    const lightsContainer = document.createElement('div');
    lightsContainer.id = 'xmas-garland-lights';

    const colorClasses = ['color-red', 'color-gold', 'color-green', 'color-blue', 'color-pink', 'color-orange'];

    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = `xmas-garland-light ${colorClasses[i % colorClasses.length]}`;

        const x = i * segmentWidth + segmentWidth * 0.5;
        const y = 10 + Math.sin(i * 0.5) * 4;

        light.style.left = `${x - 5}px`;
        light.style.top = `${y}px`;
        light.style.animationDelay = `${(i * 0.15) % 0.8}s`;

        lightsContainer.appendChild(light);
    }

    garland.appendChild(lightsContainer);
    document.body.appendChild(garland);
}

function xmasEnableSnowCursor() {
    if (!XMAS_CONFIG.enableSnowCursor) return;
    document.body.classList.add('xmas-snow-cursor');
}

let xmasLastParticleTime = 0;
const xmasParticleSymbols = ['❄', '✦', '✧', '⋆', '｡', '°'];

function xmasCreateCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'xmas-cursor-particle';
    particle.textContent = xmasParticleSymbols[Math.floor(Math.random() * xmasParticleSymbols.length)];
    particle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
    particle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
    particle.style.color = XMAS_CONFIG.garlandColors[Math.floor(Math.random() * XMAS_CONFIG.garlandColors.length)];

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
}

function xmasInitCursorTrail() {
    document.addEventListener('mousemove', (e) => {
        // Проверяем состояние при каждом движении мыши
        if (!XMAS_CONFIG.enableCursorTrail) return;

        const now = Date.now();
        if (now - xmasLastParticleTime > 50) {
            xmasCreateCursorParticle(e.clientX, e.clientY);
            xmasLastParticleTime = now;
        }
    });
}

function xmasGenerateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function openXmasSettings() {
    const uid = xmasGenerateId();

    // Минималистичный HTML
    const content = `
        <div class="xmas-settings-container">
            <label class="xmas-setting-row">
                <div class="xmas-setting-label"><span>❄️</span> Снег</div>
                <div class="xmas-switch">
                    <input type="checkbox" id="xmas-snow-${uid}" ${xmasSettingsState.snow ? 'checked' : ''}>
                    <span class="xmas-switch-slider"></span>
                </div>
            </label>
            <label class="xmas-setting-row">
                <div class="xmas-setting-label"><span>🌨️</span> Снег везде</div>
                <div class="xmas-switch">
                    <input type="checkbox" id="xmas-snowmode-${uid}" ${xmasSettingsState.snowEverywhere ? 'checked' : ''}>
                    <span class="xmas-switch-slider"></span>
                </div>
            </label>
            <label class="xmas-setting-row">
                <div class="xmas-setting-label"><span>💡</span> Гирлянда</div>
                <div class="xmas-switch">
                    <input type="checkbox" id="xmas-garland-${uid}" ${xmasSettingsState.garland ? 'checked' : ''}>
                    <span class="xmas-switch-slider"></span>
                </div>
            </label>
            <label class="xmas-setting-row">
                <div class="xmas-setting-label"><span>🖱️</span> Курсор-снежинка</div>
                <div class="xmas-switch">
                    <input type="checkbox" id="xmas-cursor-${uid}" ${xmasSettingsState.cursor ? 'checked' : ''}>
                    <span class="xmas-switch-slider"></span>
                </div>
            </label>
            <label class="xmas-setting-row">
                <div class="xmas-setting-label"><span>✨</span> След от курсора</div>
                <div class="xmas-switch">
                    <input type="checkbox" id="xmas-trail-${uid}" ${xmasSettingsState.trail ? 'checked' : ''}>
                    <span class="xmas-switch-slider"></span>
                </div>
            </label>
        </div>
    `;

    // Используем XenForo.alert через unsafeWindow
    unsafeWindow.XenForo.alert(content, '🎄 Новогодний вайб');

    // Добавляем обработчики после появления окна
    setTimeout(() => {
        // Снег
        const snowCheckbox = document.getElementById(`xmas-snow-${uid}`);
        if (snowCheckbox) {
            snowCheckbox.addEventListener('change', function() {
                xmasSettingsState.snow = this.checked;
                xmasSaveSetting('snow', this.checked);
                const container = document.getElementById('xmas-snow-container');
                if (container) container.style.display = this.checked ? 'block' : 'none';
            });
        }

        // Снег везде
        const snowmodeCheckbox = document.getElementById(`xmas-snowmode-${uid}`);
        if (snowmodeCheckbox) {
            snowmodeCheckbox.addEventListener('change', function() {
                xmasSettingsState.snowEverywhere = this.checked;
                XMAS_CONFIG.snowEverywhere = this.checked;
                xmasSaveSetting('snowEverywhere', this.checked);
                xmasRegenerateSnow();
            });
        }

        // Гирлянда
        const garlandCheckbox = document.getElementById(`xmas-garland-${uid}`);
        if (garlandCheckbox) {
            garlandCheckbox.addEventListener('change', function() {
                xmasSettingsState.garland = this.checked;
                xmasSaveSetting('garland', this.checked);
                const garland = document.getElementById('xmas-garland');
                if (garland) garland.style.display = this.checked ? 'block' : 'none';
            });
        }

        // Курсор-снежинка
        const cursorCheckbox = document.getElementById(`xmas-cursor-${uid}`);
        if (cursorCheckbox) {
            cursorCheckbox.addEventListener('change', function() {
                xmasSettingsState.cursor = this.checked;
                xmasSaveSetting('cursor', this.checked);
                if (this.checked) {
                    document.body.classList.add('xmas-snow-cursor');
                } else {
                    document.body.classList.remove('xmas-snow-cursor');
                }
            });
        }

        // След курсора
        const trailCheckbox = document.getElementById(`xmas-trail-${uid}`);
        if (trailCheckbox) {
            trailCheckbox.addEventListener('change', function() {
                xmasSettingsState.trail = this.checked;
                XMAS_CONFIG.enableCursorTrail = this.checked;
                xmasSaveSetting('trail', this.checked);
            });
        }
    }, 100);
}

function xmasAddSettingsMenuItem() {
    if (!window.location.pathname.startsWith('/account')) return;
    if (document.getElementById('xmas-settings-link')) return;

    const deleteLink = document.querySelector('a.redBlock[href*="hash257"]') ||
                      document.querySelector('a.redBlock') ||
                      document.querySelector('a[href*="account/market"]');

    if (!deleteLink) {
        console.log('🎄 Меню настроек не найдено');
        return;
    }

    const container = deleteLink.parentElement;

    const divider = document.createElement('span');
    divider.className = 'divider';

    const categoryBlock = document.createElement('div');
    categoryBlock.className = 'blockCategory';
    categoryBlock.innerHTML = `<span class="text">Плагины</span>`;

    const menuItem = document.createElement('a');
    menuItem.className = '';
    menuItem.href = 'javascript:void(0)';
    menuItem.id = 'xmas-settings-link';
    menuItem.innerHTML = `
        <span class="SvgIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 21L12 18L6.5 21L7.5 14L3 9.5L9.5 8.5L12 3Z" fill="#FFD700" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
        <span class="text">🎄 Новогодний вайб</span>
    `;

    container.appendChild(divider);
    container.appendChild(categoryBlock);
    container.appendChild(menuItem);

    console.log('🎄 Пункт меню добавлен в настройки');

    menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        openXmasSettings();
    });
}

function xmasFestiveConsole() {
    const amountElement = document.querySelector('.nodeNotify.newYear .amount');
    const prizeAmount = amountElement ? amountElement.textContent.trim() : '???';

    const messages = [
        `🎄 Удачи в новогоднем розыгрыше! Пусть ${prizeAmount} упадёт именно тебе! 🎄`,
        '❄️ Желаю исполнить свою мечту в новом году! ❄️',
        '🎁 Пусть новый год принесёт профит и удачные сделки! 🎁',
        '✨ Загадай желание - в новом году оно точно сбудется! ✨',
        '🎅 Дед Мороз уже проверяет твой симп... Удачи! 🎅',
        '🍀 Пусть удача будет на твоей стороне! С Новым Годом! 🍀'
    ];
    console.log('%c' + messages[Math.floor(Math.random() * messages.length)],
        'font-size: 18px; color: #00ff00; text-shadow: 1px 1px #ff0000; font-weight: bold;');
}

function xmasInit() {
    xmasInitSnow();
    xmasCreateGarland();
    xmasEnableSnowCursor();
    xmasInitCursorTrail();
    xmasAddSettingsMenuItem();
    xmasFestiveConsole();

    // Применяем сохранённые настройки
    if (!xmasSettingsState.snow) {
        const container = document.getElementById('xmas-snow-container');
        if (container) container.style.display = 'none';
    }
    if (!xmasSettingsState.garland) {
        const garland = document.getElementById('xmas-garland');
        if (garland) garland.style.display = 'none';
    }
    if (xmasSettingsState.cursor) {
        document.body.classList.add('xmas-snow-cursor');
    }

    console.log('🎄 LOLZ.live Новогодний скрипт загружен! Настройки: /account → Плагины → Новогодний вайб');

    // Пересоздание при ресайзе
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            xmasRegenerateSnow();
            // Пересоздаём гирлянду
            const oldGarland = document.getElementById('xmas-garland');
            if (oldGarland) {
                oldGarland.remove();
                xmasCreateGarland();
                if (!xmasSettingsState.garland) {
                    document.getElementById('xmas-garland').style.display = 'none';
                }
            }
        }, 250);
    });
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', xmasInit);
} else {
    xmasInit();
}

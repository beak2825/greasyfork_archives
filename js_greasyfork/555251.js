// ==UserScript==
// @name         Virtual Soccer Strength Analyzer
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.923
// @description  Калькулятор силы команд для Virtual Soccer с динамической визуализацией и аналитикой
// @author       Arne
// @match        *://*.virtualsoccer.ru/previewmatch.php*
// @match        *://*.vfleague.com/previewmatch.php*
// @match        *://*.vfliga.ru/previewmatch.php*
// @match        *://*.vfliga.com/previewmatch.php*
// @connect      virtualsoccer.ru
// @connect      vfleague.com
// @connect      vfliga.ru
// @connect      vfliga.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555251/Virtual%20Soccer%20Strength%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/555251/Virtual%20Soccer%20Strength%20Analyzer.meta.js
// ==/UserScript==

/* ----------------------------- CONFIGURATION & CONSTANTS ----------------------------- */

// Определяем базовый URL в зависимости от текущего домена
const SITE_CONFIG = (() => {
    const hostname = window.location.hostname;
    let baseUrl = 'https://www.virtualsoccer.ru'; // default
    
    if (hostname.includes('vfleague.com')) {
        baseUrl = 'https://www.vfleague.com';
    } else if (hostname.includes('vfliga.com')) {
        baseUrl = 'https://www.vfliga.com';
    } else if (hostname.includes('vfliga.ru')) {
        baseUrl = 'https://www.vfliga.ru';
    }
    
    return { BASE_URL: baseUrl };
})();

// Centralized configuration object
const CONFIG = {
    COLLISION: {
        NONE: 'none',
        WIN: 'win',
        LOSE: 'lose'
    },
    STYLES: {
        VALUES: {
            'sp': 1,
            'brazil': 3,
            'tiki': 4,
            'bb': 2,
            'kat': 5,
            'brit': 6,
            'norm': 0
        },
        LABELS: {
            norm: 'нормальный',
            sp: 'спартаковский',
            tiki: 'тики-така',
            brazil: 'бразильский',
            brit: 'британский',
            bb: 'бей-беги',
            kat: 'катеначчо'
        },
        ORDER: ['norm', 'sp', 'tiki', 'brazil', 'brit', 'bb', 'kat']
    },
    WEATHER: {
        OPTIONS: ["очень жарко", "жарко", "солнечно", "облачно", "пасмурно", "дождь", "снег"],
        TEMP_MAP: {
            "очень жарко": [30, 26],
            "жарко": [29, 15],
            "солнечно": [29, 10],
            "облачно": [25, 5],
            "пасмурно": [20, 1],
            "дождь": [15, 1],
            "снег": [4, 0]
        }
    },
    BONUSES: {
        MORALE: {
            SUPER_DEFAULT: 0.27,
            REST_DEFAULT: -0.1
        },
        HOME: {
            100: 0.15,
            90: 0.10,
            80: 0.05,
            DEFAULT: 0.025
        },
        POSITION_BONUS_TABLE: {
            // стиль команды: {позиция: коэффициент}
            bb: { ST: 0.11, CF: 0.06, LF: 0.00, RF: 0.00, AM: -0.05, CM: -0.05, DM: 0.00, LW: -0.05, LM: -0.05, LB: 0.11, LD: 0.00, RW: -0.05, RM: -0.05, RB: 0.11, RD: 0.00, CD: 0.06, SW: 0.00, FR: 0.00, GK: 0.00 },
            tiki: { ST: -0.05, CF: 0.00, LF: 0.00, RF: 0.00, AM: 0.04, CM: 0.08, DM: 0.00, LW: 0.04, LM: 0.04, LB: 0.00, LD: -0.05, RW: 0.04, RM: 0.04, RB: 0.00, RD: -0.00, CD: 0.00, SW: 0.05, FR: 0.00, GK: 0.00 },
            brit: { ST: 0.00, CF: -0.05, LF: 0.05, RF: 0.05, AM: -0.09, CM: -0.05, DM: -0.09, LW: 0.09, LM: 0.05, LB: 0.05, LD: 0.05, RW: 0.09, RM: 0.05, RB: 0.05, RD: 0.05, CD: 0.00, SW: -0.05, FR: 0.00, GK: 0.00 },
            sp: { ST: 0.00, CF: 0.07, LF: -0.06, RF: -0.06, AM: 0.09, CM: 0.00, DM: 0.09, LW: -0.11, LM: -0.05, LB: -0.11, LD: 0.00, RW: -0.11, RM: -0.05, RB: -0.11, RD: 0.00, CD: 0.00, SW: 0.05, FR: 0.00, GK: 0.00 },
            kat: { ST: -0.04, CF: -0.04, LF: -0.04, RF: -0.04, AM: -0.04, CM: 0.00, DM: 0.07, LW: -0.04, LM: 0.00, LB: 0.07, LD: 0.07, RW: -0.04, RM: 0.00, RB: 0.07, RD: 0.07, CD: 0.00, SW: 0.13, FR: 0.00, GK: 0.00 },
            brazil: { ST: 0.08, CF: 0.04, LF: 0.04, RF: 0.04, AM: 0.04, CM: 0.00, DM: -0.05, LW: 0.04, LM: 0.00, LB: 0.00, LD: -0.05, RW: 0.04, RM: 0.00, RB: 0.00, RD: -0.05, CD: -0.05, SW: -0.09, FR: 0.00, GK: 0.00 },
            norm: {}
        }
    },
    STORAGE_KEYS: {
        HOME: 'vs_calc_home',
        AWAY: 'vs_calc_away'
    },
    // Бонусы и штрафы за позицию игрока
    // Ключ: родная позиция игрока, значение: объект с позициями на поле и модификаторами
    POSITION_MODIFIERS: {
        // Вратари
        'GK': {
            'GK': 1.0,
        },
        'CD': {
            'SW': 1.0,
            'CD': 1.0,
            'LD': 0.9, 'RD': 0.9, 'LB': 0.85, 'RB': 0.85,
            'DM': 0.95,
            'CM': 0.8, 'LM': 0.7, 'RM': 0.7, 'FR': 1.0,
            'AM': 0.75,
            'CF': 0.7, 'ST': 0.7, 'LF': 0.7, 'RF': 0.7, 'LW': 0.7, 'RW': 0.7
        },
        'LD': {
            'SW': 0.9,
            'CD': 0.9,
            'LD': 1.0,
            'RD': 0.8, 'LB': 0.95, 'RB': 0.75,
            'DM': 0.85,
            'LM': 0.9, 'RM': 0.8,
            'CM': 0.7, 'FR': 1.0,
            'AM': 0.65,
            'LW': 0.85, 'RW': 0.65,
            'CF': 0.7, 'ST': 0.7, 'LF': 0.7, 'RF': 0.7
        },
        'RD': {
            'SW': 0.9,
            'CD': 0.9,
            'RD': 1.0,
            'LD': 0.8, 'LB': 0.75, 'RB': 0.95,
            'DM': 0.85,
            'LM': 0.8, 'RM': 0.9,
            'CM': 0.7, 'FR': 1.0,
            'AM': 0.65,
            'LW': 0.65, 'RW': 0.85,
            'CF': 0.7, 'ST': 0.7, 'LF': 0.7, 'RF': 0.7
        },
        //полузащитники
        'CM': {
            'SW': 0.8,
            'CD': 0.8,
            'LD': 0.7, 'RD': 0.7, 'LB': 0.7, 'RB': 0.7,
            'DM': 0.95,
            'CM': 1.0,
            'LM': 0.9, 'RM': 0.9, 'FR': 1.0,
            'AM': 0.95,
            'CF': 0.8, 'ST': 0.8, 'LF': 0.7, 'RF': 0.7, 'LW': 0.7, 'RW': 0.7
        },
        'LM': {
            'SW': 0.7, 'CD': 0.7, 'DM': 0.85, 'CM': 0.9, 'AM': 0.7, 'CF': 0.7, 'ST': 0.7,
            'LD': 0.9, 'LB': 0.95, 'LM': 1.0, 'LW': 0.95, 'LF': 0.9,
            'RD': 0.7, 'RB': 0.7, 'RM': 0.8, 'RW': 0.7, 'RF': 0.7,
            'FR': 1.0,
        },
        'RM': {
            'SW': 0.7, 'CD': 0.7, 'DM': 0.85, 'CM': 0.9, 'AM': 0.7, 'CF': 0.7, 'ST': 0.7,
            'LD': 0.7, 'LB': 0.7, 'LM': 0.8, 'LW': 0.7, 'LF': 0.7,
            'RD': 0.9, 'RB': 0.95, 'RM': 1.0, 'RW': 0.95, 'RF': 0.9,
            'FR': 1.0
        },
        // Нападающие
        'CF': {
            'SW': 0.7, 'CD': 0.7, 'DM': 0.75, 'CM': 0.8, 'AM': 0.9, 'CF': 1.0, 'ST': 1.0,
            'LD': 0.7, 'LB': 0.7, 'LM': 0.7, 'LW': 0.7, 'LF': 0.9,
            'RD': 0.7, 'RB': 0.7, 'RM': 0.7, 'RW': 0.7, 'RF': 0.9,
            'FR': 1.0,
        },
        'LF': {
            'SW': 0.7, 'CD': 0.7, 'DM': 0.7, 'CM': 0.7, 'AM': 0.7, 'CF': 0.9, 'ST': 0.9,
            'LD': 0.7, 'LB': 0.85, 'LM': 0.9, 'LW': 0.95, 'LF': 1.0,
            'RD': 0.7, 'RB': 0.7, 'RM': 0.7, 'RW': 0.7, 'RF': 0.9,
            'FR': 1.0,
        },
        'RF': {
            'SW': 0.7, 'CD': 0.7, 'DM': 0.7, 'CM': 0.7, 'AM': 0.7, 'CF': 0.9, 'ST': 0.9,
            'LD': 0.7, 'LB': 0.7, 'LM': 0.7, 'LW': 0.7, 'LF': 0.9,
            'RD': 0.7, 'RB': 0.85, 'RM': 0.9, 'RW': 0.95, 'RF': 1.0,
            'FR': 1.0,
        }
    },
    PHYSICAL_FORM: {
        // Типы физических форм с их параметрами
        FORMS: {
            // Тип C (обычные турниры)
            'C_76_down': { percent: 76, trend: 'down', title: '76%, падает', bgPosition: '-18px -19px', modifier: 0.76, type: 'C' },
            'C_76_up': { percent: 76, trend: 'up', title: '76%, растёт', bgPosition: '0px -19px', modifier: 0.76, type: 'C' },
            'C_83_down': { percent: 83, trend: 'down', title: '83%, падает', bgPosition: '-18px -57px', modifier: 0.83, type: 'C' },
            'C_83_up': { percent: 83, trend: 'up', title: '83%, растёт', bgPosition: '0px -57px', modifier: 0.83, type: 'C' },
            'C_94_down': { percent: 94, trend: 'down', title: '94%, падает', bgPosition: '-18px -95px', modifier: 0.94, type: 'C' },
            'C_94_up': { percent: 94, trend: 'up', title: '94%, растёт', bgPosition: '0px -95px', modifier: 0.94, type: 'C' },
            'C_106_down': { percent: 106, trend: 'down', title: '106%, падает', bgPosition: '-18px -133px', modifier: 1.06, type: 'C' },
            'C_106_up': { percent: 106, trend: 'up', title: '106%, растёт', bgPosition: '0px -133px', modifier: 1.06, type: 'C' },
            'C_117_down': { percent: 117, trend: 'down', title: '117%, падает', bgPosition: '-18px -171px', modifier: 1.17, type: 'C' },
            'C_117_up': { percent: 117, trend: 'up', title: '117%, растёт', bgPosition: '0px -171px', modifier: 1.17, type: 'C' },
            'C_124_down': { percent: 124, trend: 'down', title: '124%, падает', bgPosition: '-18px -209px', modifier: 1.24, type: 'C' },
            'C_124_up': { percent: 124, trend: 'up', title: '124%, растёт', bgPosition: '0px -209px', modifier: 1.24, type: 'C' },

            // Тип B (чемпионат, кубок межсезонья)
            'B_75_up': { percent: 75, trend: 'up', title: '75%, растёт', bgPosition: '0px 0px', modifier: 0.75, type: 'B' },
            'B_79_down': { percent: 79, trend: 'down', title: '79%, падает', bgPosition: '-18px -38px', modifier: 0.79, type: 'B' },
            'B_88_down': { percent: 88, trend: 'down', title: '88%, падает', bgPosition: '-18px -76px', modifier: 0.88, type: 'B' },
            'B_88_up': { percent: 88, trend: 'up', title: '88%, растёт', bgPosition: '0px -76px', modifier: 0.88, type: 'B' },
            'B_100_down': { percent: 100, trend: 'down', title: '100%, падает', bgPosition: '-18px -114px', modifier: 1.0, type: 'B' },
            'B_100_up': { percent: 100, trend: 'up', title: '100%, растёт', bgPosition: '0px -114px', modifier: 1.0, type: 'B' },
            'B_112_down': { percent: 112, trend: 'down', title: '112%, падает', bgPosition: '-18px -152px', modifier: 1.12, type: 'B' },
            'B_112_up': { percent: 112, trend: 'up', title: '112%, растёт', bgPosition: '0px -152px', modifier: 1.12, type: 'B' },
            'B_121_down': { percent: 121, trend: 'down', title: '121%, падает', bgPosition: '-18px -190px', modifier: 1.21, type: 'B' },
            'B_121_up': { percent: 121, trend: 'up', title: '121%, растёт', bgPosition: '0px -190px', modifier: 1.21, type: 'B' },
            'B_125_down': { percent: 125, trend: 'down', title: '125%, падает', bgPosition: '-18px -228px', modifier: 1.25, type: 'B' },

            // Товарищеские матчи
            'FRIENDLY_100': { percent: 100, trend: 'stable', title: '100% (товарищеский)', bgPosition: '0px -114px', modifier: 1.0, type: 'FRIENDLY' },

            // Неизвестная форма
            'UNKNOWN': { percent: 100, trend: 'unknown', title: 'Неизвестно', bgPosition: '0px -247px', modifier: 1.0, type: 'UNKNOWN' }
        },
        // Типы турниров и доступные физ формы
        TOURNAMENT_TYPES: {
            'typeC': ['C_76_down', 'C_76_up', 'C_83_down', 'C_83_up', 'C_94_down', 'C_94_up', 'C_106_down', 'C_106_up', 'C_117_down', 'C_117_up', 'C_124_down', 'C_124_up', 'UNKNOWN'],
            'typeC_international': ['C_76_down', 'C_76_up', 'C_83_down', 'C_83_up', 'C_94_down', 'C_94_up', 'C_106_down', 'C_106_up', 'C_117_down', 'C_117_up', 'C_124_down', 'C_124_up', 'UNKNOWN'],
            'typeB': ['B_75_up', 'B_79_down', 'B_88_down', 'B_88_up', 'B_100_down', 'B_100_up', 'B_112_down', 'B_112_up', 'B_121_down', 'B_121_up', 'B_125_down', 'UNKNOWN'],
            'typeB_amateur': ['B_75_up', 'B_79_down', 'B_88_down', 'B_88_up', 'B_100_down', 'B_100_up', 'B_112_down', 'B_112_up', 'B_121_down', 'B_121_up', 'B_125_down', 'UNKNOWN'],
            'friendly': ['FRIENDLY_100', 'UNKNOWN'],
            'all': ['C_76_down', 'C_76_up', 'C_83_down', 'C_83_up', 'C_94_down', 'C_94_up', 'C_106_down', 'C_106_up', 'C_117_down', 'C_117_up', 'C_124_down', 'C_124_up', 'B_75_up', 'B_79_down', 'B_88_down', 'B_88_up', 'B_100_down', 'B_100_up', 'B_112_down', 'B_112_up', 'B_121_down', 'B_121_up', 'B_125_down', 'FRIENDLY_100', 'UNKNOWN']
        }
    }
};

/* ----------------------------- SHIRTS SYSTEM CONSTANTS ----------------------------- */
//TO DO разобраться с вертикальным размещением фланговых игроков
//TO DO фланговые игроки не должны перемешиваться с центральными при переходе в другую линию
function generateFieldPositions(formation, side) {
    // Размеры контейнера с учётом отступов 34px со всех сторон
    const fieldWidth = 332;  // 400 - 68
    const fieldHeight = 498; // 566 - 68
    const isHome = side === 'home';

    // Определяем зоны по высоте для каждой команды (относительно контейнера)
    const zones = isHome ? {
        gk: 497,      // Вратарь (близко к нижнему краю)
        def: 450,
        semidef: 400,
        mid: 355,
        semiatt: 310,
        att: 265
    } : {
        gk: 1,       // Вратарь (близко к верхнему краю)
        def: 50,
        semidef: 100,
        mid: 145,
        semiatt: 190,
        att: 235
    };

    const positions = [];

    // Группируем позиции по линиям
    const lines = {
        gk: [],
        def: [],
        semidef: [],
        mid: [],
        semiatt: [],
        att: []
    };

    formation.forEach((pos, idx) => {
        if (pos === 'GK') {
            lines.gk.push({ pos, idx });
        } else if (['LD', 'CD', 'RD', 'SW'].includes(pos)) {
            lines.def.push({ pos, idx });
        } else if (['DM', 'LB', 'RB'].includes(pos)) {
            lines.semidef.push({ pos, idx });
        } else if (['LM', 'CM', 'RM'].includes(pos)) {
            lines.mid.push({ pos, idx });
        } else if (['AM', 'FR', 'RW', 'LW'].includes(pos)) {
            lines.semiatt.push({ pos, idx });
        } else if (['LF', 'CF', 'RF', 'ST'].includes(pos)) {
            lines.att.push({ pos, idx });
        }
    });

    // Функция для распределения игроков по ширине поля
    function distributeHorizontally(count) {
        const margin = 10; // Отступ от краёв 
        const usableWidth = fieldWidth - 2 * margin;

        if (count === 1) {
            return [fieldWidth / 2];
        } else if (count === 2) {
            return [margin + usableWidth * 0.25, margin + usableWidth * 0.75];
        } else if (count === 3) {
            return [margin, fieldWidth / 2, fieldWidth - margin];
        } else if (count === 4) {
            return [margin, margin + usableWidth / 3, margin + 2 * usableWidth / 3, fieldWidth - margin];
        } else if (count === 5) {
            return [margin, margin + usableWidth / 4, fieldWidth / 2, margin + 3 * usableWidth / 4, fieldWidth - margin];
        } else if (count === 6) {
            return [margin, margin + usableWidth / 5, margin + 2 * usableWidth / 5, margin + 3 * usableWidth / 5, margin + 4 * usableWidth / 5, fieldWidth - margin];
        }

        // Для большего количества игроков
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(margin + (usableWidth / (count - 1)) * i);
        }
        return positions;
    }

    // Размещаем вратаря
    if (lines.gk.length > 0) {
        lines.gk.forEach(({ pos, idx }) => {
            positions[idx] = { position: pos, top: zones.gk, left: fieldWidth / 2 };
        });
    }

    // Размещаем защитников
    if (lines.def.length > 0) {
        const xPositions = distributeHorizontally(lines.def.length);
        lines.def.forEach(({ pos, idx }, i) => {
            const xIdx = isHome ? i : (lines.def.length - 1 - i);
            positions[idx] = { position: pos, top: zones.def, left: xPositions[xIdx] };
        });
    }

    // Размещаем линию между защитой и полузащитой - DM, LB, RB
    if (lines.semidef.length > 0) {
        const xPositions = distributeHorizontally(lines.semidef.length);
        lines.semidef.forEach(({ pos, idx }, i) => {
            const xIdx = isHome ? i : (lines.semidef.length - 1 - i);
            positions[idx] = { position: pos, top: zones.semidef, left: xPositions[xIdx] };
        });
    }

    // Размещаем центральных полузащитников - LM, CM, RM
    if (lines.mid.length > 0) {
        const xPositions = distributeHorizontally(lines.mid.length);
        lines.mid.forEach(({ pos, idx }, i) => {
            const xIdx = isHome ? i : (lines.mid.length - 1 - i);
            positions[idx] = { position: pos, top: zones.mid, left: xPositions[xIdx] };
        });
    }

    // Размещаем атакующих полузащитников (между полузащитой и атакой) - AM, FR, RW, LW
    if (lines.semiatt.length > 0) {
        const xPositions = distributeHorizontally(lines.semiatt.length);
        lines.semiatt.forEach(({ pos, idx }, i) => {
            const xIdx = isHome ? i : (lines.semiatt.length - 1 - i);
            positions[idx] = { position: pos, top: zones.semiatt, left: xPositions[xIdx] };
        });
    }

    // Размещаем нападающих
    if (lines.att.length > 0) {
        const xPositions = distributeHorizontally(lines.att.length);
        lines.att.forEach(({ pos, idx }, i) => {
            const xIdx = isHome ? i : (lines.att.length - 1 - i);
            positions[idx] = { position: pos, top: zones.att, left: xPositions[xIdx] };
        });
    }

    return positions;
}

const DEFAULT_SHIRT = 'pics/shirts/sh_4_sm.png';
const DEFAULT_GK_SHIRT = 'pics/shirts/sh_4_sm.png';

/**
 * Отладочная функция для визуализации сетки координат на поле
 * Вызов из консоли: window.debugFieldGrid()
 */
window.debugFieldGrid = function () {
    const fieldCol = document.querySelector('td[style*="field_01.webp"]');
    if (!fieldCol) {
        console.error('Field not found');
        return;
    }

    // Удаляем старую сетку
    const oldGrid = fieldCol.querySelector('.debug-grid');
    if (oldGrid) {
        oldGrid.remove();
        console.log('Debug grid removed.');
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'debug-grid';
    grid.style.cssText = `
        position: absolute;
        top: 34px;
        left: 34px;
        right: 34px;
        bottom: 34px;
        pointer-events: none;
        z-index: 5;
        border: 2px solid rgba(255, 0, 0, 0.5);
    `;

    // Горизонтальные линии зон (относительно контейнера с отступами)
    [1, 50, 100, 145, 190, 235, 265, 310, 355, 400, 450, 497].forEach(y => {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(255, 0, 0, 0.3);
        `;
        grid.appendChild(line);
    });

    // Вертикальные линии (центр и края с отступами)
    const centerX = 332 / 2; // 166px
    [10, centerX, 322].forEach(x => {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            top: 0;
            left: ${x}px;
            width: 1px;
            height: 100%;
            background: rgba(0, 0, 255, 0.3);
        `;
        grid.appendChild(line);
    });

    fieldCol.appendChild(grid);
    console.log('Debug grid added. Red lines = zones, Blue lines = horizontal distribution. Call window.debugFieldGrid() again to remove.');
};

// Legacy constants for backward compatibility
const COLLISION_NONE = CONFIG.COLLISION.NONE;
const COLLISION_WIN = CONFIG.COLLISION.WIN;
const COLLISION_LOSE = CONFIG.COLLISION.LOSE;
const STYLE_VALUES = CONFIG.STYLES.VALUES;

function VSStorage() {
    const hasGMGet = typeof GM_getValue === 'function';
    const hasGMSet = typeof GM_setValue === 'function';
    return {
        get(key) {
            try {
                if (hasGMGet) return GM_getValue(key, null);
                const v = localStorage.getItem(key);
                return v === null ? null : v;
            } catch (e) {
                return null;
            }
        },
        set(key, value) {
            try {
                if (hasGMSet) return GM_setValue(key, value);
                localStorage.setItem(key, value);
            } catch (e) {
                /* ignore */
}
        }
    };
}
const vsStorage = VSStorage();
const collision_bonuses = {
    norm: null,
    sp: {
        brit: 0.38
    },
    bb: {
        sp: 0.42
    },
    brazil: {
        bb: 0.34
    },
    tiki: {
        kat: 0.36
    },
    kat: {
        brazil: 0.44
    },
    brit: {
        tiki: 0.40
    }
};

function pickClosest(target, nums) {
    if (!nums || !nums.length) {
        return null;
    }
    let best = nums[0],
        bestDiff = Math.abs(nums[0] - target);
    for (let i = 1; i < nums.length; i++) {
        const d = Math.abs(nums[i] - target);
        if (d < bestDiff || (d === bestDiff && nums[i] > best)) {
            best = nums[i];
            bestDiff = d;
        }
    }
    return best;
}

function normalizeTemperatureForWeather(result, weather, temperature) {
    const weatherMap = {
        "очень жарко": [0, 2],
        "жарко": [3, 6],
        "солнечно": [7, 11],
        "облачно": [12, 16],
        "пасмурно": [17, 21],
        "дождь": [22, 25],
        "снег": [26, 28]
    };
    const range = weatherMap[(weather || '').toLowerCase()];
    if (!range) return null;
    const [start, end] = range;
    const temps = [];
    for (let i = start; i <= end; i++) {
        const v = parseInt(result.temperatures[i], 10);
        if (!Number.isNaN(v)) temps.push(v);
    }
    if (!temps.length) return null;
    return pickClosest(Number(temperature), temps);
}

function normalizeTemperatureGlobally(result, temperature) {
    const temps = (result.temperatures || []).map(v => parseInt(v, 10)).filter(v => !Number.isNaN(v));
    if (!temps.length) return null;
    return pickClosest(Number(temperature), temps);
}

// Линейная интерполяция между двумя точками
function linearInterpolate(x, x0, y0, x1, y1) {
    if (x1 === x0) return y0; // Избегаем деления на ноль
    return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

// Новая функция с интерполяцией
function getWeatherStrengthWithInterpolation(result, temperature, weather, strength, callback) {
    if (!result) return callback({ found: false });

    const weatherMap = {
        "очень жарко": [0, 2],
        "жарко": [3, 6],
        "солнечно": [7, 11],
        "облачно": [12, 16],
        "пасмурно": [17, 21],
        "дождь": [22, 25],
        "снег": [26, 28]
    };

    const colRange = weatherMap[weather.toLowerCase()];
    if (!colRange) return callback({ found: false, error: "Погода не найдена" });

    // Находим строку с нужной силой
    const row = result.strengthTable.find(r => parseInt(r.strength, 10) === strength);
    if (!row) return callback({ found: false, error: "Сила не найдена" });

    // Собираем все доступные температуры и значения силы для данной погоды
    const dataPoints = [];
    for (let i = colRange[0]; i <= colRange[1]; i++) {
        const temp = parseInt(result.temperatures[i], 10);
        const value = parseInt(row.values[i], 10);
        if (!Number.isNaN(temp) && !Number.isNaN(value)) {
            dataPoints.push({ temp, value });
        }
    }

    if (dataPoints.length === 0) {
        return callback({ found: false, error: "Нет данных для интерполяции" });
    }

    // Сортируем по температуре
    dataPoints.sort((a, b) => a.temp - b.temp);

    const minTemp = dataPoints[0].temp;
    const maxTemp = dataPoints[dataPoints.length - 1].temp;

    // Если температура точно совпадает с одной из точек
    const exactMatch = dataPoints.find(p => p.temp === temperature);
    if (exactMatch) {
        return callback({
            found: true,
            weatherStr: exactMatch.value,
            interpolated: false,
            details: {
                temperature,
                requestedTemperature: temperature,
                weather,
                strength,
                method: 'exact'
            }
        });
    }

    // Если температура в диапазоне - делаем интерполяцию
    if (temperature >= minTemp && temperature <= maxTemp) {
        // Находим две ближайшие точки
        let lowerPoint = dataPoints[0];
        let upperPoint = dataPoints[dataPoints.length - 1];

        for (let i = 0; i < dataPoints.length - 1; i++) {
            if (dataPoints[i].temp <= temperature && dataPoints[i + 1].temp >= temperature) {
                lowerPoint = dataPoints[i];
                upperPoint = dataPoints[i + 1];
                break;
            }
        }

        const interpolatedValue = linearInterpolate(
            temperature,
            lowerPoint.temp,
            lowerPoint.value,
            upperPoint.temp,
            upperPoint.value
        );

        return callback({
            found: true,
            weatherStr: Math.round(interpolatedValue),
            interpolated: true,
            details: {
                temperature,
                requestedTemperature: temperature,
                weather,
                strength,
                method: 'interpolation',
                lowerPoint,
                upperPoint,
                interpolatedValue
            }
        });
    }

    // Если температура вне диапазона - используем ближайшую точку
    if (temperature < minTemp) {
        return callback({
            found: true,
            weatherStr: dataPoints[0].value,
            interpolated: false,
            details: {
                temperature: minTemp,
                requestedTemperature: temperature,
                weather,
                strength,
                method: 'extrapolation_min'
            }
        });
    } else {
        return callback({
            found: true,
            weatherStr: dataPoints[dataPoints.length - 1].value,
            interpolated: false,
            details: {
                temperature: maxTemp,
                requestedTemperature: temperature,
                weather,
                strength,
                method: 'extrapolation_max'
            }
        });
    }
}

// Старая функция удалена - используем только интерполяцию

function getCollisionInfo(teamStyleId, oppStyleId) {
    if (!teamStyleId || !oppStyleId) {
        return {
            teamStatus: COLLISION_NONE,
            oppStatus: COLLISION_NONE,
            teamBonus: 0,
            oppBonus: 0
        };
    }
    const wins = collision_bonuses[teamStyleId] || null;
    const winBonus = wins && wins[oppStyleId] ? wins[oppStyleId] : 0;
    const oppWins = collision_bonuses[oppStyleId] || null;
    const oppWinBonus = oppWins && oppWins[teamStyleId] ? oppWins[teamStyleId] : 0;
    let teamStatus = COLLISION_NONE;
    let oppStatus = COLLISION_NONE;
    let teamBonus = 0;
    let oppBonus = 0;
    if (winBonus && !oppWinBonus) {
        teamStatus = COLLISION_WIN;
        oppStatus = COLLISION_LOSE;
        teamBonus = winBonus;
        oppBonus = 0;
    } else if (!winBonus && oppWinBonus) {
        teamStatus = COLLISION_LOSE;
        oppStatus = COLLISION_WIN;
        teamBonus = 0;
        oppBonus = oppWinBonus;
    }
    return {
        teamStatus,
        oppStatus,
        teamBonus,
        oppBonus
    };
}
const SUPPORTED_ABILITY_TYPES = new Set(['Ск', 'Г', 'Пд', 'Пк', 'Д', 'Км', 'В', 'Р']);
const KNOWN_STYLE_IDS = new Set(['sp', 'brazil', 'tiki', 'bb', 'kat', 'brit', 'norm']);

function parseAbilities(abilitiesStr) {
    if (!abilitiesStr) {
        return [];
    }
    const res = [];
    const singleFlags = abilitiesStr.match(/\b[А-ЯЁA-Z]\b/gi) || [];
    singleFlags.forEach(f => {
        const up = f.replace('ё', 'е').replace('Ё', 'Е').toUpperCase();
        if (up === 'Л') {
            res.push({
                type: 'Л',
                level: 1
            });
        }
    });
    const regex = /([А-Яа-яA-Za-zЁё]{1,2})([1-4])/g;
    let m;
    while ((m = regex.exec(abilitiesStr)) !== null) {
        let type = m[1];
        const level = Number(m[2]);
        type = type.replace('ё', 'е').replace('Ё', 'Е');
        if (type.length === 2) {
            type = type[0].toUpperCase() + type[1].toLowerCase();
        } else {
            type = type.toUpperCase();
        }
        if (level >= 1 && level <= 4) {
            if (!(type === 'Л' && res.some(r => r.type === 'Л'))) {
                res.push({
                    type,
                    level
                });
            }
        }
    }
    return res;
}

function defenceTypeBonus({
    team,
    opponent,
    withResult = false
}) {
    const DEF = new Set(['GK', 'LD', 'LB', 'SW', 'CD', 'RD', 'RB']);
    const ATT = new Set(['LW', 'LF', 'AM', 'CF', 'ST', 'RW', 'RF']);
    const defenceType = team.defenceType || 'zonal';
    const oppAttCount = opponent.positions.filter(pos => ATT.has(pos)).length;
    const bonusActive =
        (defenceType === 'zonal' && oppAttCount > 3) ||
        (defenceType === 'man' && oppAttCount <= 3);
    const bonusValue = bonusActive ? 0.05 : 0;
    let totalBonus = 0;
    const perIndex = Array(team.positions.length).fill(0);
    team.positions.forEach((pos, idx) => {
        if (DEF.has(pos)) {
            const add = bonusValue * team.realStr[idx];
            team.contribution[idx] += add;
            perIndex[idx] = add;
            totalBonus += add;
        }
    });
    if (!team.log) team.log = [];
    team.log.push(
        bonusActive ?
            `DefenceTypeBonus: +${totalBonus.toFixed(2)} (${defenceType === 'zonal' ? 'зональный' : 'персональный'}; атакующих у соперника: ${oppAttCount})` :
            `DefenceTypeBonus: 0 (условия не выполнены; атакующих у соперника: ${oppAttCount})`
    );
    if (withResult) {
        return {
            applied: bonusActive,
            totalBonus,
            perIndex,
            defenceType,
            oppAttCount
        };
    }
}

function getMorale(team) {
    return (team && team.morale) || 'normal';
}

function getMoraleBonusBounds({
    homeRating,
    awayRating,
    sideLabel
}) {
    const h = Math.round(homeRating);
    const a = Math.round(awayRating);
    
    console.log('[MoraleBonus] Calculating bounds', {
        sideLabel,
        homeRating: h,
        awayRating: a
    });
    
    if (!h || !a) {
        return {
            superBonus: CONFIG.BONUSES.MORALE.SUPER_DEFAULT,
            restBonus: CONFIG.BONUSES.MORALE.REST_DEFAULT
        };
    }
    let ratio = h > a ? h / a : a / h;
    ratio = Math.max(1, ratio);
    let superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
    let restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;
    if (sideLabel === 'home') {
        if (h < a) {
            console.log('[MoraleBonus] Home is weaker');
            superBonus = Math.min(0.54, (ratio - 1) / 2 + CONFIG.BONUSES.MORALE.SUPER_DEFAULT);
            restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;
        } else {
            console.log('[MoraleBonus] Home is stronger or equal');
            superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
            restBonus = Math.max(-0.25, Math.min(CONFIG.BONUSES.MORALE.REST_DEFAULT, -((ratio - 1) / 4) + CONFIG.BONUSES.MORALE.REST_DEFAULT));
        }
    } else {
        if (a < h) {
            console.log('[MoraleBonus] Away is weaker');
            superBonus = Math.min(0.54, (ratio - 1) / 2 + CONFIG.BONUSES.MORALE.SUPER_DEFAULT);
            restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;
        } else {
            console.log('[MoraleBonus] Away is stronger or equal');
            superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
            restBonus = Math.max(-0.25, Math.min(CONFIG.BONUSES.MORALE.REST_DEFAULT, -((ratio - 1) / 4) + CONFIG.BONUSES.MORALE.REST_DEFAULT));
        }
    }
    
    console.log('[MoraleBonus] Result', {
        ratio: ratio.toFixed(2),
        superBonus: superBonus.toFixed(3),
        restBonus: restBonus.toFixed(3)
    });
    
    return {
        superBonus,
        restBonus
    };
}

function getMoraleBonusForPlayer({
    moraleMode,
    contribBase,
    bounds
}) {
    if (moraleMode === 'super') {
        return contribBase * bounds.superBonus;
    }
    if (moraleMode === 'rest') {
        return contribBase * bounds.restBonus;
    }
    return 0;
}

function getAtmosphereBonus(contribBase, atmosphereValue) {
    return contribBase * atmosphereValue;
}

function getRough(team) {
    return (team && team.rough) || 'clean';
}

function getRoughBonusForPlayer(realStr, roughMode) {
    if (roughMode !== 'rough') {
        return 0;
    }
    const base = (Number(realStr) || 0) * 0.08;
    return Math.max(base, 5.0);
}

function roughBonus({
    team,
    slotEntries
}) {
    const mode = getRough(team);
    team.roughContribution = new Array(slotEntries.length).fill(0);
    if (mode !== 'rough') {
        return 0;
    }
    let total = 0;
    slotEntries.forEach((e, idx) => {
        const rs = Number(e.player.realStr) || 0;
        const b = getRoughBonusForPlayer(rs, mode);
        team.roughContribution[idx] = b;
        total += b;
    });
    return total;
}

function getCaptainAbilityLevel(abilitiesStr) {
    if (!abilitiesStr) {
        return 0;
    }
    const m = abilitiesStr.match(/Ка(\d)?/);
    if (!m) {
        return 0;
    }
    const lvl = m[1] ? Number(m[1]) : 1;
    return Math.max(1, Math.min(lvl, 4));
}

function getAgeCaptainPercent(age) {
    const a = Number(age) || 0;
    if (a >= 34) return 0.08;
    if (a === 33) return 0.07;
    if (a === 32) return 0.06;
    if (a === 31) return 0.05;
    if (a === 30) return 0.04;
    if (a === 29) return 0.03;
    if (a === 28) return 0.02;
    if (a === 27 || a === 26) return 0.01;
    if (a === 25 || a === 24) return 0;
    if (a === 23) return -0.01;
    if (a === 22) return -0.02;
    if (a === 21) return -0.03;
    if (a === 20) return -0.04;
    if (a === 19) return -0.05;
    if (a === 18) return -0.06;
    if (a === 17) return -0.07;
    if (a === 16) return -0.08;
    return 0;
}

function getCaptainAbilityMinPercent(age, kaLevel) {
    if (!kaLevel) {
        return null;
    }
    const a = Number(age) || 0;
    const row = (() => {
        if (a >= 34) return [0.08, 0.08, 0.09, 0.12];
        if (a === 33) return [0.07, 0.07, 0.09, 0.12];
        if (a === 32) return [0.06, 0.06, 0.09, 0.12];
        if (a === 31) return [0.05, 0.05, 0.09, 0.12];
        if (a === 30) return [0.04, 0.04, 0.09, 0.12];
        if (a === 29) return [0.03, 0.03, 0.09, 0.12];
        if (a === 28) return [0.02, 0.02, 0.09, 0.12];
        if (a === 27 || a === 26) return [0.01, 0.02, 0.09, 0.12];
        if (a === 25 || a === 24) return [0.00, 0.02, 0.09, 0.12];
        if (a >= 16) return [0.02, 0.06, 0.09, 0.12];
        return [0.00, 0.02, 0.09, 0.12];
    })();
    const idx = Math.max(1, Math.min(kaLevel, 4)) - 1;
    return row[idx];
}

function estimateCaptainPercent(captainPlayer, lineupEntries) {
    if (!captainPlayer) {
        return 0;
    }
    const captainRealStr = Number(captainPlayer.realStr) || 0;
    const captainAge = Number(captainPlayer.age) || 0;
    const avgRealStr = computeAverageRealStrForLineup((lineupEntries || []).filter(Boolean));
    const kaLevel = getCaptainAbilityLevel(captainPlayer.abilities);
    const percentAge = getAgeCaptainPercent(captainAge);
    const percentKaMin = kaLevel ? getCaptainAbilityMinPercent(captainAge, kaLevel) : null;
    let finalPercent;
    if (percentAge >= 0) {
        if (!kaLevel && captainRealStr < avgRealStr) finalPercent = 0;
        else finalPercent = kaLevel ? Math.max(percentAge, percentKaMin) : percentAge;
    } else {
        finalPercent = kaLevel ? percentKaMin : percentAge;
    }
    return finalPercent || 0;
}

function computeAverageRealStrForLineup(entries) {
    const valid = entries.filter(e => e && e.player);
    if (!valid.length) {
        return 0;
    }
    const sum = valid.reduce((acc, e) => acc + (Number(e.player.realStr) || 0), 0);
    return sum / valid.length;
}
const STYLE_ABILITIES_BONUS_MAP = {
    'Ск': {
        bb: [0.10, 0.20, 0.30, 0.40],
        brit: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        kat: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    },
    'Г': {
        brit: [0.10, 0.20, 0.30, 0.40],
        kat: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        bb: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    },
    'Пд': {
        kat: [0.10, 0.20, 0.30, 0.40],
        bb: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        brit: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    },
    'Пк': {
        sp: [0.10, 0.20, 0.30, 0.40],
        tiki: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        brazil: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    },
    'Д': {
        brazil: [0.10, 0.20, 0.30, 0.40],
        sp: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        tiki: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    },
    'Км': {
        tiki: [0.10, 0.20, 0.30, 0.40],
        brazil: [0.06, 0.12, 0.18, 0.24],
        norm: [0.05, 0.10, 0.15, 0.20],
        sp: [0.04, 0.08, 0.12, 0.16],
        other: [0.02, 0.04, 0.06, 0.08]
    }
};

// Вратарские способности: зависят от наличия SW в защите
const GOALKEEPER_ABILITIES_BONUS = {
    'В': {
        withSW: [0.03, 0.06, 0.09, 0.12],
        withoutSW: [0.08, 0.16, 0.24, 0.32]
    },
    'Р': {
        withSW: [0.08, 0.16, 0.24, 0.32],
        withoutSW: [0.03, 0.06, 0.09, 0.12]
    }
};
const LEADERSHIP_LEVEL_COEFF = [0, 0.03, 0.06, 0.09, 0.12];

function getLineByMatchPos(matchPos) {
    const DEF = new Set(['GK', 'LD', 'LB', 'SW', 'CD', 'RD', 'RB']);
    const MID = new Set(['LM', 'DM', 'CM', 'FR', 'RM']);
    const ATT = new Set(['LW', 'LF', 'AM', 'CF', 'ST', 'RW', 'RF']);
    if (DEF.has(matchPos)) return 'DEF';
    if (MID.has(matchPos)) return 'MID';
    if (ATT.has(matchPos)) return 'ATT';
    return null;
}

function getAbilitiesBonusesDetailed(abilitiesStr, teamStyleId) {
    const arr = parseAbilities(abilitiesStr);
    if (!arr || !arr.length) {
        return [];
    }
    const result = [];
    for (const ab of arr) {
        const map = STYLE_ABILITIES_BONUS_MAP[ab.type];
        if (!map) continue;
        const table = map[teamStyleId] || map.other;
        if (!table || !Array.isArray(table)) continue;
        const idx = Math.min(Math.max(ab.level - 1, 0), 3);
        const bonus = Number(table[idx]) || 0;
        result.push({
            type: ab.type,
            level: ab.level,
            bonus
        });
    }
    return result;
}

function getAbilitiesBonusForStyleId(abilitiesStr, teamStyleId) {
    if (!abilitiesStr) {
        return 0;
    }
    const arr = parseAbilities(abilitiesStr);
    if (!arr || !arr.length) {
        return 0;
    }
    const styleId = KNOWN_STYLE_IDS.has(teamStyleId) ? teamStyleId : 'norm';
    let sum = 0;
    for (const ab of arr) {
        if (!SUPPORTED_ABILITY_TYPES.has(ab.type)) continue;
        const map = STYLE_ABILITIES_BONUS_MAP[ab.type];
        if (!map) continue;
        const table = map[styleId] || map.other;
        if (!Array.isArray(table) || table.length < 4) continue;
        const idx = Math.min(Math.max((Number(ab.level) || 1) - 1, 0), 3);
        const bonus = Number(table[idx]) || 0;
        sum += bonus;
    }
    return sum;
}

// Расчет вратарских способностей (зависит от наличия SW в защите)
function getGoalkeeperAbilitiesBonus(abilitiesStr, hasSW) {
    if (!abilitiesStr) {
        return 0;
    }
    const arr = parseAbilities(abilitiesStr);
    if (!arr || !arr.length) {
        return 0;
    }
    
    let sum = 0;
    for (const ab of arr) {
        const map = GOALKEEPER_ABILITIES_BONUS[ab.type];
        if (!map) {
            continue;
        }
        
        const table = hasSW ? map.withSW : map.withoutSW;
        if (!Array.isArray(table) || table.length < 4) {
            continue;
        }
        
        const idx = Math.min(Math.max((Number(ab.level) || 1) - 1, 0), 3);
        const bonus = Number(table[idx]) || 0;
        sum += bonus;
    }
    return sum;
}

function getWeatherStrengthValueCached(styleId, temperature, weather, strength, callback) {
    const cacheKey = 'weather_style_' + styleId;
    let cachedRaw = vsStorage.get(cacheKey);
    if (cachedRaw) {
        try {
            const cached = JSON.parse(cachedRaw);
            // Используем интерполяцию
            return getWeatherStrengthWithInterpolation(cached, temperature, weather, strength, (interpolationResult) => {
                if (interpolationResult && interpolationResult.found) {
                    callback(interpolationResult);
                } else {
                    console.error('[Weather] Interpolation failed (cached)', {
                        temperature,
                        weather,
                        strength,
                        error: interpolationResult?.error
                    });
                    callback({ found: false, error: 'Interpolation failed' });
                }
            });
        } catch (e) {
            /* перекачаем */
}
    }
    const url = `${SITE_CONFIG.BASE_URL}/weather.php?step=1&style=${encodeURIComponent(styleId)}`;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const tables = Array.from(doc.querySelectorAll('table'));
                let weatherTable = null;
                for (const table of tables) {
                    const rows = Array.from(table.querySelectorAll('tr'));
                    if (!rows.length) continue;
                    const hasTempRow = rows.some(row => {
                        const tds = Array.from(row.querySelectorAll('td'));
                        return tds.length > 5 && tds.every(td => td.textContent.trim().endsWith(
                            '°'));
                    });
                    if (hasTempRow) {
                        weatherTable = table;
                        break;
                    }
                }
                if (!weatherTable) return callback(null);
                const rows = Array.from(weatherTable.querySelectorAll('tr'));
                const tempRow = rows.find(row => {
                    const tds = Array.from(row.querySelectorAll('td'));
                    return tds.length > 5 && tds.every(td => td.textContent.trim().endsWith('°'));
                });
                if (!tempRow) return callback(null);
                const temperatures = Array.from(tempRow.querySelectorAll('td')).map(td => {
                    const n = parseInt(td.textContent, 10);
                    return Number.isNaN(n) ? null : n;
                });
                const strengthTable = [];
                for (const row of rows) {
                    const tds = Array.from(row.querySelectorAll('td'));
                    if (tds.length === temperatures.length + 1) {
                        const first = tds[0].textContent.trim();
                        if (/^\d+$/.test(first)) {
                            const strength = parseInt(first, 10);
                            const values = tds.slice(1).map(td => td.textContent.trim());
                            strengthTable.push({
                                strength,
                                values
                            });
                        }
                    }
                }
                const result = {
                    temperatures,
                    strengthTable
                };
                try {
                    vsStorage.set(cacheKey, JSON.stringify(result));
                } catch (e) {
                    /* ignore */
}

                // Используем интерполяцию
                getWeatherStrengthWithInterpolation(result, temperature, weather, strength, (interpolationResult) => {
                    if (interpolationResult && interpolationResult.found) {
                        callback(interpolationResult);
                    } else {
                        console.error('[Weather] Interpolation failed (fresh)', {
                            temperature,
                            weather,
                            strength,
                            error: interpolationResult?.error
                        });
                        callback({ found: false, error: 'Interpolation failed' });
                    }
                });
            } catch (e) {
                callback(null);
            }
        },
        onerror: function () {
            callback(null);
        }
    });
}

function getFavoriteStyleBonus(teamStyleId, playerStyleId) {
    if (!teamStyleId || !playerStyleId) return 0;
    if (teamStyleId === playerStyleId) return 0.025;
    const teamWins = collision_bonuses[teamStyleId] || null;
    const oppWins = collision_bonuses[playerStyleId] || null;
    const teamBeatsPlayer = !!(teamWins && teamWins[playerStyleId]);
    const playerBeatsTeam = !!(oppWins && oppWins[teamStyleId]);
    if (teamBeatsPlayer || playerBeatsTeam) return -0.01;
    return 0;
}

function getPositionBonus(teamStyleId, playerPosition) {
    if (!teamStyleId || !playerPosition) return 0;

    const styleTable = CONFIG.BONUSES.POSITION_BONUS_TABLE[teamStyleId];
    if (!styleTable) return 0;

    return styleTable[playerPosition] || 0;
}

function getRealityBonus(realStatus, realSign) {
    // Маппинг бонусов реальности на основе real_status (p[31]) и real_sign (p[32])
    const status = Number(realStatus) || 0;
    const sign = Number(realSign) || 0;

    if (status === 0) {
        // Обычная реальность
        const bonuses = [1.0, 1.03, 1.05, 1.0, 1.07];
        return bonuses[sign] || 1.0;
    } else if (status === 1) {
        // Повышенная реальность
        const bonuses = [1.0, 1.07, 1.10, 1.0, 1.15];
        return bonuses[sign] || 1.0;
    }

    return 1.0;
}

function getFatigueBonus(fatigue) {
    // Бонус усталости: 1 - (fatigue / 100)
    const f = Number(fatigue) || 0;
    return 1 - (f / 100);
}

function getPositionModifier(mainPos, secondPos, matchPosition) {
    if (!matchPosition) return 1.0;
    if (!mainPos && !secondPos) return 1.0;

    // Маппинг бонусов за универсальность (сочетание позиций дает +5% бонус)
    const versatilityBonuses = {
        // вингбеки
        'LB_LM': { 'LB': 1.05 },
        'LD_LM': { 'LB': 1.05 },
        'RB_RM': { 'RB': 1.05 },
        'RD_RM': { 'RB': 1.05 },

        // Опорники
        'CD_CM': { 'DM': 1.05 },
        'CM_CD': { 'DM': 1.05 },

        // AM + вингеры
        'CM_CF': { 'AM': 1.05 },
        'CF_CM': { 'AM': 1.05 },
        'LF_LM': { 'LW': 1.05 },
        'RM_RF': { 'RW': 1.05 },
        'LM_LF': { 'LW': 1.05 },
        'RF_RM': { 'RW': 1.05 },

    };

    // ШАГ 1: Проверяем бонус за универсальность (если есть обе позиции)
    if (mainPos && secondPos) {
        const positions = [mainPos, secondPos].sort();
        const posKey = positions.join('_');
        const bonuses = versatilityBonuses[posKey];

        if (bonuses && bonuses[matchPosition]) {
            return bonuses[matchPosition];
        }
    }

    // ШАГ 2: Получаем модификаторы из таблицы штрафов для обеих позиций
    let modifier1 = 1.0;
    let modifier2 = 1.0;

    if (mainPos) {
        const modifiers = CONFIG.POSITION_MODIFIERS[mainPos];
        if (modifiers) {
            modifier1 = modifiers[matchPosition] || 1.0;
        }
    }

    if (secondPos) {
        const modifiers = CONFIG.POSITION_MODIFIERS[secondPos];
        if (modifiers) {
            modifier2 = modifiers[matchPosition] || 1.0;
        }
    }

    // ШАГ 3: Выбираем лучший модификатор
    const finalModifier = Math.max(modifier1, modifier2);

    return finalModifier;
}

// Функции для работы с физической формой
function getPhysicalFormsByTournamentType(tournamentType) {
    const forms = CONFIG.PHYSICAL_FORM.TOURNAMENT_TYPES[tournamentType] || CONFIG.PHYSICAL_FORM.TOURNAMENT_TYPES.all;
    return forms.map(formId => ({
        id: formId,
        ...CONFIG.PHYSICAL_FORM.FORMS[formId]
    }));
}

// Алиас для обратной совместимости
function getPhysicalFormsByDayType(dayType) {
    return getPhysicalFormsByTournamentType(dayType);
}

function getPhysicalFormModifier(formId) {
    if (!formId) return 1.0;
    const form = CONFIG.PHYSICAL_FORM.FORMS[formId];
    return form ? form.modifier : 1.0;
}

function applyPhysicalFormToRealStr(baseRealStr, formId) {
    const modifier = getPhysicalFormModifier(formId);
    return Math.round(baseRealStr * modifier);
}

function getPhysicalFormIdFromData(formPercent, formDirection, tournamentType = 'typeC') {
    // Товарищеские матчи всегда 100% формы, независимо от реального значения
    if (tournamentType === 'friendly') {
        return 'FRIENDLY_100';
    }

    // Если форма неизвестна
    if (!formPercent || formPercent === '' || formPercent === '0' || formPercent === 0) {
        return 'UNKNOWN';
    }

    const percent = Number(formPercent);
    if (!Number.isFinite(percent)) {
        return 'UNKNOWN';
    }

    // Определяем направление: 1 = up, 2 = down, иначе unknown
    let trend = 'down';
    if (formDirection === 1 || formDirection === '1') {
        trend = 'up';
    } else if (formDirection === 2 || formDirection === '2') {
        trend = 'down';
    }

    // Определяем тип турнира (B или C)
    const isTypeB = tournamentType === 'typeB' || tournamentType === 'typeB_amateur';
    const isTypeC = tournamentType === 'typeC' || tournamentType === 'typeC_international';
    const prefix = isTypeB ? 'B' : (isTypeC ? 'C' : 'C');

    // Ищем точное совпадение
    const exactFormId = `${prefix}_${percent}_${trend}`;
    if (CONFIG.PHYSICAL_FORM.FORMS[exactFormId]) {
        return exactFormId;
    }

    // Если точного совпадения нет, ищем ближайшую форму
    const availableForms = Object.keys(CONFIG.PHYSICAL_FORM.FORMS)
        .filter(id => id.startsWith(prefix) && CONFIG.PHYSICAL_FORM.FORMS[id].trend === trend)
        .map(id => ({
            id,
            percent: CONFIG.PHYSICAL_FORM.FORMS[id].percent
        }))
        .sort((a, b) => Math.abs(a.percent - percent) - Math.abs(b.percent - percent));

    if (availableForms.length > 0) {
        return availableForms[0].id;
    }

    // Если ничего не найдено, возвращаем UNKNOWN
    return 'UNKNOWN';
}
const TEAM_I_LEVEL_COEFF = [0, 0.005, 0.01, 0.02, 0.03];

function getTeamIBonusForLineup(inLineupPlayers, lineup) {
    const teamIBonusByPlayer = [];
    let teamIBonusTotal = 0;
    for (const p of inLineupPlayers) {
        const abilities = parseAbilities(p.abilities);
        const intuition = abilities.find(a => a.type === 'И');
        if (!intuition) {
            continue;
        }
        const lvl = Math.max(1, Math.min(4, Number(intuition.level) || 1));
        const coeff = TEAM_I_LEVEL_COEFF[lvl] || 0;
        
        // Используем calculatedRealStr вместо realStr
        let calculatedStr = 0;
        const playerSlot = lineup.find(s => {
            const pid = s.getValue && s.getValue();
            return pid && String(pid) === String(p.id);
        });
        
        if (playerSlot && playerSlot.posValue && playerSlot.physicalFormValue) {
            calculatedStr = calculatePlayerStrengthGlobal(p, playerSlot.posValue, playerSlot.physicalFormValue);
        } else {
            calculatedStr = Number(p.realStr) || 0;
        }
        
        const bonus = calculatedStr * coeff;
        teamIBonusByPlayer.push({
            playerId: p.id,
            name: p.name,
            level: lvl,
            calculatedStr,
            coeff,
            bonus
        });
        teamIBonusTotal += bonus;
    }
    return {
        teamIBonusByPlayer,
        teamIBonusTotal
    };
}

function parseTeamsRatingFromPage() {
    const table = Array.from(document.querySelectorAll('table.nol')).find(tbl =>
        tbl.textContent.includes('Рейтинг силы команд')
    );
    if (!table) {
        console.warn('[Rating] Table not found');
        return null;
    }
    const tds = table.querySelectorAll('td.rdl, td.gdl');
    if (tds.length < 2) {
        console.warn('[Rating] Not enough cells found');
        return null;
    }
    
    // Берем только первый текстовый узел, игнорируя span и div
    const getFirstTextNode = (element) => {
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) return text;
            }
        }
        return '';
    };
    
    const homeText = getFirstTextNode(tds[0]);
    const awayText = getFirstTextNode(tds[1]);
    
    console.log('[Rating] Raw text', { homeText, awayText });
    
    const home = parseInt(homeText, 10);
    const away = parseInt(awayText, 10);
    
    console.log('[Rating] Parsed values', { home, away });
    
    if (!Number.isFinite(home) || !Number.isFinite(away)) {
        console.warn('[Rating] Invalid numbers');
        return null;
    }
    return {
        home,
        away
    };
}

function parseNumericWeatherStr(value) {
    if (value == null) return null;
    const s = String(value).replace(',', '.').replace(/[^\d.-]/g, '').trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

/* ----------------------------- BONUS CALCULATION UTILITIES ----------------------------- */
class BonusCalculator {
    static getHomeBonus(percent) {
        if (percent === 100) return CONFIG.BONUSES.HOME[100];
        if (percent >= 90 && percent <= 99) return CONFIG.BONUSES.HOME[90];
        if (percent >= 80 && percent <= 89) return CONFIG.BONUSES.HOME[80];
        if (percent >= 0 && percent < 80) return CONFIG.BONUSES.HOME.DEFAULT;
        if (percent === -1) return 0;
        return 0;
    }

    static getMoraleBonusBounds({ homeRating, awayRating, sideLabel }) {
        const h = Math.round(homeRating);
        const a = Math.round(awayRating);
        if (!h || !a) {
            return {
                superBonus: CONFIG.BONUSES.MORALE.SUPER_DEFAULT,
                restBonus: CONFIG.BONUSES.MORALE.REST_DEFAULT
            };
        }

        let ratio = h > a ? h / a : a / h;
        ratio = Math.max(1, ratio);
        let superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
        let restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;

        if (sideLabel === 'home') {
            if (h < a) {
                superBonus = Math.min(0.54, (ratio - 1) / 2 + CONFIG.BONUSES.MORALE.SUPER_DEFAULT);
                restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;
            } else {
                superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
                restBonus = Math.max(-0.25, Math.min(CONFIG.BONUSES.MORALE.REST_DEFAULT, -((ratio - 1) / 4) + CONFIG.BONUSES.MORALE.REST_DEFAULT));
            }
        } else {
            if (a < h) {
                superBonus = Math.min(0.54, (ratio - 1) / 2 + CONFIG.BONUSES.MORALE.SUPER_DEFAULT);
                restBonus = CONFIG.BONUSES.MORALE.REST_DEFAULT;
            } else {
                superBonus = CONFIG.BONUSES.MORALE.SUPER_DEFAULT;
                restBonus = Math.max(-0.25, Math.min(CONFIG.BONUSES.MORALE.REST_DEFAULT, -((ratio - 1) / 4) + CONFIG.BONUSES.MORALE.REST_DEFAULT));
            }
        }

        return { superBonus, restBonus };
    }
}

// Legacy function for backward compatibility
function getHomeBonus(percent) {
    return BonusCalculator.getHomeBonus(percent);
}

function parseStadiumCapacity() {
    const divs = Array.from(document.querySelectorAll('div.lh16'));
    for (const div of divs) {
        const m = div.textContent.match(/Стадион\s+["«][^"»]+["»]\s+\(([\d\s]+)\)/i);
        if (m) {
            const cap = parseInt(m[1].replace(/\s/g, ''), 10);
            if (!isNaN(cap)) return cap;
        }
    }
    return null;
}

function getChemistryBonus(player, lineup, teamStyleId) {
    return 0.125;
}

function getSynergyBonus(player, lineup, teamStyleId, userSynergy) {
    const v = Number(userSynergy);
    if (!Number.isFinite(v) || v < 0) return 0;
    return Math.min(v, 1);
}

function buildCaptainContext(lineup, players, captainSelectEl) {
    const captainId = captainSelectEl && captainSelectEl.value ? String(captainSelectEl.value) : '';
    const captainPlayer = players.find(p => String(p.id) === captainId) || null;
    const dummyEntries = lineup.map(slot => {
        const pid = slot.getValue && slot.getValue();
        if (!pid) return null;
        const pl = players.find(p => String(p.id) === String(pid));
        return pl ? {
            player: pl
        } : null;
    });
    return {
        captainPlayer,
        captainId,
        dummyEntries
    };
}
/* ----------------------------- GLOBAL STATE MANAGER ----------------------------- */
class GameState {
    constructor() {
        this.teams = {
            home: this.createTeamState(),
            away: this.createTeamState()
        };
        this.ui = {};
        this.players = {
            home: [],
            away: []
        };
        this.weather = null;
        this.stadium = null;
    }

    createTeamState() {
        return {
            defenceType: 'zonal',
            rough: 'clean',
            morale: 'normal',
            style: 'norm',
            formation: '4-4-2',
            captain: null,
            lineup: new Array(11).fill(null),
            miniPositions: new Array(11).fill(null),
            synergy: 0
        };
    }

    getTeam(side) {
        return this.teams[side];
    }

    updateTeam(side, updates) {
        Object.assign(this.teams[side], updates);
        this.saveState();
    }

    saveState() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.HOME, JSON.stringify(this.teams.home));
            localStorage.setItem(CONFIG.STORAGE_KEYS.AWAY, JSON.stringify(this.teams.away));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    loadState() {
        try {
            const homeState = localStorage.getItem(CONFIG.STORAGE_KEYS.HOME);
            const awayState = localStorage.getItem(CONFIG.STORAGE_KEYS.AWAY);

            if (homeState) {
                Object.assign(this.teams.home, JSON.parse(homeState));
            }
            if (awayState) {
                Object.assign(this.teams.away, JSON.parse(awayState));
            }
        } catch (e) {
            console.warn('Failed to load state:', e);
        }
    }

    clearState() {
        this.teams.home = this.createTeamState();
        this.teams.away = this.createTeamState();
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.HOME);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.AWAY);
        } catch (e) {
            console.warn('Failed to clear state:', e);
        }
    }
}

// Global state instance
const gameState = new GameState();

// Backward compatibility
window.homeTeam = gameState.teams.home;
window.awayTeam = gameState.teams.away;
//вынесено наружу (TODO)
function getSynergyPercentHome() {
    const el = document.getElementById('vs_synergy_home');
    const v = el ? Number(el.value) : 0;
    return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0;
}

function getSynergyPercentAway() {
    const el = document.getElementById('vs_synergy_away');
    const v = el ? Number(el.value) : 0;
    return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0;
}

function setSynergyPercentHome(v) {
    const el = document.getElementById('vs_synergy_home');
    if (el) el.value = String(v != null ? Math.min(100, Math.max(0, v)) : 0);
}

function setSynergyPercentAway(v) {
    const el = document.getElementById('vs_synergy_away');
    if (el) el.value = String(v != null ? Math.min(100, Math.max(0, v)) : 0);
}

function clampSynergyInput(inputEl) {
    if (!inputEl) return;
    const n = Number(inputEl.value);
    if (!Number.isFinite(n)) {
        inputEl.value = '0.00';
        return;
    }
    const clamped = Math.min(100, Math.max(0, n));
    if (clamped !== n) inputEl.value = String(clamped);
}

/* ----------------------------- IMPROVED STATE MANAGEMENT ----------------------------- */
class StateManager {
    static saveAllStates() {
        // Use the centralized game state
        gameState.saveState();

        // Also update UI-specific values
        if (gameState.ui.homeLineupBlock && gameState.ui.awayLineupBlock) {
            StateManager.syncUIToState();
        }
    }

    static syncUIToState() {
        const homeTeam = gameState.getTeam('home');
        const awayTeam = gameState.getTeam('away');

        // Sync synergy values
        homeTeam.synergy = getSynergyPercentHome();
        awayTeam.synergy = getSynergyPercentAway();

        // Sync lineup data
        if (gameState.ui.homeLineupBlock) {
            homeTeam.lineup = gameState.ui.homeLineupBlock.lineup.map(slot => slot.getValue());
            homeTeam.miniPositions = gameState.ui.homeLineupBlock.lineup.map(slot =>
                slot.miniPositionSelect ? slot.miniPositionSelect.getValue() : null
            );
        }

        if (gameState.ui.awayLineupBlock) {
            awayTeam.lineup = gameState.ui.awayLineupBlock.lineup.map(slot => slot.getValue());
            awayTeam.miniPositions = gameState.ui.awayLineupBlock.lineup.map(slot =>
                slot.miniPositionSelect ? slot.miniPositionSelect.getValue() : null
            );
        }
    }

    static getCurrentTeamState(styleSel, formationSel, captainSel, lineupBlock) {
        return {
            style: styleSel.value,
            formation: formationSel.value,
            captain: captainSel.value,
            lineup: lineupBlock.lineup.map(slot => slot.getValue()),
            miniPositions: lineupBlock.lineup.map(slot =>
                slot.miniPositionSelect ? slot.miniPositionSelect.getValue() : null
            ),
            physicalForms: lineupBlock.lineup.map(slot => slot.physicalFormValue)
        };
    }
}

// Legacy function for backward compatibility
function saveAllStates() {
    StateManager.saveAllStates();
}

// Missing functions that are called in the code
function loadTeamState(storageKey) {
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.warn('Failed to load team state:', e);
        return null;
    }
}

function clearTeamState(storageKey) {
    try {
        localStorage.removeItem(storageKey);
    } catch (e) {
        console.warn('Failed to clear team state:', e);
    }
}

/* ----------------------------- SHIRTS CACHE FUNCTIONS ----------------------------- */
function getShirtsCacheKey(teamId) {
    return `vs_shirts_${teamId}`;
}

function getCachedShirts(teamId) {
    try {
        const cached = localStorage.getItem(getShirtsCacheKey(teamId));
        if (cached) {
            const data = JSON.parse(cached);
            // Кэш действителен 7 дней
            if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
                return data.shirts;
            }
        }
    } catch (e) {
        console.error('[Shirts] Cache read error', e);
    }
    return null;
}

function setCachedShirts(teamId, shirts) {
    try {
        localStorage.setItem(getShirtsCacheKey(teamId), JSON.stringify({
            shirts,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.error('[Shirts] Cache write error', e);
    }
}

// --- Вспомогательные селекторы ---
function createRoughSelector(team, onChange) {
    const select = document.createElement('select');
    select.className = 'rough-select';
    select.innerHTML = `<option value="clean">аккуратная</option><option value="rough">грубая</option>`;
    select.value = team.rough || 'clean';
    select.addEventListener('change', () => {
        team.rough = select.value;
        if (typeof onChange === 'function') onChange();
    });
    return select;
}

function createMoraleSelector(team, onChange) {
    const select = document.createElement('select');
    select.className = 'morale-select';
    select.innerHTML =
        `<option value="normal">обычный</option><option value="super">супер</option><option value="rest">отдых</option>`;
    const initial = (team && team.morale) ? String(team.morale) : 'normal';
    select.value = initial;

    function setTeamMorale(val) {
        if (team === window.homeTeam) {
            window.homeTeam.morale = val;
        } else if (team === window.awayTeam) {
            window.awayTeam.morale = val;
        }
        team.morale = val;
    }
    select.addEventListener('change', () => {
        const val = select.value;
        setTeamMorale(val);
        try {
            if (typeof saveAllStates === 'function') saveAllStates();
        } catch (e) { }
        if (typeof onChange === 'function') onChange();
        if (typeof window.__vs_recalcAll === 'function') window.__vs_recalcAll();
    });
    return select;
}

// --- UI UTILS ---

// Кэш стилей игроков
const PLAYER_STYLE_CACHE_KEY = 'vs_player_styles_cache';

function getPlayerStyleCache() {
    try {
        const cached = vsStorage.get(PLAYER_STYLE_CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (e) {
        console.warn('[Cache] Failed to load player styles cache', e);
        return {};
    }
}

function savePlayerStyleCache(cache) {
    try {
        vsStorage.set(PLAYER_STYLE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('[Cache] Failed to save player styles cache', e);
    }
}

function getPlayerStyleFromCache(playerId) {
    const cache = getPlayerStyleCache();
    return cache[playerId] || 'norm';
}

function setPlayerStyleToCache(playerId, styleValue) {
    const cache = getPlayerStyleCache();
    cache[playerId] = styleValue;
    savePlayerStyleCache(cache);
}

// Глобальная функция для расчета силы игрока с учетом всех модификаторов
function calculatePlayerStrengthGlobal(player, matchPosition, physicalFormId) {
    const baseStr = Number(player.baseStrength) || 0;

    // Определяем форму игрока
    let actualFormId = physicalFormId;
    if (!actualFormId || actualFormId === 'FRIENDLY_100') {
        const tournamentType = document.getElementById('vs_tournament_type')?.value || 'typeC';
        actualFormId = getPhysicalFormIdFromData(player.form, player.form_mod, tournamentType);
    }

    // Применяем все модификаторы
    const physicalFormModifier = getPhysicalFormModifier(actualFormId);
    const realityModifier = getRealityBonus(player.real_status, player.real_sign);
    const positionModifier = getPositionModifier(player.mainPos, player.secondPos, matchPosition);

    // Для товарищеских матчей усталость всегда 25%
    let fatigueModifier;
    const tournamentType = document.getElementById('vs_tournament_type')?.value || 'typeC';
    if (tournamentType === 'friendly') {
        fatigueModifier = 1 - (25 / 100); // 0.75
    } else {
        fatigueModifier = getFatigueBonus(player.fatigue);
    }

    const calculatedStr = baseStr * physicalFormModifier * fatigueModifier * realityModifier * positionModifier;

    return Math.round(calculatedStr);
}

/* ----------------------------- REUSABLE UI FACTORY ----------------------------- */
class UIFactory {
    static createSelect(options, selectedValue = null) {
        const select = document.createElement('select');
        select.style.borderRadius = '0';
        select.style.color = '#444';
        select.style.padding = '2px 4px';
        select.style.lineHeight = '16px';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });
        if (selectedValue) {
            select.value = selectedValue;
        }
        return select;
    }

    static createStyleSelector(selectedValue = 'norm') {
        const options = CONFIG.STYLES.ORDER.map(id => ({
            value: id,
            label: CONFIG.STYLES.LABELS[id]
        }));
        return this.createSelect(options, selectedValue);
    }

    static createWeatherSelector(selectedValue = null) {
        const options = CONFIG.WEATHER.OPTIONS.map(weather => ({
            value: weather,
            label: weather
        }));
        return this.createSelect(options, selectedValue);
    }

    static createTemperatureSelector(weather, selectedValue = null) {
        const select = document.createElement('select');
        select.style.borderRadius = '0';
        select.style.color = '#444';
        select.style.padding = '2px 4px';
        select.style.lineHeight = '16px';
        const [max, min] = CONFIG.WEATHER.TEMP_MAP[weather] || [25, 5];

        for (let t = max; t >= min; t--) {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t + '°';
            select.appendChild(opt);
        }

        if (selectedValue && selectedValue >= min && selectedValue <= max) {
            select.value = selectedValue;
        }

        return select;
    }
}

// Legacy function for backward compatibility
function createStyleSelector() {
    return UIFactory.createStyleSelector();
}

function createFormationSelector(formationManager) {
    const select = document.createElement('select');
    select.style.borderRadius = '0';
    select.style.color = '#444';
    select.style.padding = '2px 4px';
    select.style.lineHeight = '16px';
    formationManager.getAllFormations().forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
    return select;
}

function createDummySelect() {
    const select = document.createElement('select');
    select.innerHTML = '<option value="">—</option>';
    select.style.borderRadius = '0';
    select.style.color = '#444';
    select.style.padding = '2px 4px';
    select.style.lineHeight = '16px';
    return select;
}

// --- CSS ---
(function addCSS() {
    const css = `
    .morale-select, .rough-select, .defence-type-select {
      min-width: 110px; height: 20px; font-size: 11px; border: 1px solid #aaa;
      border-radius: 0; padding: 2px 4px; margin-left: 4px; transition: background 0.2s;
      color: #444; line-height: 16px;
    }
    #vsol-calculator-ui { width: 800px; margin: 20px auto; padding: 0; background: #f9f9f9; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; overflow: visible; }
    #vsol-calculator-ui > *:not(table) { padding-left: 15px; padding-right: 15px; }
    #vsol-calculator-ui > h3 { padding-top: 15px; padding-bottom: 10px; margin: 0; }
    #vsol-calculator-ui > div:first-child { padding-top: 15px; }
    #vsol-calculator-ui #vsol-synergy-ui {
      display: flex; gap: 24px; align-items: center; margin-top: 8px; padding-bottom: 15px;
    }
    #vsol-calculator-ui .vs-synergy-block { display: inline-flex; align-items: center; gap: 6px; }
    #vsol-calculator-ui .vs-synergy-input {
      width: 80px; height: 20px; line-height: 18px; font-size: 11px; padding: 1px 4px; box-sizing: border-box;
    }
    
    /* Настройки команд */
    #vs-home-settings-table, #vs-away-settings-table { width: 175px; }
    #vs-home-settings-table { margin-left: 0; }
    #vs-away-settings-table { margin-right: 0; }

    /* Таблица составов — фикс строк и выравнивание */
    #vsol-calculator-ui .orders-table { width: 350px; border-collapse: separate; table-layout: fixed; margin: 0 auto; }
    #vsol-calculator-ui #orders-table-home { margin-left: 25px; }
    #vsol-calculator-ui #orders-table-away { margin-right: 25px; }
    #vsol-calculator-ui .orders-table tr { height: 22px; }
    #vsol-calculator-ui .orders-table td { vertical-align: middle; padding: 0; }

    #vsol-calculator-ui .order { width: 35px; text-align: center; font-weight: bold; }
    #vsol-calculator-ui .txt { text-align: center; }
    #vsol-calculator-ui .mini-pos-cell { width: 35px; }
    #vsol-calculator-ui td.player-cell { width: 215px; }
    #vsol-calculator-ui td.style-cell { width: 40px; }
    #vsol-calculator-ui td.form-cell { width: 60px; }

    /* Псевдо-select2 для игрока */
    #vsol-calculator-ui .select2 { display: inline-block; position: relative; vertical-align: top; }
    #vsol-calculator-ui .select2-container--orders { width: 215px; }

    #vsol-calculator-ui .select2-selection {
      display: flex; align-items: center; justify-content: space-between;
      border: 1px solid #aaa; padding: 1px 4px;
      height: 20px; min-height: 20px; line-height: 18px; font-size: 11px;
      box-sizing: border-box; cursor: pointer; background: #fff;
    }
    #vsol-calculator-ui .select2-selection__rendered {
      color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      text-align: left; display: block; width: 100%;
    }
    #vsol-calculator-ui .select2-selection__arrow { height: 20px; display: flex; align-items: center; }
    #vsol-calculator-ui .select2-selection__arrow b {
      display: inline-block; border-style: solid; border-width: 5px 4px 0 4px;
      border-color: #555 transparent transparent transparent; margin-left: 6px;
    }
    #vsol-calculator-ui .dropdown-wrapper { display: none; }
    #vsol-calculator-ui .orders-dropdown {
      position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #aaa;
      z-index: 10000;
    }
    #vsol-calculator-ui .orders-option { padding: 2px 4px; height: 20px; line-height: 16px; font-size: 11px; text-align: left; cursor: pointer; color: #444; }
    #vsol-calculator-ui .orders-option:hover { background: #f0f0f0; }
    #vsol-calculator-ui .orders-option.disabled { color: #bbb; cursor: default; }
    #vsol-calculator-ui .orders-placeholder { color: rgb(163,163,163); }

    /* Мини-селектор позиции */
    #vsol-calculator-ui .mini-pos-cell .select2-selection { height: 20px; min-height: 20px; line-height: 18px; }

    /* Селектор стиля игрока */
    #vsol-calculator-ui .custom-style-select { position: relative; width: 100%; user-select: none; display: block; }
    #vsol-calculator-ui .custom-style-select .selected {
      border: 1px solid #aaa; padding: 2px 4px 2px 4px; background: #fff;
      display: flex; align-items: center; justify-content: center; gap: 2px; position: relative;
      height: 20px; min-height: 20px; line-height: 16px; font-size: 11px; box-sizing: border-box; cursor: pointer;
    }
    #vsol-calculator-ui .custom-style-select .selected::after {
      content: '';
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #555;
    }
    #vsol-calculator-ui .custom-style-select .icon { width: 14px; height: 14px; }
    #vsol-calculator-ui .custom-style-select .options {
      display: none; position: absolute; left: 0; width: 100%; background: #fff; border: 1px solid #aaa; border-top: none;
      z-index: 9999; margin: 0; padding: 0; list-style: none;
    }
    #vsol-calculator-ui .custom-style-select.open .options { display: block; }
    #vsol-calculator-ui .custom-style-select .options li {
      height: 20px; line-height: 16px; font-size: 11px; display: flex; align-items: center; justify-content: center; gap: 2px; cursor: pointer; padding: 2px 4px;
    }
    #vsol-calculator-ui .custom-style-select .options li:hover { background: #f0f0f0; }
    
    /* Селектор физической формы */
    #vsol-calculator-ui .physical-form-select { position: relative; width: 100%; user-select: none; display: block; }
    #vsol-calculator-ui .physical-form-select .selected {
      border: 1px solid #aaa; padding: 2px 20px 2px 4px; background: #fff;
      display: flex; align-items: center; justify-content: center; gap: 2px; position: relative;
      height: 20px; min-height: 20px; line-height: 16px; font-size: 11px; box-sizing: border-box; cursor: pointer;
    }
    #vsol-calculator-ui .physical-form-select .selected::after {
      content: '';
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #555;
    }
    #vsol-calculator-ui .physical-form-select .options {
      display: none; position: absolute; left: 0; width: 100%; background: #fff; border: 1px solid #aaa; border-top: none;
      z-index: 9999; margin: 0; padding: 0; list-style: none;
    }
    #vsol-calculator-ui .physical-form-select.open .options { display: block; }
    #vsol-calculator-ui .physical-form-select .options li {
      height: 20px; line-height: 16px; font-size: 11px; display: flex; align-items: center; gap: 2px; cursor: pointer; padding: 2px 4px;
    }
    #vsol-calculator-ui .physical-form-select .options li:hover { background: #f0f0f0; }
    
    /* Селектор капитана */
    #vsol-calculator-ui .vs-captain-row { margin-top: 4px; }
    #vsol-calculator-ui .vs-captain-table { width: 350px; border-collapse: separate; table-layout: fixed; margin: 0 auto; }
    #orders-table-home + .vs-captain-row .vs-captain-table { margin-left: 25px; }
    #orders-table-away + .vs-captain-row .vs-captain-table { margin-right: 25px; }
    #vsol-calculator-ui .vs-captain-cell-icon { width: 35px; text-align: center; vertical-align: middle; padding: 0; }
    #vsol-calculator-ui .vs-captain-cell-select { vertical-align: middle; padding: 0; }
    #vsol-calculator-ui .vs-captain-select {
      width: 100%; height: 20px; min-height: 20px; line-height: 16px; font-size: 11px; 
      border: 1px solid #aaa; padding: 2px 4px; box-sizing: border-box; 
      background: #fff; cursor: pointer; border-radius: 0; text-align: left;
      color: #444;
    }
    #vsol-calculator-ui .vs-captain-select option.captain-placeholder {
      color: rgb(163,163,163);
    }
    
    /* Стили для контейнера футболок */
    .shirts-container {
      pointer-events: none;
    }
    
    /* Индикатор загрузки футболок */
    .shirts-loading {
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
})();

// --- PLAYER SELECTORS ---
const PLAYER_STYLES = [{
    value: 'sp',
    icon: 'styles/o1.gif'
},
{
    value: 'brazil',
    icon: 'styles/o3.gif'
},
{
    value: 'tiki',
    icon: 'styles/o4.gif'
},
{
    value: 'bb',
    icon: 'styles/o2.gif'
},
{
    value: 'kat',
    icon: 'styles/o5.gif'
},
{
    value: 'brit',
    icon: 'styles/o6.gif'
},
{
    value: 'norm',
    icon: 'styles/o8.gif'
}
];

function createCustomStyleSelect(onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-style-select';
    const selectedDiv = document.createElement('div');
    selectedDiv.className = 'selected';
    const selectedIcon = document.createElement('img');
    selectedIcon.className = 'icon';
    selectedIcon.style.display = 'none';
    selectedDiv.appendChild(selectedIcon);
    wrapper.appendChild(selectedDiv);
    const optionsUl = document.createElement('ul');
    optionsUl.className = 'options custom-style-options';
    optionsUl.id = `custom-style-options-${Math.random().toString(36).substr(2, 9)}`;
    let currentValue = 'norm';
    PLAYER_STYLES.forEach(style => {
        const li = document.createElement('li');
        li.dataset.value = style.value;
        if (style.icon) {
            const img = document.createElement('img');
            img.src = style.icon;
            img.className = 'icon';
            li.appendChild(img);
        } else {
            // Для norm без иконки - просто пустое место
            const placeholder = document.createElement('div');
            placeholder.style.width = '14px';
            placeholder.style.height = '14px';
            li.appendChild(placeholder);
        }
        li.addEventListener('click', () => {
            currentValue = li.dataset.value;
            const styleObj = PLAYER_STYLES.find(s => s.value === currentValue) || PLAYER_STYLES[0];
            if (styleObj.icon) {
                selectedIcon.src = styleObj.icon;
                selectedIcon.style.display = '';
            } else {
                selectedIcon.style.display = 'none';
            }
            wrapper.classList.remove('open');
            optionsUl.style.display = 'none';
            if (onChange) onChange(currentValue);
        });
        optionsUl.appendChild(li);
    });
    wrapper.appendChild(optionsUl);
    const styleObj = PLAYER_STYLES.find(s => s.value === currentValue) || PLAYER_STYLES[0];
    if (styleObj.icon) {
        selectedIcon.src = styleObj.icon;
        selectedIcon.style.display = '';
    }
    selectedDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = wrapper.classList.toggle('open');
        optionsUl.style.display = open ? 'block' : 'none';
    });
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
            optionsUl.style.display = 'none';
        }
    });
    wrapper.getValue = () => currentValue;
    wrapper.setValue = (val) => {
        currentValue = val;
        const styleObj = PLAYER_STYLES.find(s => s.value === currentValue) || PLAYER_STYLES[0];
        if (styleObj.icon) {
            selectedIcon.src = styleObj.icon;
            selectedIcon.style.display = '';
        } else {
            selectedIcon.style.display = 'none';
        }
    };
    return wrapper;
}

function createPhysicalFormSelect(onChange, dayType = 'all') {
    const wrapper = document.createElement('div');
    wrapper.className = 'physical-form-select';

    const selectedDiv = document.createElement('div');
    selectedDiv.className = 'selected';
    selectedDiv.title = 'Физическая форма';

    const selectedIcon = document.createElement('div');
    selectedIcon.className = 'form-icon';
    selectedIcon.style.cssText = 'width: 18px; height: 19px; background: url(form/sprite-1.4.gif) no-repeat; display: inline-block; vertical-align: middle;';

    const selectedLabel = document.createElement('span');
    selectedLabel.textContent = '100%';
    selectedLabel.style.marginLeft = '4px';

    selectedDiv.appendChild(selectedIcon);
    selectedDiv.appendChild(selectedLabel);
    wrapper.appendChild(selectedDiv);

    const optionsUl = document.createElement('ul');
    optionsUl.className = 'options physical-form-options';
    optionsUl.id = `physical-form-options-${Math.random().toString(36).substr(2, 9)}`;

    let currentValue = 'FRIENDLY_100'; // По умолчанию 100%
    let availableForms = getPhysicalFormsByDayType(dayType);

    function renderOptions() {
        optionsUl.innerHTML = '';
        availableForms.forEach(form => {
            const li = document.createElement('li');
            li.dataset.value = form.id;
            li.title = form.title; // Подсказка при наведении

            const icon = document.createElement('div');
            icon.className = 'form-icon';
            icon.style.cssText = `width: 18px; height: 19px; background: url(form/sprite-1.4.gif) no-repeat ${form.bgPosition}; display: inline-block; vertical-align: middle;`;

            const label = document.createElement('span');
            label.textContent = form.percent + '%';

            li.appendChild(icon);
            li.appendChild(label);

            li.addEventListener('click', () => {
                currentValue = form.id;
                selectedLabel.textContent = form.percent + '%';
                selectedIcon.style.backgroundPosition = form.bgPosition;
                selectedDiv.title = form.title;
                wrapper.classList.remove('open');
                optionsUl.style.display = 'none';
                if (onChange) onChange(currentValue);
            });

            optionsUl.appendChild(li);
        });
    }

    renderOptions();
    wrapper.appendChild(optionsUl);

    // Установка начального значения
    const initialForm = CONFIG.PHYSICAL_FORM.FORMS[currentValue];
    if (initialForm) {
        selectedLabel.textContent = initialForm.percent + '%';
        selectedIcon.style.backgroundPosition = initialForm.bgPosition;
        selectedDiv.title = initialForm.title;
    }

    selectedDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = wrapper.classList.toggle('open');
        optionsUl.style.display = open ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
            optionsUl.style.display = 'none';
        }
    });

    wrapper.getValue = () => currentValue;
    wrapper.setValue = (val) => {
        currentValue = val || 'FRIENDLY_100';
        const form = CONFIG.PHYSICAL_FORM.FORMS[currentValue];
        if (form) {
            selectedLabel.textContent = form.percent + '%';
            selectedIcon.style.backgroundPosition = form.bgPosition;
            selectedDiv.title = form.title;
        }
    };

    wrapper.setDayType = (newDayType) => {
        dayType = newDayType;
        availableForms = getPhysicalFormsByDayType(dayType);
        renderOptions();
        // Проверяем, доступна ли текущая форма
        if (!availableForms.some(f => f.id === currentValue)) {
            currentValue = availableForms[0]?.id || 'FRIENDLY_100';
            wrapper.setValue(currentValue);
            if (onChange) onChange(currentValue);
        }
    };

    wrapper.setTournamentType = (tournamentType) => {
        return wrapper.setDayType(tournamentType);
    };

    return wrapper;
}

function createMiniPositionSelect({
    options,
    bg = '#FFFFBB',
    widthPx = 40,
    onChange
}) {
    const wrap = document.createElement('span');
    wrap.className = 'select2 select2-container select2-container--orders';
    wrap.style.width = widthPx + 'px';
    const selection = document.createElement('span');
    selection.className = 'selection';
    const sel = document.createElement('span');
    sel.className = 'select2-selection select2-selection--single';
    sel.style.backgroundColor = bg;
    const rendered = document.createElement('span');
    rendered.className = 'select2-selection__rendered';
    const arrow = document.createElement('span');
    arrow.className = 'select2-selection__arrow';
    arrow.appendChild(document.createElement('b'));
    sel.appendChild(rendered);
    sel.appendChild(arrow);
    selection.appendChild(sel);
    wrap.appendChild(selection);
    const dropdownWrapper = document.createElement('span');
    dropdownWrapper.className = 'dropdown-wrapper';
    wrap.appendChild(dropdownWrapper);
    const dropdown = document.createElement('div');
    dropdown.className = 'orders-dropdown';
    dropdownWrapper.appendChild(dropdown);
    let open = false;

    function toggle() {
        open = !open;
        dropdownWrapper.style.display = open ? 'block' : 'none';
    }
    sel.addEventListener('click', (e) => {
        toggle();
        e.stopPropagation();
    });
    document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) {
            open = false;
            dropdownWrapper.style.display = 'none';
        }
    });
    let localOptions = Array.isArray(options) ? options.slice() : [];
    let current = localOptions[0] ? localOptions[0] : {
        value: '',
        label: ''
    };
    rendered.textContent = current.label || '';

    function renderOptions(opts) {
        dropdown.innerHTML = '';
        opts.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'orders-option';
            div.textContent = opt.label;
            div.dataset.value = opt.value;
            div.addEventListener('click', () => {
                current = opt;
                rendered.textContent = opt.label;
                toggle();
                if (onChange) onChange(opt);
            });
            dropdown.appendChild(div);
        });
    }
    renderOptions(localOptions);
    return {
        el: wrap,
        getValue: () => current.value,
        setValue: (v, {
            allowTemp = true
        } = {}) => {
            const f = localOptions.find(o => o.value === v);
            if (f) {
                current = f;
            } else if (allowTemp) {
                current = {
                    value: v,
                    label: String(v)
                };
            } else {
                return;
            }
            rendered.textContent = current.label || '';
        },
        setBg: (color) => {
            sel.style.backgroundColor = color;
        },
        setOptions: (opts) => {
            localOptions = Array.isArray(opts) ? opts.slice() : [];
            renderOptions(localOptions);
            const still = localOptions.find(o => o.value === current.value);
            if (!still) {
                if (localOptions[0]) {
                    current = localOptions[0];
                    rendered.textContent = current.label || '';
                } else {
                    current = {
                        value: '',
                        label: ''
                    };
                    rendered.textContent = '';
                }
            } else {
                current = still;
                rendered.textContent = still.label || '';
            }
        }
    };
}

function createOrdersSelect({
    placeholder,
    options,
    widthPx = 215,
    onChange
}) {
    const wrap = document.createElement('span');
    wrap.className = 'select2 select2-container select2-container--orders';
    wrap.style.width = widthPx + 'px';
    const selection = document.createElement('span');
    selection.className = 'selection';
    const sel = document.createElement('span');
    sel.className = 'select2-selection select2-selection--single';
    sel.setAttribute('role', 'combobox');
    sel.setAttribute('aria-haspopup', 'true');
    sel.setAttribute('aria-expanded', 'false');
    sel.tabIndex = 0;
    const rendered = document.createElement('span');
    rendered.className = 'select2-selection__rendered orders-placeholder';
    rendered.textContent = placeholder || '';
    const arrow = document.createElement('span');
    arrow.className = 'select2-selection__arrow';
    const b = document.createElement('b');
    arrow.appendChild(b);
    sel.appendChild(rendered);
    sel.appendChild(arrow);
    selection.appendChild(sel);
    wrap.appendChild(selection);
    const dropdownWrapper = document.createElement('span');
    dropdownWrapper.className = 'dropdown-wrapper';
    wrap.appendChild(dropdownWrapper);
    const dropdown = document.createElement('div');
    dropdown.className = 'orders-dropdown';
    dropdownWrapper.appendChild(dropdown);
    let currentValue = '';

    function close() {
        dropdownWrapper.style.display = 'none';
        sel.setAttribute('aria-expanded', 'false');
    }

    function open() {
        dropdownWrapper.style.display = 'block';
        sel.setAttribute('aria-expanded', 'true');
    }
    sel.addEventListener('click', (e) => {
        if (dropdownWrapper.style.display === 'block') close();
        else open();
        e.stopPropagation();
    });
    document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) close();
    });

    function renderOptions(opts) {
        dropdown.innerHTML = '';
        opts.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'orders-option' + (opt.disabled ? ' disabled' : '');
            div.textContent = opt.label;
            div.dataset.value = opt.value;
            if (!opt.disabled) {
                div.addEventListener('click', () => {
                    currentValue = String(opt.value || '');
                    rendered.textContent = opt.label;
                    rendered.classList.remove('orders-placeholder');
                    close();
                    if (onChange) onChange(currentValue);
                });
            }
            dropdown.appendChild(div);
        });
    }
    renderOptions(options || []);
    return {
        el: wrap,
        setOptions(newOptions) {
            renderOptions(newOptions);
        },
        setPlaceholder(text) {
            rendered.textContent = text;
            rendered.classList.add('orders-placeholder');
        },
        getValue() {
            return currentValue;
        },
        setValue(value, label) {
            currentValue = String(value || '');
            rendered.textContent = label || '';
            if (!label) rendered.classList.add('orders-placeholder');
            else rendered.classList.remove('orders-placeholder');
        }
    };
}

// --- FORMATIONS ---
const FORMATIONS = {
    "4-4-2": ["GK", "LD", "CD", "CD", "RD", "LM", "CM", "CM", "RM", "CF", "CF"],
    "3-5-2": ["GK", "LD", "CD", "RD", "LM", "CM", "CM", "CM", "RM", "CF", "CF"],
    "5-3-2": ["GK", "LD", "CD", "CD", "CD", "RD", "LM", "CM", "RM", "CF", "CF"],
    "4-3-3": ["GK", "LD", "CD", "CD", "RD", "LM", "CM", "RM", "CF", "CF", "CF"],
    "3-4-3": ["GK", "LD", "CD", "RD", "LM", "CM", "CM", "RM", "CF", "CF", "CF"],
    "4-5-1": ["GK", "LD", "CD", "CD", "RD", "LM", "CM", "CM", "CM", "RM", "CF"],
    "3-6-1": ["GK", "LD", "CD", "RD", "LM", "DM", "CM", "CM", "CM", "RM", "CF"],
    "4-2-4": ["GK", "LD", "CD", "CD", "RD", "CM", "CM", "LF", "CF", "CF", "RF"],
    "5-4-1": ["GK", "LD", "CD", "CD", "CD", "RD", "LM", "CM", "CM", "RM", "CF"],
};

const POSITION_PLACEHOLDERS = {
    GK: 'выберите вратаря:',
    LD: 'выберите левого защитника:',
    LB: 'выберите левого вингбэка:',
    CD: 'выберите центрального защитника:',
    SW: 'выберите последнего защитника:',
    RD: 'выберите правого защитника:',
    RB: 'выберите правого вингбэка:',
    LM: 'выберите левого полузащитника:',
    LW: 'выберите левого вингера:',
    CM: 'выберите центрального полузащитника:',
    DM: 'выберите опорного полузащитника:',
    AM: 'выберите атакующего полузащитника:',
    FR: 'выберите свободного художника:',
    RM: 'выберите правого полузащитника:',
    RW: 'выберите правого вингера:',
    CF: 'выберите центрального нападающего:',
    ST: 'выберите выдвинутого нападающего:',
    LF: 'выберите левого нападающего:',
    RF: 'выберите правого нападающего:'
};

function getAllowedMiniOptions({
    formationName,
    positions,
    rowIndex
}) {
    const pos = positions[rowIndex];
    if (!pos) return [];
    const is424 = formationName === '4-2-4';
    const is361 = formationName === '3-6-1';
    const counts = positions.reduce((acc, p, i) => {
        acc[p] = (acc[p] || 0) + 1;
        if (!acc.indexes) acc.indexes = {};
        if (!acc.indexes[p]) acc.indexes[p] = [];
        acc.indexes[p].push(i);
        return acc;
    }, {});
    const hasLW = positions.includes('LW');
    const hasRW = positions.includes('RW');
    const add = (arr, v, extra = {}) => {
        if (!arr.some(o => o.value === v)) {
            arr.push({
                value: v,
                label: v,
                ...extra
            });
        }
    };
    const cmIdxs = (counts.indexes && counts.indexes['CM']) || [];
    const cmCount = cmIdxs.length;
    const cmSorted = [...cmIdxs].sort((a, b) => a - b);
    const cmMin1 = cmSorted[0] ?? null;
    const cmMin2 = cmSorted[1] ?? null;
    const cmMax = cmSorted.length ? cmSorted[cmSorted.length - 1] : null;
    const dmIdxs = (counts.indexes && counts.indexes['DM']) || [];
    const dmCount = dmIdxs.length;
    const cdIdxs = (counts.indexes && counts.indexes['CD']) || [];
    const cdCount = cdIdxs.length;
    const cdMin = cdIdxs.length ? Math.min(...cdIdxs) : null;
    const cfIdxs = (counts.indexes && counts.indexes['CF']) || [];
    const cfCount = cfIdxs.length;
    const cfMin = cfIdxs.length ? Math.min(...cfIdxs) : null;
    const cfMax = cfIdxs.length ? Math.max(...cfIdxs) : null;
    const lmIdxs = (counts.indexes && counts.indexes['LM']) || [];
    const rmIdxs = (counts.indexes && counts.indexes['RM']) || [];
    const options = [];
    add(options, pos);
    switch (pos) {
        case 'LD':
            add(options, 'LB');
            break;
        case 'LB':
            add(options, 'LD');
            break;
        case 'RD':
            add(options, 'RB');
            break;
        case 'RB':
            add(options, 'RD');
            break;
        case 'CD': {
            if (cdCount > 1 && rowIndex === cdMin) add(options, 'SW');
            break;
        }
        case 'SW': {
            add(options, 'CD');
            break;
        }
        case 'LM': {
            if (is424) add(options, 'CM');
            const amAbsent = (counts['AM'] || 0) < 1;
            if (amAbsent && !hasLW) add(options, 'LW');
            break;
        }
        case 'RM': {
            if (is424) add(options, 'CM');
            const amAbsent = (counts['AM'] || 0) < 1;
            if (amAbsent && !hasRW) add(options, 'RW');
            break;
        }
        case 'CM': {
            if (!is424) {
                let cmToDMAllowed = false;
                if ((dmCount < 2) && cmCount > 2 && (rowIndex === cmMin1 || rowIndex === cmMin2)) cmToDMAllowed = true;
                if ((dmCount < 2) && cmCount === 2 && rowIndex === cmMin1) cmToDMAllowed = true;
                if ((dmCount < 2) && cmCount === 1) cmToDMAllowed = true;
                if (cmToDMAllowed) add(options, 'DM');
                const noLWnoRW = !hasLW || !hasRW;
                const amAbsent = (counts['AM'] || 0) < 1;
                const isMaxCM = rowIndex === cmMax;
                if (noLWnoRW && amAbsent && isMaxCM) add(options, 'AM');
            } else {
                if (rowIndex === cmMin1) add(options, 'LM');
                if (rowIndex === cmMax) add(options, 'RM');
                const frCount = counts['FR'] || 0;
                if (frCount < 1 && rowIndex === cmMax) add(options, 'FR');
            }
            break;
        }
        case 'DM': {
            const locked = is361 && dmCount === 1;
            if (!locked) {
                add(options, 'CM');
                const amAllowed = !is424 && (counts['AM'] || 0) < 1 && hasLW && hasRW;
                if (amAllowed) add(options, 'AM');
            }
            break;
        }
        case 'AM':
            add(options, 'CM');
            break;
        case 'CF': {
            if (is424) {
                const stIdxs = (counts.indexes && counts.indexes['ST']) || [];
                const stTaken = stIdxs.length > 0;
                if (positions[rowIndex] === 'CF' && !stTaken) add(options, 'ST');
                if (positions[rowIndex] === 'ST') add(options, 'CF');
            } else if (cfCount === 2) {
                if (rowIndex === cfMin) add(options, 'LF');
                if (rowIndex === cfMax) add(options, 'RF');
            } else if (cfCount === 3) {
                const cfSorted = [...cfIdxs].sort((a, b) => a - b);
                const leftCF = cfSorted[0];
                const midCF = cfSorted[1];
                const rightCF = cfSorted[2];
                if (rowIndex === leftCF) add(options, 'LF');
                if (rowIndex === rightCF) add(options, 'RF');
                if (rowIndex === midCF) add(options, 'ST');
            }
            break;
        }
        case 'ST':
            add(options, 'CF');
            break;
        case 'LF': {
            if (!is424) add(options, 'CF');
            break;
        }
        case 'RF': {
            if (!is424) add(options, 'CF');
            break;
        }
        default:
            break;
    }
    if (is424) {
        if (pos === 'CM' && cmCount === 2) {
            const otherCMIndex = cmIdxs.find(idx => idx !== rowIndex);
            options.forEach(opt => {
                if (opt.value === 'LM' || opt.value === 'RM') {
                    const otherValue = (opt.value === 'LM') ? 'RM' : 'LM';
                    opt.syncChange = [{
                        index: otherCMIndex,
                        value: otherValue
                    }];
                }
            });
        }
        if (pos === 'LM' && rmIdxs.length >= 1) {
            const otherRM = rmIdxs[0];
            options.forEach(opt => {
                if (opt.value === 'CM') {
                    opt.syncChange = [{
                        index: otherRM,
                        value: 'CM'
                    }];
                }
            });
        }
        if (pos === 'RM' && lmIdxs.length >= 1) {
            const otherLM = lmIdxs[0];
            options.forEach(opt => {
                if (opt.value === 'CM') {
                    opt.syncChange = [{
                        index: otherLM,
                        value: 'CM'
                    }];
                }
            });
        }
    }
    return options;
}

function onMiniPositionChange({
    formationName,
    positions,
    rowIndex,
    selectedOpt,
    lineup,
    afterChange
}) {
    if (!selectedOpt) return positions;
    const is424 = formationName === '4-2-4';
    const newPositions = [...positions];
    newPositions[rowIndex] = selectedOpt.value;
    const syncArr = Array.isArray(selectedOpt.syncChange) ? selectedOpt.syncChange : (selectedOpt.syncChange ? [
        selectedOpt.syncChange
    ] : []);
    for (const sc of syncArr) {
        if (sc && typeof sc.index === 'number' && sc.value) {
            newPositions[sc.index] = sc.value;
            if (lineup && lineup[sc.index] && lineup[sc.index].miniPositionSelect) {
                const opts2 = getAllowedMiniOptions({
                    formationName,
                    positions: newPositions,
                    rowIndex: sc.index
                });
                lineup[sc.index].miniPositionSelect.setOptions(opts2);
                lineup[sc.index].miniPositionSelect.setValue(sc.value);
            }
        }
    }
    if (is424) {
        const lmIdxs = [];
        const rmIdxs = [];
        const cmIdxs = [];
        newPositions.forEach((p, i) => {
            if (p === 'LM') lmIdxs.push(i);
            if (p === 'RM') rmIdxs.push(i);
            if (p === 'CM') cmIdxs.push(i);
        });
        const exactlyOneCM = cmIdxs.length === 1;
        const exactlyOneWing = (lmIdxs.length + rmIdxs.length) === 1;
        if (exactlyOneCM && exactlyOneWing) {
            const wingIndex = lmIdxs[0] ?? rmIdxs[0];
            newPositions[wingIndex] = 'CM';
            if (lineup && lineup[wingIndex] && lineup[wingIndex].miniPositionSelect) {
                const optsW = getAllowedMiniOptions({
                    formationName,
                    positions: newPositions,
                    rowIndex: wingIndex
                });
                lineup[wingIndex].miniPositionSelect.setOptions(optsW);
                lineup[wingIndex].miniPositionSelect.setValue('CM');
            }
        }
    }
    if (lineup && lineup[rowIndex] && lineup[rowIndex].miniPositionSelect) {
        const opts1 = getAllowedMiniOptions({
            formationName,
            positions: newPositions,
            rowIndex
        });
        lineup[rowIndex].miniPositionSelect.setOptions(opts1);
        lineup[rowIndex].miniPositionSelect.setValue(selectedOpt.value);
    }
    if (typeof afterChange === 'function') afterChange(newPositions);
    return newPositions;
}

function mapCustomStyleToStyleId(customValue) {
    return customValue in STYLE_VALUES ? customValue : 'norm';
}

function parseWeatherFromPreview() {
    const weatherDiv = Array.from(document.querySelectorAll('div.lh16')).find(div =>
        div.textContent.includes('Прогноз погоды:')
    );
    if (!weatherDiv) return null;
    const text = weatherDiv.textContent;
    const weatherMatch = text.match(/Прогноз погоды:.*?([а-яё\- ]+),/i);
    const weather = weatherMatch ? weatherMatch[1].trim() : '';
    const tempMatch = text.match(/, ([\d\-]+)[°]/);
    let temperature = '';
    if (tempMatch) {
        const tempStr = tempMatch[1].trim();
        if (tempStr.includes('-')) temperature = parseInt(tempStr.split('-')[0]);
        else temperature = parseInt(tempStr);
    }
    return {
        weather,
        temperature,
        icon: weatherDiv.querySelector('img')?.src || ''
    };
}
class FormationManager {
    constructor(formations) {
        this.formations = formations;
        this.formationNames = Object.keys(formations);
    }
    getPositions(formationName) {
        return this.formations[formationName] || [];
    }
    getAllFormations() {
        return this.formationNames;
    }
}

function logPlayerWeatherCoef({
    player,
    customStyleValue,
    strength
}) {
    const wt = getCurrentWeatherFromUI();
    if (!wt) {
        return;
    }
    const styleId = mapCustomStyleToStyleId(customStyleValue);
    const styleNumeric = STYLE_VALUES[styleId] ?? 0;
    getWeatherStrengthValueCached(styleNumeric, wt.temperature, wt.weather, strength, (res) => {
        // WeatherCoef calculation completed
    });
}

function getCurrentWeatherFromUI() {
    const ui = document.getElementById('vsol-weather-ui');
    if (!ui) return null;
    const selects = ui.querySelectorAll('select');
    if (selects.length < 2) return null;
    return {
        weather: selects[0].value,
        temperature: Number((selects[1].value || '').replace('°', '')) || 0
    };
}
// --- MAIN LINEUP BLOCK ---
function createTeamLineupBlock(players, initialFormationName = "4-4-2", teamId = null) {
    const lineup = [];
    const selectedPlayerIds = new Set();
    const table = document.createElement('table');
    table.className = 'orders-table';
    if (teamId) {
        table.id = `orders-table-${teamId}`;
    }
    const rowsCount = 11;
    let formationName = initialFormationName;
    let positions = FORMATIONS[formationName];

    function buildPlaceholder(posValue) {
        return POSITION_PLACEHOLDERS[posValue] || 'выберите игрока:';
    }

    function getFilteredPlayersForRow(posValue, currentValue) {
        let pool;
        if (posValue === 'GK') {
            pool = players.filter(p => p.mainPos === 'GK' || p.secondPos === 'GK');
        } else {
            pool = players.filter(p => p.mainPos !== 'GK' && p.secondPos !== 'GK');
        }
        const otherSelected = Array.from(selectedPlayerIds).filter(id => id !== currentValue);
        pool = pool.filter(p => !otherSelected.includes(String(p.id)));
        pool.sort((a, b) => (Number(b.realStr || 0) - Number(a.realStr || 0)));
        return pool;
    }

    function calculatePlayerStr(player, matchPosition, physicalFormId) {
        const baseStr = Number(player.baseStrength) || 0;

        // Определяем форму игрока
        let actualFormId = physicalFormId;
        if (!actualFormId || actualFormId === 'FRIENDLY_100') {
            const tournamentType = getTournamentType();
            actualFormId = getPhysicalFormIdFromData(player.form, player.form_mod, tournamentType);
        }

        // Применяем все модификаторы
        const physicalFormModifier = getPhysicalFormModifier(actualFormId);
        const realityModifier = getRealityBonus(player.real_status, player.real_sign);
        const positionModifier = getPositionModifier(player.mainPos, player.secondPos, matchPosition);

        // Для товарищеских матчей усталость всегда 25%
        let fatigueModifier;
        const tournamentType = getTournamentType();
        if (tournamentType === 'friendly') {
            fatigueModifier = 1 - (25 / 100); // 0.75
        } else {
            fatigueModifier = getFatigueBonus(player.fatigue);
        }

        const calculatedStr = baseStr * physicalFormModifier * fatigueModifier * realityModifier * positionModifier;

        return Math.round(calculatedStr);
    }

    function toOptionLabel(p, matchPosition, physicalFormId) {
        const pos = [p.mainPos, p.secondPos].filter(Boolean).join('/');
        const percent = (Number(p.form) || 0) + '%';

        // Определяем какую силу показывать
        let displayStr;

        // Определяем автоматическую форму игрока
        const tournamentType = getTournamentType();
        const autoFormId = getPhysicalFormIdFromData(p.form, p.form_mod, tournamentType);

        if (autoFormId === 'UNKNOWN' || (physicalFormId && physicalFormId !== autoFormId)) {
            // Форма неизвестна или изменена пользователем - рассчитываем от baseStr
            displayStr = calculatePlayerStr(p, matchPosition, physicalFormId || autoFormId);
        } else {
            // Форма известна и не изменена - используем realStr из игры с positionModifier
            const realStr = Number(p.realStr) || 0;
            const positionModifier = getPositionModifier(p.mainPos, p.secondPos, matchPosition);
            displayStr = Math.round(realStr * positionModifier);
        }

        return `${p.name.padEnd(16, ' ')} ${pos.padEnd(6, ' ')} ${percent.padStart(3, ' ')}   ${displayStr}`;
    }

    function updatePlayerSelectOptions() {
        lineup.forEach(slot => {
            const currentVal = slot.getValue();
            const pool = getFilteredPlayersForRow(slot.posValue, currentVal);
            const placeholder = buildPlaceholder(slot.posValue);
            const matchPosition = slot.posValue;
            const currentSlotFormId = slot.physicalFormValue;  // Может быть null - это нормально

            // Для каждого игрока в dropdown используем его собственную форму
            const opts = pool.map(p => {
                // Находим слот, в котором находится этот игрок (если он выбран где-то)
                const playerSlot = lineup.find(s => s.getValue() === String(p.id));
                const playerFormId = playerSlot ? playerSlot.physicalFormValue : null;

                return {
                    value: String(p.id),
                    label: toOptionLabel(p, matchPosition, playerFormId)
                };
            });
            slot.setOptions(opts);

            // Обновляем label выбранного игрока с его собственной формой
            if (currentVal) {
                const selectedPlayer = pool.find(p => String(p.id) === currentVal);
                if (selectedPlayer) {
                    const newLabel = toOptionLabel(selectedPlayer, matchPosition, currentSlotFormId);
                    slot.setValue(currentVal, newLabel);
                }
            } else if (!pool.some(p => String(p.id) === currentVal)) {
                slot.setValue('', '');
                if (typeof slot.setPlaceholder === 'function') slot.setPlaceholder(placeholder);
            }
        });
        if (typeof updateCaptainOptionsProxy === 'function') updateCaptainOptionsProxy();
        if (typeof window.__vs_onLineupChanged === 'function') window.__vs_onLineupChanged();
    }
    let captainSelectRef = null;

    function attachCaptainSelect(ref) {
        captainSelectRef = ref;
    }

    function updateCaptainOptionsProxy() {
        if (!captainSelectRef) return;
        const inLineupIds = new Set(lineup.map(s => s.getValue()).filter(Boolean));
        const available = players.filter(p => inLineupIds.has(String(p.id)));

        // Обновляем title селектора
        if (available.length === 0) {
            captainSelectRef.title = 'Некому быть капитаном';
        } else {
            captainSelectRef.title = 'Выберите капитана';
        }

        const dummyEntries = lineup.map(slot => {
            const pid = slot.getValue && slot.getValue();
            if (!pid) return null;
            const pl = players.find(pp => String(pp.id) === String(pid));
            return pl ? {
                player: pl
            } : null;
        });
        const prev = captainSelectRef.value;
        captainSelectRef.innerHTML = '<option value="" class="captain-placeholder">— не выбран —</option>';
        available.forEach(p => {
            const percent = estimateCaptainPercent(p, dummyEntries);

            // Находим слот капитана для получения его позиции и формы
            const captainSlot = lineup.find(slot => {
                const pid = slot.getValue && slot.getValue();
                return pid && String(pid) === String(p.id);
            });

            let captainCalculatedStr;
            if (captainSlot && captainSlot.posValue && captainSlot.physicalFormValue) {
                // Используем calculatePlayerStr для точного расчета
                captainCalculatedStr = calculatePlayerStr(p, captainSlot.posValue, captainSlot.physicalFormValue);
            } else {
                // Fallback на realStr если нет данных о позиции/форме
                captainCalculatedStr = Number(p.realStr) || 0;
            }

            const captainBonus = captainCalculatedStr * percent;

            const opt = document.createElement('option');
            opt.value = p.id;

            // Форматирование: если бонус положительный - показываем число и проценты, если отрицательный/нулевой - только проценты
            if (captainBonus > 0) {
                opt.textContent = `${p.name} — ${captainBonus.toFixed(2)} (+${(percent * 100).toFixed(0)}%)`;
            } else {
                opt.textContent = `${p.name} — ${captainBonus.toFixed(1)} (${(percent * 100).toFixed(0)}%)`;
            }

            captainSelectRef.appendChild(opt);
        });
        if (prev && Array.from(captainSelectRef.options).some(o => o.value === prev)) {
            captainSelectRef.value = prev;
        }
    }
    for (let row = 0; row < rowsCount; row++) {
        const tr = document.createElement('tr');
        const tdPos = document.createElement('td');
        const tdSel = document.createElement('td');
        let mini = null;
        const miniOpts = getAllowedMiniOptions({
            formationName,
            positions,
            rowIndex: row
        });
        const initialPos = positions[row];
        if (row === 0) {
            tdPos.className = 'order';
            tdPos.style.backgroundColor = '#FFFFBB';
            tdPos.textContent = 'GK';
        } else {
            tdPos.className = 'txt mini-pos-cell';
            mini = createMiniPositionSelect({
                options: miniOpts,
                bg: '#FFFFBB',
                onChange: (selectedOpt) => {
                    const currentPositions = lineup.map(s => s.posValue || '');
                    const updated = onMiniPositionChange({
                        formationName,
                        positions: currentPositions,
                        rowIndex: row,
                        selectedOpt,
                        lineup,
                        afterChange: (newPositions) => {
                            newPositions.forEach((p, i) => {
                                lineup[i].posValue = p;
                            });
                            selectedPlayerIds.clear();
                            lineup.forEach(s => {
                                const v = s.getValue();
                                if (v) selectedPlayerIds.add(v);
                            });
                            updatePlayerSelectOptions();
                            if (typeof updateCaptainOptionsProxy === 'function')
                                updateCaptainOptionsProxy();
                            if (typeof window.__vs_onLineupChanged === 'function') window
                                .__vs_onLineupChanged();
                        }
                    });
                    lineup[row].posValue = updated[row];
                }
            });
            const miniSel = mini.el.querySelector('.select2-selection');
            if (miniSel) {
                miniSel.style.height = '20px';
                miniSel.style.minHeight = '20px';
                miniSel.style.lineHeight = '18px';
            }
            if (miniOpts[0]) mini.setValue(miniOpts[0].value);
            tdPos.appendChild(mini.el);
        }
        const placeholder = buildPlaceholder(initialPos);
        const orders = createOrdersSelect({
            placeholder,
            options: []
        });
        orders.setPlaceholder(placeholder);
        orders.setValue('', '');
        const rendered = orders.el.querySelector('.select2-selection__rendered');

        if (rendered) {
            rendered.style.textAlign = 'left';
            rendered.style.justifyContent = 'flex-start';
        }
        const styleSelect = createCustomStyleSelect((styleValue) => {
            slotApi.customStyleValue = styleValue;
            const playerId = slotApi.getValue && slotApi.getValue();

            // Сохраняем стиль игрока в кэш
            if (playerId) {
                setPlayerStyleToCache(playerId, styleValue);
            }

            const player = players.find(p => String(p.id) === String(playerId));
            if (player) {
                logPlayerWeatherCoef({
                    player,
                    customStyleValue: slotApi.customStyleValue || 'norm',
                    strength: Number(player.realStr) || 0
                });
            }
        });
        styleSelect.style.display = 'block';
        const styleSelSelected = styleSelect.querySelector('.selected');
        if (styleSelSelected) {
            styleSelSelected.style.height = '20px';
            styleSelSelected.style.minHeight = '20px';
            styleSelSelected.style.lineHeight = '18px';
            styleSelSelected.style.padding = '1px 4px';
            styleSelSelected.style.boxSizing = 'border-box';
        }
        const slotApi = {
            rowIndex: row,
            posValue: initialPos,
            getValue: () => orders.getValue(),
            setValue: (v, label) => {
                orders.setValue(v, label);
                // Проверяем форму игрока при установке
                if (v) {
                    const player = players.find(p => String(p.id) === String(v));
                    if (player) {
                        // Загружаем стиль игрока из кэша
                        const cachedStyle = getPlayerStyleFromCache(v);
                        if (cachedStyle && cachedStyle !== 'norm') {
                            slotApi.customStyleValue = cachedStyle;
                            if (styleSelect && styleSelect.setValue) {
                                styleSelect.setValue(cachedStyle);
                            }
                        }

                        if (slotApi.physicalFormSelect) {
                            const tournamentType = document.getElementById('vs_tournament_type')?.value || 'typeC';
                            const autoFormId = getPhysicalFormIdFromData(player.form, player.form_mod, tournamentType);

                            // Устанавливаем форму только если она ещё не установлена (null)
                            // Если форма уже установлена вручную, не перезаписываем её
                            if (slotApi.physicalFormValue === null) {
                                slotApi.physicalFormSelect.setValue(autoFormId);
                                slotApi.physicalFormValue = autoFormId;

                                // Пересчитываем realStr с учетом физ формы
                                const baseRealStr = Number(player.baseRealStr || player.realStr) || 0;
                                const modifiedRealStr = applyPhysicalFormToRealStr(baseRealStr, autoFormId);
                                slotApi.modifiedRealStr = modifiedRealStr;
                            }
                        }
                    }
                }
            },
            setOptions: (opts) => orders.setOptions(opts),
            setPlaceholder: (ph) => orders.setPlaceholder(ph),
            customStyleValue: 'norm',
            physicalFormValue: null,  // Будет установлено при выборе игрока
            modifiedRealStr: null,
            miniPositionSelect: mini,
            physicalFormSelect: null  // Будет установлен позже
        };
        orders.el.addEventListener('click', (e) => e.stopPropagation());
        const onChangePlayer = (value) => {
            selectedPlayerIds.clear();
            lineup.forEach(s => {
                const v = s.getValue();
                if (v) selectedPlayerIds.add(v);
            });
            updatePlayerSelectOptions();
            const player = players.find(p => String(p.id) === value);
            if (player) {
                logPlayerWeatherCoef({
                    player,
                    customStyleValue: slotApi.customStyleValue || 'norm',
                    strength: Number(player.realStr) || 0
                });

                // Автоматически устанавливаем форму на основе данных игрока
                if (slotApi.physicalFormSelect) {
                    const tournamentType = document.getElementById('vs_tournament_type')?.value || 'typeC';
                    const formId = getPhysicalFormIdFromData(player.form, player.form_mod, tournamentType);
                    slotApi.physicalFormSelect.setValue(formId);
                    slotApi.physicalFormValue = formId;

                    // Пересчитываем realStr с учетом физ формы
                    const baseRealStr = Number(player.baseRealStr || player.realStr) || 0;
                    const modifiedRealStr = applyPhysicalFormToRealStr(baseRealStr, formId);
                    slotApi.modifiedRealStr = modifiedRealStr;

                    // Обновляем селекторы игроков с новой формой
                    updatePlayerSelectOptions();
                }
            }
        };
        const origSetOptions = slotApi.setOptions.bind(slotApi);
        slotApi.setOptions = (opts) => {
            origSetOptions(opts);
            const dropdown = orders.el.querySelector('.orders-dropdown');
            if (dropdown) {
                dropdown.querySelectorAll('.orders-option').forEach(div => {
                    const val = div.dataset.value;
                    if (val) {
                        div.addEventListener('click', () => onChangePlayer(val), {
                            once: true
                        });
                    }
                });
            }
        };
        // Ячейка с селектором игрока
        tdSel.className = 'player-cell';
        tdSel.appendChild(orders.el);

        // Ячейка с селектором стиля
        const tdStyle = document.createElement('td');
        tdStyle.className = 'txt style-cell';
        tdStyle.appendChild(styleSelect);

        // Ячейка с селектором физической формы
        const tdForm = document.createElement('td');
        tdForm.className = 'txt form-cell';

        const physicalFormSelect = createPhysicalFormSelect((formId) => {
            slotApi.physicalFormValue = formId;
            const playerId = slotApi.getValue && slotApi.getValue();
            const player = players.find(p => String(p.id) === String(playerId));
            if (player) {
                // Пересчитываем realStr с учетом физ формы
                const baseRealStr = Number(player.baseRealStr || player.realStr) || 0;
                const modifiedRealStr = applyPhysicalFormToRealStr(baseRealStr, formId);
                slotApi.modifiedRealStr = modifiedRealStr;

                // Обновляем все селекторы (каждый игрок сохраняет свою форму)
                updatePlayerSelectOptions();
            }
        }, 'typeC');

        physicalFormSelect.style.display = 'block';
        const physFormSelected = physicalFormSelect.querySelector('.selected');
        if (physFormSelected) {
            physFormSelected.style.height = '20px';
            physFormSelected.style.minHeight = '20px';
            physFormSelected.style.lineHeight = '18px';
            physFormSelected.style.padding = '1px 4px';
            physFormSelected.style.boxSizing = 'border-box';
        }

        tdForm.appendChild(physicalFormSelect);
        slotApi.physicalFormSelect = physicalFormSelect;

        // Добавляем все ячейки в строку
        tr.appendChild(tdPos);
        tr.appendChild(tdSel);
        tr.appendChild(tdStyle);
        tr.appendChild(tdForm);
        table.appendChild(tr);
        lineup.push(slotApi);
    }

    function applyFormation(newFormationName) {
        formationName = newFormationName || formationName;
        positions = FORMATIONS[formationName];
        if (!Array.isArray(positions)) return;
        lineup.forEach((slot, idx) => {
            const newPos = positions[idx] || '';
            slot.posValue = newPos;
            if (idx > 0 && slot.miniPositionSelect) {
                const opts = getAllowedMiniOptions({
                    formationName,
                    positions,
                    rowIndex: idx
                });
                slot.miniPositionSelect.setOptions(opts);
                const exists = opts.some(o => o.value === slot.posValue);
                if (!exists && opts[0]) {
                    slot.posValue = opts[0].value;
                    slot.miniPositionSelect.setValue(opts[0].value);
                } else {
                    slot.miniPositionSelect.setValue(slot.posValue);
                }
            }
        });
        selectedPlayerIds.clear();
        lineup.forEach(s => {
            const v = s.getValue();
            if (v) selectedPlayerIds.add(v);
        });
        updatePlayerSelectOptions();
    }
    updatePlayerSelectOptions();
    return {
        block: table,
        lineup,
        updatePlayerSelectOptions,
        attachCaptainSelect,
        applyFormation,
        getFormationName() {
            return formationName;
        }
    };
}

// --- CAPTAIN AND HELPERS ---
function refreshCaptainOptions(lineupBlock, players) {
    const sel = lineupBlock.captainSelect;
    if (!sel) return;
    const inLineupIds = new Set(lineupBlock.lineup.map(s => s.getValue()).filter(Boolean));
    const available = players.filter(p => inLineupIds.has(String(p.id)));

    // Обновляем title селектора
    if (available.length === 0) {
        sel.title = 'Некому быть капитаном';
    } else {
        sel.title = 'Выберите капитана';
    }

    const dummyEntries = lineupBlock.lineup.map(slot => {
        const pid = slot.getValue && slot.getValue();
        if (!pid) return null;
        const pl = players.find(p => String(p.id) === String(pid));
        return pl ? {
            player: pl
        } : null;
    });
    const prev = sel.value;
    sel.innerHTML = '<option value="" class="captain-placeholder">— не выбран —</option>';
    available.forEach(p => {
        const percent = estimateCaptainPercent(p, dummyEntries);

        // Находим слот капитана для получения его позиции и формы
        const captainSlot = lineupBlock.lineup.find(slot => {
            const pid = slot.getValue && slot.getValue();
            return pid && String(pid) === String(p.id);
        });

        let captainCalculatedStr;
        if (captainSlot && captainSlot.posValue && captainSlot.physicalFormValue) {
            // Используем calculatePlayerStrengthGlobal для точного расчета
            captainCalculatedStr = calculatePlayerStrengthGlobal(p, captainSlot.posValue, captainSlot.physicalFormValue);
        } else {
            // Fallback на realStr если нет данных о позиции/форме
            captainCalculatedStr = Number(p.realStr) || 0;
        }

        const captainBonus = captainCalculatedStr * percent;

        const opt = document.createElement('option');
        opt.value = p.id;

        // Форматирование: если бонус положительный - показываем число и проценты, если отрицательный/нулевой - только проценты
        if (captainBonus > 0) {
            opt.textContent = `${p.name} — ${captainBonus.toFixed(2)} (+${(percent * 100).toFixed(0)}%)`;
        } else {
            opt.textContent = `${p.name} — ${captainBonus.toFixed(1)} (${(percent * 100).toFixed(0)}%)`;
        }

        sel.appendChild(opt);
    });
    if (prev && Array.from(sel.options).some(o => o.value === prev)) sel.value = prev;
}

function makeCaptainRow(lineupBlock) {
    const rowWrap = document.createElement('div');
    rowWrap.className = 'vs-captain-row';
    const tbl = document.createElement('table');
    tbl.className = 'vs-captain-table';
    const tr = document.createElement('tr');
    const tdIcon = document.createElement('td');
    tdIcon.className = 'qt vs-captain-cell-icon';
    tdIcon.title = 'Капитан команды';
    tdIcon.innerHTML = '<img src="pics/captbig.png" style="vertical-align:top">';
    tr.appendChild(tdIcon);
    const tdSel = document.createElement('td');
    tdSel.className = 'vs-captain-cell-select';
    const select = document.createElement('select');
    select.className = 'vs-captain-select';
    select.title = 'Некому быть капитаном';
    select.innerHTML = '<option value="" class="captain-placeholder">— не выбран —</option>';
    tdSel.appendChild(select);
    tr.appendChild(tdSel);
    tbl.appendChild(tr);
    rowWrap.appendChild(tbl);
    lineupBlock.captainSelect = select;
    lineupBlock.attachCaptainSelect(select);
    return rowWrap;
}

// --- SETTINGS BLOCK ---
function createDefenceTypeSelector(team, onChange) {
    const select = document.createElement('select');
    select.className = 'defence-type-select';
    select.innerHTML = `<option value="zonal">Зональный</option><option value="man">Персональный</option>`;
    select.value = team.defenceType || 'zonal';
    select.style.background = 'transparent';
    select.addEventListener('change', () => {
        team.defenceType = select.value;
        if (typeof onChange === 'function') onChange();
    });
    select.setHighlight = function (status) {
        const WIN_BG = 'rgb(224, 255, 224)';
        const LOSE_BG = 'rgb(255, 208, 208)';
        const NEUTRAL = 'transparent';
        select.style.background = status === 'win' ? WIN_BG : (status === 'lose' ? LOSE_BG : NEUTRAL);
    };
    return select;
}

function createTeamSettingsBlock(team, sideLabel, onChange) {
    if (sideLabel === 'home') {
        if (!window.homeTeam) {
            window.homeTeam = {
                defenceType: 'zonal',
                rough: 'clean',
                morale: 'normal'
            };
        }
        team = window.homeTeam;
    } else {
        if (!window.awayTeam) {
            window.awayTeam = {
                defenceType: 'zonal',
                rough: 'clean',
                morale: 'normal'
            };
        }
        team = window.awayTeam;
    }
    const styleSelector = createStyleSelector();
    const formationManager = new FormationManager(FORMATIONS);
    const formationSelector = createFormationSelector(formationManager);
    if (team.style) styleSelector.value = team.style;
    styleSelector.addEventListener('change', () => {
        team.style = styleSelector.value;
        if (typeof onChange === 'function') onChange();
    });
    if (team.formation && [...formationSelector.options].some(o => o.value === team.formation)) {
        formationSelector.value = team.formation;
    }
    formationSelector.addEventListener('change', () => {
        team.formation = formationSelector.value;
        if (typeof onChange === 'function') onChange();
    });

    const tacticSelect = createDummySelect();
    const defenseSelect = createDefenceTypeSelector(team, onChange);
    const roughSelect = createRoughSelector(team, onChange);
    const moraleSelect = createMoraleSelector(team, onChange);

    if (team === window.homeTeam) {
        window.homeDefenceTypeSelect = defenseSelect;
        window.homeRoughSelect = roughSelect;
        window.homeMoraleSelect = moraleSelect;
    }
    if (team === window.awayTeam) {
        window.awayDefenceTypeSelect = defenseSelect;
        window.awayRoughSelect = roughSelect;
        window.awayMoraleSelect = moraleSelect;
    }

    // Создаем блок с таблицей
    const block = document.createElement('div');
    block.style.marginBottom = '8px';

    const table = document.createElement('table');
    table.id = team === window.homeTeam ? 'vs-home-settings-table' : 'vs-away-settings-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Функция для создания строк таблицы (заголовок и селектор на разных строках)
    const createRow = (labelText, selectElement, extraElement = null, rowId = null) => {
        // Строка с заголовком
        const trLabel = document.createElement('tr');
        if (rowId) {
            trLabel.id = `${rowId}-label`;
        }

        const tdLabel = document.createElement('td');
        tdLabel.className = 'txt';
        tdLabel.textContent = labelText;
        tdLabel.style.paddingBottom = '2px';
        tdLabel.style.fontSize = '11px';
        tdLabel.style.fontWeight = 'bold';

        trLabel.appendChild(tdLabel);

        // Строка с селектором
        const trSelect = document.createElement('tr');
        if (rowId) {
            trSelect.id = `${rowId}-select`;
        }

        const tdSelect = document.createElement('td');
        tdSelect.className = 'txt';
        tdSelect.style.paddingBottom = '6px';

        // Применяем стили как у селекторов игроков
        if (selectElement.tagName === 'SELECT') {
            selectElement.style.width = '100%';
            selectElement.style.height = '20px';
            selectElement.style.fontSize = '11px';
            selectElement.style.border = '1px solid #aaa';
            selectElement.style.borderRadius = '0';
            selectElement.style.padding = '2px 4px';
            selectElement.style.boxSizing = 'border-box';
            selectElement.style.background = 'transparent';
            selectElement.style.color = '#444';
            selectElement.style.lineHeight = '16px';
        }

        // Если есть дополнительный элемент (кнопка помощи), создаем flex контейнер
        if (extraElement) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.gap = '4px';
            container.style.alignItems = 'center';
            selectElement.style.flex = '1';
            container.appendChild(selectElement);
            container.appendChild(extraElement);
            tdSelect.appendChild(container);
        } else {
            tdSelect.appendChild(selectElement);
        }

        trSelect.appendChild(tdSelect);

        return [trLabel, trSelect];
    };

    const teamPrefix = team === window.homeTeam ? 'home' : 'away';

    // Добавляем строки (каждая пара: заголовок + селектор)
    const [styleLabelRow, styleSelectRow] = createRow('стиль:', styleSelector, null, `vs-${teamPrefix}-style`);
    table.appendChild(styleLabelRow);
    table.appendChild(styleSelectRow);

    const [formLabelRow, formSelectRow] = createRow('формация:', formationSelector, null, `vs-${teamPrefix}-formation`);
    table.appendChild(formLabelRow);
    table.appendChild(formSelectRow);

    const [tacticLabelRow, tacticSelectRow] = createRow('тактика:', tacticSelect, null, `vs-${teamPrefix}-tactic`);
    table.appendChild(tacticLabelRow);
    table.appendChild(tacticSelectRow);

    const [defenseLabelRow, defenseSelectRow] = createRow('вид защиты:', defenseSelect, null, `vs-${teamPrefix}-defense`);
    table.appendChild(defenseLabelRow);
    table.appendChild(defenseSelectRow);

    const [roughLabelRow, roughSelectRow] = createRow('грубость:', roughSelect, null, `vs-${teamPrefix}-rough`);
    table.appendChild(roughLabelRow);
    table.appendChild(roughSelectRow);

    const [moraleLabelRow, moraleSelectRow] = createRow('настрой:', moraleSelect, null, `vs-${teamPrefix}-morale`);
    table.appendChild(moraleLabelRow);
    table.appendChild(moraleSelectRow);

    block.appendChild(table);
    team._styleSelector = styleSelector;
    team._formationSelector = formationSelector;
    return block;
}

// Вспомогательные функции для определения типа турнира
function parseMatchInfo(html) {
    const typeRegex = /(?:Чемпионат|Кубок межсезонья|Кубок страны|Кубок вызова|Товарищеский матч|Лига Европы|Лига европейских чемпионов|Кубок азиатской конфедерации|Лига чемпионов Азии|Кубок африканской конфедерации|Лига чемпионов Африки|Кубок Южной Америки|Кубок Либертадорес|Кубок Сев\. и Центр\. Америки|Лига чемпионов Америки)/i;
    const typeMatch = html.match(typeRegex);
    let tournamentType = null;
    if (typeMatch) {
        const t = typeMatch[0].toLowerCase();
        if (t.includes('чемпионат')) tournamentType = 'championship';
        else if (t.includes('межсезонья')) tournamentType = 'preseason_cup';
        else if (t.includes('страны')) tournamentType = 'national_cup';
        else if (t.includes('вызова')) tournamentType = 'challenge_cup';
        else if (t.includes('товарищеский')) tournamentType = 'friendly';
        else if (t.includes('любительских')) tournamentType = 'amators';
        else if (t.includes('лига европы')) tournamentType = 'europa_league';
        else if (t.includes('европейских чемпионов')) tournamentType = 'champions_league_europe';
        else if (t.includes('азиатской конфедерации')) tournamentType = 'asian_confederation_cup';
        else if (t.includes('чемпионов азии')) tournamentType = 'asian_champions_league';
        else if (t.includes('африканской конфедерации')) tournamentType = 'african_confederation_cup';
        else if (t.includes('чемпионов африки')) tournamentType = 'african_champions_league';
        else if (t.includes('южной америки')) tournamentType = 'south_america_cup';
        else if (t.includes('либертадорес')) tournamentType = 'libertadores';
        else if (t.includes('сев. и центр. америки')) tournamentType = 'north_central_america_cup';
        else if (t.includes('чемпионов америки')) tournamentType = 'americas_champions_league';
    } else {
        throw new Error('Неизвестный тип турнира');
    }
    return {
        tournamentType
    };
}

function detectTournamentTypeFromPage() {
    try {
        const matchInfo = parseMatchInfo(document.body.innerHTML);
        const tournamentType = matchInfo.tournamentType;

        // Конвертируем типы турниров в типы физ форм
        const typeMapping = {
            'friendly': 'friendly',              // Товарищеский
            'championship': 'typeB',             // Чемпионат
            'preseason_cup': 'typeB',            // Кубок межсезонья
            'national_cup': 'typeC',             // Кубок страны
            'challenge_cup': 'typeC',            // Кубок вызова
            'amators': 'typeB_amateur',          // Конференция любительских
            // Международные турниры с бонусом дома
            'europa_league': 'typeC_international',
            'champions_league_europe': 'typeC_international',
            'asian_confederation_cup': 'typeC_international',
            'asian_champions_league': 'typeC_international',
            'african_confederation_cup': 'typeC_international',
            'african_champions_league': 'typeC_international',
            'south_america_cup': 'typeC_international',
            'libertadores': 'typeC_international',
            'north_central_america_cup': 'typeC_international',
            'americas_champions_league': 'typeC_international'
        };

        return typeMapping[tournamentType] || 'typeC';
    } catch (e) {
        console.warn('[TournamentType] Failed to detect, using default typeC', e);
        return 'typeC';
    }
}

function getTournamentType() {
    const select = document.getElementById('vs_tournament_type');
    if (select) {
        return select.value;
    }

    // Если селектор еще не создан, пытаемся определить автоматически
    return detectTournamentTypeFromPage();
}

// --- MAIN LOGIC ---
(function () {
    'use strict';

    async function init() {
        replaceTeamIcons();
        const teamLinks = document.querySelectorAll('table.tobl a[href^="roster.php?num="]');
        if (teamLinks.length < 2) return;
        const homeTeamId = new URL(teamLinks[0].href).searchParams.get('num');
        const awayTeamId = new URL(teamLinks[1].href).searchParams.get('num');
        if (!homeTeamId || !awayTeamId) return;
        let tournamentType;
        try {
            const info = parseMatchInfo(document.body.innerHTML);
            tournamentType = info.tournamentType;
        } catch (e) {
            alert(e.message);
            return;
        }
        const [homePlayers, awayPlayers, homeAtmosphere, awayAtmosphere] = await Promise.all([
            loadTeamRoster(homeTeamId, tournamentType),
            loadTeamRoster(awayTeamId, tournamentType),
            loadTeamAtmosphere(homeTeamId),
            loadTeamAtmosphere(awayTeamId)
        ]);
        const oldUI = document.getElementById('vsol-calculator-ui');
        if (oldUI) oldUI.remove();
        const ui = createUI(homeTeamId, awayTeamId, homePlayers, awayPlayers, homeAtmosphere, awayAtmosphere);
        const comparisonTable = document.querySelector('table.tobl');
        if (comparisonTable && comparisonTable.parentNode) {
            comparisonTable.parentNode.insertBefore(ui, comparisonTable.nextSibling);
        }
    }




    function createWeatherUI(defaultWeather, defaultTemp, iconUrl) {
        const container = document.createElement('div');
        container.id = 'vsol-weather-ui';
        container.className = 'lh16';
        if (iconUrl) {
            const iconImg = document.createElement('img');
            iconImg.src = iconUrl;
            iconImg.height = 16;
            iconImg.style.verticalAlign = 'top';
            iconImg.style.padding = '0 3px 0 0';
            container.appendChild(iconImg);
        }
        const WEATHER_OPTIONS = ["очень жарко", "жарко", "солнечно", "облачно", "пасмурно", "дождь", "снег"];
        const weatherSel = document.createElement('select');
        WEATHER_OPTIONS.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w;
            opt.textContent = w;
            weatherSel.appendChild(opt);
        });
        const tempSel = document.createElement('select');

        function fillTempOptions(weather, selectedTemp) {
            tempSel.innerHTML = '';
            const WEATHER_TEMP_MAP = {
                "очень жарко": [30, 26],
                "жарко": [29, 15],
                "солнечно": [29, 10],
                "облачно": [25, 5],
                "пасмурно": [20, 1],
                "дождь": [15, 1],
                "снег": [4, 0]
            };
            const [max, min] = WEATHER_TEMP_MAP[weather];
            for (let t = max; t >= min; t--) {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t + '°';
                tempSel.appendChild(opt);
            }
            if (selectedTemp && parseInt(selectedTemp) >= min && parseInt(selectedTemp) <= max) {
                tempSel.value = selectedTemp;
            }
        }
        weatherSel.value = defaultWeather && WEATHER_OPTIONS.includes(defaultWeather) ? defaultWeather :
            WEATHER_OPTIONS[0];
        fillTempOptions(weatherSel.value, defaultTemp);
        weatherSel.addEventListener('change', function () {
            fillTempOptions(weatherSel.value);
        });
        const weatherLabel = document.createElement('label');
        weatherLabel.textContent = 'Погода: ';
        weatherLabel.appendChild(weatherSel);
        const tempLabel = document.createElement('label');
        tempLabel.textContent = 'Температура: ';
        tempLabel.appendChild(tempSel);
        container.appendChild(weatherLabel);
        container.appendChild(tempLabel);
        const mainTable = document.querySelector('table.wst.tobl');
        if (mainTable && mainTable.parentNode) {
            mainTable.parentNode.insertBefore(container, mainTable.nextSibling);
        } else {
            document.body.prepend(container);
        }
        return {
            container,
            getWeather: () => weatherSel.value,
            getTemperature: () => Number(tempSel.value),
            setWeather: (w) => {
                weatherSel.value = w;
                fillTempOptions(w);
            },
            setTemperature: (t) => {
                tempSel.value = t;
            }
        };
    }

    function extractPlayersFromPlrdat(plrdat) {
        return plrdat.map(p => ({
            id: p[0],
            name: `${p[2]} ${p[3]}`,
            mainPos: p[6],
            secondPos: p[7],
            age: p[9],
            baseStrength: p[10],
            fatigue: p[12],
            form: p[13],
            form_mod: p[14],
            realStr: p[15],
            baseRealStr: p[15],  // Сохраняем оригинальное значение для модификации физ формой
            abilities: `${p[16]} ${p[17]} ${p[18]} ${p[19]}`,
            real_status: p[31],
            real_sign: p[32],
            transfer: p[38],
            training: p[44]
        }));
    }

    function extractPlrdatFromHTML(html) {
        const match = html.match(/var plrdat\s*=\s*\[(.*?)\];/s);
        if (!match) return [];
        const arrText = match[1];
        const items = [];
        const regex = /new jPlayer\(([\s\S]*?)\),?/g;
        let m;
        while ((m = regex.exec(arrText)) !== null) {
            try {
                const arr = eval(`[${m[1]}]`);
                items.push(arr);
            } catch (e) {
                console.log('Ошибка парсинга игрока:', e, m[1]);
            }
        }
        console.log('[plrdat] Extracted data:', items);
        return items;
    }

    function loadTeamRoster(teamId, tournamentType) {
        const sortMap = {
            friendly: 1,
            preseason_cup: 2,
            championship: 3,
            national_cup: 4,
            amators: 10,
            challenge_cup: 47,
            // Международные турниры
            champions_league_europe: 8,
            europa_league: 14,
            asian_champions_league: 26,
            asian_confederation_cup: 27,
            african_champions_league: 28,
            african_confederation_cup: 29,
            libertadores: 30,
            south_america_cup: 31,
            americas_champions_league: 32,
            north_central_america_cup: 48
        };
        const sort = sortMap[tournamentType];
        if (!sort) return Promise.reject(new Error('Неизвестный тип турнира'));
        const url = `${SITE_CONFIG.BASE_URL}/roster.php?num=${teamId}&sort=${sort}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status !== 200) {
                        resolve([]);
                        return;
                    }
                    try {
                        const rawPlayers = extractPlrdatFromHTML(response.responseText);
                        if (!rawPlayers.length) {
                            resolve([]);
                            return;
                        }
                        const players = extractPlayersFromPlrdat(rawPlayers);
                        resolve(players);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    function loadTeamAtmosphere(teamId) {
        const url = `${SITE_CONFIG.BASE_URL}/roster_s.php?num=${teamId}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status !== 200) {
                        console.warn('[Atmosphere] Failed to load roster_s for team', teamId);
                        resolve(0);
                        return;
                    }
                    try {
                        const html = response.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Ищем строку с "Атмосфера в команде:"
                        const rows = doc.querySelectorAll('tr');
                        for (const row of rows) {
                            const text = row.textContent;
                            if (text.includes('Атмосфера в команде:')) {
                                // Ищем значение в формате "+2%" или "-1%"
                                const match = text.match(/([+-]?\d+)%/);
                                if (match) {
                                    const percent = parseInt(match[1], 10);
                                    const atmosphere = percent / 100; // Конвертируем в 0.02, -0.01 и т.д.
                                    console.log('[Atmosphere] Parsed for team', teamId, ':', atmosphere);
                                    resolve(atmosphere);
                                    return;
                                }
                            }
                        }
                        
                        console.log('[Atmosphere] Not found for team', teamId, ', using default 0');
                        resolve(0);
                    } catch (error) {
                        console.error('[Atmosphere] Parse error for team', teamId, ':', error);
                        resolve(0);
                    }
                },
                onerror: function (err) {
                    console.error('[Atmosphere] Request error for team', teamId, ':', err);
                    resolve(0);
                }
            });
        });
    }

    /* ----------------------------- SHIRTS DATA FUNCTIONS ----------------------------- */
    function getLastMatchForTeam(teamId) {
        return new Promise((resolve, reject) => {
            const url = `${SITE_CONFIG.BASE_URL}/roster_m.php?num=${teamId}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status !== 200) {
                        reject(new Error('Failed to load roster_m'));
                        return;
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Ищем все строки матчей (только viewmatch.php - это сыгранные матчи)
                        const matchLinks = Array.from(doc.querySelectorAll('a[href*="viewmatch.php"]'));

                        // Ищем последний сыгранный матч (идем с конца списка)
                        for (let i = matchLinks.length - 1; i >= 0; i--) {
                            const link = matchLinks[i];
                            const scoreText = link.textContent.trim();

                            // Пропускаем несыгранные матчи (счет ?:?)
                            if (scoreText === '?:?') {
                                continue;
                            }

                            const href = link.getAttribute('href');
                            const match = href.match(/day=(\d+)&match_id=(\d+)/);
                            if (match) {
                                resolve({ day: match[1], matchId: match[2] });
                                return;
                            }
                        }

                        resolve(null);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    function getMatchLineup(day, matchId, teamId) {
        return new Promise((resolve, reject) => {
            const url = `${SITE_CONFIG.BASE_URL}/viewmatch.php?day=${day}&match_id=${matchId}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status !== 200) {
                        reject(new Error('Failed to load viewmatch'));
                        return;
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Определяем, дома или в гостях играла команда
                        const teamLinks = doc.querySelectorAll('table.tobl a[href^="roster.php?num="]');
                        let isHome = false;

                        if (teamLinks.length >= 2) {
                            const homeTeamId = new URL(teamLinks[0].href, SITE_CONFIG.BASE_URL).searchParams.get('num');
                            isHome = (homeTeamId === String(teamId));
                        }

                        // Извлекаем футболки
                        const prefix = isHome ? 'gif_0_' : 'gif_1_';
                        const shirts = {};

                        // Пробуем разные селекторы
                        let shirtDivs = doc.querySelectorAll(`div.shirt.qf[id^="${prefix}"]`);

                        if (shirtDivs.length === 0) {
                            // Пробуем без класса qf
                            shirtDivs = doc.querySelectorAll(`div.shirt[id^="${prefix}"]`);
                        }

                        if (shirtDivs.length === 0) {
                            // Пробуем просто по id
                            shirtDivs = doc.querySelectorAll(`div[id^="${prefix}"]`);
                        }

                        if (shirtDivs.length === 0) {
                            // Пробуем найти все div с классом shirt
                            const allShirts = doc.querySelectorAll('div.shirt');


                            if (allShirts.length === 0) {
                                // Проверяем что вообще есть на странице
                                const allDivs = doc.querySelectorAll('div');


                                // Проверяем есть ли таблица с составом
                                const tables = doc.querySelectorAll('table.tobl');


                                // Ищем любые div с id содержащим gif
                                const gifDivs = Array.from(allDivs).filter(d => d.id && d.id.includes('gif'));

                                if (gifDivs.length > 0) {
                                    console.log('[Shirts] Sample gif div:', {
                                        id: gifDivs[0].id,
                                        className: gifDivs[0].className,
                                        textContent: gifDivs[0].textContent,
                                        style: gifDivs[0].getAttribute('style')?.substring(0, 100)
                                    });
                                }
                            } else {
                                console.log('[Shirts] Sample shirt div:', allShirts[0] ? {
                                    id: allShirts[0].id,
                                    className: allShirts[0].className,
                                    innerHTML: allShirts[0].innerHTML.substring(0, 100)
                                } : 'none');
                            }
                        }

                        // Если нашли элементы через querySelector
                        if (shirtDivs.length > 0) {
                            shirtDivs.forEach((div, idx) => {
                                const position = div.textContent.trim();
                                const style = div.getAttribute('style');
                                const bgMatch = style ? style.match(/background-image:\s*url\(['"]*([^'"()]+)['"]*\)/) : null;

                                if (idx < 3) {
                                    console.log('[Shirts] Processing div #' + idx + ':', {
                                        id: div.id,
                                        position,
                                        styleLength: style ? style.length : 0,
                                        bgMatch: bgMatch ? bgMatch[1] : null
                                    });
                                }

                                if (bgMatch) {
                                    const shirtUrl = bgMatch[1];
                                    if (!shirts.gk && position === 'GK') {
                                        shirts.gk = shirtUrl;

                                    } else if (!shirts.field && position !== 'GK') {
                                        shirts.field = shirtUrl;

                                    }
                                }
                            });
                        } else {
                            // Если не нашли через querySelector, парсим сырой HTML

                            const htmlText = response.responseText;

                            // Ищем паттерн: id="gif_X_Y" ... background-image:url('pics/shirts/sh_XXX_sm.png')>POSITION<
                            const shirtPattern = new RegExp(`id="${prefix}\\d+"[^>]*?background-image:url\\(['"]*([^'"()]+)['"]*\\)[^>]*?>(\\w+)<`, 'g');
                            const matches = [...htmlText.matchAll(shirtPattern)];



                            if (matches.length > 0) {
                                matches.forEach((match, idx) => {
                                    if (idx < 3) {
                                        console.log('[Shirts] Pattern match #' + idx + ':', {
                                            shirtUrl: match[1],
                                            position: match[2]
                                        });
                                    }

                                    const shirtUrl = match[1];
                                    const position = match[2];

                                    if (position) {
                                        if (!shirts.gk && position === 'GK') {
                                            shirts.gk = shirtUrl;

                                        } else if (!shirts.field && position !== 'GK') {
                                            shirts.field = shirtUrl;

                                        }
                                    }
                                });
                            }
                        }


                        resolve(shirts);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    async function getTeamShirts(teamId) {


        // Проверяем кэш
        const cached = getCachedShirts(teamId);
        if (cached) {

            return cached;
        }

        try {
            // Получаем последний матч
            const lastMatch = await getLastMatchForTeam(teamId);

            if (!lastMatch) {

                return { gk: DEFAULT_GK_SHIRT, field: DEFAULT_SHIRT };
            }



            // Получаем расстановку
            const shirts = await getMatchLineup(lastMatch.day, lastMatch.matchId, teamId);



            // Если не нашли футболки, используем дефолтные
            if (!shirts.gk) {
                console.warn('[Shirts] No GK shirt found, using default');
                shirts.gk = DEFAULT_GK_SHIRT;
            }
            if (!shirts.field) {
                console.warn('[Shirts] No field shirt found, using default');
                shirts.field = DEFAULT_SHIRT;
            }

            // Кэшируем
            setCachedShirts(teamId, shirts);

            return shirts;
        } catch (error) {
            console.error('[Shirts] Error getting shirts for team', teamId, error);
            return { gk: DEFAULT_GK_SHIRT, field: DEFAULT_SHIRT };
        }
    }

    /* ----------------------------- SHIRTS DISPLAY FUNCTIONS ----------------------------- */
    function createShirtElement(position, shirtUrl, top, left, playerName = null) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: absolute;
            width: 40px;
            height: 34px;
            background-image: url('${shirtUrl}');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            top: ${top}px;
            left: ${left}px;
            transform: translate(-50%, -50%);
            font-size: 9px;
            font-weight: bold;
            color: white;
            text-align: center;
            line-height: 34px;
            text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;
            cursor: default;
            z-index: 10;
        `;
        div.textContent = position;
        div.title = playerName ? `${position}: ${playerName}` : position;

        return div;
    }

    function displayShirtsOnField(fieldCol, homeShirts, awayShirts, homeFormation, awayFormation, homeLineup = null, awayLineup = null) {
        // Создаём или очищаем контейнер для футболок
        let shirtsContainer = fieldCol.querySelector('.shirts-container');
        if (!shirtsContainer) {
            shirtsContainer = document.createElement('div');
            shirtsContainer.className = 'shirts-container';
            shirtsContainer.style.cssText = 'position: absolute; top: 34px; left: 34px; right: 34px; bottom: 34px;';
            fieldCol.appendChild(shirtsContainer);
        } else {
            shirtsContainer.innerHTML = '';
        }

        // Получаем позиции - используем актуальные posValue из lineup, если доступны
        let homePositions = FORMATIONS[homeFormation] || FORMATIONS['4-4-2'];
        let awayPositions = FORMATIONS[awayFormation] || FORMATIONS['4-4-2'];

        // Если есть lineup с актуальными позициями, используем их
        if (homeLineup && homeLineup.length > 0) {
            const actualPositions = homeLineup.map(slot => slot.posValue || '').filter(p => p);
            if (actualPositions.length === homePositions.length) {
                homePositions = actualPositions;
            }
        }

        if (awayLineup && awayLineup.length > 0) {
            const actualPositions = awayLineup.map(slot => slot.posValue || '').filter(p => p);
            if (actualPositions.length === awayPositions.length) {
                awayPositions = actualPositions;
            }
        }

        // Генерируем координаты для каждой команды
        const homeCoords = generateFieldPositions(homePositions, 'home');
        const awayCoords = generateFieldPositions(awayPositions, 'away');

        console.log('[Shirts] Generated positions', {
            homeFormation,
            awayFormation,
            homePositions,
            awayPositions,
            homeCoords: homeCoords.length,
            awayCoords: awayCoords.length
        });

        // Отображаем футболки хозяев
        homeCoords.forEach((coord, idx) => {
            if (!coord) return;

            const position = coord.position;
            const shirtUrl = position === 'GK' ? homeShirts.gk : homeShirts.field;
            let playerName = null;

            // Пытаемся получить имя игрока из состава
            if (homeLineup && homeLineup[idx]) {
                const playerId = homeLineup[idx].getValue && homeLineup[idx].getValue();
                if (playerId && homeLineup[idx].selectedPlayer) {
                    playerName = homeLineup[idx].selectedPlayer.name;
                }
            }

            const shirt = createShirtElement(position, shirtUrl, coord.top, coord.left, playerName);
            if (shirt) shirtsContainer.appendChild(shirt);
        });

        // Отображаем футболки гостей
        awayCoords.forEach((coord, idx) => {
            if (!coord) return;

            const position = coord.position;
            const shirtUrl = position === 'GK' ? awayShirts.gk : awayShirts.field;
            let playerName = null;

            // Пытаемся получить имя игрока из состава
            if (awayLineup && awayLineup[idx]) {
                const playerId = awayLineup[idx].getValue && awayLineup[idx].getValue();
                if (playerId && awayLineup[idx].selectedPlayer) {
                    playerName = awayLineup[idx].selectedPlayer.name;
                }
            }

            const shirt = createShirtElement(position, shirtUrl, coord.top, coord.left, playerName);
            if (shirt) shirtsContainer.appendChild(shirt);
        });
    }

    async function initializeShirtsSystem(homeTeamId, awayTeamId, fieldCol, homeFormationSelect, awayFormationSelect, homeLineupBlock = null, awayLineupBlock = null) {


        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'shirts-loading';
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 100;
        `;
        loadingIndicator.textContent = 'Загрузка футболок...';
        fieldCol.style.position = 'relative';
        fieldCol.appendChild(loadingIndicator);

        try {
            // Получаем футболки для обеих команд
            const [homeShirts, awayShirts] = await Promise.all([
                getTeamShirts(homeTeamId),
                getTeamShirts(awayTeamId)
            ]);



            // Убираем индикатор загрузки
            loadingIndicator.remove();

            // Отображаем футболки
            const updateShirts = () => {
                const homeFormation = homeFormationSelect.value || '4-4-2';
                const awayFormation = awayFormationSelect.value || '4-4-2';
                const homeLineup = homeLineupBlock ? homeLineupBlock.lineup : null;
                const awayLineup = awayLineupBlock ? awayLineupBlock.lineup : null;
                displayShirtsOnField(fieldCol, homeShirts, awayShirts, homeFormation, awayFormation, homeLineup, awayLineup);
            };

            updateShirts();

            // Обновляем при изменении формации
            homeFormationSelect.addEventListener('change', updateShirts);
            awayFormationSelect.addEventListener('change', updateShirts);

            // Сохраняем функцию обновления для использования извне
            window.__updateShirtsDisplay = updateShirts;
        } catch (error) {
            console.error('[Shirts] Failed to initialize shirts system', error);
            loadingIndicator.textContent = 'Ошибка загрузки футболок';
            setTimeout(() => loadingIndicator.remove(), 3000);
        }
    }

    function replaceTeamIcons() {
        const divs = Array.from(document.querySelectorAll('div[style*="pics/teams32"]'));
        divs.forEach(div => {
            const style = div.getAttribute('style');
            const m = style.match(/url\(pics\/teams32\/(\d+\.png\?[\d]+)\)/);
            if (!m) return;
            const imgName = m[1];
            const teamId = imgName.match(/^(\d+)\.png/)[1];
            const query = imgName.split('?')[1] || '';
            let align = 'left';
            if (style.includes('float:right')) align = 'right';
            const img = document.createElement('img');
            img.src = `pics/teams80/${teamId}.png${query ? '?' + query : ''}`;
            img.setAttribute('hspace', '4');
            img.setAttribute('vspace', '0');
            img.setAttribute('border', '0');
            img.setAttribute('width', '80');
            img.setAttribute('align', align);
            img.setAttribute('alt', '');
            div.parentNode.replaceChild(img, div);
        });
    }

    function paintStyleSelectByCollision(selectEl, status) {
        const WIN_BG = 'rgb(224, 255, 224)';
        const LOSE_BG = 'rgb(255, 208, 208)';
        const NEUTRAL = 'transparent';
        if (!selectEl) return;
        selectEl.style.background = status === COLLISION_WIN ? WIN_BG : (status === COLLISION_LOSE ? LOSE_BG :
            NEUTRAL);
    }

    function setTeamState(state, styleSel, formationSel, captainSel, lineupBlock, players) {
        if (!state) return;
        if (state.style) styleSel.value = state.style;
        if (state.formation) formationSel.value = state.formation;
        if (state.mini && Array.isArray(state.mini)) {
            state.mini.forEach((miniVal, idx) => {
                if (lineupBlock.lineup[idx] && lineupBlock.lineup[idx].miniPositionSelect && miniVal) {
                    lineupBlock.lineup[idx].miniPositionSelect.setValue(miniVal);
                }
            });
        }
        if (state.lineup && Array.isArray(state.lineup)) {
            state.lineup.forEach((pid, idx) => {
                if (lineupBlock.lineup[idx]) {
                    const player = players.find(p => String(p.id) === String(pid));
                    if (player) lineupBlock.lineup[idx].setValue(String(pid), player.name);
                    else lineupBlock.lineup[idx].setValue('', '');
                }
            });
        }

        // Загрузка физических форм
        if (state.physicalForms && Array.isArray(state.physicalForms)) {
            state.physicalForms.forEach((formId, idx) => {
                if (lineupBlock.lineup[idx] && lineupBlock.lineup[idx].physicalFormSelect && formId) {
                    lineupBlock.lineup[idx].physicalFormSelect.setValue(formId);
                    lineupBlock.lineup[idx].physicalFormValue = formId;
                }
            });

            // Обновляем селекторы игроков после восстановления форм
            if (lineupBlock.updatePlayerSelectOptions) {
                lineupBlock.updatePlayerSelectOptions();
            }
        }

        setTimeout(() => {
            if (state.captain) captainSel.value = state.captain;
        }, 100);
    }

    function createUI(homeTeamId, awayTeamId, homePlayers, awayPlayers, homeAtmosphere = 0, awayAtmosphere = 0) {
        const parsedWeather = parseWeatherFromPreview();
        const weatherUI = createWeatherUI(parsedWeather?.weather, parsedWeather?.temperature, parsedWeather?.icon);
        const container = document.createElement('div');
        container.id = 'vsol-calculator-ui';
        container.appendChild(weatherUI.container);
        const stadiumCapacity = parseStadiumCapacity() || 0;
        const attendanceUI = document.createElement('div');
        attendanceUI.id = 'vsol-attendance-ui';
        attendanceUI.className = 'lh16';
        const attendanceLabel = document.createElement('label');
        attendanceLabel.innerHTML =
            `Посещаемость: <img src="https://cdn-icons-png.flaticon.com/128/1259/1259792.png" style="vertical-align:top; padding:2px 3px 0 0" height="16">`;
        const attendanceInput = document.createElement('input');
        attendanceInput.type = 'number';
        attendanceInput.id = 'vs_home_attendance';
        attendanceInput.min = '0';
        attendanceInput.max = String(stadiumCapacity);
        attendanceInput.value = String(stadiumCapacity);
        attendanceInput.style.marginLeft = '4px';
        const capacitySpan = document.createElement('span');
        capacitySpan.className = 'capacity';
        capacitySpan.textContent = ` / ${stadiumCapacity}`;
        attendanceLabel.appendChild(attendanceInput);
        attendanceUI.appendChild(attendanceLabel);
        attendanceUI.appendChild(capacitySpan);
        container.appendChild(attendanceUI);
        const homeTeamObj = {
            defenceType: 'zonal',
            rough: 'clean',
            morale: 'normal'
        };
        const awayTeamObj = {
            defenceType: 'zonal',
            rough: 'clean',
            morale: 'normal'
        };
        window.homeTeam = homeTeamObj;
        window.awayTeam = awayTeamObj;
        const homeSettingsBlock = createTeamSettingsBlock(homeTeamObj, 'home', saveAllStates);
        const awaySettingsBlock = createTeamSettingsBlock(awayTeamObj, 'away', saveAllStates);
        const homeStyle = window.homeTeam._styleSelector;
        const awayStyle = window.awayTeam._styleSelector;
        const homeFormationSelect = window.homeTeam._formationSelector;
        const awayFormationSelect = window.awayTeam._formationSelector;
        const homeLineupBlock = createTeamLineupBlock(homePlayers, "4-4-2", "home");
        const awayLineupBlock = createTeamLineupBlock(awayPlayers, "4-4-2", "away");
        const homeCaptainRow = makeCaptainRow(homeLineupBlock);
        const awayCaptainRow = makeCaptainRow(awayLineupBlock);
        window.homeStyle = homeStyle;
        window.awayStyle = awayStyle;
        window.homeFormationSelect = homeFormationSelect;
        window.awayFormationSelect = awayFormationSelect;
        window.homeLineupBlock = homeLineupBlock;
        window.awayLineupBlock = awayLineupBlock;
        const homeSaved = loadTeamState(CONFIG.STORAGE_KEYS.HOME);
        const awaySaved = loadTeamState(CONFIG.STORAGE_KEYS.AWAY);
        if (homeSaved) {
            setTeamState(homeSaved, homeStyle, homeFormationSelect, homeLineupBlock.captainSelect,
                homeLineupBlock, homePlayers);
        }
        if (awaySaved) {
            setTeamState(awaySaved, awayStyle, awayFormationSelect, awayLineupBlock.captainSelect,
                awayLineupBlock, awayPlayers);
        }
        // ✅ Восстановление morale — ПОСЛЕ создания селекторов
        if (homeSaved?.morale && window.homeMoraleSelect) {
            window.homeTeam.morale = homeSaved.morale;
            window.homeMoraleSelect.value = homeSaved.morale;
        }
        if (awaySaved?.morale && window.awayMoraleSelect) {
            window.awayTeam.morale = awaySaved.morale;
            window.awayMoraleSelect.value = awaySaved.morale;
        }

        window.__vs_onLineupChanged = () => {
            refreshCaptainOptions(homeLineupBlock, homePlayers);
            refreshCaptainOptions(awayLineupBlock, awayPlayers);
            saveAllStates();

            // Обновляем отображение футболок при изменении состава
            if (typeof window.__updateShirtsDisplay === 'function') {
                window.__updateShirtsDisplay();
            }
            
            // Автоматически пересчитываем силу при изменении позиций
            if (typeof window.__vs_recalculateStrength === 'function') {
                window.__vs_recalculateStrength();
            }
        };
        const mainTable = document.createElement('table');
        mainTable.style.width = '750px';
        mainTable.style.margin = '0 auto 10px auto';
        mainTable.style.borderCollapse = 'separate';
        mainTable.style.tableLayout = 'fixed';
        const tr1 = document.createElement('tr');
        const homeCol1 = document.createElement('td');
        homeCol1.style.verticalAlign = 'top';
        homeCol1.style.width = '175px';
        homeCol1.appendChild(homeSettingsBlock);
        const fieldCol = document.createElement('td');
        fieldCol.style.width = '400px';
        fieldCol.style.height = '566px';
        fieldCol.style.background =
            "url('https://github.com/stankewich/vfliga_calc/blob/main/img/field_01.webp?raw=true') no-repeat center center";
        fieldCol.style.backgroundSize = 'contain';
        fieldCol.style.verticalAlign = 'top';
        const awayCol1 = document.createElement('td');
        awayCol1.style.verticalAlign = 'top';
        awayCol1.style.width = '175px';
        awayCol1.appendChild(awaySettingsBlock);
        tr1.appendChild(homeCol1);
        tr1.appendChild(fieldCol);
        tr1.appendChild(awayCol1);
        mainTable.appendChild(tr1);
        const lineupsTable = document.createElement('table');
        lineupsTable.style.width = '800px';
        lineupsTable.style.margin = '0 auto 10px auto';
        lineupsTable.style.borderCollapse = 'separate';
        lineupsTable.style.tableLayout = 'fixed';
        const tr2 = document.createElement('tr');
        const homeCol2 = document.createElement('td');
        homeCol2.style.verticalAlign = 'top';
        homeCol2.style.width = '400px';
        homeCol2.appendChild(homeLineupBlock.block);
        homeCol2.appendChild(homeCaptainRow);
        const awayCol2 = document.createElement('td');
        awayCol2.style.verticalAlign = 'top';
        awayCol2.style.width = '400px';
        awayCol2.appendChild(awayLineupBlock.block);
        awayCol2.appendChild(awayCaptainRow);
        tr2.appendChild(homeCol2);
        tr2.appendChild(awayCol2);
        lineupsTable.appendChild(tr2);

        // Селектор типа турнира для физ форм
        const tournamentTypeUI = document.createElement('div');
        tournamentTypeUI.className = 'lh16';
        tournamentTypeUI.style.marginTop = '8px';
        tournamentTypeUI.style.marginBottom = '8px';
        const tournamentLabel = document.createElement('label');
        tournamentLabel.textContent = 'Тип турнира: ';
        const tournamentSelect = document.createElement('select');
        tournamentSelect.id = 'vs_tournament_type';
        tournamentSelect.innerHTML = `
            <option value="friendly">Товарищеский матч</option>
            <option value="typeC">Тип C (кубок страны, кубок вызова)</option>
            <option value="typeC_international">Международный кубок (C-формы, с бонусом дома)</option>
            <option value="typeB">Тип B (чемпионат, кубок межсезонья)</option>
            <option value="typeB_amateur">Конференция любительских клубов (тип B)</option>
            <option value="all">Все формы</option>
        `;

        // Автоматически определяем тип турнира
        const detectedType = detectTournamentTypeFromPage();
        tournamentSelect.value = detectedType;

        tournamentSelect.style.marginLeft = '4px';
        tournamentSelect.style.borderRadius = '0';
        tournamentSelect.style.color = '#444';
        tournamentSelect.style.padding = '2px 4px';
        tournamentSelect.style.lineHeight = '16px';

        // Функция обновления селекторов формы
        const updatePhysicalFormSelectors = (selectedType) => {
            // Обновляем все селекторы физ форм и пересчитываем формы игроков
            [homeLineupBlock, awayLineupBlock].forEach((block, blockIdx) => {
                if (block && block.lineup) {
                    const playersList = blockIdx === 0 ? homePlayers : awayPlayers;
                    block.lineup.forEach(slot => {
                        if (slot.physicalFormSelect && slot.physicalFormSelect.setTournamentType) {
                            slot.physicalFormSelect.setTournamentType(selectedType);
                        }

                        // Пересчитываем форму игрока для нового типа турнира
                        const playerId = slot.getValue && slot.getValue();
                        if (playerId) {
                            const player = playersList.find(p => String(p.id) === String(playerId));
                            if (player && slot.physicalFormSelect) {
                                const formId = getPhysicalFormIdFromData(player.form, player.form_mod, selectedType);
                                slot.physicalFormSelect.setValue(formId);
                                slot.physicalFormValue = formId;

                                // Пересчитываем realStr
                                const baseRealStr = Number(player.baseRealStr || player.realStr) || 0;
                                const modifiedRealStr = applyPhysicalFormToRealStr(baseRealStr, formId);
                                slot.modifiedRealStr = modifiedRealStr;
                            }
                        }
                    });

                    // Обновляем все опции в селекторах после изменения типа турнира
                    // Это также обновит отображаемый текст для всех игроков
                    if (block.updatePlayerSelectOptions) {
                        block.updatePlayerSelectOptions();
                    }
                }
            });
        };

        // Обработчик изменения типа турнира
        tournamentSelect.addEventListener('change', () => {
            updatePhysicalFormSelectors(tournamentSelect.value);
        });

        tournamentLabel.appendChild(tournamentSelect);
        tournamentTypeUI.appendChild(tournamentLabel);

        // Применяем определенный тип турнира к селекторам формы при первичной загрузке
        updatePhysicalFormSelectors(detectedType);

        const title = document.createElement('h3');
        title.textContent = 'Калькулятор силы';
        container.appendChild(tournamentTypeUI);
        container.appendChild(title);
        container.appendChild(mainTable);
        container.appendChild(lineupsTable);
        const synergyWrap = document.createElement('div');
        synergyWrap.id = 'vsol-synergy-ui';

        function createSynergyBlock(labelText, inputId, blockId) {
            const block = document.createElement('div');
            block.className = 'vs-synergy-block';
            block.id = blockId;
            const label = document.createElement('label');
            label.setAttribute('for', inputId);
            label.textContent = labelText + ' ';
            const input = document.createElement('input');
            input.type = 'number';
            input.id = inputId;
            input.className = 'vs-synergy-input';
            input.min = '0';
            input.max = '100';
            input.step = '0.01';
            input.value = '0.00';
            label.appendChild(input);
            const hint = document.createElement('span');
            hint.className = 'vs-synergy-hint';
            block.appendChild(label);
            block.appendChild(hint);
            return {
                block,
                input
            };
        }
        const synergyHomeUI = createSynergyBlock('Сыгранность хозяев:', 'vs_synergy_home', 'vs-synergy-home');
        const synergyAwayUI = createSynergyBlock('Сыгранность гостей:', 'vs_synergy_away', 'vs-synergy-away');
        synergyWrap.appendChild(synergyHomeUI.block);
        synergyWrap.appendChild(synergyAwayUI.block);
        container.appendChild(synergyWrap);

        if (homeSaved && typeof homeSaved.synergyHomePercent !== 'undefined') {
            setSynergyPercentHome(homeSaved.synergyHomePercent);
        }
        if (awaySaved && typeof awaySaved.synergyAwayPercent !== 'undefined') {
            setSynergyPercentAway(awaySaved.synergyAwayPercent);
        }
        synergyHomeUI.input.addEventListener('input', () => {
            clampSynergyInput(synergyHomeUI.input);
            saveAllStates();
        });
        synergyHomeUI.input.addEventListener('change', () => {
            clampSynergyInput(synergyHomeUI.input);
            saveAllStates();
        });
        synergyAwayUI.input.addEventListener('input', () => {
            clampSynergyInput(synergyAwayUI.input);
            saveAllStates();
        });
        synergyAwayUI.input.addEventListener('change', () => {
            clampSynergyInput(synergyAwayUI.input);
            saveAllStates();
        });
        homeLineupBlock.applyFormation(homeFormationSelect.value || '4-4-2');
        awayLineupBlock.applyFormation(awayFormationSelect.value || '4-4-2');
        refreshCaptainOptions(homeLineupBlock, homePlayers);
        refreshCaptainOptions(awayLineupBlock, awayPlayers);

        function onStyleChange(repaintStyleCollision, saveAllStates) {
            repaintStyleCollision();
            saveAllStates();
        }

        function makeFormationHandler(lineupBlock, formationSelect, players, applyFormation, refreshCaptainOptions,
            saveAllStates) {
            return () => {
                applyFormation(lineupBlock.lineup, formationSelect.value, lineupBlock);
                refreshCaptainOptions(lineupBlock, players);
                saveAllStates();
            };
        }

        function makeCaptainHandler(saveAllStates) {
            return () => saveAllStates();
        }

        function repaintStyleCollision() {
            const homeTeamStyleId = homeStyle.value || 'norm';
            const awayTeamStyleId = awayStyle.value || 'norm';
            const info = getCollisionInfo(homeTeamStyleId, awayTeamStyleId);
            paintStyleSelectByCollision(homeStyle, info.teamStatus);
            paintStyleSelectByCollision(awayStyle, info.oppStatus);
        }
        homeStyle.addEventListener('change', () => onStyleChange(repaintStyleCollision, saveAllStates));
        awayStyle.addEventListener('change', () => onStyleChange(repaintStyleCollision, saveAllStates));
        homeFormationSelect.addEventListener('change', () => {
            homeLineupBlock.applyFormation(homeFormationSelect.value);
            refreshCaptainOptions(homeLineupBlock, homePlayers);
            saveAllStates();
        });
        awayFormationSelect.addEventListener('change', () => {
            awayLineupBlock.applyFormation(awayFormationSelect.value);
            refreshCaptainOptions(awayLineupBlock, awayPlayers);
            saveAllStates();
        });
        homeLineupBlock.captainSelect.addEventListener('change', makeCaptainHandler(saveAllStates));
        awayLineupBlock.captainSelect.addEventListener('change', makeCaptainHandler(saveAllStates));
        repaintStyleCollision();
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Очистить состав';
        clearBtn.style.marginTop = '15px';
        clearBtn.className = 'butn-red';
        clearBtn.style.padding = '8px 16px';
        clearBtn.onclick = () => {
            clearTeamState(CONFIG.STORAGE_KEYS.HOME);
            clearTeamState(CONFIG.STORAGE_KEYS.AWAY);
            homeStyle.value = 'norm';
            awayStyle.value = 'norm';
            homeFormationSelect.value = Object.keys(FORMATIONS)[0];
            awayFormationSelect.value = Object.keys(FORMATIONS)[0];
            homeLineupBlock.applyFormation(homeFormationSelect.value);
            awayLineupBlock.applyFormation(awayFormationSelect.value);
            homeLineupBlock.lineup.forEach(slot => {
                slot.setValue('', '');
            });
            awayLineupBlock.lineup.forEach(slot => {
                slot.setValue('', '');
            });
            homeLineupBlock.captainSelect.value = '';
            awayLineupBlock.captainSelect.value = '';
            refreshCaptainOptions(homeLineupBlock, homePlayers);
            refreshCaptainOptions(awayLineupBlock, awayPlayers);
            repaintStyleCollision();
            setSynergyPercentHome(0);
            setSynergyPercentAway(0);
            saveAllStates();
        };
        container.appendChild(clearBtn);
        
        // Функция для пересчета силы команд
        window.__vs_recalculateStrength = async () => {
            const wt = getCurrentWeatherFromUI();
            if (!wt) {
                alert('Не найдены элементы UI погоды');
                return;
            }
            const stadiumCapacityLocal = stadiumCapacity;
            const homeAttendanceInput = document.getElementById('vs_home_attendance');
            const homeAttendance = homeAttendanceInput ? parseInt(homeAttendanceInput.value, 10) :
                stadiumCapacityLocal;
            const homeAttendancePercent = stadiumCapacityLocal ? Math.round((homeAttendance /
                stadiumCapacityLocal) * 100) : -1;
            const userSynergyHome = getSynergyPercentHome() / 100;
            const userSynergyAway = getSynergyPercentAway() / 100;
            const homeTeamStyleId = mapCustomStyleToStyleId(homeStyle.value);
            const awayTeamStyleId = mapCustomStyleToStyleId(awayStyle.value);
            async function computeTeamStrength(lineup, players, teamStyleId, sideLabel, opponentTeamStyleId,
                homeBonusPercent = -1, userSynergy = 0, atmosphereValue = 0) {
                const teamRatings = parseTeamsRatingFromPage() || {
                    home: 0,
                    away: 0
                };
                const moraleMode = (sideLabel === 'home' ? (window.homeTeam && window.homeTeam.morale) :
                    (window.awayTeam && window.awayTeam.morale)) || 'normal';
                const moraleBounds = getMoraleBonusBounds({
                    homeRating: teamRatings.home,
                    awayRating: teamRatings.away,
                    sideLabel
                });

                // Бонус дома для турниров типа B и международных кубков
                const tournamentType = getTournamentType();
                const hasHomeBonus = tournamentType === 'typeB' || 
                                     tournamentType === 'typeB_amateur' || 
                                     tournamentType === 'typeC_international';
                const homeBonusValue = hasHomeBonus ? getHomeBonus(homeBonusPercent) : 0;

                const myStyleId = teamStyleId || 'norm';
                const oppStyleId = opponentTeamStyleId || 'norm';
                const inLineupPlayers = lineup.map(slot => {
                    const id = slot.getValue && slot.getValue();
                    return id ? players.find(p => String(p.id) === String(id)) : null;
                }).filter(Boolean);
                const {
                    teamIBonusByPlayer,
                    teamIBonusTotal
                } = getTeamIBonusForLineup(inLineupPlayers, lineup);
                const captainSelectEl = sideLabel === 'home' ? homeLineupBlock.captainSelect :
                    awayLineupBlock.captainSelect;
                const {
                    captainId,
                    captainPlayer,
                    dummyEntries
                } = buildCaptainContext(lineup, players, captainSelectEl);
                const teamCaptainPercent = estimateCaptainPercent(captainPlayer, dummyEntries) || 0;
                let captainBonus = 0;
                if (captainPlayer && teamCaptainPercent !== 0) {
                    const captainRealStr = Number(captainPlayer.realStr) || 0;
                    captainBonus = captainRealStr * teamCaptainPercent;
                }
                const {
                    teamStatus,
                    teamBonus
                } = getCollisionInfo(myStyleId, oppStyleId);
                const tasks = lineup.map(slot => new Promise(resolve => {
                    const playerId = slot.getValue && slot.getValue();
                    if (!playerId) return resolve(null);
                    const player = players.find(p => String(p.id) === String(playerId));
                    if (!player) return resolve(null);
                    const playerCustomStyle = slot.customStyleValue || 'norm';
                    const playerStyleId = KNOWN_STYLE_IDS.has(playerCustomStyle) ?
                        playerCustomStyle : 'norm';
                    const styleNumeric = STYLE_VALUES[playerStyleId] ?? 0;
                    const requestedStrength = Number(player.baseStrength) || 0;
                    getWeatherStrengthValueCached(styleNumeric, wt.temperature, wt.weather,
                        requestedStrength, (res) => {
                            if (!res || !res.found) {
                                console.warn('[Calc] WeatherStrength not found', {
                                    side: sideLabel,
                                    player: player?.name,
                                    playerStyleId,
                                    teamStyleId: myStyleId,
                                    weather: wt.weather,
                                    temperature: wt.temperature,
                                    strengthRow: requestedStrength,
                                    error: res?.error
                                });
                                return resolve({
                                    player,
                                    weatherStr: null,
                                    wasNormalized: false,
                                    playerStyleId,
                                    teamStyleId: myStyleId
                                });
                            }
                            const ws = parseNumericWeatherStr(res.weatherStr);

                            // Логируем ws для отладки
                            console.log('[Weather] Player WS calculated', {
                                player: player.name,
                                baseStr: player.baseStrength,
                                temperature: wt.temperature,
                                weather: wt.weather,
                                weatherStr: res.weatherStr,
                                ws: ws,
                                method: res.details?.method,
                                interpolated: res.interpolated,
                                lowerPoint: res.details?.lowerPoint,
                                upperPoint: res.details?.upperPoint
                            });

                            resolve({
                                player,
                                weatherStr: (ws == null || ws === 0) ? null :
                                    ws,
                                wasNormalized: !!res.details.wasNormalized,
                                playerStyleId,
                                teamStyleId: myStyleId
                            });
                        });
                }));
                const results = await Promise.all(tasks);
                let total = 0;
                let totalCollisionWinBonus = 0;
                let totalHomeBonus = 0;
                let totalChemistryBonus = 0;
                let totalLeadershipBonus = 0;
                let totalDefenceTypeBonus = 0;
                let totalMoraleBonus = 0;
                let totalSynergyBonus = 0;
                let totalPositionBonus = 0;
                let totalTeamIBonus = 0;
                let totalAtmosphereBonus = 0;
                const slotEntries = lineup.map((slot, idx) => {
                    const playerId = slot.getValue && slot.getValue();
                    const player = playerId ? players.find(p => String(p.id) === String(
                        playerId)) : null;
                    const matchPos = slot.posValue || null;
                    return player ? {
                        idx,
                        slot,
                        player,
                        matchPos
                    } : null;
                }).filter(Boolean);
                const team = {
                    positions: slotEntries.map(e => e.matchPos),
                    realStr: slotEntries.map(e => Number(e.player.realStr) || 0),
                    contribution: slotEntries.map(e => 0),
                    defenceType: (sideLabel === 'home' ? (window.homeTeam && window.homeTeam
                        .defenceType) : (window.awayTeam && window.awayTeam.defenceType)) ||
                        'zonal',
                    rough: (sideLabel === 'home' ? (window.homeTeam && window.homeTeam.rough) : (
                        window.awayTeam && window.awayTeam.rough)) || 'clean',
                    morale: (sideLabel === 'home' ? (window.homeTeam && window.homeTeam.morale) : (
                        window.awayTeam && window.awayTeam.morale)) || 'normal',
                    log: [],
                    name: sideLabel
                };
                const opponent = {
                    positions: (sideLabel === 'home' ? (window.awayLineupBlock && window
                        .awayLineupBlock.lineup.map(slot => slot.posValue)) : (window
                            .homeLineupBlock && window.homeLineupBlock.lineup.map(slot => slot
                                .posValue))) || []
                };
                const totalRoughBonus = roughBonus({
                    team,
                    slotEntries
                }) || 0;
                defenceTypeBonus({
                    team,
                    opponent
                });
                const bonusActive = team.contribution.some(v => v > 0);
                const defenceTypeWinStatus = bonusActive ? 'win' : 'lose';
                if (sideLabel === 'home' && window.homeDefenceTypeSelect) {
                    window.homeDefenceTypeSelect.setHighlight(defenceTypeWinStatus);
                }
                if (sideLabel === 'away' && window.awayDefenceTypeSelect) {
                    window.awayDefenceTypeSelect.setHighlight(defenceTypeWinStatus);
                }
                totalDefenceTypeBonus = team.contribution.reduce((s, v) => s + (Number(v) || 0), 0);
                const leadersByLine = {
                    DEF: [],
                    MID: [],
                    ATT: []
                };
                slotEntries.forEach(entry => {
                    const line = getLineByMatchPos(entry.matchPos);
                    if (!line) return;
                    const abilities = parseAbilities(entry.player.abilities);
                    const leaderAb = abilities.find(a => a.type === 'Л');
                    if (!leaderAb) return;
                    const lvl = Math.max(1, Math.min(4, Number(leaderAb.level) || 1));
                    leadersByLine[line].push({
                        entry,
                        level: lvl
                    });
                });
                const leadershipBonusByPlayerId = new Map();
                ['DEF', 'MID', 'ATT'].forEach(line => {
                    const leaders = leadersByLine[line];
                    if (!leaders || leaders.length !== 1) {
                        return;
                    }
                    const leader = leaders[0];
                    
                    // Используем calculatedRealStr вместо realStr для корректного расчета
                    const leaderSlot = leader.entry.slot;
                    let leaderCalculatedStr = 0;
                    if (leaderSlot && leaderSlot.posValue && leaderSlot.physicalFormValue) {
                        leaderCalculatedStr = calculatePlayerStrengthGlobal(
                            leader.entry.player,
                            leaderSlot.posValue,
                            leaderSlot.physicalFormValue
                        );
                    } else {
                        leaderCalculatedStr = Number(leader.entry.player.realStr) || 0;
                    }
                    
                    const coeff = LEADERSHIP_LEVEL_COEFF[leader.level] || 0;
                    const perPlayerBonus = leaderCalculatedStr * coeff;
                    slotEntries.forEach(entry => {
                        const l = getLineByMatchPos(entry.matchPos);
                        if (l !== line) {
                            return;
                        }
                        const prev = leadershipBonusByPlayerId.get(String(entry.player.id)) || 0;
                        leadershipBonusByPlayerId.set(String(entry.player.id), prev + perPlayerBonus);
                    });
                });
                results.forEach(entry => {
                    if (!entry || !entry.player) return;
                    const slotEntryIdx = slotEntries.findIndex(e => String(e.player.id) === String(entry
                        .player.id));
                    if (slotEntryIdx < 0) return;

                    // НОВАЯ ЛОГИКА: Рассчитываем силу игрока на основе baseStr с модификаторами
                    const slotEntry = slotEntries[slotEntryIdx];
                    const slot = slotEntry.slot;  // Используем slot из slotEntry
                    const idx = slotEntry.idx;    // Используем оригинальный индекс
                    const baseStr = Number(entry.player.baseStrength) || 0;
                    const ws = Number(entry.weatherStr);

                    if (!ws || ws === 0) {
                        console.warn('[Calc] Skip player due to invalid WeatherStrength', {
                            side: sideLabel,
                            name: entry.player.name,
                            baseStr,
                            ws
                        });
                        return;
                    }

                    const denom = ws / (baseStr || 1);
                    if (!Number.isFinite(denom) || denom === 0) {
                        console.warn('[Calc] Skip player due to invalid denominator', {
                            side: sideLabel,
                            name: entry.player.name,
                            baseStr,
                            ws,
                            denom
                        });
                        return;
                    }

                    // Шаг 1: Получаем все модификаторы для baseStr
                    // Если форма не установлена вручную, определяем автоматически
                    let actualFormId = slot?.physicalFormValue;
                    if (!actualFormId) {
                        const tournamentType = getTournamentType();
                        actualFormId = getPhysicalFormIdFromData(entry.player.form, entry.player.form_mod, tournamentType);
                    }

                    const physicalFormModifier = getPhysicalFormModifier(actualFormId);
                    const fatigueModifier = getFatigueBonus(entry.player.fatigue);
                    const realityModifier = getRealityBonus(entry.player.real_status, entry.player.real_sign);

                    const playerMatchPos = idx >= 0 ? slotEntries[idx]?.matchPos : null;
                    const playerMainPos = entry.player.mainPos || null;
                    const playerSecondPos = entry.player.secondPos || null;
                    const positionModifier = getPositionModifier(playerMainPos, playerSecondPos, playerMatchPos);

                    // Шаг 2: Вычисляем calculatedRealStr = baseStr * все модификаторы
                    const calculatedRealStr = baseStr * physicalFormModifier * fatigueModifier * realityModifier * positionModifier;

                    // Шаг 3: Вычисляем contribBase = calculatedRealStr * denom
                    const contribBase = calculatedRealStr * denom;
                    // Шаг 4: Бонусы от contribBase
                    const abilityBonusesDetailed = getAbilitiesBonusesDetailed(entry.player.abilities, myStyleId);
                    const abilitiesBonus = getAbilitiesBonusForStyleId(entry.player.abilities, myStyleId);
                    const favoriteStyleBonus = getFavoriteStyleBonus(myStyleId, entry.playerStyleId);
                    
                    // Вратарские способности (только для GK)
                    let goalkeeperBonus = 0;
                    if (playerMatchPos === 'GK') {
                        const hasSW = slotEntries.some(e => e.matchPos === 'SW');
                        goalkeeperBonus = getGoalkeeperAbilitiesBonus(entry.player.abilities, hasSW);
                    }

                    const synergyBonus = getSynergyBonus(entry.player, inLineupPlayers, myStyleId, userSynergy);
                    const synergyBonusForPlayer = contribBase * synergyBonus;
                    totalSynergyBonus += synergyBonusForPlayer;

                    const chemistryBonus = getChemistryBonus(entry.player, inLineupPlayers, myStyleId);
                    const chemistryBonusForPlayer = contribBase * chemistryBonus;
                    totalChemistryBonus += chemistryBonusForPlayer;

                    const positionBonus = getPositionBonus(myStyleId, playerMatchPos);
                    const positionBonusForPlayer = contribBase * positionBonus;
                    totalPositionBonus += positionBonusForPlayer;

                    const moraleBonusForPlayer = getMoraleBonusForPlayer({
                        moraleMode,
                        contribBase,
                        bounds: moraleBounds
                    });
                    totalMoraleBonus += moraleBonusForPlayer;

                    const atmosphereBonusForPlayer = getAtmosphereBonus(contribBase, atmosphereValue);
                    totalAtmosphereBonus += atmosphereBonusForPlayer;

                    const homeBonusForPlayer = contribBase * homeBonusValue;
                    totalHomeBonus += homeBonusForPlayer;

                    let collisionWinBonusForPlayer = 0;
                    if (teamStatus === COLLISION_WIN && teamBonus > 0) {
                        collisionWinBonusForPlayer = contribBase * teamBonus;
                        totalCollisionWinBonus += collisionWinBonusForPlayer;
                    }

                    const defenceTypeBonusForPlayer = idx >= 0 ? (team.contribution[idx] || 0) : 0;

                    const totalBonus = abilitiesBonus + favoriteStyleBonus + goalkeeperBonus;
                    const contribWithIndividualBonuses = contribBase * (1 + totalBonus);

                    // Шаг 5: Бонусы от calculatedRealStr
                    const isCaptain = captainId && String(entry.player.id) === String(captainId);
                    // Капитанский бонус: если это капитан, бонус 0, иначе вычисляем от calculatedRealStr капитана
                    let captainBonusForPlayer = 0;
                    if (!isCaptain && captainPlayer && teamCaptainPercent !== 0) {
                        // Находим slot капитана для получения его позиции и формы
                        const captainSlot = lineup.find(s => {
                            const pid = s.getValue && s.getValue();
                            return pid && String(pid) === String(captainId);
                        });

                        let captainCalculatedStr;
                        if (captainSlot && captainSlot.posValue) {
                            // Вычисляем calculatedRealStr капитана с учетом всех модификаторов
                            const captainBaseStr = Number(captainPlayer.baseStrength) || 0;

                            // Форма капитана
                            let captainFormId = captainSlot.physicalFormValue;
                            if (!captainFormId) {
                                const tournamentType = getTournamentType();
                                captainFormId = getPhysicalFormIdFromData(captainPlayer.form, captainPlayer.form_mod, tournamentType);
                            }

                            const captainPhysicalFormModifier = getPhysicalFormModifier(captainFormId);
                            const captainFatigueModifier = getFatigueBonus(captainPlayer.fatigue);
                            const captainRealityModifier = getRealityBonus(captainPlayer.real_status, captainPlayer.real_sign);
                            const captainPositionModifier = getPositionModifier(captainPlayer.mainPos, captainPlayer.secondPos, captainSlot.posValue);

                            captainCalculatedStr = captainBaseStr * captainPhysicalFormModifier * captainFatigueModifier * captainRealityModifier * captainPositionModifier;
                        } else {
                            // Fallback на realStr если нет данных о позиции
                            captainCalculatedStr = Number(captainPlayer.realStr) || 0;
                        }

                        captainBonusForPlayer = captainCalculatedStr * teamCaptainPercent;
                    }

                    const roughMode = getRough(team);
                    const roughBonusForPlayer = getRoughBonusForPlayer(calculatedRealStr, roughMode);

                    const leadershipBonusForPlayer = leadershipBonusByPlayerId.get(String(entry.player.id)) || 0;
                    totalLeadershipBonus += leadershipBonusForPlayer;
                    
                    // teamIBonus добавляется к каждому игроку
                    const teamIBonusForPlayer = teamIBonusTotal;
                    totalTeamIBonus += teamIBonusForPlayer;
                    
                    const contribution = contribWithIndividualBonuses +
                        captainBonusForPlayer +
                        collisionWinBonusForPlayer +
                        chemistryBonusForPlayer +
                        homeBonusForPlayer +
                        leadershipBonusForPlayer +
                        synergyBonusForPlayer +
                        roughBonusForPlayer +
                        defenceTypeBonusForPlayer +
                        positionBonusForPlayer +
                        moraleBonusForPlayer +
                        atmosphereBonusForPlayer +
                        teamIBonusForPlayer;
                    total += contribution;

                    console.log('[Calc] Player contribution', {
                        side: sideLabel,
                        name: entry.player.name,
                        baseStr,
                        weatherStr: ws,
                        calculatedRealStr,
                        contribBase,
                        moraleMode,
                        moraleBonusForPlayer: moraleBonusForPlayer.toFixed(2),
                        moraleBounds: {
                            super: moraleBounds.superBonus,
                            rest: moraleBounds.restBonus
                        },
                        contribution
                    });
                });
                // teamIBonusTotal уже добавлен к каждому игроку, не добавляем отдельно
                const nonCaptainCount = results.filter(entry => entry && entry.player && (!captainId ||
                    String(entry.player.id) !== String(captainId))).length;
                const totalCaptainBonus = (Number(captainBonus) || 0) * nonCaptainCount;

                console.log('[Calc] Team total', {
                    side: sideLabel,
                    total,
                    moraleMode,
                    moraleBounds: {
                        super: moraleBounds.superBonus,
                        rest: moraleBounds.restBonus
                    },
                    totalTeamIBonus,
                    totalCaptainBonus,
                    totalCollisionWinBonus,
                    totalSynergyBonus,
                    totalChemistryBonus,
                    totalHomeBonus,
                    totalDefenceTypeBonus,
                    totalLeadershipBonus,
                    totalRoughBonus,
                    totalPositionBonus,
                    totalMoraleBonus,
                    atmosphereValue,
                    totalAtmosphereBonus
                });

                return total
            }
            try {
                const [homeStrength, awayStrength] = await Promise.all([
                    computeTeamStrength(homeLineupBlock.lineup, homePlayers, homeTeamStyleId,
                        'home', awayTeamStyleId, homeAttendancePercent, userSynergyHome, homeAtmosphere),
                    computeTeamStrength(awayLineupBlock.lineup, awayPlayers, awayTeamStyleId,
                        'away', homeTeamStyleId, -1, userSynergyAway, awayAtmosphere)
                ]);
                const oldResult = container.querySelector('.vsol-result');
                if (oldResult) oldResult.remove();
                const resultDiv = document.createElement('div');
                resultDiv.className = 'vsol-result';
                resultDiv.style.marginTop = '15px';
                resultDiv.style.fontWeight = 'bold';
                resultDiv.innerHTML =
                    `<div>Сила хозяев: <b>${Math.round(homeStrength)}</b></div><div>Сила гостей: <b>${Math.round(awayStrength)}</b></div>`;
                container.appendChild(resultDiv);
            } catch (e) {
                console.error('Ошибка расчёта:', e);
                alert('Ошибка при расчёте силы команд. Подробности в консоли.');
            }
        };
        
        const btn = document.createElement('button');
        btn.textContent = 'Рассчитать силу';
        btn.style.marginTop = '15px';
        btn.className = 'butn-green';
        btn.style.padding = '8px 16px';
        btn.onclick = () => window.__vs_recalculateStrength();
        container.appendChild(btn);
        window.saveAllStates = saveAllStates;

        // Кнопка обновления футболок
        const refreshShirtsBtn = document.createElement('button');
        refreshShirtsBtn.textContent = 'Обновить футболки';
        refreshShirtsBtn.style.marginTop = '10px';
        refreshShirtsBtn.style.marginLeft = '10px';
        refreshShirtsBtn.className = 'butn';
        refreshShirtsBtn.style.padding = '6px 12px';
        refreshShirtsBtn.style.fontSize = '12px';
        refreshShirtsBtn.title = 'Очистить кэш и загрузить футболки заново';
        refreshShirtsBtn.onclick = async () => {
            if (!homeTeamId || !awayTeamId) return;

            // Очищаем кэш
            try {
                localStorage.removeItem(getShirtsCacheKey(homeTeamId));
                localStorage.removeItem(getShirtsCacheKey(awayTeamId));


                // Перезагружаем футболки
                await initializeShirtsSystem(homeTeamId, awayTeamId, fieldCol, homeFormationSelect, awayFormationSelect, homeLineupBlock, awayLineupBlock);

                alert('Футболки успешно обновлены!');
            } catch (error) {
                console.error('[Shirts] Failed to refresh:', error);
                alert('Ошибка при обновлении футболок');
            }
        };
        container.appendChild(refreshShirtsBtn);

        // Инициализируем систему футболок
        if (homeTeamId && awayTeamId && fieldCol) {
            initializeShirtsSystem(homeTeamId, awayTeamId, fieldCol, homeFormationSelect, awayFormationSelect, homeLineupBlock, awayLineupBlock)
                .catch(err => console.error('[Shirts] Failed to initialize:', err));
        }

        // Первый автоматический расчет после загрузки
        setTimeout(() => {
            if (typeof window.__vs_recalculateStrength === 'function') {
                window.__vs_recalculateStrength();
            }
        }, 1000);

        return container;
    }
    init();
})();

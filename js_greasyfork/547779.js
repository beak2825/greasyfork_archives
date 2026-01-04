// ==UserScript==
// @name         Catwar - Подсветка клеток (ЛЗ) с управлением, автопереключением и таймером
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Подсвечивает клетки на catwar.net/cw3/ с ручным переключением локаций, автопереключением по клику и таймером со звуком
// @author       MyName
// @match        https://catwar.net/cw3/*
// @match        https://catwar.net/*
// @match        https://catwar.su/cw3/*
// @match        https://catwar.su/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547779/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%97%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/547779/Catwar%20-%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D0%BA%20%28%D0%9B%D0%97%29%20%D1%81%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B8%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для интерфейса
    GM_addStyle(`
        .cw-highlight-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 200px;
        }
        .cw-highlight-ui button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 0 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .cw-highlight-ui button:hover {
            background: #45a049;
        }
        .cw-highlight-ui span {
            font-weight: bold;
            margin: 0 10px;
        }
        .highlighted-cell {
            cursor: pointer;
        }
        .cw-input-container {
            margin-top: 10px;
        }
        .cw-input-container input {
            width: 60px;
            padding: 5px;
            margin-right: 5px;
        }
        .cw-input-container button {
            padding: 5px 10px;
        }
        .cw-timer-container {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        .cw-timer-display {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .cw-timer-setup {
            margin-top: 10px;
        }
    `);

    // База данных всех локаций (ID => {row, col}) из таблицы ЛЗ.xlsx
    const highlightRules = {
        489: { row: 3, col: 3 },
        488: { row: 4, col: 9 },
        487: { row: 3, col: 2 },
        486: { row: 4, col: 7 },
        485: { row: 4, col: 2 },
        484: { row: 5, col: 6 },
        483: { row: 5, col: 8 },
        482: { row: 5, col: 1 },
        481: { row: 5, col: 1 },
        480: { row: 1, col: 9 },
        479: { row: 2, col: 5 },
        478: { row: 2, col: 2 },
        477: { row: 2, col: 2 },
        476: { row: 1, col: 4 },
        475: { row: 4, col: 1 },
        474: { row: 1, col: 1 },
        473: { row: 2, col: 5 },
        472: { row: 3, col: 6 },
        471: { row: 1, col: 6 },
        470: { row: 6, col: 1 },
        469: { row: 6, col: 1 },
        468: { row: 4, col: 2 },
        467: { row: 4, col: 6 },
        466: { row: 5, col: 2 },
        465: { row: 6, col: 2 },
        464: { row: 3, col: 7 },
        463: { row: 2, col: 5 },
        462: { row: 3, col: 8 },
        461: { row: 2, col: 1 },
        460: { row: 1, col: 8 },
        459: { row: 4, col: 2 },
        458: { row: 2, col: 1 },
        457: { row: 3, col: 6 },
        456: { row: 4, col: 7 },
        455: { row: 5, col: 8 },
        454: { row: 5, col: 2 },
        453: { row: 5, col: 4 },
        452: { row: 1, col: 5 },
        451: { row: 4, col: 7 },
        450: { row: 5, col: 3 },
        449: { row: 4, col: 8 },
        448: { row: 4, col: 6 },
        447: { row: 5, col: 2 },
        446: { row: 5, col: 6 },
        445: { row: 3, col: 2 },
        444: { row: 2, col: 5 },
        443: { row: 6, col: 5 },
        442: { row: 1, col: 4 },
        441: { row: 4, col: 9 },
        440: { row: 6, col: 3 },
        439: { row: 3, col: 3 },
        438: { row: 4, col: 7 },
        437: { row: 4, col: 1 },
        436: { row: 2, col: 4 },
        435: { row: 6, col: 6 },
        434: { row: 1, col: 1 },
        433: { row: 6, col: 8 },
        432: { row: 6, col: 7 },
        431: { row: 4, col: 9 },
        430: { row: 6, col: 1 },
        429: { row: 4, col: 2 },
        428: { row: 5, col: 2 },
        427: { row: 5, col: 4 },
        426: { row: 5, col: 1 },
        425: { row: 5, col: 5 },
        424: { row: 5, col: 9 },
        423: { row: 5, col: 6 },
        422: { row: 3, col: 1 },
        421: { row: 6, col: 9 },
        420: { row: 5, col: 7 },
        419: { row: 4, col: 4 },
        418: { row: 2, col: 7 },
        417: { row: 2, col: 9 },
        416: { row: 1, col: 1 },
        415: { row: 1, col: 9 },
        414: { row: 2, col: 8 },
        413: { row: 4, col: 5 },
        412: { row: 5, col: 2 },
        411: { row: 3, col: 9 },
        410: { row: 1, col: 5 },
        409: { row: 3, col: 6 },
        408: { row: 1, col: 1 },
        407: { row: 1, col: 3 },
        406: { row: 2, col: 6 },
        405: { row: 1, col: 3 },
        404: { row: 2, col: 6 },
        403: { row: 6, col: 7 },
        402: { row: 2, col: 7 },
        401: { row: 3, col: 4 },
        400: { row: 3, col: 2 },
        399: { row: 4, col: 2 },
        398: { row: 4, col: 2 },
        397: { row: 2, col: 4 },
        396: { row: 3, col: 9 },
        395: { row: 1, col: 1 },
        394: { row: 2, col: 6 },
        393: { row: 2, col: 7 },
        392: { row: 4, col: 8 },
        391: { row: 3, col: 1 },
        390: { row: 4, col: 8 },
        389: { row: 6, col: 2 },
        388: { row: 4, col: 6 },
        387: { row: 4, col: 7 },
        386: { row: 4, col: 3 },
        385: { row: 6, col: 5 },
        384: { row: 1, col: 1 },
        383: { row: 1, col: 4 },
        382: { row: 5, col: 1 },
        381: { row: 2, col: 2 },
        380: { row: 5, col: 2 },
        379: { row: 3, col: 2 },
        378: { row: 2, col: 5 },
        377: { row: 2, col: 7 },
        376: { row: 2, col: 5 },
        375: { row: 3, col: 9 },
        374: { row: 2, col: 2 },
        373: { row: 5, col: 8 },
        372: { row: 2, col: 5 },
        371: { row: 2, col: 4 },
        370: { row: 6, col: 1 },
        369: { row: 3, col: 6 },
        368: { row: 1, col: 9 },
        367: { row: 1, col: 4 },
        366: { row: 2, col: 8 },
        365: { row: 6, col: 7 },
        364: { row: 1, col: 6 },
        363: { row: 3, col: 4 },
        362: { row: 3, col: 7 },
        361: { row: 6, col: 6 },
        360: { row: 2, col: 1 },
        359: { row: 2, col: 8 },
        358: { row: 1, col: 3 },
        357: { row: 5, col: 2 },
        356: { row: 6, col: 7 },
        355: { row: 2, col: 8 },
        354: { row: 4, col: 3 },
        353: { row: 1, col: 3 },
        352: { row: 6, col: 2 },
        351: { row: 1, col: 1 },
        350: { row: 4, col: 4 },
        349: { row: 2, col: 8 },
        348: { row: 2, col: 3 },
        347: { row: 4, col: 2 },
        346: { row: 5, col: 7 },
        345: { row: 1, col: 2 },
        344: { row: 4, col: 1 },
        343: { row: 5, col: 2 },
        342: { row: 3, col: 8 },
        341: { row: 5, col: 6 },
        340: { row: 1, col: 2 },
        339: { row: 5, col: 4 },
        338: { row: 3, col: 7 },
        337: { row: 3, col: 1 },
        336: { row: 3, col: 3 },
        335: { row: 4, col: 2 },
        334: { row: 6, col: 7 },
        333: { row: 5, col: 8 },
        332: { row: 5, col: 2 },
        331: { row: 6, col: 4 },
        330: { row: 2, col: 7 },
        329: { row: 6, col: 7 },
        328: { row: 6, col: 9 },
        327: { row: 4, col: 2 },
        326: { row: 2, col: 6 },
        325: { row: 4, col: 6 },
        324: { row: 1, col: 9 },
        323: { row: 1, col: 5 },
        322: { row: 5, col: 4 },
        321: { row: 1, col: 2 },
        320: { row: 5, col: 2 },
        319: { row: 2, col: 5 },
        318: { row: 1, col: 9 },
        317: { row: 5, col: 6 },
        316: { row: 2, col: 7 },
        315: { row: 2, col: 4 },
        314: { row: 1, col: 1 },
        313: { row: 2, col: 1 },
        312: { row: 3, col: 8 },
        311: { row: 1, col: 1 },
        310: { row: 1, col: 5 },
        309: { row: 2, col: 7 },
        308: { row: 2, col: 5 },
        307: { row: 4, col: 3 },
        306: { row: 6, col: 1 },
        305: { row: 5, col: 2 },
        304: { row: 2, col: 7 },
        303: { row: 2, col: 4 },
        302: { row: 6, col: 5 },
        301: { row: 2, col: 4 },
        300: { row: 4, col: 1 },
        299: { row: 1, col: 7 },
        298: { row: 2, col: 1 },
        297: { row: 3, col: 2 },
        296: { row: 3, col: 4 },
        295: { row: 4, col: 5 },
        294: { row: 6, col: 3 },
        293: { row: 3, col: 2 },
        292: { row: 6, col: 4 },
        291: { row: 2, col: 2 },
        290: { row: 2, col: 6 },
        289: { row: 5, col: 3 },
        288: { row: 4, col: 7 },
        287: { row: 1, col: 1 },
        286: { row: 5, col: 2 },
        285: { row: 5, col: 2 },
        284: { row: 6, col: 8 },
        283: { row: 3, col: 4 },
        282: { row: 2, col: 4 },
        281: { row: 3, col: 2 },
        280: { row: 1, col: 2 },
        279: { row: 6, col: 2 },
        278: { row: 2, col: 4 },
        277: { row: 5, col: 1 },
        276: { row: 3, col: 5 },
        275: { row: 6, col: 9 },
        274: { row: 1, col: 2 },
        273: { row: 3, col: 7 },
        272: { row: 1, col: 6 },
        271: { row: 1, col: 9 },
        270: { row: 1, col: 2 },
        269: { row: 5, col: 1 },
        268: { row: 3, col: 5 },
        267: { row: 1, col: 2 },
        266: { row: 2, col: 9 },
        265: { row: 2, col: 9 },
        264: { row: 2, col: 2 },
        263: { row: 1, col: 6 },
        262: { row: 3, col: 6 },
        261: { row: 6, col: 6 },
        260: { row: 2, col: 9 },
        259: { row: 3, col: 3 },
        258: { row: 3, col: 6 },
        257: { row: 1, col: 2 },
        256: { row: 1, col: 4 },
        255: { row: 3, col: 3 },
        254: { row: 2, col: 2 },
        253: { row: 1, col: 7 },
        252: { row: 5, col: 9 },
        251: { row: 6, col: 1 },
        250: { row: 5, col: 4 },
        249: { row: 2, col: 9 },
        248: { row: 3, col: 2 },
        247: { row: 1, col: 8 },
        246: { row: 5, col: 1 },
        245: { row: 2, col: 4 },
        244: { row: 2, col: 3 },
        243: { row: 2, col: 7 },
        242: { row: 4, col: 5 },
        241: { row: 2, col: 1 },
        240: { row: 3, col: 4 },
        239: { row: 2, col: 7 },
        238: { row: 2, col: 7 },
        237: { row: 4, col: 6 },
        236: { row: 2, col: 8 },
        235: { row: 5, col: 3 },
        234: { row: 5, col: 8 },
        233: { row: 4, col: 9 },
        232: { row: 2, col: 3 },
        231: { row: 1, col: 9 },
        230: { row: 6, col: 8 },
        229: { row: 3, col: 3 },
        228: { row: 4, col: 3 },
        227: { row: 2, col: 9 },
        226: { row: 1, col: 9 },
        225: { row: 4, col: 7 },
        224: { row: 5, col: 6 },
        223: { row: 5, col: 1 },
        222: { row: 4, col: 2 },
        221: { row: 6, col: 3 },
        220: { row: 2, col: 5 },
        219: { row: 5, col: 2 },
        218: { row: 2, col: 7 },
        217: { row: 1, col: 2 },
        216: { row: 1, col: 9 },
        215: { row: 5, col: 2 },
        214: { row: 4, col: 5 },
        213: { row: 5, col: 4 },
        212: { row: 2, col: 2 },
        211: { row: 2, col: 7 },
        210: { row: 3, col: 8 },
        209: { row: 1, col: 3 },
        208: { row: 1, col: 8 },
        207: { row: 4, col: 4 },
        206: { row: 5, col: 9 },
        205: { row: 2, col: 1 },
        204: { row: 3, col: 2 },
        203: { row: 3, col: 6 },
        202: { row: 1, col: 4 },
        201: { row: 5, col: 3 },
        200: { row: 1, col: 7 },
        199: { row: 4, col: 2 },
        198: { row: 2, col: 4 },
        197: { row: 2, col: 3 },
        196: { row: 6, col: 3 },
        195: { row: 4, col: 4 },
        194: { row: 6, col: 5 },
        193: { row: 3, col: 8 },
        192: { row: 2, col: 1 },
        191: { row: 1, col: 1 },
        190: { row: 2, col: 4 },
        189: { row: 1, col: 7 },
        188: { row: 1, col: 3 },
        187: { row: 2, col: 1 },
        186: { row: 1, col: 9 },
        185: { row: 2, col: 1 },
        184: { row: 1, col: 1 },
        183: { row: 1, col: 5 },
        182: { row: 1, col: 4 },
        181: { row: 2, col: 5 },
        180: { row: 5, col: 9 },
        179: { row: 4, col: 9 },
        178: { row: 3, col: 1 },
        177: { row: 3, col: 6 },
        176: { row: 3, col: 1 },
        175: { row: 2, col: 9 },
        174: { row: 6, col: 8 },
        173: { row: 1, col: 3 },
        172: { row: 1, col: 3 },
        171: { row: 1, col: 6 },
        170: { row: 3, col: 5 },
        169: { row: 5, col: 4 },
        168: { row: 5, col: 3 },
        167: { row: 2, col: 4 },
        166: { row: 2, col: 3 },
        165: { row: 6, col: 8 },
        164: { row: 3, col: 2 },
        163: { row: 4, col: 3 },
        162: { row: 6, col: 6 },
        161: { row: 5, col: 7 },
        160: { row: 3, col: 4 },
        159: { row: 2, col: 2 },
        158: { row: 1, col: 9 },
        157: { row: 3, col: 2 },
        156: { row: 1, col: 8 },
        155: { row: 1, col: 7 },
        154: { row: 5, col: 1 },
        153: { row: 2, col: 4 },
        152: { row: 5, col: 5 },
        151: { row: 3, col: 6 },
        150: { row: 2, col: 7 },
        149: { row: 3, col: 1 },
        148: { row: 1, col: 7 },
        147: { row: 1, col: 8 },
        146: { row: 5, col: 3 },
        145: { row: 6, col: 4 },
        144: { row: 1, col: 8 },
        143: { row: 2, col: 8 },
        142: { row: 4, col: 7 },
        141: { row: 1, col: 3 },
        140: { row: 4, col: 2 },
        139: { row: 3, col: 6 },
        138: { row: 5, col: 4 },
        137: { row: 6, col: 4 },
        136: { row: 1, col: 5 },
        135: { row: 5, col: 3 },
        134: { row: 3, col: 7 },
        133: { row: 1, col: 5 },
        132: { row: 6, col: 9 },
        131: { row: 2, col: 8 },
        130: { row: 5, col: 5 },
        129: { row: 6, col: 6 },
        128: { row: 3, col: 4 },
        127: { row: 1, col: 5 },
        126: { row: 5, col: 2 },
        125: { row: 6, col: 6 },
        124: { row: 1, col: 9 },
        123: { row: 2, col: 5 },
        122: { row: 1, col: 7 },
        121: { row: 3, col: 6 },
        120: { row: 6, col: 3 },
        119: { row: 4, col: 1 },
        118: { row: 1, col: 5 },
        117: { row: 6, col: 2 },
        116: { row: 3, col: 9 },
        115: { row: 4, col: 2 },
        114: { row: 5, col: 9 },
        113: { row: 3, col: 1 },
        112: { row: 5, col: 4 },
        111: { row: 3, col: 2 },
        110: { row: 6, col: 3 },
        109: { row: 4, col: 7 },
        108: { row: 2, col: 7 },
        107: { row: 3, col: 3 },
        106: { row: 4, col: 5 },
        105: { row: 3, col: 1 },
        104: { row: 4, col: 3 },
        103: { row: 6, col: 3 },
        102: { row: 6, col: 4 },
        101: { row: 3, col: 8 },
        100: { row: 4, col: 3 },
        99: { row: 2, col: 1 },
        98: { row: 2, col: 3 },
        97: { row: 6, col: 7 },
        96: { row: 5, col: 9 },
        95: { row: 3, col: 5 },
        94: { row: 2, col: 6 },
        93: { row: 4, col: 2 },
        92: { row: 4, col: 8 },
        91: { row: 6, col: 9 },
        90: { row: 3, col: 2 },
        89: { row: 6, col: 9 },
        88: { row: 4, col: 3 },
        87: { row: 3, col: 2 },
        86: { row: 1, col: 1 },
        85: { row: 3, col: 5 },
        84: { row: 6, col: 1 },
        83: { row: 5, col: 9 },
        82: { row: 1, col: 9 },
        81: { row: 1, col: 8 },
        80: { row: 3, col: 3 },
        79: { row: 3, col: 3 },
        78: { row: 1, col: 7 },
        77: { row: 1, col: 3 },
        76: { row: 1, col: 8 },
        75: { row: 6, col: 4 },
        74: { row: 6, col: 1 },
        73: { row: 6, col: 7 },
        72: { row: 6, col: 2 },
        71: { row: 5, col: 8 },
        70: { row: 5, col: 4 },
        69: { row: 4, col: 3 },
        68: { row: 5, col: 1 },
        67: { row: 5, col: 7 },
        66: { row: 5, col: 7 },
        65: { row: 5, col: 1 },
        64: { row: 6, col: 2 },
        63: { row: 6, col: 8 },
        62: { row: 1, col: 3 },
        61: { row: 3, col: 5 },
        60: { row: 5, col: 4 },
        59: { row: 2, col: 3 },
        58: { row: 1, col: 3 },
        57: { row: 2, col: 5 },
        56: { row: 5, col: 4 },
        55: { row: 3, col: 4 },
        54: { row: 6, col: 4 },
        53: { row: 2, col: 5 },
        52: { row: 2, col: 4 },
        51: { row: 1, col: 1 },
        50: { row: 1, col: 2 },
        49: { row: 6, col: 2 },
        48: { row: 2, col: 8 },
        47: { row: 2, col: 3 },
        46: { row: 5, col: 8 },
        45: { row: 1, col: 3 },
        44: { row: 1, col: 6 },
        43: { row: 3, col: 4 },
        42: { row: 4, col: 8 },
        41: { row: 2, col: 2 },
        40: { row: 3, col: 8 },
        39: { row: 4, col: 9 },
        38: { row: 3, col: 5 },
        37: { row: 1, col: 2 },
        36: { row: 3, col: 7 },
        35: { row: 3, col: 7 },
        34: { row: 6, col: 6 },
        33: { row: 2, col: 4 },
        32: { row: 4, col: 1 },
        31: { row: 2, col: 6 },
        30: { row: 3, col: 6 },
        29: { row: 4, col: 6 },
        28: { row: 5, col: 5 },
        27: { row: 3, col: 6 },
        26: { row: 2, col: 2 },
        25: { row: 4, col: 4 },
        24: { row: 5, col: 8 },
        23: { row: 2, col: 4 },
        22: { row: 2, col: 3 },
        21: { row: 4, col: 5 },
        20: { row: 6, col: 4 },
        19: { row: 1, col: 1 },
        18: { row: 6, col: 5 },
        17: { row: 6, col: 4 },
        16: { row: 2, col: 2 },
        15: { row: 6, col: 8 },
        14: { row: 6, col: 9 },
        13: { row: 4, col: 8 },
        12: { row: 6, col: 6 },
        11: { row: 2, col: 5 },
        10: { row: 4, col: 4 },
        9: { row: 2, col: 3 },
        8: { row: 2, col: 8 },
        7: { row: 1, col: 8 },
        6: { row: 4, col: 3 },
        5: { row: 4, col: 4 },
        4: { row: 2, col: 4 },
        3: { row: 6, col: 6 },
        2: { row: 3, col: 3 },
        1: { row: 6, col: 1 }
    };

    // Загружаем сохраненный ID локации или используем 489 по умолчанию
    let currentLocationId = GM_getValue('currentLocationId', 489);
    let highlightedCell = null;
    
    // Переменные для таймера
    let timerInterval = null;
    let timerEndTime = GM_getValue('timerEndTime', 0);
    let timerRunning = GM_getValue('timerRunning', false);
    let timerSeconds = GM_getValue('timerSeconds', 0);
    let notificationShown = GM_getValue('notificationShown', false);

// Функция для воспроизведения милого похрюкивания (встроенный Base64)
function playOinkSound() {
    try {
        const audio = new Audio("data:audio/mp3;base64,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DNh06bBoonJm6AZhagRhCK4sIBmapM9G1IrdEdQ6aI7Rszx4zp0gBuwYEGagSLSQhAEojTIpBTkp+IGZMmgODzZ/BxAMGSKAZ04Z46Zs2Z04PNjM1TuIhQyQHTOGo2RP43OEKEdNDpoehjqEVpKnEaMeZDiAkPkTUz5oWhsPMsWd8mSFB6bMYMMYRMePpIYICGRMeKyBMddtnbX4ftP+ShyYVSEwwxAgcCmFDyuHCgWYQOUCtkwklBRu2VQQ6AjdsqBYYfx/IplGH8ll2Nw/bqRt/5/AqBsCoF3nuVxuN2nAa5Ou2uxrkOETaGHYdx/JyIKYAweXgChVlhM7GmoqYGDo05MwYJTYkya5Dlm4/9ay4Ykta/D7tw+ygIVByYUQTK5xClMoUU3dSPrDiEsOnDOm3IdyWDz8dMEzW4QGyZsTPXbFmKxGcQ5Vht/5fcjEP35RGJZjK43buxuX9pIxYu08s5Txu3qUSyxUlFJunl/aliQ1vngS2I6RhOG6zpmY+mcKiKZ8LmRqQITDe3AzFDOyxTYko6maGp4ypZN0VzAls2YlMXOjLQocVOyMhgDuziTMzkNhN2w3xFUy2oEFAyqAp4jChFtTLWNMoP/70MT/gbTCCv7Pd0HOecEeQd3kOVDJ7mlKciIoebi40KpUvYZEN14Ksnt2NXHByLmmeYQEg4A0zkvy2IFAQbAyIqIGJABcMtMtRGsYDQUMUIvEj8MBmgiXQM85ShPsxBxQY3Wg4MxiTGDQpWyYhokaFwAMMtaCVhVSrugdDEvCyVI4BDMvSFYlPRpmKYMCxJYZdz8tyWMxKG0hWS0DhOTDtA5TXotHWss5i0RYaoC4hapSTKWIuVFplwVhWmt2QlJhRgvMBhlUy0LBZxcygSxWxMGaUXeXeYAZdlpgEPNIUQqG+cVQwgWQ1YzHXdcFdKhyC0XaynKX+WHMY0mFAJAQcIBRIkvcyhNZEFCEAnFBxgBoBQUKCFzaDEZBpqDyxjJhCsYCoSVtIuZYzjV2ss5fmZdl3b0NOVFpl2X+vxF/YdqQ0/0umn+h7OGX9nZp2ozhDT/S6rDMtkG1TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="); // вставь свою строку
        audio.volume = 0.8;
        audio.play();
    } catch (e) {
        console.log("Не удалось воспроизвести похрюкивание:", e);
    }
}

    // Создаем интерфейс управления
    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'cw-highlight-ui';
        ui.innerHTML = `
            <button id="cw-prev">←</button>
            <span id="cw-location-id">ID: ${currentLocationId}</span>
            <button id="cw-next">→</button>
            <div class="cw-input-container">
                <input type="number" id="cw-location-input" min="1" max="489" placeholder="ID локации">
                <button id="cw-go">Перейти</button>
            </div>
            <div class="cw-timer-container">
                <div class="cw-timer-display" id="cw-timer-display">${timerSeconds}</div>
                <div class="cw-timer-setup">
                    <input type="number" id="cw-timer-input" min="1" placeholder="Секунды">
                    <button id="cw-timer-set">Установить</button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);

        // Обработчики кнопок
        document.getElementById('cw-prev').addEventListener('click', () => {
            if (currentLocationId > 1) {
                currentLocationId--;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });

        document.getElementById('cw-next').addEventListener('click', () => {
            if (currentLocationId < 489) {
                currentLocationId++;
                saveAndUpdate();
                highlightCurrentCell();
            }
        });

        // Обработчик кнопки перехода
        document.getElementById('cw-go').addEventListener('click', () => {
            const input = document.getElementById('cw-location-input');
            const newId = parseInt(input.value);

            if (!isNaN(newId) && newId >= 1 && newId <= 489) {
                currentLocationId = newId;
                saveAndUpdate();
                highlightCurrentCell();
                input.value = ''; // Очищаем поле ввода
            } else {
                alert('Пожалуйста, введите число от 1 до 489');
            }
        });

        // Обработчик нажатия Enter в поле ввода
        document.getElementById('cw-location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('cw-go').click();
            }
        });

        // Обработчики таймера
        document.getElementById('cw-timer-set').addEventListener('click', setTimer);
        
        // Обработчик нажатия Enter в поле таймера
        document.getElementById('cw-timer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('cw-timer-set').click();
            }
        });

        // Инициализация таймера
        initTimer();
    }

    // Сохраняем ID и обновляем интерфейс
    function saveAndUpdate() {
        GM_setValue('currentLocationId', currentLocationId);
        updateUI();
    }

    // Обновление отображаемого ID
    function updateUI() {
        const locationElement = document.getElementById('cw-location-id');
        if (locationElement) {
            locationElement.textContent = `ID: ${currentLocationId}`;
        }
    }

    // Подсветка текуной клетки
    function highlightCurrentCell() {
        const rule = highlightRules[currentLocationId];
        if (!rule) {
            alert(`Локация с ID ${currentLocationId} не найдена!`);
            return;
        }

        // Сначала убираем все подсветки
        clearHighlight();

        const table = document.getElementById('cages');
        if (!table) {
            // Если это не игровая страница, просто выходим
            return;
        }

        try {
            const targetCell = table.rows[rule.row - 1].cells[rule.col - 1];
            targetCell.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            targetCell.style.boxShadow = '0 0 10px 5px yellow';
            targetCell.classList.add('highlighted-cell');

            // Сохраняем ссылку на подсвеченную ячейку
            highlightedCell = targetCell;

            // Добавляем обработчик клика - теперь он запускает таймер!
            highlightedCell.addEventListener('click', handleCellClick);

            console.log(`Подсвечена клетка для локации ID ${currentLocationId}: строка ${rule.row}, столбец ${rule.col}`);
        } catch (e) {
            console.log(`Не удалось подсветить клетку для локации ${currentLocationId}`);
        }
    }

    // Очистка подсветки
    function clearHighlight() {
        if (highlightedCell) {
            highlightedCell.style.backgroundColor = '';
            highlightedCell.style.boxShadow = '';
            highlightedCell.classList.remove('highlighted-cell');
            highlightedCell.removeEventListener('click', handleCellClick);
            highlightedCell = null;
        }
    }

    // Обработчик клика по подсвеченной ячейке - теперь запускает таймер!
    function handleCellClick() {
        // Запускаем таймер при клике на выделенную область
        if (timerSeconds > 0 && !timerRunning) {
            startTimer();
        }
        
        // Старая логика переключения локаций
        if (currentLocationId > 1) {
            currentLocationId--;
            saveAndUpdate();
            highlightCurrentCell();
        } else {
            clearHighlight();
            alert('Вы достигли последней локации!');
        }
    }

    // Функции для работы с таймером
    function initTimer() {
        updateTimerDisplay();
        
        // Если таймер был запущен, продолжаем отсчет
        if (timerRunning && timerEndTime > Date.now()) {
            startTimerInterval();
        } else if (timerRunning) {
            // Таймер истек, но был запущен - сбрасываем
            resetTimerState();
        }
    }

    function startTimer() {
        if (timerSeconds <= 0) {
            return;
        }

        // Сбрасываем флаг уведомления
        notificationShown = false;
        GM_setValue('notificationShown', notificationShown);
        
        // Устанавливаем время окончания
        timerEndTime = Date.now() + timerSeconds * 1000;
        timerRunning = true;
        
        // Сохраняем состояние
        GM_setValue('timerEndTime', timerEndTime);
        GM_setValue('timerRunning', timerRunning);
        
        // Запускаем интервал обновления
        startTimerInterval();
    }

    function setTimer() {
        const input = document.getElementById('cw-timer-input');
        const seconds = parseInt(input.value);
        
        if (!isNaN(seconds) && seconds > 0) {
            timerSeconds = seconds;
            GM_setValue('timerSeconds', timerSeconds);
            input.value = '';
            updateTimerDisplay();
        } else {
            alert('Пожалуйста, введите корректное количество секунд');
        }
    }

    function startTimerInterval() {
        // Останавливаем предыдущий интервал, если он был
        clearInterval(timerInterval);
        
        // Запускаем новый интервал
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();
    }

    function resetTimerState() {
        // Останавливаем интервал
        clearInterval(timerInterval);
        timerInterval = null;
        
        // Сбрасываем состояние запуска
        timerRunning = false;
        timerEndTime = 0;
        GM_setValue('timerRunning', timerRunning);
        GM_setValue('timerEndTime', timerEndTime);
        
        // Возвращаем отображение к установленному времени
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const display = document.getElementById('cw-timer-display');
        if (!display) return;
        
        if (!timerRunning) {
            // Таймер не активен - показываем установленное время
            display.textContent = timerSeconds.toString();
            display.style.color = '#333';
            return;
        }
        
        if (timerEndTime <= Date.now()) {
            // Таймер истек
            if (!notificationShown) {
                // ВОСПРОИЗВЕСТИ ЗВУК ХРЮКАНЬЯ ДО ПОЯВЛЕНИЯ ВСПЛЫВАЮЩЕГО ОКНА
                playOinkSound();
                
                // Небольшая задержка перед показом уведомления, чтобы звук успел начать воспроизводиться
                setTimeout(() => {
                    // Показываем уведомление только один раз
                    alert('Переход закончился!');
                    
                    notificationShown = true;
                    GM_setValue('notificationShown', notificationShown);
                }, 100);
            }
            
            // Возвращаемся к установленному времени
            display.textContent = timerSeconds.toString();
            display.style.color = '#333';
            
            // Сбрасываем состояние таймера
            resetTimerState();
            return;
        }
        
        // Вычисляем оставшееся время в секундах
        const remainingSeconds = Math.floor((timerEndTime - Date.now()) / 1000);
        
        // Обновляем отображение
        display.textContent = remainingSeconds.toString();
        
        // Меняем цвет на красный при остатке менее 10 секунд
        if (remainingSeconds <= 10) {
            display.style.color = 'red';
        } else {
            display.style.color = '#333';
        }
    }

    // Запускаем при загрузке страницы
    window.addEventListener('load', function() {
        createUI();
        
        // Пытаемся подсветить клетку только если это игровая страница
        if (window.location.href.includes('/cw3/')) {
            setTimeout(highlightCurrentCell, 1000);
        }
        
        // Обновляем таймер каждую секунду на всех страницас
        setInterval(updateTimerDisplay, 1000);
    });
})();


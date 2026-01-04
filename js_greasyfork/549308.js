// ==UserScript==
// @name         KG_WebTypeStats
// @namespace    KG_WebTypeStats
// @version      0.76
// @description  Записывает все нажатия клавиш в процессе геймплея для дальнейшего статистического анализа. Работает только с полем ввода набираемого в заезде текста.
// @author       un4given (111001)
// @license      GNU GPLv3
// @match        http*://*.klavogonki.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549308/KG_WebTypeStats.user.js
// @updateURL https://update.greasyfork.org/scripts/549308/KG_WebTypeStats.meta.js
// ==/UserScript==

// ⏱️🎹📖💼📜🗃️📂🙈

(function() {
    'use strict';

// --------- !!! DO NOT MODIFY ANYTHING ABOVE THIS LINE UNLESS YOU ARE AWARE OF WHAT YOU ARE DOING !!! -------
// some internal settings\constants

const MAX_LAST_WTS_COUNT = 100; // limit history of autosaved WTSs

const WTS_PANEL_TITLE = 'Статистика набора'; // заголовок панели в заезде (справа)

const NETTO_HINT = 'Реальная скорость (она же средняя)';
const BRUTTO_HINT = 'Гипотетическая скорость без учёта опечаток и их исправлений';
const ERROR_COUNT_HINT = 'Количество серий исправлений\n(может отличаться от количества ошибок на КГ)';
const TYPE_TIME_HINT = 'Время набора текста';
const CORRECT_TYPED_CHARS_HINT = 'Правильно набранные знаки';
const INCORRECT_TYPED_CHARS_HINT = 'Ошибочно набранные знаки';
const CLOSE_BUTTON_HINT = 'Между прочим, кнопка [Esc] тоже работает!';
const TAB_PREV_BUTTON_HINT = 'К предыдущему представлению данных\n(«Стрелка влево» на клаве)';
const TAB_NEXT_BUTTON_HINT = 'К следующему представлению данных\n(«Стрелка вправо» на клаве)';

const WTS_PANEL_READY_HINT = 'Система записи клавожмяков готова!';
const WTS_PANEL_RECORDING_HINT = 'Тихо! Идёт запись клавожмяков...';
const WTS_PANEL_RECORDING_SUSPENDED_HINT = 'Запись клавожмяков приостановлена...';
const WTS_PANEL_FAIL_MSG = 'Упс! Что-то пошло не так :(';

const TOAST_LIFETIME = 2000; // in ms
const TOAST_INVALID_PASTE_DATA = 'Фу, что вы в меня пихаете!';
const TOAST_CLIPBOARD_COPY_OK = 'Скопировано!';
const TOAST_CLIPBOARD_COPY_FAIL = 'Ха! А копировать-то и нечего...';
const TOAST_NOTHING_TO_SAVE = 'Чё-т нечего сохранять!';
const TOAST_NOTHING_TO_PUBLISH = 'Чё-т нечего публиковать!';
const TOAST_NOTHING_TO_DELETE = 'Чё-т нечего удалять!';
const TOAST_SOMETHING_WENT_WRONG = 'Что-то пошло не так...';
const TOAST_USER_NOT_LOGGED_IN = 'Сперва надо залогиниться!';
const TOAST_BLOG_HIDDEN_POST_ADDED = 'Спрятано в БЖ!';
const TOAST_BLOG_POST_ADDED = 'Опубликовано в БЖ!';
const TOAST_ARCHIVE_DELETED = 'Архив статистики удалён!';

const MENU_OPENFILE_HINT = "Открыть файл с WTS-кой (можно несколько) или архив целиком.\nЕсли кликать с Shift'ом, то открываемые файлы будут добавляться к загруженным ранее.";
const MENU_SAVEFILE_HINT = 'Сохранить текущую WTS-ку в файл.';
const MENU_SAVECOLLECTION_HINT = 'Сохранить всю коллекцию WTS-ок из архива или из загруженных файлов.';
const MENU_PUBLISHBLOG_HINT = "Опубликовать текущую WTS-ку в бортжурналe.\nЕсли кликать с Shift'ом, то запись будет публичной, иначе − скрытой.\nКлик с Alt'ом − опубликовать в формате JSON.";
const MENU_DELETEARCHIVE_HINT = "Удалить весь архив статистики заездов";
const MENU_HELP_HINT = "Отправиться в БЖ к унчу за FAQ'ом/обсуждениями";

const CONFIRM_DELETEARCHIVE = "!! Внимание !!\nЭто действие необратимо, поэтому убедитесь, что вы предварительно сохранили всю необходимую вам информацию.\n\nВы действительно хотите удалить весь архив статистики заездов?";

// custom game mode names
const GAME_MODES = {
    normal: 'Обычка',
    abra: 'Абра',
    referats: 'Яндекс.Рефераты',
    noerror: 'Безошибка',
    marathon: 'Марик',
    chars: 'Буквы',
    digits: 'Цифры',
    sprint: 'Спринт',
    // custom name for unknown game mode
    unknown: 'Неведома зверушка',
};

//
const POPULAR_VOCS = {
    192: 'Частотка',
    1789: 'Короткие тексты',
    5539: 'English',
    6018: 'Миник',
    25856: 'Соточка',
    // continue yourself
};

const FAST_DELAY_THRESHOLD = 15; // (in ms!): all delays below this threshold will be marked yellow in text
const DISABLE_CTRL_SHORTCUTS = false; // disable all Ctrl+[anykey (except 'A') \ anydigit] while in-game typing

// --------- !!! DO NOT MODIFY ANYTHING BELOW THIS LINE UNLESS YOU ARE AWARE OF WHAT YOU ARE DOING !!! -------
/*

 KNOWN BUGS \ NUANCES:
 1) calculated speed slightly differs from speed, calculated on site (for different reasons)
 2) speed calculates from first keypress, not from actual game start
 3) Ctrl+Backspace behaviour is set to Chrome/Windows OS (sorryyyyy)
 4) no processing of weird\unusual corrections (like ctrl+a, shift+←→, home→del→end, etc.)
 5) in some cases there might be some keypresses registered right after game end (e.g.: you pressed last [.] and accidentally slipped to [/] at the end of the game)
 6) 2 b continued...

*/

const AM_EMPTY = 0, AM_INGAME = 1, AM_ARCHIVE = 2, AM_FILES = 3; // app modes
const MWC_EMPTY = 0, MWC_CHARTS = 1; // main window content types

const META_KEY = (navigator.platform === "Win32")?'Win':((navigator.platform === "MacIntel")?'Cmd':'Meta');
const ALT_KEY = (navigator.platform === "MacIntel")?'Opt':'Alt';

const TAB_ARROW_LEFT = (navigator.platform === "MacIntel")?'◄':'🠜';
const TAB_ARROW_RIGHT = (navigator.platform === "MacIntel")?'►':'🠞';

const CUT_START_MARK = '…]';
const CUT_END_MARK = '[…';
const HTML_BACKSPACE = (navigator.platform === "MacIntel")?'◄':'🠈';
const HTML_VISIBLE_SPACE = '&#x25FB;';
const MD_VISIBLE_SPACE = '⎵'; //␣ ˽ ⎵

const WTS_FORMAT_VERSION = 1;
const MIN_LAYOUT_DETECTION_SAMPLES = 10;
const MIN_LIST_ELEMENTS_TO_SHOW_PROGRESS = 3;

const MODAL_ID = 'wts-draggable-window';
const STORAGE_POS_KEY = 'WTS_MODAL_POSITION';
const STORAGE_TEXT_CONTROL_OPTIONS_KEY = 'WTS_TEXT_CONTROL_OPTIONS';
const DEFAULT_TEXT_CONTROL_OPTIONS = {'hide-fast': true, 'hide-err': true, 'hide-corr': false};
const UPLOT_CSS = 'https://unpkg.com/uplot@1.6.24/dist/uPlot.min.css';
const UPLOT_JS = 'https://unpkg.com/uplot@1.6.24/dist/uPlot.iife.min.js';

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;

const SPEEDCHART_Y_SCALE = 'static'; //could be either 'static' or 'dynamic';

const HISTOGRAM_BIN_SIZE = 20;
const HISTOGRAM_MAX_X = 400;
const HISTOGRAM_MAX_Y = 0.3;

const ColorUtils = {
    // ===== HELPERS =====
    hexToHsl: function (hex) {
        hex = hex.replace(/^#/, "");
        if (hex.length === 3) {
            hex = hex.split("").map(c => c + c).join("");
        }
        let r = parseInt(hex.substr(0, 2), 16) / 255;
        let g = parseInt(hex.substr(2, 2), 16) / 255;
        let b = parseInt(hex.substr(4, 2), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    },

    hslToHex: function (h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    },

    // ===== GENERATORS =====
    // Lightness gradient (light → dark)
    generateTints: function (baseHex, steps = 16) {
        let [h, s, l] = this.hexToHsl(baseHex);
        let colors = [];
        let lightStart = 90; // very light (90%)
        let lightEnd   = 20; // dark (20%)
        for (let i = 0; i < steps; i++) {
            let li = lightStart + (lightEnd - lightStart) * (i / (steps - 1));
            colors.push(this.hslToHex(h, s, li));
        }
        return colors;
    },

    // Hue gradient (full 360° from baseH)
    generateHues: function (baseH, baseS = 100, baseL = 50, steps = 16) {
        let colors = [];
        for (let i = 0; i < steps; i++) {
            let hi = (baseH + 360 * (i / steps)) % 360;
            colors.push(this.hslToHex(hi, baseS, baseL));
        }
        return colors;
    }
};

const __InitArchive = () => {localStorage.WTS_ARCHIVE = JSON.stringify([])};
const __LoadArchive = () => JSON.parse(localStorage.getItem('WTS_ARCHIVE') || "[]").reverse();

let __appMode = AM_EMPTY;

let __WTSData = [];
let __WTSInfo = {};
let __WTSKeyMap = {};
let __isGameStarted = false;
let __isGameFinished = false;
let __isGameFailed = false; // this is only for noerror mode
let __isQual = false; // freaking qualification with infinite number of retries 🤬
let __isWTSAddedToArchive = false; //we have qualification and error work mode, so we should add WTS to archive only one time.

let __gameStartTime = 0;
let __gameFirstKeyTime = 0;
let __gameEndTime = 0;

let __gameDuration = 0;
let __gameSpeed = 0;
let __gameErrorCount = 0;

let __archive = []; // for local WTS archive (in localStorage)
let __files = []; // same, but for opened\pasted files

// ------ ENTRY POINT ------

    //apply CSS as fast as possible
    injectCSS();

    // include oonch.js framework :D
    function oO(s) {
        var m = {
            '#': 'getElementById',
            '.': 'getElementsByClassName',
            '@': 'getElementsByName',
            '=': 'getElementsByTagName',
            '*': 'querySelectorAll'
        }[s[0]];

        return (typeof m != 'undefined')? document[m](s.slice(1)) : document.getElementById(s);
    };

    // perform initialization
    let lastMS = 0;
    if (!localStorage.WTS_ARCHIVE) {
        __InitArchive();
    }

    const __isInGame = (/\/g\//.test(location.href))? location.href.split('gmid=')[1].replace(/[^\d]+/, '') : null; // contains gameID, just in case :)
    if (__isInGame && localStorage.getItem('curWTS'))
    {
        //cleanup previous leftovers
        localStorage.removeItem('curWTS');
    }

    // temporarily (or not, lol!)
    ['#userpanel-level-container', '#stats-block'].forEach(id => {
        const el = document.body.querySelector(id);
        if (el) {
            el.onclick = (e) => {if (!['A', 'SELECT', 'OPTION'].includes(e.target.nodeName)) showWTS()};
        }
    });

    // show WTS window on Alt+S / close on Esc
    document.addEventListener("keydown", (e) => {
        let modal = oO(`#${MODAL_ID}`);
        if (!modal && e.altKey && e.code == 'KeyS') {
            showWTS();
        } else if (modal && e.key == 'Escape') {
            // do not forget to close uPlot tooltips, if any
            const tooltips = oO('.wts-chart-tooltip');
            for (let tt of tooltips) {
                tt.style.display = "none";
            }
            modal.remove();
        }
    });

    // if we are in game, we need to create side panel and attach event listeners to input text field:
    if (__isInGame) {

        // create rightside panel after 0.5sec
        setTimeout(() => {
            const params = oO("#params");
            if (params) {
                const panel = document.createElement('div');
                panel.id = 'wts-side-panel';

                //        panel.style.backgroundColor = getComputedStyle(params).backgroundColor; // ← enable this, if you are still using KTS with color-themes
                panel.innerHTML = `
<div class="wts-side-panel-content">
 <span id="wts-rec" class="ready" title="${WTS_PANEL_READY_HINT}"></span>
 <h4>${WTS_PANEL_TITLE}</h4>
 <div id="wts-side-panel-stats"></div>
</div>`;

                params.parentNode.insertBefore(panel, params.nextSibling);
            }

        }, 500);

        // listen for focus event: first setFocus is basically a game start, so we need to perform some initialization
        oO("#inputtext").addEventListener("focus", (e) => {
            //enable rec button
            oO('#wts-rec').classList.remove('pause', 'ready');
            oO('#wts-rec').classList.add('blink');
            oO('#wts-rec').title = WTS_PANEL_RECORDING_HINT;

            if (!__isGameStarted) {
                __isGameStarted = true;
                __isQual = /, квалификация,/.test(oO('#gamedesc').innerText);
                __gameStartTime = Date.now();
            }

            // if game finished but we fall into onFocus again, then we either playing qualification (correcting errors) or doing error work, I guess...
            if (__isGameFinished && __isQual) {
                lastMS = performance.now();
            }
        });

        // attach event listener to input text field
        oO("#inputtext").addEventListener("keydown", (e) => {
            let MS = performance.now();

            //check if event is trusted (I am aware that this «protection» is kinda shitty and could be easily bypassed!)
            if (!e.isTrusted) return;

            //skip unnecessary keys
            if (['Meta', 'Shift', 'Control', 'Alt'].includes(e.key)) return;
            //skip Alt + [any printable character]
            if (e.altKey && e.key.length == 1) return;

            //disable ctrl+[b-z0-9\-\=] shortcuts, if needed
            //awsh~~, Ctrl+W can not be disabled this way :(
            if (DISABLE_CTRL_SHORTCUTS && e.ctrlKey && e.code != 'KeyA' && (e.code.startsWith('Key') || e.code.startsWith('Digit') || ['-', '='].includes(e.key))) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (!lastMS) {
                lastMS = MS;

                // save WTS info for future use
                const ver = WTS_FORMAT_VERSION;
                const time = Date.now();
                const uid = (typeof __user__ !== 'undefined')? __user__ : 0;
                let type = oO('#gamedesc').children[0].className.replace('gametype-', '') || "unknown";
                if (type == 'voc') {
                    type += `-${oO('#gamedesc').children[0].children[0].href.replace(/[^0-9]+/g, '')}`;
                }

                __WTSInfo = {ver, time, uid, type};
                __gameFirstKeyTime = Date.now();
            }

            //do not register repeats (except for backspace)
            if (!e.repeat || e.key === 'Backspace') {
                if (e.key === 'Backspace' && !e.target.value) {
                    return; // !!!experimental: do not register corrections when input field is empty
                }

                // build keymap for detecting keyboard layout later
                if (e.code.startsWith('Key')) {
                    __WTSKeyMap[e.code] = e.key;
                }

                let prefix = '';
                let key = e.key; // assign to Event.key by default, but we may change it later in some cases

                // preprocess special combinations before saving (like ctrl+backspace, ctrl+a, shift+home, etc)
                if (e.ctrlKey && (e.code === 'KeyA')) {
                    prefix = 'Ctrl+';
                    key = `A:${e.target.value.length}`; //experimental feature for future use
                } else if ((e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) && ['Backspace', 'Delete', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    if (e.metaKey)  prefix += `${META_KEY}+`;
                    if (e.ctrlKey)  prefix += 'Ctrl+';
                    if (e.altKey)   prefix += `${ALT_KEY}+`;
                    if (e.shiftKey) prefix += 'Shift+';
                }

                __WTSData.push({
                    [prefix + key]: Math.trunc((MS - lastMS)*1000+0.5)/1000
                });
            }

            lastMS = MS;
        });

        oO("#inputtext").addEventListener("blur", (e) => {

            //disable rec button
            oO('#wts-rec').classList.remove('blink');
            oO('#wts-rec').classList.add('pause');
            oO('#wts-rec').title = WTS_PANEL_RECORDING_SUSPENDED_HINT;

            if (__WTSData.length)
            {
                const data = __WTSData; //we need to do that way, so result object will have all the __WTSInfo fields and data:xxx
                localStorage.curWTS = JSON.stringify({...__WTSInfo, data}); //store to localStorage only when input field loses focus (normally it means end of the game)
            }

            __isGameFinished = e.target.parentElement.parentElement.style.display == 'none';

            if (__isGameFinished) {
                __gameEndTime = Date.now();

                if (localStorage.curWTS) {
                    //if we are here, then at least 1 keypress has been recorded, though it can be useless (like backspace only)

                    let curWTS = JSON.parse(localStorage.curWTS);

                    //show stats on right side panel
                    const stats = collectSpeedStats(annotateKeypresses(curWTS.data));
                    oO('#wts-side-panel-stats').innerHTML = `
<table style='width: 100%; margin-top: 10px;'>
 <tr>
  <td width="22%">Скорость:&nbsp;</td><td width="33%"><span title="${NETTO_HINT}">${stats.nettoCPM.toFixed(0)}</span>${(stats.nettoCPM != stats.bruttoCPM)?` <span title="${BRUTTO_HINT}">(${stats.bruttoCPM.toFixed(0)})</span>`:''}</td>
  <td width="15%">Время:&nbsp;</td><td width="30%"><span title="${TYPE_TIME_HINT}">${stats.totalTimeStr}</span></td>
 </tr>
 <tr>
  <td>Ошибки:&nbsp;</td><td>${stats.correctionSeries}</td>
  <td>Знаки:&nbsp;</td><td>${stats.correctCount}${(stats.errorCount)?` <span title="Ошибочно набранные знаки">(+${stats.errorCount})</span>`:''}</td>
 </tr>
 <tr><td colspan=4 align="center" style="padding-top: 4px;"><a href="#" onclick="showWTS()" style="text-decoration: none; border-bottom: 1px dashed">Посмотреть детальную статистику</a></td></tr>
</table>`


                    setTimeout(() => {
                        //finalize game
                        oO('#wts-rec').classList.remove('blink', 'pause');
                        oO('#wts-rec').title = '';

                        // failed in noerror mode
                        if ((__WTSInfo.type == 'noerror') && oO('*#players .you .noerror-fail').length) {
                            __isGameFailed = true;
                            return;
                        }

                        // failed in qualification
                        if (__isQual) {
                            const res = document.querySelector('#players .you .rating div');
                            if (res && res.innerText == 'Результат не зачтен') {
                                __isGameFailed = true;
                                return;
                            }
                        }

                        // add curWTS to archive
                        // (BTW, curWTS is still available, because it was declared in closure, just FYI)
                        if (curWTS.data.length) {
                            // add any other info, if needed:
                            curWTS.sysInfo = {
                                rawStart:__gameStartTime,
                                firstKey: __gameFirstKeyTime - __gameStartTime,
                                rawDuration: __gameEndTime - __gameStartTime,
                                keybLayout: KeybLayout.detect(__WTSKeyMap)
                            };

                            if (__isQual) {
                                curWTS.sysInfo.isQual = 1;
                                curWTS.sysInfo.qualTextLength = oO('#inputtext').value.length;
                            }

                            if (curWTS.sysInfo.rawDuration >= 6 * 60 * 1000) {
                                return; // do not store this WTS, because we are probably AFK
                            }

                            const gameStat = document.querySelector('#players .you .stats');

                            if (gameStat) {
                                curWTS.sysInfo.kgDur = gameStat.children[0].innerText;
                                curWTS.sysInfo.kgSpeed = parseFloat(gameStat.children[1].innerText.split(' ')[0]).toFixed(0);
                                curWTS.sysInfo.kgErrorCount = parseInt(gameStat.children[2].innerText.split(' ')[0]);
                            }

                            // one final save with all gathered information
                            localStorage.curWTS = JSON.stringify(curWTS);

                            if (!__isWTSAddedToArchive) {
                                let tmpArchive = JSON.parse(localStorage.WTS_ARCHIVE);
                                if (tmpArchive.length >= MAX_LAST_WTS_COUNT) {
                                    while (tmpArchive.length >= MAX_LAST_WTS_COUNT) {
                                        tmpArchive.shift();
                                    }
                                }

                                tmpArchive.push(curWTS);
                                localStorage.WTS_ARCHIVE = JSON.stringify(tmpArchive);
                                __archive = __LoadArchive();
                                __isWTSAddedToArchive = true;
                            }
                        }
                    }, 2000); // 2s should be enough to get game results
                } else {
                    oO('#wts-side-panel-stats').innerHTML = `<span>${WTS_PANEL_FAIL_MSG}</span>`;
                }
            }
        });
    }

// ---------------------------------------

    function createWTSfromData(data, time=Date.now(), uid=0, type='unknown') {
        let newWTS = {
            "ver": WTS_FORMAT_VERSION,
            time,
            uid,
            type
        };

        newWTS.data = data;
        return newWTS;
    }

    //auxiliary functions (partly made with AI)
    function annotateKeypresses(sequence) {
        const flat = sequence.map(obj => {
            const key = Object.keys(obj)[0];
            const delay = obj[key];

            //perform simple checks against possible XSS attacks
            if (key.length > 1 && /[<> ]/.test(key)) {
                throw new Error("WTS appears to be corrupted: unknown key");
            }

            if (typeof delay !== 'number') {
                throw new Error("WTS appears to be corrupted: delay is not a number");
            }

            return {
                key,
                delay,
                mark: null,
                deleted: false
            };
        });

        const history = [];

        for (let i = 0; i < flat.length; i++) {
            const entry = flat[i];
            const { key } = entry;

            if (key === 'Backspace' || key === 'Shift+Backspace') {
                // Удаляем последний не-deleted символ (исключая correction)
                for (let j = history.length - 1; j >= 0; j--) {
                    if (!history[j].deleted && history[j].mark !== 'correction') {
                        history[j].deleted = true;
                        break;
                    }
                }
                entry.mark = 'correction';
            } else if (key === 'Ctrl+Backspace' || key === 'Opt+Backspace') {
                let j = history.length - 1;
                const skip = h => h.deleted || h.mark === 'correction';

                // Юникод-«слово»: буквы (включая кириллицу), цифры, подчёркивание
                const isSpace = k => k === ' ';
                const isWord  = k => /[\p{L}\p{N}_]/u.test(k);
                const isPunct = k=> /[…,:;'"«»“”‘’!@#%&*(){}<>\.\-\/\\\?\[\]]/.test(k); // F.M.B (x3)

                // дойти до последнего актуального символа
                while (j >= 0 && skip(history[j])) j--;

                // 1) удалить хвостовые пробелы (если есть)
                while (j >= 0 && !skip(history[j]) && isSpace(history[j].key)) {
                    history[j].deleted = true;
                    j--;
                }

                // перескочить удалённые/коррекции, если попались
                while (j >= 0 && skip(history[j])) j--;

                // 2) если дальше пунктуация — снести весь её блок; иначе — слово
                if (j >= 0 && !skip(history[j])) {
                    if (isPunct(history[j].key)) {
                        // снести целиком подряд идущую пунктуацию (например, "..." или ",—")
                        while (j >= 0 && (isPunct(history[j].key) || skip(history[j].key))) {
                            history[j].deleted = true;
                            j--;
                        }
                    } else if (isWord(history[j].key)) {
                        // снести целиком слово (буквенно-цифровой блок)
                        while (j >= 0 && (isWord(history[j].key) || skip(history[j].key))) {
                            history[j].deleted = true;
                            j--;
                        }
                    } else {
                        // на всякий случай: одиночный символ непонятной категории
                        history[j].deleted = true;
                    }
                }

                entry.mark = 'correction';
            } else if (key.length === 1) {
                // Буква или пробел
                history.push(entry);
                // Метку поставим потом
            } else {
                // Остальные спецклавиши
                entry.mark = 'control';
            }
        }

        // Второй проход — корректные и ошибочные символы
        for (const entry of flat) {
            if (entry.mark) continue;
            entry.mark = entry.deleted ? 'error' : 'correct';
        }

        return flat;
    }

    function collectSpeedStats(annotatedData, range=null) {
        let correctCount = 0;
        let errorCount = 0;
        let totalTime = 0;
        let partialTime = 0;
        let correctTime = 0;
        let correctionSeries = 0;
        let isPrevCorrection = false;

        for (const { mark, delay } of annotatedData) {
            totalTime += delay;
            if (range) {
                if ((totalTime < (range.min-1)*1000) || (totalTime > (range.max * 1000))) continue;
            }
            partialTime += delay;

            if (mark === 'correct') {
                correctCount++;
                correctTime += delay;
            } else if (mark === 'error') {
                errorCount++;
            }

            // count correction series
            const isCorrection = (mark === 'correction') || (mark === 'error');
            if (!isPrevCorrection && isCorrection) {
                correctionSeries++;
            }
            isPrevCorrection = isCorrection;
        }

        const totalSeconds = partialTime / 1000;
        const totalMinutes = totalSeconds / 60;
        const correctMinutes = correctTime / 1000 / 60;

        const nettoCPM = totalMinutes > 0 ? +(correctCount / totalMinutes).toFixed(2) : 0;
        const bruttoCPM = correctMinutes > 0 ? +(correctCount / correctMinutes).toFixed(2) : 0;

        return {
            correctCount,
            errorCount,
            correctionSeries,
            totalTimeSec: +totalSeconds.toFixed(2),
            totalTimeStr: formatDecimal(formatTime(+totalSeconds.toFixed(2))),
            nettoCPM,
            bruttoCPM,
            isPartial: totalTime != partialTime
        };
    }

    function collectDelayStats(annotatedData, range=null) {
        const correct = annotatedData.filter(p => (p.mark === 'correct'));

        const idxStart = range?.idxStart || 0;
        const idxEnd = range?.idxEnd || correct.length - 1;

        const isPartial = (range)? (correct.length !== (idxEnd - idxStart + 1)) : false;
        let totalTime = 0;

        if (!isPartial) {
            //need to collect totalTime also
            for (const { delay } of annotatedData) {
                totalTime += delay;
            }
        }

        const delays = [];
        for (let i = idxStart; i <= idxEnd; i++ ) {
            const { delay } = correct[i];
            if (delay) {
                delays.push(delay);
            }
        }

        const correctTime = delays.reduce((a,v) => a+v, 0);
        const totalChars = idxEnd - idxStart + 1;
        const min = Math.min(...delays);
        const max = Math.max(...delays);
        const avg = correctTime / delays.length;

        const nettoCPM = (isPartial)? 0 : +(totalChars * 60000 / totalTime).toFixed(2);
        const bruttoCPM = +(totalChars * 60000 / correctTime).toFixed(2);

        const diffSpeedStr = (!isPartial && totalTime != correctTime)? formatDecimal((bruttoCPM - nettoCPM).toFixed(2)) : null;
        const diffTimeStr = (!isPartial && totalTime != correctTime)? formatDecimal(formatTime(+((totalTime - correctTime) / 1000).toFixed(3))) : null;

        return {
            min,
            max,
            avg,
            totalChars,
            bruttoCPM,
            correctTimeSec: +(correctTime / 1000).toFixed(3),
            correctTimeStr: formatDecimal(formatTime(+(correctTime / 1000).toFixed(3))),
            diffSpeedStr: diffSpeedStr,
            diffTimeStr: diffTimeStr,
            isPartial: isPartial
        };
    }

    function collectHistStats(annotatedData) {
        const correct = annotatedData.filter(p => (p.mark === 'correct'));
        const delays = [];

        for (const { delay } of correct) {
            if (delay) {
                delays.push(delay);
            }
        }

        return Stat.analyzeDelays(delays);
    }

    function buildText(annotatedData) {
        let textHTML = ''; // text for speedChart (WITH errors/corrections)
        let textHTMLClean = ''; // text for delayChart (WITHOUT errors/corrections)
        let text = ''; // restored original text
        let prevSec = -1;
        let totalTime = 0;
        let lastMark = '';

        let curCharIdx = 0;

        for (const { key, mark, delay } of annotatedData) {
            totalTime += delay;
            let curSec = Math.floor(totalTime / 1000);

            if (curSec != prevSec) {
                if (prevSec != -1) {
                    textHTML += '</span>';

                    //we should fill the gap with empty spans in order to be consistent with the chart's x-value
                    if (curSec - prevSec > 1) {
                        for (let i = prevSec + 1; i < curSec; i++) {
                            textHTML += `<span class='s s${i+1} idle'></span>`;
                        }
                    }
                }
                textHTML += `<span class='s s${curSec+1}'>`;
                prevSec = curSec;
            }

            if (mark === 'correct') {
                if (delay && (delay < FAST_DELAY_THRESHOLD)) {
                    textHTML += `<span class='fast' title='${delay} мс'>${key}</span>`;
                    textHTMLClean += `<span class='c c${curCharIdx++}'><span class='fast' title='${delay} мс'>${key}</span></span>`;
                } else {
                    textHTML += key;
                    textHTMLClean += `<span class='c c${curCharIdx++}' title='${delay} мс'>${key}</span>`;
                }
                text += key;
            } else if (mark === 'error') {
                textHTML += `<span class='err'>${key == ' ' ? HTML_VISIBLE_SPACE : key}</span>`;
            } else { // correction
                textHTML += `<span class='corr' title='${delay} мс'>${key.replace(/Backspace/, HTML_BACKSPACE)}</span>`;
            }

            lastMark = mark;
        }
        textHTML += '</span>';
        return {
            textHTML,
            textHTMLClean,
            text,
        };
    }

    function buildHistText(annotatedData, cutValue) {

        let textHTMLClean = ''; // text for histChart (WITHOUT errors/corrections)

        for (const { key, mark, delay } of annotatedData) {
            if (mark !== 'correct') continue;

            const gradIdx = (delay && delay <= cutValue)? Math.floor(delay / HISTOGRAM_BIN_SIZE) : Math.floor(HISTOGRAM_MAX_X / HISTOGRAM_BIN_SIZE);
            textHTMLClean += `<span class="grad${gradIdx}" title="${delay} мс">${key}</span>`;
        }

        return textHTMLClean;
    }

    // this will be needed later, for detecting duplicate data while loading \ pasting
    function makeHash(data) {
        let hash = 0;
        for (let i=0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash >>> 0;
    }

    // --- DRAGGABLE MODAL WINDOW FUNCTIONS --- //
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    async function loadUPlotIfNeeded(callback) {
        if (window.uPlot) return callback();

        // inject uPlot CSS
        if (!document.querySelector(`link[href="${UPLOT_CSS}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = UPLOT_CSS;
            document.head.appendChild(link);
        }

        // inject uPlot JS
        const script = document.createElement('script');
        script.src = UPLOT_JS;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function showMainWindow(contentHTML, afterRender) {
        let modal = oO(`#${MODAL_ID}`);
        if (modal) modal.remove(); // close previous instance, if any

        modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.tabIndex = -1; // this is for receiving keydown events

        // listen for onPaste event to display WTS directly from clipboard
        modal.addEventListener("paste", (e) => {
            e = e || window.event;
            let clipboardData, pastedData;

            // Stop data actually being pasted
            e.preventDefault();

            // Get pasted data via clipboard API
            clipboardData = e.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');

//            let hash = makeHash(pastedData);
            let fullWTS;
            try {
                    fullWTS = JSON.parse(pastedData);
            } catch(e) {
                    showToast(TOAST_INVALID_PASTE_DATA, 'err');
                    return;
            }

            // normally we expect full WTS from clipboard, but it is also possible to paste only keypresses data
            // in that case we just need to create empty WTS from given data:
            if (!fullWTS.data) {
                fullWTS = createWTSfromData(fullWTS);
            }

            __files.push(fullWTS);

            let sel;
            if (__appMode != AM_FILES) {
                setAppMode(AM_FILES);
                sel = oO('#wts-file-list');
            } else {
                let dummySelHTML = createWTSListElement('dummy', __files, null);
                dummySelHTML = dummySelHTML.replace(/<\/?select.*?>/g, ''); // ha-ha, genius, lol!
                sel = oO('#wts-file-list');
                sel.innerHTML = dummySelHTML;
            }

            sel.selectedIndex = __files.length - 1;
            sel.dispatchEvent(new Event('change')); // trigger onChange event to update view
            sel.focus();
        });

        // Ctrl+C useful handler for copying current WTS into clipboard
        modal.addEventListener("copy", (e) => {
            if (window.getSelection().toString().length) return; // do not copy WTS, if we have selected something on the page

            e = e || window.event;

            // Stop data actually being copied
            e.preventDefault();

            if (lastRenderedWTS) {
                navigator.clipboard.writeText(JSON.stringify(lastRenderedWTS));
                showToast(TOAST_CLIPBOARD_COPY_OK);
            } else {
                showToast(TOAST_CLIPBOARD_COPY_FAIL, 'err');
            };
        });

        // переключение графиков стрелками ← → и по alt+1..3
        modal.addEventListener("keydown", (e) => {
            if (!chartFrames || !chartFrames.length) return;

            // switch charts with alt+1..3 or with ← →
            if (e.altKey && ['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                const newFrameIndex = parseInt(e.key) - 1;
                if (newFrameIndex != currentFrameIndex) {
                    showFrame(newFrameIndex);
                }
            } else if ((e.key === "ArrowRight") && (currentFrameIndex < chartFrames.length - 1)) {
                showFrame(currentFrameIndex + 1);
            } else if ((e.key === "ArrowLeft") && (currentFrameIndex > 0)) {
                showFrame(currentFrameIndex - 1);
            }

            if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
                e.preventDefault();
            }
        });

        // обработка клавиши 'Del' и шорткатов меню
        modal.addEventListener("keydown", (e) => {
            if (e.key === 'Delete' && __appMode == AM_FILES && __files.length) {
                // process 'Del' button in files mode
                e.preventDefault();
                const sel = oO('#wts-file-list');
                let curIdx = sel.value;

                if (e.shiftKey) {
                    let type = __files[curIdx].type;
                    __files = __files.filter(wts => {
                        return (e.ctrlKey)?
                            (wts.type == type): // delete all, EXCEPT of same type as current
                            (wts.type != type); // delete all of same type
                    });
                    curIdx = 0;
                } else if (e.ctrlKey) {
                    // delete all, EXCEPT current
                    __files = [__files[curIdx]]; //lol!
                    curIdx = 0;
                } else {
                    // delete single
                    __files.splice(curIdx, 1);
                }

                if (__files.length) {
                    let dummySelHTML = createWTSListElement('dummy', __files, null);
                    dummySelHTML = dummySelHTML.replace(/<\/?select.*?>/g, '');
                    sel.innerHTML = dummySelHTML;
                    let newIdx = Math.min(curIdx, __files.length - 1);
                    sel.selectedIndex = newIdx;
                    sel.dispatchEvent(new Event('change')); // trigger onChange event to update view
                    sel.focus();
                } else {
                    __archive = __LoadArchive(); // just in case
                    setAppMode(AM_ARCHIVE);
                }
            } else if (e.ctrlKey || e.metaKey) {
                const shortCuts = Menu.ctrlShortCuts;
                if (Object.keys(shortCuts).includes(e.code)) {
                    e.preventDefault();
                    Menu[shortCuts[e.code]](e);
                }
            }
        });

        const header = document.createElement('div');
        header.className = 'wts-header';
        header.id = 'wts-header';

        let menuHTML = `
<div class="wts-menu-wrapper">
  <span class="wts-button">☰</span>
  <div class="wts-menu">
	<div class="wts-menu-header">Чего изволите?</div>
	<a href="#" data-action="openFile" title="${MENU_OPENFILE_HINT}">Открыть...</a>
	<hr>
	<a href="#" data-action="saveToFile" title="${MENU_SAVEFILE_HINT}">Сохранить файл</a>
	<a href="#" data-action="saveCollection" title="${MENU_SAVECOLLECTION_HINT}">Сохранить коллекцию</a>
    <hr>
	<a href="#" data-action="publishToBlog" title="${MENU_PUBLISHBLOG_HINT}">Опубликовать в БЖ</a>
    <hr>
	<a href="#" data-action="deleteArchive" title="${MENU_DELETEARCHIVE_HINT}">Удалить архив</a>
    <hr>
	<a href="https://klavogonki.ru/u/#/111001/journal/68a8aea56271aec5a58b4567" title="${MENU_HELP_HINT}">Памагити!!!</a>
  </div>
</div>
`;

        header.innerHTML = `
<span class="wts-header-title"></span>
<span class="wts-header-info"></span>
<span class="wts-emptyspace"></span>
<div id="wts-tab-switcher">
  <span class="wts-tab-button inactive" data-key='ArrowLeft' title='${TAB_PREV_BUTTON_HINT}'>${TAB_ARROW_LEFT}</span>
  <span class="wts-tab-button" data-key='ArrowRight' title='${TAB_NEXT_BUTTON_HINT}'>${TAB_ARROW_RIGHT}</span>
</div>
${menuHTML}
<span class="wts-close" title="${CLOSE_BUTTON_HINT}">&times;</span>
`;

        // set handler for tab swticher
        const ts = header.querySelector('#wts-tab-switcher');
        ts.addEventListener('click', (e) => {
            let key = '';
            if (key = e.target.getAttribute('data-key')) {
                modal.dispatchEvent(new KeyboardEvent('keydown', {key}));
            }
        });

        // set handlers for each menu item, based on data-action attribute
        let links = header.querySelectorAll('.wts-menu a');
        for (let link of links) {
            link.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = e.target.getAttribute('data-action');

                if (action) {
                    if (Menu[action]) {
                        Menu[action](e);
                    } else {
                        showToast('Not implemented yet', 'err');
                    }
                }

                //magic! © mr Bean
                e.target.parentElement.style.display = 'none';
                setTimeout(()=>{
                    e.target.parentElement.style.display = '';
                    oO(`#${MODAL_ID}`).focus();
                }, 500);

                if (!action) {
                    window.open(e.target.href, '_blank');
                }
            }
        }

        //TODO: remove in future! (or not)
        header.ondblclick = (e) => {
            if (e.target.id != 'wts-header' && !e.target.classList.contains('wts-header-title')) return;

            if (lastRenderedWTS) {
                navigator.clipboard.writeText(JSON.stringify(lastRenderedWTS));
                showToast(TOAST_CLIPBOARD_COPY_OK);
            } else {
                showToast(TOAST_CLIPBOARD_COPY_FAIL, 'err');
            };
        };

        const content = document.createElement('div');
        content.className = 'wts-content';
        content.innerHTML = contentHTML;

        const toast = document.createElement('div');
        toast.id = 'wts-toast';

        const overlay = document.createElement('div');
        overlay.id = 'wts-overlay';
        overlay.className = 'wts-overlay';
        overlay.style.display = 'none';
        overlay.innerHTML = `
<div class="wts-progress-box">
    <div class="wts-progress-text" id="wts-progress-text">
      Подготовка...
    </div>
    <div class="wts-progress-bar">
      <div class="wts-progress-fill" id="wts-progress-fill"></div>
    </div>
    <button id="wts-cancel" style="display:none;">Отменить</button>
</div>
`;
        const fileOpener = document.createElement('input');
        fileOpener.id = 'fileOpener';
        fileOpener.type = 'file';
        fileOpener.multiple = true;
        fileOpener.accept = '.wts,.wtsa,.tsf';

        fileOpener.addEventListener('change', async (e) => {
            let fileList = e.target.files;
            let newIdx = 0;

            if (!fileList.length) {
                hideOverlay();
                return;
            }

            const isAppending = e.target.getAttribute('data-append') === "true";
            if (!isAppending) {
                __files = [];
                newIdx = 0;
            } else {
                if (__files.length) newIdx = __files.length;
            }

            showOverlay();
            setIndeterminate();

            const filteredFileArray = Array.from(fileList).filter(f=>{
                const ext = f.name.split('.').pop();
                return ['wts', 'wtsa', 'tsf'].includes(ext);
            });

            let totalFiles = filteredFileArray.length;
            let processedFiles = 0;

            const processingPromises = filteredFileArray.map(async (file) => {
                const reader = new FileReader();
                const promise = new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsText(file);
                });

                const fileExt = file.name.split('.').pop().toLowerCase();
                const content = await promise;
                try {
                    let jsonData, tsfAllData, tsfData, tsfParams, wtsData;
                    switch (fileExt) {
                        case 'wts':
                        case 'wtsa':
                            jsonData = JSON.parse(content);
                            if (Array.isArray(jsonData)) {
                                __files.push(...jsonData);
                            } else {
                                __files.push(jsonData);
                            }
                            break;

                        case 'tsf':
                            tsfAllData = content.split('\n');
                            tsfData = tsfAllData.filter(item => item.match(/[0-9a-f]{8}\s[0-9a-f]{12}/i));
                            tsfParams = tsfAllData.filter(item => item.match(/^[0-9a-z]+\=/i));
                            wtsData = FileImport.TSFdata2WTSdata(tsfData);
                            for (const tmpData of wtsData) {
                                __files.push(createWTSfromData(tmpData));
                            }
                            break;
                    }
                    processedFiles++;
                } catch(e) {
                    console.log(`[WTS]: Error processing '${file.name}'`);
                }

                return { name: file.name, content };
            });

            await Promise.all(processingPromises);
            e.target.value = ''; //reset fileOpener
            hideOverlay();

            if (__files.length) {
                setAppMode(AM_FILES);
                const sel = oO('#wts-file-list');
                sel.selectedIndex = newIdx;
                sel.dispatchEvent(new Event('change')); // trigger onChange event to update view
                sel.focus();
            } else {
                setAppMode(AM_EMPTY);
                setWindowHeaderTitle('🙈 Что-то нажалось и всё исчезло!');
            }

            const plurals = (isAppending)?['файл добавлен', 'файла добавлено', 'файлов добавлено']:['файл загружен', 'файла загружено', 'файлов загружено'];

            if (processedFiles != totalFiles) {
                showToast(`${processedFiles} ${getPluralForm(processedFiles, plurals)}, ${totalFiles - processedFiles} ${getPluralForm(totalFiles-processedFiles, ['проскипан', 'проскипано', 'проскипано'])}`, 'warn');
            } else {
                showToast(`${processedFiles} ${getPluralForm(processedFiles, plurals)}`);
            }
        });

        fileOpener.addEventListener('cancel', () => {
            hideOverlay();
        });

        header.querySelector('.wts-close').onclick = () => modal.remove();

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(toast);
        modal.appendChild(overlay);
        modal.appendChild(fileOpener);

        document.body.appendChild(modal);
        modal.focus();

        // Restore window position
        const saved = localStorage.getItem(STORAGE_POS_KEY);
        let pos = saved ? JSON.parse(saved) : {
            left: 100,
            top: 50
        };
        setPosition(pos.left, pos.top);

        // Dragging
        let isDragging = false,
            offsetX = 0,
            offsetY = 0;

        header.addEventListener('click', (e) => {
            if (__appMode == AM_ARCHIVE || __appMode == AM_FILES) {
                const sel = e.currentTarget.getElementsByTagName('SELECT')[0];
                if (sel) {
                    sel.focus();
                }
            } else {
                header.parentElement.focus();
            }
        });

        header.addEventListener('mousedown', (e) => {
            if (e.target.id != 'wts-header' && !e.target.classList.contains('wts-header-title')) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const maxX = window.innerWidth - modal.offsetWidth;
            const maxY = window.innerHeight - modal.offsetHeight;
            const left = clamp(e.clientX - offsetX, 0, maxX);
            const top = clamp(e.clientY - offsetY, 0, maxY);
            setPosition(left, top);
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            localStorage.setItem(STORAGE_POS_KEY, JSON.stringify({
                left: modal.offsetLeft,
                top: modal.offsetTop
            }));
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        function setPosition(left, top) {
            modal.style.left = `${left}px`;
            modal.style.top = `${top}px`;
        }

        // Execute callback after window insertion and positioning
        if (typeof afterRender === 'function') {
            setTimeout(() => afterRender(), 50); // wait for DOM rerender
        }
    }

    function showToast(text, type='ok') {
        const toast = oO('#wts-toast');
        toast.removeAttribute('class'); //clear previous state
        toast.innerHTML = text;
        toast.classList.add(type);
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, TOAST_LIFETIME);
    }

    function setAppMode(mode) {
        switch (mode) {
            case AM_INGAME: {
                if (localStorage.curWTS) {
                    __appMode = AM_INGAME;
                    setWindowHeaderTitle(`🎹 Текущий ${(__isGameFinished && !__isGameFailed)?'заезд':'недоезд'}`);
                    setWindowHeaderInfo('');
                    setMainWindowContent(MWC_CHARTS);
                    renderWTSCharts(JSON.parse(localStorage.curWTS));
                } else {
                    setAppMode(AM_EMPTY);
                }
                break;
            }

            case AM_ARCHIVE: {
                if (__archive.length) {
                    __appMode = AM_ARCHIVE;
                    setWindowHeaderTitle(`📜 Архив: `);

                    const selWithProgressHTML = createWTSListWithProgressElement('archive', __archive, 'date');
                    setWindowHeaderInfo(selWithProgressHTML, true);

                    // set onchange event on newly created selector
                    const sel = oO('#wts-archive-list');
                    sel.onchange = (e) => {
                        updateListProgress(e.target);
                        renderWTSCharts(__archive[e.target.value]);
                    };

                    setMainWindowContent(MWC_CHARTS);
                    sel.dispatchEvent(new Event('change')); // trigger onChange event to update view
                    sel.focus();
                } else {
                    setAppMode(AM_EMPTY);
                }
                break;
            }

            case AM_FILES: {
                if (__files.length) {
                    __appMode = AM_FILES;
                    setWindowHeaderTitle(`📂 Загруженное: `);

                    const selWithProgressHTML = createWTSListWithProgressElement('file', __files, null);
                    setWindowHeaderInfo(selWithProgressHTML, true);

                    // set onchange event on newly created selector
                    const sel = oO('#wts-file-list');
                    sel.onchange = (e) => {
                        updateListProgress(e.target);
                        renderWTSCharts(__files[e.target.value]);
                    };

                    setMainWindowContent(MWC_CHARTS);
                    sel.dispatchEvent(new Event('change')); // trigger onChange event to update view
                    sel.focus();
                } else {
                    setAppMode(AM_EMPTY);
                }
                break;
            }

            case AM_EMPTY:
            default: {
                __appMode = AM_EMPTY;
                setWindowHeaderTitle('🙈 Здесь ничего нет!');
                setWindowHeaderInfo('');
                setMainWindowContent(MWC_EMPTY);
                break;
            }
        }
    }

    function setWindowHeaderTitle(title, forceHTML=false) {
        const el = oO('#wts-header').querySelector('.wts-header-title');
        if (forceHTML) {
            el.innerHTML = title;
        } else {
            el.textContent = title;
        }
    }

    function setWindowHeaderInfo(info, forceHTML=false) {
        const el = oO('#wts-header').querySelector('.wts-header-info');
        if (forceHTML) {
            el.innerHTML = info;
        } else {
            el.textContent = info;
        }
    }

    // --- Overlay functions ---
    const cancelBtn = oO("#wts-cancel");

    //  show overlay
    function showOverlay() {
        oO("#wts-overlay").style.display = "flex";
    }

    // hide overlay
    function hideOverlay() {
        oO("#wts-overlay").style.display = "none";
        const fillEl = oO("#wts-progress-fill");
        fillEl.classList.remove("indeterminate");
        fillEl.style.width = "0";
    }

    // indeterminate mode
    function setIndeterminate(message = "Обработка...") {
        oO("#wts-progress-text").textContent = message;
        const fillEl = oO("#wts-progress-fill");
        fillEl.classList.add("indeterminate");
        fillEl.style.width = "30%"; // фикс ширина, анимация делает остальное
    }

    // determinate mode
    function setProgress(current, total, message = "") {
        const percent = Math.round((current/total)*100);
        const fillEl = oO("#wts-progress-fill");
        oO("#wts-progress-text").textContent = message || `Файл ${current} из ${total} (${percent}%)`;
        fillEl.classList.remove("indeterminate");
        fillEl.style.width = percent + "%";
    }

    function getGameTypeStr(type) {
        let gameTypeStr;

        if (type.match(/voc-/)) {
            const vocID = type.replace('voc-', '').replace(/[^\d]+/, '');
            gameTypeStr = POPULAR_VOCS[vocID] || `Словарь #${vocID}`;
        } else {
            gameTypeStr = GAME_MODES[type] || GAME_MODES.unknown;
        }
        return gameTypeStr;
    }

    function getGameTypeMDStr(type) {
        let gameTypeMDStr;

        if (type.match(/voc-/)) {
            const vocID = type.replace('voc-', '').replace(/[^\d]+/, '');
            const vocTitle = (POPULAR_VOCS[vocID])? `**«${POPULAR_VOCS[vocID]}»**` : `#${vocID}`;
            gameTypeMDStr = `Заезд по словарю [${vocTitle}](/vocs/${vocID})`;
        } else {
            gameTypeMDStr = `Заезд в режиме **«${GAME_MODES[type] || GAME_MODES.unknown}»**`;
        }
        return gameTypeMDStr;
    }

    function formatDecimal(f) {
        const parts = f.toString().split('.');
        return (parts.length == 2) ? `${parts[0]}<span>.${parts[1]}</span>` : f;
    }

    function formatTime(seconds, fractionDigits = 2, forceShowMinutes = false, forceShowFraction = true) {
        const scale = 10 ** fractionDigits;
        const total = Math.round(seconds * scale);
        const secs = Math.floor(total / scale);
        const minutes = Math.floor(secs / 60);

        const mm = String(minutes).padStart(1, "0");
        const ss = String(secs % 60).padStart(2, "0");
        const frac = String(total % scale).padStart(fractionDigits, "0");

        const timeCore = (minutes > 0 || forceShowMinutes) ?
              `${mm}:${ss}` : String(secs % 60);

        return (fractionDigits > 0 && ( +frac !== 0 || forceShowFraction)) ?
            `${timeCore}.${frac}` : timeCore;
    }

    function getPluralForm(cnt, titles)
    {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[ (cnt%100 > 4 && cnt%100 < 20)? 2: cases[Math.min(cnt%10, 5)] ];
    }

    // menu actions & shortcuts
    const Menu = {
        ctrlShortCuts: {
            'KeyO':'openFile',
            'KeyS':'saveFile',
            'KeyB':'publishToBlog',
            'Delete':'deleteArchive',
        },

        openFile: function(e) {
            oO('#fileOpener').setAttribute('data-append', e.shiftKey); //sets true, if shift was pressed while clicking menu tiem, or false otherwise;
            oO('#fileOpener').click(e);
        },

        // master function for saving, kinda virtual
        saveFile: function(e) {
            if (e.shiftKey) {
                this.saveCollection();
            } else {
                this.saveToFile();
            }
        },

        // save single WTS to file (Ctrl+S)
        saveToFile: function() {
            if (!lastRenderedWTS) {
                showToast(TOAST_NOTHING_TO_SAVE, 'err');
                return;
            }

            const stats = collectSpeedStats(annotatedData); // if we have lastRenderedWTS, then we should have annotatedData
            let data = JSON.stringify(lastRenderedWTS);
            let fileName = `${getGameTypeStr(lastRenderedWTS.type)} (${stats.nettoCPM.toFixed(0)}-${stats.correctionSeries}).wts`;
            this._saveFile(data, fileName);
        },

        // save archive \ temporarily loaded files (Ctrl+Shift+S)
        saveCollection: function() {
            let data = null;
            if (__appMode == AM_FILES && __files.length) {
                data = JSON.stringify(__files);
            } else if (__archive.length) {
                data = localStorage.WTS_ARCHIVE;
            } else {
                showToast(TOAST_NOTHING_TO_SAVE, 'err');
                return;
            }

            const d = new Date();
            const date = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}`;
            const time = `${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}`;
            const fileName = (__appMode == AM_FILES)? `wts-collection-${date}.wtsa` : `wts-archive-${date}.wtsa`;
            this._saveFile(data, fileName);
        },

        // publish currently rendered WTS to blog (Ctrl+B → hidden post, Ctrl+Shift+B → public post)
        publishToBlog: function (e) {
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }

            if (typeof __user__ === 'undefined') {
                showToast(TOAST_USER_NOT_LOGGED_IN, 'err');
                return;
            }

            if (!lastRenderedWTS) {
                showToast(TOAST_NOTHING_TO_PUBLISH, 'err');
                return;
            }

            const isHidden = !e.shiftKey;
            const isJSON = e.altKey;

            showOverlay();
            if (isJSON) {
                setIndeterminate((isHidden)?'Прячем JSON в БЖ...':'Публикуем JSON в БЖ...');
            } else {
                setIndeterminate((isHidden)?'Прячем в БЖ...':'Публикуем в БЖ...');
            }

            let textContent = `> ${getGameTypeMDStr(lastRenderedWTS.type)}\n\n`;

            if (isJSON) {
                textContent += '```\n' + JSON.stringify(lastRenderedWTS) + '\n```';
            } else {
                const stats = collectSpeedStats(annotatedData);
                const timeStr = formatTime(stats.totalTimeSec, 1, true, false); //force show minutes, but do not show fraction when fraction == 0
                const texts = buildText(annotatedData);

                // IDK why header is not centered, maybe glitch in CSS?
                // that's why we skipped header and make it with regular cells
                textContent += `| | | | | |\n`;
                textContent += "| :---: | :---: | :---: | :---: | :---: |\n";
                textContent += `| **${stats.nettoCPM.toFixed(0)}** | **${stats.correctionSeries}** | ${stats.bruttoCPM.toFixed(0)} | ${timeStr} | ${stats.correctCount} ${(stats.errorCount)?`(+${stats.errorCount}‎)`:''} |\n`;
                textContent += "| `скорость` | `ошибки` | `брутто` | `время` | `знаки` |\n\n";
                //TODO: reset speedChart scale?
                const pic1 = oO('wts-chart0').querySelector('canvas').toDataURL('image/webp');
                textContent += `![](${pic1})\n\n`;
                let textHTML = texts.textHTML;

                let mdText = textHTML
                .replaceAll(HTML_VISIBLE_SPACE, MD_VISIBLE_SPACE)
                .replaceAll(/<span class='err'>(.+?)<\/span>/g, "~~$1~~")
                .replaceAll(/<span class='corr'.+?>.+?<\/span>/g, '')
                .replaceAll(/<span class='fast'.+?>(.+?)<\/span>/g, '$1')
                .replaceAll(/<span class='s.+?'>(.*?)<\/span>/g, '$1')
                .replaceAll('~~~~', '')

                textContent += `> ${mdText}`;
            }

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/profile/add-journal-post");
            xhr.setRequestHeader("X-XSRF-TOKEN", getCookie('XSRF-TOKEN'));
            xhr.onload = () => {
                if (this.status !== 200) {
                    showToast(TOAST_SOMETHING_WENT_WRONG, 'err');
                }

                hideOverlay();
                showToast(isHidden? TOAST_BLOG_HIDDEN_POST_ADDED : TOAST_BLOG_POST_ADDED);
            };

            xhr.send(JSON.stringify({
                userId: __user__,
                text: textContent,
                hidden: isHidden,
            }));
        },

        deleteArchive: function() {
            if (!__archive.length) {
                showToast(TOAST_NOTHING_TO_DELETE, 'err');
                return;
            }

            if (confirm(`${CONFIRM_DELETEARCHIVE}`)) {
                localStorage.removeItem('WTS_ARCHIVE');
                __InitArchive();
                __archive = __LoadArchive();
                if (__appMode == AM_ARCHIVE) {
                    setAppMode(AM_EMPTY);
                }
                showToast(TOAST_ARCHIVE_DELETED);
            }
        },

        // common function for saving files
        _saveFile: function(data, fileName) {
            const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            const blobURL = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobURL;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            //cleanup
            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(blobURL);
            }, 1000);
        }
    }

    const KeybLayout = {

        layouts: {
            // === Карты раскладок ===

            // EN
            qwerty: {
                descr: 'QWERTY',
                KeyQ:"q", KeyW:"w", KeyE:"e", KeyR:"r", KeyT:"t", KeyY:"y", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p",
                KeyA:"a", KeyS:"s", KeyD:"d", KeyF:"f", KeyG:"g", KeyH:"h", KeyJ:"j", KeyK:"k", KeyL:"l",
                KeyZ:"z", KeyX:"x", KeyC:"c", KeyV:"v", KeyB:"b", KeyN:"n", KeyM:"m"
            },

            qwertz: {
                descr: 'QWERTZ',
                KeyQ:"q", KeyW:"w", KeyE:"e", KeyR:"r", KeyT:"t", KeyY:"z", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p",
                KeyA:"a", KeyS:"s", KeyD:"d", KeyF:"f", KeyG:"g", KeyH:"h", KeyJ:"j", KeyK:"k", KeyL:"l",
                KeyZ:"y", KeyX:"x", KeyC:"c", KeyV:"v", KeyB:"b", KeyN:"n", KeyM:"m"
            },

            azerty: {
                descr: 'AZERTY',
                KeyA:"q", KeyZ:"w", KeyE:"e", KeyR:"r", KeyT:"t", KeyY:"y", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p",
                KeyQ:"a", KeyS:"s", KeyD:"d", KeyF:"f", KeyG:"g", KeyH:"h", KeyJ:"j", KeyK:"k", KeyL:"l", KeyM:"m",
                KeyW:"z", KeyX:"x", KeyC:"c", KeyV:"v", KeyB:"b", KeyN:"n"
            },

            dvorak: {
                descr: 'Dvorak',
                KeyQ:"'", KeyW:",", KeyE:".", KeyR:"p", KeyT:"y", KeyY:"f", KeyU:"g", KeyI:"c", KeyO:"r", KeyP:"l",
                KeyA:"a", KeyS:"o", KeyD:"e", KeyF:"u", KeyG:"i", KeyH:"d", KeyJ:"h", KeyK:"t", KeyL:"n",
                KeyZ:";", KeyX:"q", KeyC:"j", KeyV:"k", KeyB:"x", KeyN:"b", KeyM:"m"
            },

            colemak: {
                descr: 'Colemak',
                KeyQ:"q", KeyW:"w", KeyE:"f", KeyR:"p", KeyT:"g", KeyY:"j", KeyU:"l", KeyI:"u", KeyO:"y", KeyP:";",
                KeyA:"a", KeyS:"r", KeyD:"s", KeyF:"t", KeyG:"d", KeyH:"h", KeyJ:"n", KeyK:"e", KeyL:"i",
                KeyZ:"z", KeyX:"x", KeyC:"c", KeyV:"v", KeyB:"b", KeyN:"k", KeyM:"m"
            },

            // RU
            ru_jcuken: {
                descr: 'ЙЦУКЕН',
                KeyQ:"й", KeyW:"ц", KeyE:"у", KeyR:"к", KeyT:"е", KeyY:"н", KeyU:"г", KeyI:"ш", KeyO:"щ", KeyP:"з",
                KeyA:"ф", KeyS:"ы", KeyD:"в", KeyF:"а", KeyG:"п", KeyH:"р", KeyJ:"о", KeyK:"л", KeyL:"д",
                KeyZ:"я", KeyX:"ч", KeyC:"с", KeyV:"м", KeyB:"и", KeyN:"т", KeyM:"ь"
            },

            ru_diktor: {
                descr: 'Диктор',
                KeyQ:"я", KeyW:"ч", KeyE:"о", KeyR:"л", KeyT:"д", KeyY:"у", KeyU:"т", KeyI:"ь", KeyO:"б", KeyP:"ю",
                KeyA:"а", KeyS:"и", KeyD:"е", KeyF:"н", KeyG:"к", KeyH:"р", KeyJ:"с", KeyK:"в", KeyL:"м",
                KeyZ:"ж", KeyX:"з", KeyC:"й", KeyV:"ф", KeyB:"г", KeyN:"ш", KeyM:"ц"
            },

            ru_phonetic: {
                descr: 'Русская фонетическая',
                KeyQ:"я", KeyW:"ш", KeyE:"е", KeyR:"р", KeyT:"т", KeyY:"ы", KeyU:"у", KeyI:"и", KeyO:"о", KeyP:"п",
                KeyA:"а", KeyS:"с", KeyD:"д", KeyF:"ф", KeyG:"г", KeyH:"ч", KeyJ:"й", KeyK:"к", KeyL:"л",
                KeyZ:"з", KeyX:"ь", KeyC:"ц", KeyV:"ж", KeyB:"б", KeyN:"н", KeyM:"м"
            },
        },

        getLayouts: function() {
            return this.layouts;
        },

        parseLayoutStr: function(s) {
            let result = '';
            const parts=s.split(':');
            try {
                const name = this.getLayoutDescr(parts[0]);
                const score = parseFloat(parts[1]);

                if (isNaN(score) || score<0 || score>1) return false;

                if (score == 1) {
                    result = name;
                } else {
                    result = `Не определена. Возможно ${name}, но это не точно (${(score*100).toFixed(0)}%)`;
                }
            } catch(e) {
                result = 'Ошибка в данных';
            }

            return result;
        },

        getLayoutDescr: function(name) {
            const layouts = this.getLayouts();
            return layouts[name]?.descr || 'Неизвестна';
        },

        // === Функция детекции ===
        detect: function (samples) {
            const samplesArray = Object.entries(samples);
            if (samplesArray.length < MIN_LAYOUT_DETECTION_SAMPLES) return 'not enough data';

            const results = [];
            const layoutsArray = Object.entries(this.getLayouts());

            for (let [name, map] of layoutsArray) {
                let total = 0, match = 0;

                for (let [code, key] of samplesArray) {
                    if (map[code]) {
                        total++;
                        if (map[code].toLowerCase() === key.toLowerCase()) {
                            match++;
                        }
                    }
                }

                if (total > 0) {
                    results.push({
                        name,
                        score: +(match / total).toFixed(2)
                    });
                }
            }

            const sorted = results.sort((a, b) => b.score - a.score);
            return (sorted.length)? `${sorted[0].name}:${sorted[0].score}`:false;
        }
    }

    function setMainWindowContent(contentType=MWC_EMPTY) {
        let contentHTML = '';

        switch (contentType) {
            case MWC_EMPTY:
                contentHTML = `
<div style="height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: anchor-center;">
<h4>Сорри, а показывать-то и нечего!</h4>
<p><i><b>«Нельзя впихнуть невпихуемое и визуализнуть невизуализуемое»</b> © Ун Фо Гив</i></p>
<p>Для того, чтобы отобразить что-нибудь ненужное, надо сначала получить что-нибудь ненужное, а у нас данных нет. Данные можно получить либо проехав заезд, либо открыв файл из менюшки (☰), либо воткнув JSON-чик через Ctrl+V :)</p>
</div>
`;
                break;

            case MWC_CHARTS:
                contentHTML = `
<div id="wts-frames">
  <div class="wts-frame active">
	<div id="wts-stats0" class="wts-stats"></div>
	<div id="wts-chart0" class="wts-chart"></div>
	<div id="wts-text-controls"><div><input type="checkbox" id="hide-fast"><label for="hide-fast" title="помечать нажатия с паузой < ${FAST_DELAY_THRESHOLD} мс">быстрые нажатия</label><input type="checkbox" id="hide-err"><label for="hide-err" title="показывать ошибочно набранные символы">опечатки</label><input type="checkbox" id="hide-corr"><label for="hide-corr" title="показывать нажатия служебных клавиш">доп. клавиши</label></div></div>
	<div id="wts-text0" class='wts-text'></div>
  </div>
  <div class="wts-frame">
	<div id="wts-stats1" class="wts-stats"></div>
	<div id="wts-chart1" class="wts-chart"></div>
	<div id="wts-text1" class='wts-text'></div>
  </div>
  <div class="wts-frame">
	<div id="wts-stats2" class="wts-stats"></div>
	<div id="wts-chart2" class="wts-chart"></div>
	<div id="wts-text2" class='wts-text'></div>
  </div>
</div>
<div class="wts-overlay" id="wts-overlay" style="display:none;">
  <div class="wts-progress-box">
    <div class="wts-progress-text" id="wts-progress-text">
      Подготовка...
    </div>
    <div class="wts-progress-bar">
      <div class="wts-progress-fill" id="wts-progress-fill"></div>
    </div>
    <button id="wts-cancel" style="display:none;">Отменить</button>
  </div>
</div>
`;
                currentFrameIndex = 0;
                break;
        }

        //set content
        oO(`${MODAL_ID}`).querySelector('.wts-content').innerHTML = contentHTML;

        //add event listeners
        switch (contentType) {
            case MWC_CHARTS:
                oO('#wts-text-controls').addEventListener("change", e=> {
                    oO('#wts-text0').classList.toggle(e.target.id, !e.target.checked);

                    let allCBs = oO('#wts-text-controls').getElementsByTagName('input');
                    let tcOptions = {};
                    for (let cb of allCBs) {
                        const {id, checked} = cb;
                        tcOptions[id] = checked;
                    }
                    // save options
                    localStorage.setItem(STORAGE_TEXT_CONTROL_OPTIONS_KEY, JSON.stringify(tcOptions));

                    if (e.target.id == 'hide-err') {
                        //redraw chart
                        Charts[0].series[3].show = e.target.checked;
                        Charts[0].redraw(false);
                    }

                    // return focus to our window for correct processing ← →
                    oO(`${MODAL_ID}`).focus();
                });
                break;
        }
    }

    function postInitMainWindow() {
        let mode = AM_EMPTY; // default
        __archive = __LoadArchive();

        // set appMode
        if (__isInGame && localStorage.curWTS) {
            mode = AM_INGAME;
        } else {
            if (__archive.length) {
                mode = AM_ARCHIVE;
            } else {
                mode = AM_EMPTY;
            }
        }
        setAppMode(mode);
    }

    function createWTSListElement(id, source, delimiter='date') {
        let selectHTML = `<select id='wts-${id}-list'>`;

        let i = 0;
        const dateOpts = {month: 'long', day: 'numeric'};
        let prevDate = new Date().toLocaleDateString('ru-RU', dateOpts);
        for (let wts of source) {
            const datetime = new Date(wts.time)
            const date = datetime.toLocaleDateString('ru-RU', dateOpts);;
            const time = datetime.toLocaleTimeString().substr(0, 5);
            if (delimiter) {
                switch (delimiter) {
                    case 'date':
                        if (date != prevDate) {
                            selectHTML += `<option disabled>-- ${date} --</option>`;
                            prevDate = date;
                        }
                        break;

                    case 'file':
                        //TODO: implement later (or not)
                        break;
                }
            }

            let tmpAnnotated = annotateKeypresses(wts.data);
            let stats = collectSpeedStats(tmpAnnotated);

            const isQual = wts.sysInfo?.isQual || false;
            // sanitize wts.type for preventing possible XSS
            let classNamePostfix = wts.type.split('-')[0];
            if (classNamePostfix != 'voc' && !GAME_MODES[classNamePostfix]) classNamePostfix = 'normal';
            selectHTML += `<option class='gametype-${classNamePostfix}' value='${i++}' title='${time}\n${date}'>${i}. ${getGameTypeStr(wts.type)}${isQual?'*':''} ${stats.nettoCPM.toFixed(0)}/${stats.correctionSeries}</option>`;
        }
        selectHTML += '</select>';
        return selectHTML;
    }

    function createWTSListWithProgressElement(id, source, delimiter='date') {
        const selectorHTML = createWTSListElement(id, source, delimiter);
        return `
<div style="margin-left: 4px; display: flex; flex-direction: column;">
  ${selectorHTML}
  <div id="wts-list-progress"></div>
</div>
`;
    }

    function updateListProgress(list) {
        const count = (list.options)? list.options[list.options.length-1].value : 0; //not ACTUAL count, but last index of zero-based array of elements
        if (count >= MIN_LIST_ELEMENTS_TO_SHOW_PROGRESS - 1) {
            const progress = (count)? (list.value/count * 100).toFixed(1) : 0;
            oO('#wts-list-progress').style.width = `${progress}%`;
        }
    }

    // --- uPlot FUNCTIONS --- //

    let lastRenderedWTS = null;
    let annotatedData = null;
    let Charts = [];
    let TextSpans = [];
    let currentFrameIndex = 0;
    let chartFrames;

    function showFrame(index) {
        chartFrames.forEach((cf, i) => {
            cf.classList.toggle("active", i === index);
        });
        currentFrameIndex = index;
        updateTabSwitcher();
    }

    function updateTabSwitcher() {
        const ts = oO('#wts-tab-switcher');
        ts.children[0].classList.toggle('inactive', currentFrameIndex == 0);
        ts.children[1].classList.toggle('inactive', currentFrameIndex == chartFrames.length-1);
    }

    function setTextTrackers0(u) {
        let i=1;
        for (let el of TextSpans[0]) {
            const left = u.valToPos(i, 'x');
            const top = u.valToPos(u.data[1][i-1], 'y');
            el.onmouseover = () => { u.setCursor({left: left, top: top})}
            el.onmouseout = () =>{u.setCursor({left: -10, top: -10})}
            i++;
        }
    }

    function setTextTrackers1(u) {
        let i=0;
        for (let el of TextSpans[1]) {
            const left = u.valToPos(i, 'x');
            const top = u.valToPos(u.data[1][i], 'y');
            if (i) {
                el.onmouseover = () => { u.setCursor({left: left, top: top})}
                el.onmouseout = () =>{u.setCursor({left: -10, top: -10})}
            }
            i++;
        }
    }

    function renderSpeedStats(stats) {
        const isPartial = stats.isPartial;
        const timeScaleStr = +(stats.totalTimeSec.toFixed(2))<60?'сек':'мин';

        const el = oO('#wts-stats0');
        el.classList.toggle('partial', isPartial);
        el.nextElementSibling.classList.toggle('partial', isPartial);

        el.innerHTML = `
<div title='${NETTO_HINT}'><span>${formatDecimal(stats.nettoCPM)}</span>скорость, зн/мин</div>
<div title='${ERROR_COUNT_HINT}'><span>${stats.correctionSeries}</span>ошибки</div>
<div title='${BRUTTO_HINT}'><span>${formatDecimal(stats.bruttoCPM)}</span>брутто, зн/мин</div>
<div title='${TYPE_TIME_HINT}'><span>${stats.totalTimeStr}</span>время, ${timeScaleStr}</div>
<div><div><span title='${CORRECT_TYPED_CHARS_HINT}'>${stats.correctCount}${(stats.errorCount)?`<span title='${INCORRECT_TYPED_CHARS_HINT}'> (+${stats.errorCount})</span>`:''}</span></div>знаки</div>
`;
    }

    function renderDelayStats(stats) {
        const isPartial = stats.isPartial;
        const isSameSpeed = !stats.diffSpeedStr;
        const timeScaleStr = +(stats.correctTimeSec.toFixed(2))<60?'сек':'мин';

        const el = oO('#wts-stats1');
        el.classList.toggle('partial', isPartial);
        el.nextElementSibling.classList.toggle('partial', isPartial);

        el.innerHTML = `
<div title="${(isSameSpeed)?NETTO_HINT:BRUTTO_HINT}"><div><span>${formatDecimal(stats.bruttoCPM)}</span>${(stats.diffSpeedStr)?` <span title="Потери скорости из-за опечаток и их исправлений">(-${stats.diffSpeedStr})</span>`:''}</div>${(!isPartial && isSameSpeed)?'скорость':'брутто'}, зн/мин</div>
<div><div><span title="Минимальная пауза между нажатиями">${stats.min.toFixed(0)}</span> / <span title="Средняя пауза между нажатиями">${stats.avg.toFixed(0)}</span> / <span title="Максимальная пауза между нажатиями">${stats.max.toFixed(0)}</span></div>паузы (мин / ср / макс), мс</div>
<div><div><span title="Время набора только правильного текста">${stats.correctTimeStr}</span>${(stats.diffTimeStr)?` <span title="Время, затраченное на опечатки и их исправления">(+${stats.diffTimeStr})</span>`:''}</div>время, ${timeScaleStr}</div>
<div><span title="Количество правильно набранных знаков">${stats.totalChars}</span>знаки</div>
`;
    }

    function renderHistStats(stats, eId) {
        const params = [
            ['mean',   0, 'среднее', null],
            ['median', 0, 'медиана', null],
            ['sd',     0, 'СО', null],
            ['cv',     0, 'КВ', '%'],
            ['iqr',    0, 'IQR', null],
            ['min',    0, 'минимум', null],
            ['max',    0, 'максимум', null],
        ];
        let contentHTML = '';

        if (stats) {
            for (let p of params) {
                const val = (p[3]=='%')?`${(stats[p[0]].val*100).toFixed(p[1])}` : stats[p[0]].val.toFixed(p[1]);
                const descr = stats[p[0]].descr || '';
                const hint = stats[p[0]].hint || '';
                const name = p[2]? p[2] : p[0];
                contentHTML += `<div title="${descr}"><span title="${hint}">${val}${((p[3])?p[3]:'')}</span>${name}</div>`;
            }
        } else {
            contentHTML = '<div><span>Недостаточно данных для отображения статистической информации.</span>Если вы считаете, что это ошибка − обратитесь к разработчику.</div>';
        }

        oO('#wts-stats2').innerHTML = contentHTML;
    }

// --- MAIN CHARTS RENDER FUNCTION ---

    function renderWTSCharts(fullWTS) {
        lastRenderedWTS = null;

        chartFrames = document.querySelectorAll(".wts-frame");

        // destroy previous charts, if any
        if (Charts.length) {
            for (let chart of Charts) {
                chart.destroy();
            }
            Charts = [];
        }

        const rawData = fullWTS.data;
        annotatedData = annotateKeypresses(rawData);

        // fill #wts-statsX elements:
        renderSpeedStats(collectSpeedStats(annotatedData));
        renderDelayStats(collectDelayStats(annotatedData));
        renderHistStats(collectHistStats(annotatedData));

        const texts = buildText(annotatedData);
        const histCD = getHistChartData(annotatedData);
        const histText = buildHistText(annotatedData, histCD.cutValue);

        // fill #wts-textX elements:
        oO('#wts-text0').innerHTML = `<div>${texts.textHTML}</div>`;
        TextSpans[0] = oO('*#wts-text0 span.s');

        oO('#wts-text1').innerHTML = `<div>${texts.textHTMLClean}</div>`;
        TextSpans[1] = oO('*#wts-text1 span.c');

        oO('#wts-text2').innerHTML = `<div>${histText}</div>`;
//        TextSpans[2] = oO('*#wts-text2 span'); // not used

        // set text control checkboxes:
        const tcOptions = JSON.parse(localStorage.getItem(STORAGE_TEXT_CONTROL_OPTIONS_KEY)) || DEFAULT_TEXT_CONTROL_OPTIONS;
        for (const opt in tcOptions) {
            oO('#wts-text0').classList.toggle(opt, !tcOptions[opt]);
            oO(`#${opt}`).checked = tcOptions[opt];
            oO(`#${opt}`).disabled = !oO('#wts-text0').querySelectorAll(opt.replace('hide-', '.')).length;
        }

        const opts0 = getSpeedChartOpts();
        const data0 = getSpeedChartData(annotatedData);

        //TODO: remake this later
        if (SPEEDCHART_Y_SCALE == 'dynamic' || Math.max(...data0[2]) > 1100) {
            //switch to dynamic mode
            delete opts0.axes[1].splits;
            delete opts0.axes[1].values;
            delete opts0.axes[2].splits;
            delete opts0.axes[2].values;
            opts0.axes[1].incrs=opts0.axes[2].incrs=[10, 20, 30, 40, 50, 100, 150, 200];
            opts0.axes[1].space=opts0.axes[2].space=20;
            opts0.scales.y.range = [Math.min(...data0[2])*0.95, Math.max(...data0[2])*1.05];
            opts0.scales.y.auto=true;
            opts0.series[1].show = false;
        }
        Charts.push( new uPlot(opts0, data0, oO('#wts-chart0')) );

        const opts1 = getDelaysChartOpts();
        const data1 = getDelaysChartData(annotatedData);
        Charts.push( new uPlot(opts1, data1, oO('#wts-chart1')) );

        const opts2 = getHistChartOpts();
        const data2 = histCD.data;
        Charts.push( new uPlot(opts2, data2, oO('#wts-chart2')) );

        lastRenderedWTS = fullWTS;
    }

// --- SPEED CHART ---

    function getSpeedChartOpts() {
        const css = getComputedStyle(document.documentElement);
        const baseColor = css.getPropertyValue('--base-color');
        const errorColor = css.getPropertyValue('--error-color');

        return {
            width: CHART_WIDTH,
            height: CHART_HEIGHT,
            legend: {
                show: false,
            },
            scales: {
                x: {
                    time: false,
                    range: (u, newMin, newMax) => {
                        let curMin = u.scales.x.min;
                        let curMax = u.scales.x.max;

                        if (newMax - newMin < 1) {
                            return [curMin, curMax];
                        }
                        return [newMin, newMax];
                    }
                },
                y: {
//                    range: (self, min, max) => __isStaticYScale? [0, 1100] : [min*0.95, max*1.05],
                    range: [0, 1100],
                    font: '14px, Tahoma',
                },
            },
            series: [{
                    //label: "Время, с",
                },
                {
                    //label: "Мгновенная скорость, зн/мин",
                    show: true,
                    stroke: '#cccccc',
                    fill: '#eeeeee',
                    width: 1,
                    paths: uPlot.paths.spline(),
                },
                {
                    //label: "Скорость, зн/мин",
                    stroke: baseColor,
                    width: 3,
                },
                {
//                    stroke: `${errorColor}`,
                    show: oO('#hide-err').checked, //checkbox should be already set!
                    width: 3,
                    points: {
                        show: true,
                        size: 10,
                        fill: `${errorColor}`,
                    },
                },
            ],
            axes: [{
                    font: '12px Tahoma',
                    stroke: '#888888',
                    values: (u, ticks) => ticks.map(v => `${formatTime(v, 0, true)}`),
                    incrs: [1,2,3,4,5,10,20,30,60,120,240],
                    grid: {
                        stroke: '#88888866',
                        width: 1,
                    },
                    ticks: {
                        stroke: '#88888866',
                        width: 1,
                    },
                },
                {
                    side: 1,
                    scale: 'y',
                    font: '14px Tahoma',
                    stroke: '#330000',
                    grid: {
                        stroke: '#33000066',
                        width: 1,
                    },
                    ticks: {
                        stroke: '#33000066',
                        width: 1,
                    },
                    values: (u, ticks) => ticks.map(v => `${((v/100)%2==1)?v:''}`), //disable default formatting
                    splits: () => [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
                },
                {
                    side: 3,
                    scale: 'y',
                    font: '14px Tahoma',
                    stroke: '#330000',
                    values: (u, ticks) => ticks.map(v => `${((v/100)%2==1)?v:''}`), //disable default formatting
                    splits: () => [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
                    grid: {
                        show: false,
                    },
                    ticks: {
                        stroke: '#33000066',
                        width: 1,
                    },
                },
            ],
            hooks: {
                init: [
                    u => {
						let axisEls = u.root.querySelectorAll('.u-axis');
                        // set x axis event listener
                        let el = axisEls[0];
                        el.addEventListener('mousedown', e => {
                            let x0 = e.clientX;
                            let scaleKey = u.axes[0].scale;
                            let scale = u.scales[scaleKey];
                            let { min, max } = scale;
                            let diff = max - min;
                            let unitsPerPx = diff / (u.bbox.width / uPlot.pxRatio);

                            let mousemove = e => {
                                let dx = e.clientX - x0;
                                let shiftxBy = dx * unitsPerPx;

                                let newMin = min - shiftxBy;
                                let newMax = max - shiftxBy;
                                if (newMin < 1) {
                                    newMin = 1; newMax = newMin + diff;
                                } else if (newMax > u.data[0].length) {
                                    newMax = u.data[0].length;
                                    newMin = newMax - diff;
                                }

                                u.setScale(scaleKey, {
                                    min: newMin,
                                    max: newMax
                                });
                            };

                            let mouseup = e => {
                                document.removeEventListener('mousemove', mousemove);
                                document.removeEventListener('mousemove', mouseup);
                            };

                            document.addEventListener('mousemove', mousemove);
                            document.addEventListener('mouseup', mouseup);
                        });
                    },
                ],

                ready: [
                    (u) => {
                        setTextTrackers0(u);

                        const ttInfo = oO('#wts-chart-tooltip') || document.createElement("div");
                        ttInfo.id = 'wts-chart-tooltip';
                        ttInfo.className = 'wts-chart-tooltip';
                        ttInfo.style.display = "none";
                        document.body.appendChild(ttInfo);
/*
                        const ttMagGlass = oO('#wts-chart-mag-glass') || document.createElement("div");
                        ttMagGlass.id = 'wts-chart-mag-glass';
                        ttMagGlass.className = 'wts-chart-tooltip';
                        ttMagGlass.style.display = "none";
                        document.body.appendChild(ttMagGlass);
*/
                        u.over.addEventListener("mousemove", e => {
                            const { left, top } = u.over.getBoundingClientRect();
                            const x = e.clientX - left;
                            const y = e.clientY - top;
                            const idx = u.posToIdx(x);

                            if (idx >= 0) {
                                let spans = TextSpans[0];
                                for (let i = 0; i < spans.length; i++) {
                                    if (i == idx) {
                                        spans[i].classList.add('wts-track-current');
                                        spans[i].scrollIntoView({block: 'center', behavior: 'smooth'});
                                    } else {
                                        spans[i].classList.remove('wts-track-current');
                                    }

                                    if (i<idx) {
                                        spans[i].classList.add('wts-track-selection');
                                    } else {
                                        spans[i].classList.remove('wts-track-selection');
                                    }
                                }
                            }

                            if (idx >= 0 && idx < u.data[0].length) {
                                const totalChars = u.data[4][idx];
                                const totalCorrectChars = u.data[5][idx];
                                const totalErrorChars = totalChars - totalCorrectChars;

                                const instantChars = (idx) ? (totalChars - u.data[4][idx-1]) : totalChars;
                                const instantCorrectChars = (idx) ? (totalCorrectChars - u.data[5][idx-1]) : totalCorrectChars;
                                const instantErrorChars = instantChars - instantCorrectChars;

                                ttInfo.innerHTML =
                                    `<span class='time'>${formatTime(u.data[0][idx], 0, true)}</span>` +
                                    `Скорость: <span>${u.data[2][idx].toFixed(0)}</span> зн/мин<br>` +
                                    `За эту секунду: <span>${u.data[1][idx].toFixed(0)}</span> зн/мин<hr>` +
                                    `Знаков: <span>${totalCorrectChars}</span>${(totalErrorChars)?` (+${totalErrorChars} ${getPluralForm(totalErrorChars, ['удалённый', 'удалённых', 'удалённых'])})`:''}<br>` +
                                    `За эту секунду: <span>${instantCorrectChars}</span>${(instantErrorChars)?` (+${instantErrorChars} ${getPluralForm(instantErrorChars, ['удалённый', 'удалённых', 'удалённых'])})`:''}`;
                                ttInfo.style.left = `${e.clientX + 10}px`;
                                ttInfo.style.top = `${e.clientY + 10}px`;
                                ttInfo.style.display = "block";
/*
                                const curEl = document.getElementsByClassName('wts-track-current');
                                if (curEl.length && curEl[0].innerHTML.length) {
                                    ttMagGlass.innerHTML =
                                        `${(idx>0)? '&ltrif;' : ''}${curEl[0].innerHTML}${(idx < u.data[0].length-1) ? '&rtrif;' : ''}`;
                                    ttMagGlass.style.left = `${e.clientX + 10}px`;
                                    ttMagGlass.style.top = `${e.clientY + 20 + ttInfo.offsetHeight}px`;
                                    ttMagGlass.style.display = "block";
                                } else {
                                    ttMagGlass.style.display = "none";
                                }
*/
                            } else {
                                ttInfo.style.display = "none";
                            }

                        });

                        u.over.addEventListener("mouseleave", () => {
                            ttInfo.style.display = "none";
//                            ttMagGlass.style.display = "none";

                            let spans = TextSpans[0];
                            for (let i = 0; i < spans.length; i++) {
                                spans[i].classList.remove('wts-track-selection', 'wts-track-current');
                            }

                        });
                    }
                ],
                setScale: [
                    (u) => {
                        setTextTrackers0(u);

                        const idxStart = Math.ceil(u.scales.x.min);
                        const idxEnd = Math.floor(u.scales.x.max);

                        // update stats for selected interval
                        const stats = collectSpeedStats(annotatedData, {min: idxStart, max: idxEnd});
                        renderSpeedStats(stats);

                        let spans = TextSpans[0];
                        for (let i = 0; i < spans.length; i++) {
                            spans[i].classList.remove('wts-track-hide', 'wts-track-start', 'wts-track-end');

                            if (! ((i+1 >= idxStart-1) && (i+1 <= idxEnd+1)) ) {
                                spans[i].classList.add('wts-track-hide');
                            } else {
                                if (i+1 == idxStart-1) spans[i].classList.add('wts-track-start');
                                if (i+1 == idxEnd+1) spans[i].classList.add('wts-track-end');
                            }
                        }
                    }
                ]
            }
        };
    }

    function getSpeedChartData(annotatedData) {
        let totalTime = 0;
        const points = [];

        for (const { key, delay, mark } of annotatedData) {
            totalTime += delay;
            points.push({
                key,
                delay,
                mark,
                time: totalTime / 1000 // в секундах
            });
        }

        // Квантуем по секундам
        const duration = Math.ceil(totalTime / 1000); // общая длительность в секундах
        const xVals = [];

        const yInstant = []; // мгновенная скорость (по количеству набранных знаков за 1 секунду)
        const yAvg = []; // средняя скорость
        const yErr = []; // для указания мест ошибок на графике мгновенной скорости
        const yTotalCount = []; // сколько всего знаков к этому времени
        const yCorrectCount = []; // сколько всего правильно набранных знаков к этому времени
        let prevErrCount = 0;

        // Стартуем с 1, потому что в нулевой секунде нечего считать, по сути
        for (let t = 1; t <= duration; t++) {
            xVals.push(t);

            // Найдём символы, набранные ПО эту секунду включительно
            const pressed = points.filter(p => p.time <= t);
            const correctTyped = pressed.filter(p => (p.mark === 'correct'));
            const correctCount = correctTyped.length;

            const errorTyped = pressed.filter(p => (p.mark === 'error'));
            const errorCount = errorTyped.length;

            const totalCount = correctCount + errorCount;

            // Средняя скорость
            let time = (t < duration) ? t : totalTime / 1000;
            const avgSpeed = totalCount > 0 && t > 0 ? (correctCount / time) * 60 : 0;

            // Мгновенная скорость
            let prevSecCount = (t == 1) ? correctCount : correctCount - yCorrectCount[yCorrectCount.length - 1];
            if (t == duration) {
                prevSecCount += (duration>1)? (yInstant[yInstant.length-1]/60) : 0;
            }

            let lastSecCorrection = (duration>1)? t-2:0;
            let instSpeed = (t < duration)? (prevSecCount * 60) : ((prevSecCount * 60) / (time - lastSecCorrection)); //last second really pissed me off!

            // push the data!
            yInstant.push(instSpeed);
            yAvg.push(avgSpeed);
            yErr.push((errorCount != prevErrCount) ? avgSpeed : null);

            // these two are used only for tooltips
            yTotalCount.push(totalCount);
            yCorrectCount.push(correctCount);

            prevErrCount = errorCount;
        }

        return [
            xVals,
            yInstant,
            yAvg,
            yErr,
            yTotalCount,
            yCorrectCount,
        ];
    }

// --- DELAYS CHART ---

    function getDelaysChartOpts() {
        const css = getComputedStyle(document.documentElement);
        const fastDelayColor = css.getPropertyValue('--fast-delay-color');

        return {
            width: CHART_WIDTH,
            height: CHART_HEIGHT,

            legend: {
                show: false,
            },

            scales: {
                x: {
                    time: false,
                    range: (u, newMin, newMax) => {
                        let curMin = u.scales.x.min;
                        let curMax = u.scales.x.max;

                        if (newMax - newMin < 5) {
                            return [curMin, curMax];
                        }
                        return [newMin, newMax];
                    }
                },
                y: {
                    range: [0, 300],
                },
            },

            series: [
                {},
                {
                    //label: "delays",
                    stroke: '#33000066',
                    width: 1,
                },
                {
                    points: {
                        show: true,
                        size: 8,
                        fill: fastDelayColor,
                    },
                }
            ],

            axes: [
                {
                    font: '12px Tahoma',
                    stroke: '#888888',
                    scale: 'x',
                    incrs: [1, 2, 3, 5, 10, 15, 20, 40, 60, 100, 200, 400, 500],
                    values: (u, ticks) => ticks.map(v => `${v}`), //disable default formatting
                    grid: {
                        width: 1,
                    },
                    ticks: {
                        width: 1,
                    },
                },
                {
                    font: '12px Tahoma',
                    stroke: '#330000cc',
                    scale: 'y',
                    values: (u, ticks) => ticks.map(v => `${v} мс`), //disable default formatting
                    splits: () => [0, FAST_DELAY_THRESHOLD, 50, 100, 150, 200, 250, 300],
                    grid: {
                        width: 1,
                        stroke: '#33000022',
                    },
                    ticks: {
                        width: 1,
                        stroke: '#33000022',
                    },
                },
            ],

            hooks: {
                init: [
                    u => {
						let axisEls = u.root.querySelectorAll('.u-axis');
                        // set x axis event listener
                        let el = axisEls[0];
                        el.addEventListener('mousedown', e => {
                            let x0 = e.clientX;
                            let scaleKey = u.axes[0].scale;
                            let scale = u.scales[scaleKey];
                            let { min, max } = scale;
                            let diff = max - min;
                            let unitsPerPx = diff / (u.bbox.width / uPlot.pxRatio);

                            let mousemove = e => {
                                let dx = e.clientX - x0;
                                let shiftxBy = dx * unitsPerPx;

                                let newMin = min - shiftxBy;
                                let newMax = max - shiftxBy;
                                if (newMin < 0) {
                                    newMin = 0; newMax = newMin + diff;
                                } else if (newMax > u.data[0].length - 1) {
                                    newMax = u.data[0].length - 1;
                                    newMin = newMax - diff;
                                }

                                u.setScale(scaleKey, {
                                    min: newMin,
                                    max: newMax
                                });
                            };

                            let mouseup = e => {
                                document.removeEventListener('mousemove', mousemove);
                                document.removeEventListener('mousemove', mouseup);
                            };

                            document.addEventListener('mousemove', mousemove);
                            document.addEventListener('mouseup', mouseup);
                        });
                    },
                ],

                ready: [
                    (u) => {
                        setTextTrackers1(u);

                        const ttInfo = document.getElementById('wts-chart-tooltip') || document.createElement("div");
                        ttInfo.id = 'wts-chart-tooltip';
                        ttInfo.className = 'wts-chart-tooltip';
                        ttInfo.style.display = "none";
                        document.body.appendChild(ttInfo);

                        const ttMagGlass = document.getElementById('wts-chart-mag-glass') || document.createElement("div");
                        ttMagGlass.id = 'wts-chart-mag-glass';
                        ttMagGlass.className = 'wts-chart-tooltip';
                        ttMagGlass.style.display = "none";
                        document.body.appendChild(ttMagGlass);

                        u.over.addEventListener("mousemove", e => {
                            const { left, top } = u.over.getBoundingClientRect();
                            const x = e.clientX - left;
                            const y = e.clientY - top;
                            const idx = u.posToIdx(x);

                            if (idx > 0 && idx < u.data[0].length) {
                                const prevKey = `&nbsp;${u.data[3][idx-1] == ' ' ? '&nbsp;' : u.data[3][idx-1]}&nbsp;`;
                                const nextKey = `&nbsp;${u.data[3][idx] == ' ' ? '&nbsp;' : u.data[3][idx]}&nbsp;`;
                                const delay = parseInt(u.data[1][idx].toFixed(0));
                                ttMagGlass.innerHTML =`
                                     <div style="display: flex; align-items: center;">
                                        <span class="wts-tt-prev-key">${prevKey}</span>
                                        <span class="wts-tt-delay${(delay < FAST_DELAY_THRESHOLD)?' fast':''}">${delay} мс</span>
                                        <span class="wts-tt-next-key">${nextKey}</span>
                                     </div>`;
                                ttMagGlass.style.left = `${e.clientX + 10}px`;
                                ttMagGlass.style.top = `${e.clientY + 10}px`;
                                ttMagGlass.style.display = "block";
                            } else {
                                ttMagGlass.style.display = "none";
                            }

                            if (idx >= 0) {
                                let spans = TextSpans[1];
                                for (let i = 0; i < spans.length; i++) {
                                    if (idx && ((i == idx) || (i + 1 == idx))) {
                                        spans[i].classList.add('wts-track-current');
                                        spans[i].scrollIntoView({block: 'center', behavior: 'smooth'});
                                    } else {
                                        spans[i].classList.remove('wts-track-current');
                                    }
                                }
                            }

                        });

                        u.over.addEventListener("mouseleave", () => {
                            ttInfo.style.display = "none";
                            ttMagGlass.style.display = "none";

                            let spans = TextSpans[1];
                            for (let i = 0; i < spans.length; i++) {
                                spans[i].classList.remove('wts-track-current');
                            }
                        });
                    }
                ],

                setScale: [
                    (u) => {
                        setTextTrackers1(u);

                        const idxStart = Math.ceil(u.scales.x.min);
                        const idxEnd = Math.floor(u.scales.x.max);

                        renderDelayStats(collectDelayStats(annotatedData, {idxStart, idxEnd}));

                        let spans = TextSpans[1];
                        for (let i = 0; i < spans.length; i++) {
                            spans[i].classList.remove('wts-track-hide', 'wts-track-start', 'wts-track-end');

                            if ( (i < idxStart - 2) || (i > idxEnd + 1) ) {
                                spans[i].classList.add('wts-track-hide');
                            }
                            if (i == idxStart - 2) spans[i].classList.add('wts-track-start');
                            if (i > 1 && i == idxEnd + 1) spans[i].classList.add('wts-track-end');
                        }
                    }
                ]
            }
        };

    }

    function getDelaysChartData(annotatedData) {
        const xVals = [];
        const yVals = [];
        const fast = [];
        const cVals = [];

        let i=0;
        for (const obj of annotatedData) {
            const { key, delay, mark } = obj;

            if (mark === 'correct') {
                xVals.push(i);
                yVals.push((i)?delay:null);
                fast.push(i && (delay < FAST_DELAY_THRESHOLD)? delay:null);
                cVals.push(key);
                i++;
            }
        }

        return [
            xVals,
            yVals,
            fast,
            cVals
        ];
    }

// --- HISTOGRAM CHART ---

    function getHistChartOpts() {
        let isSelecting = false;
        let startX;

        const css = getComputedStyle(document.documentElement);
        const baseColor = css.getPropertyValue('--base-color');

        return {
            width: CHART_WIDTH,
            height: CHART_HEIGHT,

            legend: {
                show: false,
            },

            scales: {
                x: {
		            auto: false,
                    time: false,
		            range: [0, HISTOGRAM_MAX_X + HISTOGRAM_BIN_SIZE], // last one for outliers
                },
                y: {
		            auto: false,
		            range: [0, HISTOGRAM_MAX_Y],
                },
            },

            series: [
                {},
                {
                    fill: '#cf8282',
                    width: 1,
                    paths: uPlot.paths.bars(),
                    points: {show: false},
                },
                {
                    fill: baseColor,
                    width: 1,
                    paths: uPlot.paths.bars(),
                    points: {show: false},
                },
            ],

            axes: [
                {
                    scale: 'x',
                    values: (u, ticks) => ticks.map(v => `${(v<=HISTOGRAM_MAX_X)?v:'outliers'}`), //disable default formatting
                    font: '12px Tahoma',
                    stroke: '#888888',
                    grid: {
                        width: 1,
                    },
                    ticks: {
                        width: 1,
                    },
                    splits: ()=>{
                        let ret = [];
                        for (let i=0; i<=(HISTOGRAM_MAX_X + HISTOGRAM_BIN_SIZE); i+=(HISTOGRAM_BIN_SIZE<20)?2*HISTOGRAM_BIN_SIZE:HISTOGRAM_BIN_SIZE)
                        {
                            ret.push(i)
                        };
                        return ret;
                    }
                },
                {
                    scale: 'y',
                    values: (u, ticks) => ticks.map(v => `${(v*100).toFixed(0)}%`), //disable default formatting
                    font: '12px Tahoma',
                    stroke: '#330000',
                    grid: {
                        width: 1,
                    },
                    ticks: {
                        width: 1,
                    }
                },
            ],

            hooks: {
                ready: [
                    (u) => {

                        const ttInfo = document.getElementById('wts-chart-tooltip') || document.createElement("div");
                        ttInfo.id = 'wts-chart-tooltip';
                        ttInfo.className = 'wts-chart-tooltip';
                        ttInfo.style.display = "none";
                        document.body.appendChild(ttInfo);

                        u.over.addEventListener("mousemove", e => {
                            const { left, top } = u.over.getBoundingClientRect();
                            const x = e.clientX - left;
                            const y = e.clientY - top;
                            const idx = u.posToIdx(x);

                            if (idx >= 0 && idx < u.data[0].length && (u.data[1][idx] || u.data[2][idx])) {
                                ttInfo.innerHTML =
                                    (idx<u.data[0].length-1)?
                                    `<span>${(100*u.data[1][idx]).toFixed(1)}%</span> межклавишных пауз<br>в интервале <span>${idx*HISTOGRAM_BIN_SIZE}−${(idx+1)*HISTOGRAM_BIN_SIZE}</span> мс`:
                                    `<span>${(100*u.data[2][idx]).toFixed(1)}%</span> выбросов, не вошедших<br>в основную гистограмму<br>(паузы >${u.data[3].toFixed(0)} мс)`;
                                ttInfo.style.left = `${e.clientX + 10}px`;
                                ttInfo.style.top = `${e.clientY + 10}px`;
                                ttInfo.style.display = "block";
                            } else {
                                ttInfo.style.display = "none";
                            }

                            const startIdx = Math.min(u.posToIdx(startX), idx);
                            const endIdx = Math.max(u.posToIdx(startX), idx);

                            for (let i = 0; i < Math.floor(HISTOGRAM_MAX_X/HISTOGRAM_BIN_SIZE)+1; i++) {
                                if (isSelecting) {
                                    oO('#wts-text2').classList.toggle(`grad${i}`, (i >= startIdx) && (i <= endIdx));
                                } else {
                                    oO('#wts-text2').classList.toggle(`grad${i}`, i == idx);
                                }
                            }
                        });

                        u.over.addEventListener("mouseleave", () => {
                            ttInfo.style.display = "none";

                            isSelecting = false;
                            startX = null;
                            for (let i = 0; i < Math.floor(HISTOGRAM_MAX_X/HISTOGRAM_BIN_SIZE)+1; i++) {
                                oO('#wts-text2').classList.remove(`grad${i}`);
                            }
                        });

                        u.over.addEventListener("mousedown", (e) => {
                            isSelecting = true;
                            const { left } = u.over.getBoundingClientRect();
                            startX = e.clientX - left;
                        });

                        u.over.addEventListener("mouseup", (e) => {
                            isSelecting = false;
                            const { left } = u.over.getBoundingClientRect();
                            const x = e.clientX - left;
                            const idx = u.posToIdx(x);

                            for (let i = 0; i < Math.floor(HISTOGRAM_MAX_X/HISTOGRAM_BIN_SIZE)+1; i++) {
                                oO('#wts-text2').classList.remove(`grad${i}`);
                                oO('#wts-text2').classList.toggle(`grad${i}`, i == idx);
                            }

                        });
                    }
                ],
            }

        };
    }

    function getHistChartData(annotatedData) {
        const delays = [];

        for (const obj of annotatedData) {
            const { delay, mark } = obj;
            if (mark === 'correct' && delay) {
                delays.push(delay);
            }
        }

        const histData = Stat.prepareHistogramData(delays, {fixedBinSize:HISTOGRAM_BIN_SIZE, percentileCut: 0.97});
        if (!histData) return {data: [], cutValue: 0}

        const { bins, outliers, cutValue } = histData;

        const binLength = bins.x.length;
        const maxLength = Math.floor(HISTOGRAM_MAX_X / HISTOGRAM_BIN_SIZE) + 1;

        bins.x.length = maxLength;
        for (let i = binLength; i < maxLength; i++) {
            bins.x[i] = (HISTOGRAM_BIN_SIZE>>1) + i*HISTOGRAM_BIN_SIZE;
        }

        bins.y.length = maxLength;
        bins.y.fill(0, binLength, maxLength)

        //add another series for outliers
        const y2 = [];
        y2.length = maxLength;
        y2.fill(0, 0, maxLength);
        y2[maxLength-1] = outliers.length / delays.length;

        return {
            data:[
                bins.x,
                bins.y,
                y2,
                cutValue
            ],
            cutValue
        }
    }

    function showWTS() {
        loadUPlotIfNeeded(() => {
            showMainWindow('<div style="height: 400px; line-height: 1.5em; font-size:16px; font-family: Tahoma, sans-serif; color: #003300;">Wake up, Neo...<br>The Matrix has you...</div>', postInitMainWindow);
        });
    }

//just for debug
//window.oO = oO;
//window.setAppMode = setAppMode;
//window.Charts = Charts;
//window.__files = __files;

    window.showWTS = showWTS;

const Stat = {
    prepareHistogramData: function(values, options = {}) {
        const {
            percentileCut = null, // например, 0.98 для 98% обрезки
            useIQR = true, // использовать ли метод IQR
            iqrMultiplier = 1.5, // множитель для IQR
            fixedBinSize = null, // фиксированная ширина бакета (мс)
            normalize = true, // нормировать ли частоты
            fixedRange = null // [minX, maxX] диапазон по X
        } = options;

        // 1. Сортировка
        let data = values.slice().sort((a, b) => a - b);
        const n = data.length;
        if (n < 2) return null;

        // 2. Верхняя граница (если нет fixedRange)
        let cutValue;
        if (fixedRange) {
            cutValue = fixedRange[1];
        } else if (percentileCut !== null) {
            const idx = Math.floor(percentileCut * n);
            cutValue = data[idx];
        } else if (useIQR) {
            const q1 = data[Math.floor(0.25 * n)];
            const q3 = data[Math.floor(0.75 * n)];
            const iqr = q3 - q1;
            cutValue = q3 + iqrMultiplier * iqr;
        } else {
            cutValue = data[n - 1];
        }

        // 3. Основные данные и выбросы
        let mainData, outliers;
        if (fixedRange) {
            mainData = data.filter(v => v >= fixedRange[0] && v <= fixedRange[1]);
            outliers = data.filter(v => v < fixedRange[0] || v > fixedRange[1]);
        } else {
            mainData = data.filter(v => v <= cutValue);
            outliers = data.filter(v => v > cutValue);
        }

        // 4. Ширина бакета
        let binSize;
        if (fixedBinSize && fixedBinSize > 0) {
            binSize = fixedBinSize;
        } else {
            const q1 = mainData[Math.floor(0.25 * mainData.length)];
            const q3 = mainData[Math.floor(0.75 * mainData.length)];
            const iqr = q3 - q1;
            binSize = (2 * iqr) / Math.cbrt(mainData.length) || 1;
        }

        // 5. Границы диапазона для построения
        const min = fixedRange ? fixedRange[0] : mainData[0];
        const max = fixedRange ? fixedRange[1] : mainData[mainData.length - 1];
//        const binCount = Math.ceil((max - min) / binSize);
        const binCount = Math.ceil(max / binSize);
        const bins = new Array(binCount).fill(0);

        mainData.forEach(v => {
//            const idx = Math.min(Math.floor((v - min) / binSize), binCount - 1);
            const idx = Math.min(Math.floor(v / binSize), binCount - 1);
            bins[idx]++;
        });

        // 6. Нормализация
        let y = bins.slice();
        if (normalize) {
            const total = mainData.length;
            if (total > 0) {
                y = y.map(count => count / total);
            }
        }

        // 7. X и Y
        const x = [];
        for (let i = 0; i < binCount; i++) {
            //                const center = min + (i + 0.5) * binSize;
            const center = (i + 0.5) * binSize;
            x.push(center);
        }

        return {
            bins: { x, y },
            binSize,
            outliers,
            cutValue
        };
    },

    analyzeDelays: function(delays) {
        if (!delays || delays.length < 2) {
            return null;
        }

        const sorted = [...delays].sort((a, b) => a - b);
        const n = sorted.length;

        const mean = sorted.reduce((a, b) => a + b, 0) / n;
        const median = (n % 2 === 0)
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[(n - 1) / 2];
        const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
        const sd = Math.sqrt(variance);
        const cv = mean !== 0 ? sd / mean : 0;
        const q1 = sorted[Math.floor(n * 0.25)];
        const q3 = sorted[Math.floor(n * 0.75)];
        const iqr = q3 - q1;
        const min = sorted[0];
        const max = sorted[n - 1];

        return {
            mean: {
                val: mean,
                descr: "Средняя пауза между нажатиями. Чем меньше − тем быстрее набор.",
                hint: ""
            },
            median: {
                val: median,
                descr: "Устойчивая альтернатива среднему. Менее чувствительна к выбросам.",
                hint: ""
            },
            sd: {
                val: sd,
                descr: "Стандартное отклонение. Чем меньше − тем стабильнее ритм.",
                hint: ""
            },
            cv: {
                val: cv,
                descr: "Коэффициент вариации или аритмия. Чем меньше − тем ритмичнее набор.",
                hint: ""
            },
            iqr: {
                val: iqr,
                descr: "Межквартильный размах. Характеризует разброс значений в интервале от 25% до 75%",
                hint: ""
            },
            min: {
                val: min,
                descr: "Минимальная пауза между нажатиями.",
                hint: ""
            },
            max: {
                val: max,
                descr: "Максимальная пауза между нажатиями.",
                hint: ""
            }
        };
    }
};

const FileImport = {
    TSFdata2WTSdata: function(lines) {
        const RESET_DELAY = 2000*1000;
        const MIN_TSF_LENGTH_TO_SAVE = 5;
        const subst = {'0008':'Backspace', '0009':'Tab', '007F':'Ctrl+Backspace'};
        const result = [];
        let wtsData = [];
        let diff = 0;
        for (let line of lines) {
            const [timestamp, data] = line.trim().split(' ');
            const delay = parseInt(timestamp, 16);

            if (delay > RESET_DELAY) {
                if (wtsData.length && wtsData.length >= MIN_TSF_LENGTH_TO_SAVE) result.push(wtsData);
                wtsData = [];
                diff = 0;
            }

            const keyCodeHex = data.slice(0, 4);
            const keyCode = parseInt(keyCodeHex, 16);
            if (wtsData.length) diff += delay; // accumulate delays of non-printable keypresses
            if (keyCode == 0) continue;
            const key = subst[keyCodeHex] || String.fromCodePoint(keyCode);
            wtsData.push({[key]: diff/1000})
            diff = 0;
        }
        if (wtsData.length && wtsData.length >= MIN_TSF_LENGTH_TO_SAVE) result.push(wtsData);
        return result;
    }
}

// --- !!! no significant code below this line, only auxiliary functions !!! ---

// --- CSS ---

    // TODO: minimize css
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
    :root {
       --main-font-family: Tahoma, sans-serif;
       --text-font-size: 11pt; /* 16px */
       --base-color: #883333;
       --highlighter-color: #a2ee55;
       --partial-indicator-color: #aaf0f0;
       --fast-delay-color: #ffd900;
       --error-color: #ff0000;
    }

    #wts-side-panel {
        background-color: #F8F4E6;
        border-radius: 10px;
        margin: 10px 0;
        line-height: 1.6em;
    }

    .wts-side-panel-content {
        padding: 10px;
    }

    #wts-rec {
        position: absolute;
        visibility: hidden;
        display: block;
        background: radial-gradient(#ff3333 40%, #666666);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 0 2px #000000;
        cursor: help;
    }

    #wts-rec.blink {
        visibility: visible;
        animation: blink 1s infinite;
        z-index: 9999; /* 😈 <[MWAHAHA] */
    }

    @keyframes blink {
      0%, 100% {opacity: 0}
      25% {opacity: 1}
    }

    #wts-rec.pause {
        visibility: visible;
        background: radial-gradient(#ffa500 40%, #666666);
    }

    #wts-rec.ready {
        visibility: visible;
        background: radial-gradient(#66aa66 40%, #666666);
    }

    #${MODAL_ID} {
        background: #ffffff;
        color: #330000;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        overflow: auto;
        position: fixed;
        width: 800px;
        max-height: 95vh;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        outline: none;
        font-family: var(--main-font-family);
        font-size: 10pt;
        line-height: 1.4em;
    }

    #${MODAL_ID} .wts-header {
        padding: 10px 15px;
        background: #f0f0f0;
        cursor: move;
        user-select: none;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    #${MODAL_ID} .wts-header select {
        font-size: 16px;
        color: #333333;
        outline: none;
        padding-right: 10px;
        padding-bottom: 1px;
    }

    #wts-list-progress {
        height: 2px;
        margin-bottom: -2px;
        width: 0%;
        background-color: #aaaaaa;
    }

    #${MODAL_ID} .wts-emptyspace {
        flex-grow: 1;
    }

    #${MODAL_ID} .wts-button {
        font-size: 20px;
        line-height: 24px;
        color: #888888;
        cursor: pointer;
        margin-left: 10px;
        text-align: center;
    }

    #${MODAL_ID} .wts-button:hover {
        color: #000000;
    }

    #${MODAL_ID} .wts-close {
        font-size: 32px;
        line-height: 24px;
        color: #888888;
        cursor: pointer;
        margin-left: 10px;
        width: 40px;
        text-align: center;
        border-radius: 5px;
        transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    #${MODAL_ID} .wts-close:hover {
        color: #ffffff;
        background-color: #cc3333;
    }

    #${MODAL_ID} .wts-menu-wrapper {
        position: relative;
        display: inline-block;
    }

    #${MODAL_ID} .wts-menu {
        display: none;
        position: absolute;
        top: 0; /* начинаем прямо с верха кнопки */
        right: 0;  /* чтобы выпадало вправо от края */
        background: #fff;
        border: 1px solid #aaa;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        white-space: nowrap;
        z-index: 1000;
        overflow: hidden;
        cursor: default;
    }

    #${MODAL_ID} .wts-menu-header {
        background: #f0f0f0;
        padding: 4px 10px;
        font-weight: bold;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
    }

    #${MODAL_ID} .wts-menu a {
        display: block;
        padding: 4px 10px;
        text-decoration: none;
        color: #333333;
        font-size: 14px;
    }

    #${MODAL_ID} .wts-menu a:hover {
        background: #8053dd;
        color: #ffffff;
    }

    /* магия hover */
    #${MODAL_ID} .wts-menu-wrapper:hover .wts-menu {
        display: block;
    }

    #${MODAL_ID} #wts-tab-switcher {
        background: #ffffff;
        margin: 0 24px -20px 24px;
        border-radius: 10px 10px 0 0;
        cursor: default;
    }

    #${MODAL_ID} .wts-tab-button {
        font-size: 16px;
        line-height: 24px;
        color: var(--base-color);
        cursor: pointer;
        text-align: center;
        display: inline-block;
        width: 30px;
    }

    #${MODAL_ID} .wts-tab-button:hover {
        color: #000000;
    }

    #${MODAL_ID} .wts-tab-button.inactive {
        color: #aaaaaa;
        pointer-events: none;
    }

    #${MODAL_ID} .wts-content {
        padding: 15px;
        overflow-y: auto;
    }

    #${MODAL_ID} input[type="file"] {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }

    #${MODAL_ID} input[type="checkbox"], label {
        margin: 0px;
    }

    #${MODAL_ID} input[type="checkbox"][disabled] + label {
        cursor: not-allowed;
        opacity: 0.3;
    }

    #${MODAL_ID} hr {
        margin: 5px auto;
        height: 1px;
        width: 90%;
        border: 0;
        border-top: 1px solid #f0f0f0;
    }

    #wts-frames {
        overflow: hidden;
        position: relative;
    }

    .wts-frame {
        display:none;
        opacity: 0;
        pointer-events: none;
    }

    .wts-frame.active {
        display: block;
        opacity: 1;
        pointer-events: auto;
    }

    #${MODAL_ID} .wts-stats {
        width: 100%;
        background-image: linear-gradient(#ffffff, 50%, #f0f0f0);
        border-radius: 0 0 10px 10px; /*background-color: #fafafa;*/
        color: #888888;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    #${MODAL_ID} .wts-stats > div {
        padding: 0px 20px 5px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #${MODAL_ID} .wts-stats span {
        font-size: 12pt;
        color: #330000;
    }

    #${MODAL_ID} .wts-stats span span {
        font-size: 10pt;
        padding: 0;
    }

    #${MODAL_ID} .wts-stats.partial {
        background-image: linear-gradient(#ffffff, 50%, var(--partial-indicator-color)); /* f0f0ff */
        border-radius: 0;
    }

    #${MODAL_ID} .wts-chart {
        width: ${CHART_WIDTH}px;
        height: ${CHART_HEIGHT}px;
        margin-left: auto;
        margin-right: auto;
    }

    #${MODAL_ID} .wts-chart.partial {
        border-radius: 0 0 20px 20px;
        box-shadow: 0 2px 5px 3px var(--partial-indicator-color);
    }

    #${MODAL_ID} #wts-chart1 {
        padding-left: 8px;
    }

    .wts-chart-tooltip {
        position: fixed;
        font-size: 8pt;
        background: #ffffff; /*opacity: 0.9;*/
        color: #666;
        padding: 4px 6px;
        border: 1px solid #cccccc;
        border-radius: 5px;
        z-index: 10000;
        pointer-events: none;
    }

    #wts-chart-tooltip {
        width: 190px;
    }

    #wts-chart-tooltip span {
        font-size: 10pt;
        color: #300;
    }

    #wts-chart-tooltip span.time {
        font-size: 8pt;
        color: #fff;
        padding: 2px 4px;
        position: absolute;
        right: 5px;
        background-color: var(--base-color);
        border-radius: 4px;
    }

    .wts-chart-tooltip hr {
        margin: 5px 0 2px 0;
    }

    #wts-chart-mag-glass {
        background-image: linear-gradient(#eeeeee, #ffffff, #eeeeee);
        font-size: 16px;
        border-radius: 8px;
        box-shadow: 0 0 2px;
    }

    .wts-tt-prev-key, .wts-tt-next-key {
        background: var(--base-color);
        color: #ffffff;
        padding: 5px;
        border-radius: 10px;
        font-size: 18px;
        margin: 5px;
        min-width: 36px;
        text-align: center;
    }

    .wts-tt-delay {
        background: #f0f0f0;
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 12px;
        min-width: 50px;
        text-align: center;
    }

    .wts-tt-delay.fast {
        background-color: var(--fast-delay-color);
        color: #333333;
    }

    #wts-text-controls {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    #wts-text-controls div {
        display: flex;
        align-items: center;
        padding: 5px 20px 2px 20px;
    }

    #wts-text-controls label {
        font-weight: normal;
        font-size: 12px;
        margin-left: -20px;
        padding: 2px 5px;
        padding-left: 25px;
        margin-right: 30px;
        background-color: #f0f0f0;
        border-radius: 5px;
    }

    #hide-fast + label {
        background-color: #ffea92;
        color: #330000;
    }

    #hide-err + label {
        background-color: #ffaa99;
        color: #330000;
    }

    #hide-corr + label {
        background-color: #a86c62;
        color: #ffffff;
    }

    #wts-text-controls input[type="checkbox"] {
        z-index: 1;
    }

    .wts-text {
        width: 740px;
        font-size: var(--text-font-size);
        padding: 2px 5px 2px 30px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
    }

    .wts-text div {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        text-align: justify;
        max-height: 45vh;
        overflow-y: auto;
        padding: 5px 25px 10px 10px;
    }

    .wts-text span.s:hover {
        background-color: var(--highlighter-color);
        position: relative;
        border-radius: 5px;
        padding: 1px 2px;
        margin: -1px -2px;
    }
    .wts-text .err {
        text-decoration: line-through;
        color: var(--error-color);
    }
    .wts-text.hide-err .err {
        display: none;
    }

    .wts-text .corr {
        font-weight: bold;
        color: #ffffff;
        background-color: #660000;
        font-size: 9px;
        line-height: 12px;
        border-radius: 4px;
        padding: 0 2px;
        margin: 0 1px;
        cursor: help;
        position: relative;
        top: -1px;
    }
    .wts-text .corr:hover {
        position: relative;
        padding: 2px 4px;
        margin: -2px -1px;
    }

    .wts-text.hide-corr .corr {
        display: none;
    }

    .wts-text .fast {
        color: #333333;
        background-color: var(--fast-delay-color);
        cursor: help;
    }
    .wts-text .fast:hover {
        position: relative;
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 5px;
        box-shadow: 0 0 2px;
    }

    .wts-text .fast:hover:before {
        content: attr(data-prevkey);
    }

    .wts-text.hide-fast .fast {
        color: unset;
        background-color: unset;
        cursor: unset;
    }

    .wts-text.hide-fast .fast:hover {
        position: unset;
        padding: unset;
        margin: unset;
        border-radius: unset;
        box-shadow: unset;
    }

    .wts-text.hide-fast .fast:hover:before {
        content: '';
    }

    #wts-text2 {
        line-height: 1.8em;
        /* font-size: 16px; */
    }

    .wts-track-selection {
        background-color: #eeeeee;
    } /*#def2e0*/

    .wts-track-selection:first-of-type {
        border-radius: 5px 0 0 5px;
        padding-left: 3px;
        margin-left: -3px;
    }

    .wts-track-current {
        background-color: var(--highlighter-color);
        border-radius: 0 5px 5px 0;
        padding-right: 3px;
        margin-right: -3px;
    }

    .wts-track-current,
    .wts-track-selection,
    #wts-text span.s {
        transition: background-color 0.3s ease-in-out;
    }

    .c.wts-track-current {
        border-radius: 0;
        border: 4px solid var(--base-color);
        border-width: 0 0 4px 0;
        position: relative;
        background: var(--highlighter-color);
    }

    .wts-track-hide {
        display: none;
    }

    .wts-track-start,
    .wts-track-end {
        font-size: 0;
        line-height: 0px; /* this is important for some reason!*/
        pointer-events: none;
        color: #888888;
        display: inline-block;
    }

    .wts-track-start:after, .wts-track-end:before {
        font-size: var(--text-font-size);
    }

    .wts-track-start:after {
        content: '${CUT_START_MARK}';
    }

    .wts-track-end:before {
        content: '${CUT_END_MARK}';
    }

    #wts-toast {
        visibility: hidden;
        background-color: #f0f0f0;
        color: #000000;
        min-width: 220px;
        margin-left: -110px;
        text-align: center;
        border-radius: 30px;
        padding: 10px;
        pointer-events: none;
        position: absolute;
        z-index: 10001;
        top: 0px;
        left: 50%;
        font-size: 12pt;
        opacity: 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, top 0.3s;
    }

    #wts-toast.ok {
        background-color: #33aa33; /* 66ee66 */
        color: #ffffff;
    }

    #wts-toast.warn {
        background-color: #ffcc33;
        color: #333333;
    }

    #wts-toast.err {
        background-color: var(--error-color);
        color: #ffffff;
    }

    #wts-toast.show {
        visibility: visible;
        opacity: 1;
        top: 30px;
    }

    .wts-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .wts-progress-box {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        min-width: 260px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: sans-serif;
    }

    .wts-progress-text {
        margin-bottom: 12px;
        font-size: 14px;
    }

    .wts-progress-bar {
        width: 100%;
        height: 12px;
        background: #ddd;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
    }

    .wts-progress-fill {
        height: 100%;
        width: 0;
        background: #4caf50;
        transition: width 0.3s ease;
    }

    /* анимация "indeterminate" */
    .wts-progress-fill.indeterminate {
        position: absolute;
        width: 30%;
        left: -30%;
        animation: wts-indeterminate 1.2s infinite linear;
    }

    @keyframes wts-indeterminate {
        0%   { left: -30%; }
        50%  { left: 100%; }
        100% { left: 100%; }
    }
`;
        // generate gradients for histogram text
        const maxLen = Math.floor(HISTOGRAM_MAX_X / HISTOGRAM_BIN_SIZE) + 1;
        const gradient = ColorUtils.generateTints('#666666', maxLen);
        for (let i = 0; i < maxLen; i++) {
            const color = (i < maxLen - 1)?gradient[i]:'var(--base-color)';
            style.textContent += `.wts-text .grad${i} {color: #aaaaaa; border: 6px solid ${color}; border-width: 0 0 6px 0; transition: color 0.3s ease-in-out;}\n\n`;
            style.textContent += `.wts-text.grad${i} .grad${i} {color: unset; border-width: 0 0 9px 0; position: relative; top: -3px}\n\n`;
        }

        document.head.appendChild(style);
    }
})();

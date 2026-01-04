// ==UserScript==
// @name         MusicBrainz: Guess release language and script
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.0.3
// @tag          ai-created
// @description  Guess release language and script from release tracklist using Language Detector API
// @author       ROpdebee, chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/add*
// @match        *://*.musicbrainz.org/release/*/edit*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548617/MusicBrainz%3A%20Guess%20release%20language%20and%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/548617/MusicBrainz%3A%20Guess%20release%20language%20and%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_NAME = GM.info.script.name;

    // --- Logger ---
    const LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
    };

    class Logger {
        constructor(scriptName, level = LogLevel.INFO) {
            this.scriptName = scriptName;
            this.logLevel = level;
        }

        #log(level, message, ...args) {
            if (level < this.logLevel) return;

            const style = `color: ${level === LogLevel.ERROR ? 'red' : (level === LogLevel.WARN ? 'orange' : 'cyan')}; font-weight: bold;`;
            console.log(`%c[${this.scriptName}]%c`, style, '', message, ...args);
        }

        debug(message, ...args) {
            this.#log(LogLevel.DEBUG, message, ...args);
        }
        info(message, ...args) {
            this.#log(LogLevel.INFO, message, ...args);
        }
        warn(message, ...args) {
            this.#log(LogLevel.WARN, message, ...args);
        }
        error(message, ...args) {
            this.#log(LogLevel.ERROR, message, ...args);
        }
    }

    const LOGGER = new Logger(SCRIPT_NAME, LogLevel.INFO);

    // --- DOM Utilities ---
    function qs(selector, parent = document) {
        return parent.querySelector(selector);
    }

    // --- Language & Script Data ---
    // Maps language codes from the detection API to English names
    const LANGUAGE_CODE_TO_NAME = {
        ar: 'Arabic', az: 'Azerbaijani', bn: 'Bengali', cs: 'Czech', da: 'Danish',
        de: 'German', el: 'Greek', en: 'English', eo: 'Esperanto', es: 'Spanish',
        fa: 'Persian', fi: 'Finnish', fr: 'French', ga: 'Irish', he: 'Hebrew',
        hi: 'Hindi', hu: 'Hungarian', id: 'Indonesian', it: 'Italian', ja: 'Japanese',
        ko: 'Korean', nl: 'Dutch', pl: 'Polish', pt: 'Portuguese', ru: 'Russian',
        sk: 'Slovak', sv: 'Swedish', tr: 'Turkish', uk: 'Ukrainian', vi: 'Vietnamese',
        zh: 'Chinese',
    };

    // Maps English language names to MusicBrainz's internal numeric IDs
    const LANGUAGE_NAME_TO_ID = {
        'Arabic': 18, 'Azerbaijani': 34, 'Bengali': 47, 'Chinese': 76, 'Czech': 98,
        'Danish': 100, 'Dutch': 113, 'English': 120, 'Esperanto': 122, 'Finnish': 131,
        'French': 134, 'German': 145, 'Greek': 159, 'Hebrew': 167, 'Hindi': 171,
        'Hungarian': 176, 'Indonesian': 189, 'Irish': 149, 'Italian': 195,
        'Japanese': 198, 'Korean': 224, 'Persian': 334, 'Polish': 338,
        'Portuguese': 340, 'Russian': 353, 'Slovak': 377, 'Spanish': 393,
        'Swedish': 403, 'Turkish': 433, 'Ukrainian': 441, 'Vietnamese': 448,
    };

    // Maps English script names to MusicBrainz's internal numeric IDs
    const SCRIPT_NAME_TO_ID = {
        Arabic: 18, Cyrillic: 31, Greek: 22, Han: 92, Hebrew: 11, Japanese: 85,
        Korean: 43, Latin: 28, Thai: 65,
    };

    const SCRIPT_REGEXES = {
        Arabic: /(?:[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C-\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0751-\u077F\u0870-\u088E\u0890\u0891\u0898-\u08E1\u08E3-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD40-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFDFF\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1])/,
        Cyrillic: /[\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F]/,
        Greek: /(?:[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45])/,
        Han: /(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
        Hebrew: /[\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F]/,
        Japanese: /(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9\uFF66-\uFF6F\uFF71-\uFF9D]|\uD81B[\uDFE2\uDFE3\uDFF0\uFF1]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67]|\uD83C\uDE00|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
        Korean: /(?:[\u1100-\u11FF\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u302E\u302F\u3038-\u303B\u3131-\u318E\u3200-\u321E\u3260-\u327E\u3400-\u4DBF\u4E00-\u9FFF\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
        Thai: /[\u0E01-\u0E3A\u0E40-\u0E5B]/,
        Latin: /(?:[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]|\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E])/,
    };

    // --- Core Logic ---
    function formatPercentage(value) {
        return `${(value * 100).toFixed(2)}%`;
    }

    const detectLanguage = async (text, confidenceThreshold = 0.75) => {
        if (!('LanguageDetector' in window)) {
            throw new Error('LanguageDetector API is not available in this browser.');
        }

        try {
            const detector = await LanguageDetector.create();
            const results = await detector.detect(text);
            const reliableResult = results.find(res => res.confidence >= confidenceThreshold);

            if (reliableResult) {
                const langCode = reliableResult.detectedLanguage.split('-')[0];
                const mappedLanguage = LANGUAGE_CODE_TO_NAME[langCode];

                if (mappedLanguage) {
                    LOGGER.info(`Identified as ${mappedLanguage} (${langCode}) with confidence ${formatPercentage(reliableResult.confidence)}`);
                    return mappedLanguage;
                }
            }

            const topResults = results.slice(0, 5).map(r =>
                `${r.detectedLanguage} (${formatPercentage(r.confidence)})`
            ).join(', ');

            LOGGER.warn(`Could not reliably identify a supported language (threshold: ${formatPercentage(confidenceThreshold)}).`);
            LOGGER.warn(`Top detections: [${topResults}]`);
            LOGGER.debug('Full detection results:', results);
            throw new Error('Could not detect language reliably from the given text.');

        } catch (error) {
            if (error.message !== 'Could not detect language reliably from the given text.') {
                LOGGER.error('An unexpected error occurred during language detection.', error);
            }
            throw error;
        }
    };

    function detectScript(text, confidenceThreshold = 0.75) {
        const scriptCounts = new Map(
            Object.entries(SCRIPT_REGEXES).map(([script, regex]) => {
                const matches = text.match(new RegExp(regex, 'g')) || [];
                return [script, matches.length];
            })
        );

        const latinCount = scriptCounts.get('Latin') ?? 0;
        const latinConfidence = text.length > 0 ? latinCount / text.length : 0;
        scriptCounts.delete('Latin');

        const [bestMatchScript, bestMatchCount] = [...scriptCounts.entries()]
            .sort(([, countA], [, countB]) => countB - countA)[0];

        const bestMatchConfidence = text.length > 0 ? bestMatchCount / text.length : 0;

        if (bestMatchConfidence >= 0.15 && bestMatchConfidence + latinConfidence >= confidenceThreshold) {
            LOGGER.info(`Identified script as ${bestMatchScript} with confidence ${formatPercentage(bestMatchConfidence + latinConfidence)}`);
            return bestMatchScript;
        }

        if (latinConfidence > 0.75) {
            LOGGER.info(`Identified script as Latin with confidence ${formatPercentage(latinConfidence)}`);
            return 'Latin';
        }

        return undefined;
    }

    // --- MusicBrainz Integration ---

    function selectOptionByValue(selectElement, value) {
        // Use `==` to allow implicit conversion between string and number
        const option = [...selectElement.options].find(opt => opt.value == value);
        if (option) {
            selectElement.value = value;
            selectElement.dispatchEvent(new Event('change'));
        } else {
            throw new Error(`Value '${value}' not found in the dropdown.`);
        }
    }

    async function guessLanguage(titles) {
        const text = titles.join('. ');
        const languageName = await detectLanguage(text); // e.g., 'English'
        const languageId = LANGUAGE_NAME_TO_ID[languageName];

        if (!languageId) {
            throw new Error(`No ID mapping found for language '${languageName}'`);
        }

        selectOptionByValue(qs('select#language'), languageId);
    }

    function guessScript(titles) {
        const text = titles.join('').replaceAll(/\s+/g, '');
        const scriptName = detectScript(text); // e.g., 'Latin'

        if (!scriptName) {
            LOGGER.warn('Could not determine script');
            return;
        }

        const scriptId = SCRIPT_NAME_TO_ID[scriptName];
        if (!scriptId) {
            throw new Error(`No ID mapping found for script '${scriptName}'`);
        }

        selectOptionByValue(qs('select#script'), scriptId);
    }

    async function retry(fn, times, delay) {
        for (let i = 0; i < times; i++) {
            try {
                return await fn();
            } catch (err) {
                if (i === times - 1) throw err;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    async function expandMedium(medium) {
        if (medium.loaded()) return;
        if (!medium.loading()) {
            medium.loadTracks();
        }
        await retry(() => {
            if (!medium.loaded()) throw new Error('Medium did not load');
        }, 20, 250);
    }

    function pThrottle({ limit, interval }) {
        const queue = [];
        let activeCount = 0;
        const timeouts = new Set();

        const next = () => {
            if (activeCount >= limit || queue.length === 0) return;
            activeCount++;

            const { fn, args, resolve, reject } = queue.shift();

            const timeout = setTimeout(() => {
                activeCount--;
                timeouts.delete(timeout);
                next();
            }, interval);
            timeouts.add(timeout);

            (async () => {
                try {
                    resolve(await fn(...args));
                } catch (error) {
                    reject(error);
                }
            })();
        };

        const throttled = (...args) => new Promise((resolve, reject) => {
            queue.push({ fn: throttled.fn, args, resolve, reject });
            next();
        });

        return (fn) => {
            throttled.fn = fn;
            return throttled;
        };
    }

    const getTrackTitlesFromMedium = pThrottle({ limit: 4, interval: 1000 })(async (medium) => {
        await expandMedium(medium);
        return medium.tracks().map(track => track.name());
    });

    async function getTrackTitles() {
        const editor = window.MB?.releaseEditor;
        if (!editor) throw new Error('Release editor not found.');

        const mediums = editor.rootField.release().mediums() ?? [];
        const trackTitlesPerMedium = await Promise.all(mediums.map(getTrackTitlesFromMedium));
        const allTrackTitles = trackTitlesPerMedium.flat();

        if (allTrackTitles.length === 0) {
            throw new Error('No tracklist to guess from');
        }

        return allTrackTitles;
    }

    async function getTitles() {
        const editor = window.MB?.releaseEditor;
        if (!editor) throw new Error('Release editor not found.');

        const releaseTitle = editor.rootField.release().name();
        const trackTitles = await getTrackTitles();

        return [releaseTitle, ...trackTitles];
    }

    async function doGuess() {
        const titles = await getTitles();

        try {
            guessScript(titles);
        } catch (err) {
            LOGGER.error('Failed to guess or set script.', err);
        }

        try {
            await guessLanguage(titles);
        } catch (err) {
            LOGGER.warn('Failed to guess or set language.');
        }
    }

    // --- UI ---
    function addButton() {
        const target = qs('table.row-form > tbody');
        if (!target) return;

        const row = document.createElement('tr');
        const emptyCell = document.createElement('td');
        const cell = document.createElement('td');
        cell.colSpan = 2;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Guess language and script';

        const loadingSpan = document.createElement('span');
        loadingSpan.className = 'loading-message';
        loadingSpan.style.display = 'none';
        loadingSpan.style.marginLeft = '10px';
        loadingSpan.textContent = 'Guessing...';

        btn.addEventListener('click', async (evt) => {
            evt.preventDefault();
            loadingSpan.style.display = '';
            btn.disabled = true;

            try {
                await doGuess();
            } catch (err) {
                // More specific errors are logged inside doGuess
                LOGGER.error('Guessing process failed unexpectedly.', err);
            } finally {
                loadingSpan.style.display = 'none';
                btn.disabled = false;
            }
        });

        cell.append(btn, loadingSpan);
        row.append(emptyCell, cell);
        target.append(row);
    }

    // --- Main ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        addButton();
    }
})();
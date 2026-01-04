// ==UserScript==
// @name         WME PLN Core - Normalization Engine
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      9.0.0
// @description  Motor de lógica de normalización para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none

// ==/UserScript==

// Helper local (usa PLNCore.utils.escapeRegExp si existe)
function plnEscapeRegExpLocal(s){
    const f = (typeof PLNCore !== 'undefined' && PLNCore.utils && typeof PLNCore.utils.escapeRegExp === 'function')
        ? PLNCore.utils.escapeRegExp
        : (x => String(x).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&'));
    return f(String(s));
}

function applySwapRules(originalName, deps) {
    try {
        const DBG = !!(window.__PLN_SWAP_DEBUG_ON || localStorage.getItem('wme_pln_debug_swap') === '1');
        let name = String(originalName || '');
        const swaps = (typeof plnCollectSwapRules === 'function')
            ? plnCollectSwapRules(deps)
            : (Array.isArray(deps?.swapWords) ? deps.swapWords : Array.isArray(window.swapWords) ? window.swapWords : []);

        if (DBG) plnLog('swap', 'applySwapRules', { originalName, swapsCount: Array.isArray(swaps) ? swaps.length : 0 });
        if (!swaps.length) { if (DBG) { plnLog('swap', 'skip: no swaps configured'); } return name; }

        const normalizeSpace = s => s.replace(/\s+/g, ' ').replace(/\s*-\s*/g, ' - ').trim();

        for (const raw of swaps) {
            if (!raw) { if (DBG) plnLog('swap', 'skip: null item'); continue; }
            const token = String((raw.word || raw.text || raw.token || '').trim());
            if (!token) { if (DBG) plnLog('swap', 'skip: empty token', raw); continue; }

            let where = String((raw.position || raw.where || raw.dir || raw.direction || '')).toLowerCase();
            if (where === 'antes' || where === 'before' || where === 'pre') where = 'before';
            if (where === 'despues' || where === 'después' || where === 'after' || where === 'post') where = 'after';
            if (where !== 'before' && where !== 'after') { if (DBG) plnLog('swap', `skip [${token}]: invalid position`, raw); continue; }

            const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const SEP = '[\\s,.;:()\\[\\]\\-–—\\/]';

            const reFind = new RegExp(`(?:^|${SEP})${esc}(?=$|${SEP})`, 'iu');
            const reAnywhere = new RegExp(`(?:^|${SEP})${esc}(?=$|${SEP})`, 'giu');
            const reStart = new RegExp(`^\\s*${esc}(?=$|${SEP})`, 'iu');
            const reEnd = new RegExp(`(?:^|${SEP})${esc}\\s*$`, 'iu');

            if (DBG) plnLog('swap', `[${token}] → ${where}`);
            if (!reFind.test(name)) {
                if (DBG) { plnLog('swap', 'no-op: token not present in name', { name, token }); }
                continue;
            }

            if ((where === 'before' && reStart.test(name)) || (where === 'after' && reEnd.test(name))) {
                if (DBG) { plnLog('swap', 'no-op: already at target edge', { name }); }
                name = normalizeSpace(name);
                continue;
            }

            const before = name;
            name = name.replace(reAnywhere, ' ').replace(/\s{2,}/g, ' ').trim();
            name = where === 'before' ? `${token} ${name}`.trim() : `${name} ${token}`.trim();
            name = normalizeSpace(name);
            if (DBG) plnLog('swap', 'moved', { before, after: name });
        }

        if (DBG) { plnLog('swap', 'result =>', name); }
        return name;
    } catch (e) {
        if (window.__PLN_SWAP_DEBUG_ON) plnLog('error', '[PLN Swap] error', e);
        return originalName;
    }
}

function plnCollectSwapRules(deps) {
    try {
        const normDir = v => {
            v = String(v || '').toLowerCase();
            if (v === 'antes' || v === 'before' || v === 'pre' || v === 'start') return 'before';
            if (v === 'despues' || v === 'después' || v === 'after' || v === 'post' || v === 'end') return 'after';
            return null;
        };
        const key = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        const map = new Map();
        const setRule = (w, d, pri) => {
            w = String(w || '').trim();
            d = normDir(d);
            if (!w || !d) return;
            const k = key(w);
            const prev = map.get(k);
            if (!prev || (prev._pri || 0) <= pri) {
                map.set(k, { word: w, position: d, _pri: pri });
            }
        };
        (Array.isArray(deps?.swapWords) ? deps.swapWords : Array.isArray(window.swapWords) ? window.swapWords : []).forEach(x => {
            if (!x) return;
            if (typeof x === 'string') { setRule(x, 'before', 1); return; }
            const w = x.word || x.text || x.token || x.value || x.name;
            const d = x.position || x.where || x.dir || x.direction;
            setRule(w, d, 1);
        });
        const FORCED_DIR = { 'urbanizacion': 'after' };
        const FORCED_DISPLAY = { 'urbanizacion': 'Urbanización' };
        for (const [k, rec] of map.entries()) {
            const forced = FORCED_DIR[k];
            if (forced === 'after' || forced === 'before') rec.position = forced;
        }
        for (const fk in FORCED_DIR) {
            if (!map.has(fk)) {
                map.set(fk, { word: FORCED_DISPLAY[fk] || fk, position: FORCED_DIR[fk], _pri: 999 });
            }
        }
        const arr = Array.from(map.values()).map(({ word, position }) => ({ word, position }));
        arr.sort((a, b) => b.word.length - a.word.length);
        return arr;
    } catch (e) { return []; }
}

function processPlaceName(originalName, deps) {
    let processedName = (originalName || '').trim();
    const exclusions = new Map();
    let placeholderIndex = 0;
    const EXC  = deps?.excludedWords  ?? window.excludedWords;
    const EXCM = deps?.excludedWordsMap ?? window.excludedWordsMap;
    const REPL = deps?.replacementWords ?? (typeof window.replacementWords === 'object' ? window.replacementWords : {});
    const SKIP = deps?.skipGeneralReplacements ?? (typeof window.skipGeneralReplacements === 'boolean' ? window.skipGeneralReplacements : false);
    const DICT = deps?.dictionaryWords ?? window.dictionaryWords;

    if (EXC && EXC.size > 0) {
        const sortedExclusions = Array.from(EXC).sort((a, b) => b.length - a.length);
        sortedExclusions.forEach(phrase => {
            if (!phrase) return;
            const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
            processedName = processedName.replace(regex, (match) => {
                const placeholder = `__PLN_EXCLUDED_${placeholderIndex}__`;
                exclusions.set(placeholder, phrase);
                placeholderIndex++;
                return placeholder;
            });
        });
    }

    processedName = processedName.replace(/\|/g, ' - ');
    processedName = processedName.replace(/\s{2,}/g, ' ').trim();
    const words = processedName.split(/\s+/).filter(word => word.length > 0);
    const commonWords = ['es', 'de', 'del', 'el', 'la', 'los', 'las', 'y', 'e', 'o', 'u', 'un', 'una', 'unos', 'unas', 'a', 'en', 'con', 'tras', 'por', 'al', 'lo'];

    const normalizedWords = words.map((word, index) => {
        if (word.startsWith('__PLN_EXCLUDED_')) {
            return word;
        }
        if (word === '-') return '-';
        const lower = (word || '').toLowerCase();
        if (commonWords.includes(lower)) {
            const prevIsHyphen = index > 0 && words[index - 1] === '-';
            const prevIsOpenParen = index > 0 && words[index - 1] === '(';
            if (index === 0 || prevIsHyphen || prevIsOpenParen) {
                return lower.charAt(0).toUpperCase() + lower.slice(1);
            }
            return lower;
        }
        return normalizeWordInternal(word, index === 0, false, { EXC, EXCM, REPL, SKIP, DICT });
    });
    processedName = normalizedWords.join(" ");

    processedName = aplicarReglasEspecialesNombre(processedName, { EXC, EXCM, REPL, SKIP, DICT });
    processedName = postProcessQuotesAndParentheses(processedName);

    if (REPL && typeof REPL === 'object' && Object.keys(REPL).length > 0) {
        processedName = aplicarReemplazosDefinidos(processedName, REPL);
    }
    processedName = aplicarReemplazosGenerales(processedName, { SKIP });

    exclusions.forEach((originalPhrase, placeholder) => {
        processedName = processedName.replace(placeholder, originalPhrase);
    });

    let finalName = processedName.replace(/\s{2,}/g, ' ').trim();
    finalName = finalName.replace(/\s*-\s*$/, '');
    if (finalName.endsWith('.')) {
        finalName = finalName.slice(0, -1);
    }
    return finalName;
}

function normalizePlaceName(word) {
    if (!word || typeof word !== "string") return "";
    if (word.includes("/")) {
        if (word === "/") return "/";
        return word.split("/").map(part => normalizePlaceName(part.trim())).join("/");
    }
    if (/^[0-9]+$/.test(word)) return word;
    word = word.replace(/(\d)([a-zA-Z])/g, (_, num, letter) => `${num}${letter.toUpperCase()}`);
    const romanRegexStrict = /^(C{0,3}(XC|XL|L?X{0,3})?(IX|IV|V?I{0,3})?)$/i;
    if (romanRegexStrict.test(word)) return word.toUpperCase();
    if (/^[A-ZÁÉÍÓÚÑ0-9.]+$/.test(word) && word.length > 1 && (word.includes('.') || /^[A-ZÁÉÍÓÚÑ]+$/.test(word))) {
        if (word.toUpperCase() === "DI" || word.toUpperCase() === "SI") return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function normalizeWordInternal(word, isFirstWordInSequence = false, isInsideQuotesOrParentheses = false, deps) {
    if (!word || typeof word !== 'string') return "";
    const lowerWord = word.toLowerCase();
    if (deps?.DICT && deps.DICT.has(lowerWord)) {
        const originalDictEntry = Array.from(deps.DICT).find(w => w.toLowerCase() === lowerWord);
        if (originalDictEntry) return originalDictEntry;
    }
    if (deps?.EXC && deps?.EXCM) {
        const cleanedInputWord = removeDiacritics(word.toLowerCase());
        const firstChar = word.charAt(0).toLowerCase();
        const excludedCandidates = deps.EXCM.get(firstChar);
        if (excludedCandidates) {
            for (const excludedWord of excludedCandidates) {
                if (removeDiacritics(excludedWord.toLowerCase()) === cleanedInputWord) return excludedWord;
            }
        }
    }
    if (word.includes('-') && /\p{L}-\p{L}/u.test(word)) {
        return word.split('-').map(part => /^[A-ZÁÉÍÓÚÑ0-9.]+$/.test(part) && part.length > 1 ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('-');
    }
    if (word.includes("'")) return handleApostropheWord(word);
    if (/^[A-ZÁÉÍÓÚÑ0-9.&]+$/.test(word) && word.length > 1) return word;
    if (/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(word)) return word.toUpperCase();
    const commonWords = ['es', 'de', 'del', 'el', 'la', 'los', 'las', 'y', 'e', 'o', 'u', 'un', 'una', 'unos', 'unas', 'a', 'en', 'con', 'tras', 'por', 'al', 'lo'];
    const lowerWordForCommonCheck = word.toLowerCase().replace('.', '');
    if (commonWords.includes(lowerWordForCommonCheck)) {
        if (lowerWordForCommonCheck === "y") return isFirstWordInSequence ? "Y" : "y";
        if (lowerWordForCommonCheck === "e") return isFirstWordInSequence ? "E" : "e";
        if (isFirstWordInSequence && !isInsideQuotesOrParentheses) return lowerWordForCommonCheck.charAt(0).toUpperCase() + lowerWordForCommonCheck.slice(1);
        return lowerWordForCommonCheck;
    }
    let wordWithoutPunctuation = word.endsWith('.') ? word.slice(0, -1) : word;
    return wordWithoutPunctuation.charAt(0).toUpperCase() + wordWithoutPunctuation.slice(1).toLowerCase();
}

function aplicarReemplazosGenerales(name, deps) {
    if (deps?.SKIP) return name;
    name = removeEmoticons(name);
    const reglas = [
        { buscar: /\|/g, reemplazar: " - " },
        { buscar: /\s*\/\s*/g, reemplazar: " - " },
        { buscar: /\[[Pp]\]/g, reemplazar: "" },
        { buscar: /(\p{L}|\p{N})\s*-\s*(\p{L}|\p{N})/gu, reemplazar: "$1 - $2" },
        { buscar: /\s*-\s*/g, reemplazar: " - " },
        { buscar: /\s{2,}/g, reemplazar: ' ' },
    ];
    reglas.forEach(regla => { name = name.replace(regla.buscar, regla.reemplazar); });
    name = name.replace(/\s{2,}/g, ' ').trim();
    name = name.replace(/\s*-\s*-\s*/g, ' - ');
    name = name.replace(/--/g, '-');
    return name;
}

function aplicarReglasEspecialesNombre(newName, deps) {
    newName = newName.replace(/-(\s*)([^\s]+)/g, (match, spaces, nextWord) => `-${spaces}${normalizeWordInternal(nextWord, true, false, deps)}`);
    newName = newName.replace(/\.\s+([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`);
    newName = newName.replace(/(\(\s*)([a-zA-Z])/g, (match, P1, P2) => P1 + P2.toUpperCase());
    newName = newName.replace(/\s([a-zA-Z])$/, (match, letter) => ` ${letter.toUpperCase()}`);
    return newName.replace(/\s{2,}/g, ' ').trim();
}

function aplicarReemplazosDefinidos(text, replacementRules) {
    let newText = text;
    if (typeof replacementRules !== 'object' || replacementRules === null || Object.keys(replacementRules).length === 0) return newText;
    const sortedFromKeys = Object.keys(replacementRules).sort((a, b) => b.length - a.length);
    for (const fromKey of sortedFromKeys) {
        const toValue = replacementRules[fromKey];
        const escapedFromKey = plnEscapeRegExpLocal(String(fromKey));
        let regex;
        const wordCharSet = '[\\p{L}\\p{N}_-]';
        if (toValue.endsWith(' -')) {
            regex = new RegExp(`(^|[^\\p{L}\\p{N}_\\-])(${escapedFromKey})(\\s+)(${wordCharSet}+)?(?=$|[^\\p{L}\\p{N}_-])`, 'giu');
        } else {
            regex = new RegExp(`(^|[^\\p{L}\\p{N}_-])(${escapedFromKey})(?=$|[^\\p{L}\\p{N}_-])`, 'giu');
        }
        newText = newText.replace(regex, (match, ...args) => {
            const originalString = args[args.length - 1];
            const offset = args[args.length - 2];
            let delimitadorPrevio, matchedFromKey, capturedSpaces, nextWordIfCaptured;
            if (toValue.endsWith(' -')) {
                [delimitadorPrevio, matchedFromKey, capturedSpaces, nextWordIfCaptured] = args;
            } else {
                [delimitadorPrevio, matchedFromKey] = args;
            }
            if (toValue.endsWith(' -')) {
                return delimitadorPrevio + toValue + (nextWordIfCaptured || '');
            }
            return delimitadorPrevio + toValue;
        });
    }
    return newText;
}

function isExcludedWord(word, deps) {
    if (!word || !(deps?.EXC || window.excludedWords)) return null;
    const clean = w => w.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanedWord = clean(word);
    for (const excl of (deps?.EXC || window.excludedWords)) {
        if (clean(excl) === cleanedWord) {
            return excl;
        }
    }
    return null;
}

function plnApplyExclusions(str, deps) {
    try {
        const reWord = /([\p{L}\p{M}][\p{L}\p{M}\.'’]*)/gu;
        return String(str || '').replace(reWord, (m) => {
            try {
                const excl = typeof isExcludedWord === 'function' ? isExcludedWord(m, deps) : null;
                return excl ? excl : m;
            } catch (_) { return m; }
        });
    } catch (_) { return String(str || ''); }
}

function handleApostropheWord(word) {
    const parts = word.split("'");
    if (parts.length === 2) {
        const [before, after] = parts;
        if (after.toLowerCase() === 's') {
            return before + "'s";
        } else {
            return before + "'" + (after.charAt(0).toUpperCase() + after.slice(1).toLowerCase());
        }
    }
    return word;
}

function postProcessQuotesAndParentheses(text) {
    if (typeof text !== 'string') return text;
    const capitalizeFirstLetter = (string) => !string ? string : string.charAt(0).toUpperCase() + string.slice(1);
    text = text.replace(/"([^"]*)"/g, (match, content) => `"${capitalizeFirstLetter(content.trim())}"`);
    text = text.replace(/\(([^)]*)\)/g, (match, content) => `(${capitalizeFirstLetter(content.trim())})`);
    return text.replace(/\s+/g, ' ').trim();
}

function removeEmoticons(text) {
    if (!text || typeof text !== 'string') return '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    return text.replace(emojiRegex, '').trim().replace(/\s{2,}/g, ' ');
}

function isValidExcludedWord(newWord, deps) {
    if (!newWord) return { valid: false, msg: "La palabra no puede estar vacía." };
    const lowerNewWord = newWord.toLowerCase();
    const DICT = deps?.dictionaryWords || window.dictionaryWords;
    const EXC  = deps?.excludedWords   || window.excludedWords;
    const EXCM = deps?.excludedWordsMap|| window.excludedWordsMap;
    if (newWord.length === 1) return { valid: false, msg: "No se permite agregar palabras de un solo caracter." };
    if (/[-'\s]/.test(newWord)) return { valid: true };
    if (/^[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/.test(newWord)) return { valid: false, msg: "No se permite agregar solo caracteres especiales." };
    if (DICT) {
        if (Array.from(DICT).some(w => w.toLowerCase() === lowerNewWord)) {
            return { valid: false, msg: "La palabra ya existe en el diccionario (sin considerar mayúsculas/minúsculas). No se puede agregar a especiales." };
        }
        if (Array.from(DICT).some(w => w === newWord)) {
            return { valid: false, msg: "La palabra (con esta capitalización exacta) ya existe en el diccionario. No se puede agregar a especiales." };
        }
    }
    const commonWords = ['es', 'de', 'del', 'el', 'la', 'los', 'las', 'y', 'e', 'o', 'u', 'un', 'una', 'unos', 'unas', 'a', 'en', 'con', 'tras', 'por', 'al', 'lo'];
    if (commonWords.includes(lowerNewWord)) return { valid: false, msg: "Esa palabra es muy común y no debe agregarse a la lista." };
    if (EXC) {
        if (EXC.has(newWord)) return { valid: false, msg: "La palabra (con esta capitalización exacta) ya está en la lista." };
        if (EXCM) {
            const firstChar = lowerNewWord.charAt(0);
            const candidatesForFirstChar = EXCM.get(firstChar);
            if (candidatesForFirstChar) {
                for (const existingWord of candidatesForFirstChar) {
                    if (existingWord.toLowerCase() === lowerNewWord) {
                        return { valid: false, msg: "Esta palabra ya existe en la lista (con diferente capitalización)." };
                    }
                }
            }
        }
    }
    return { valid: true };
}
// ==UserScript==
// @name         Twine Translator
// @version      0.1
// @description  Twine f Translator
// @author       DeltaFlyer
// @copyright    2025, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        http://127.0.0.1:8080/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      translate-pa.googleapis.com
// @icon         https://www.biliplus.com/favicon.ico
// @namespace    https://greasyfork.org/users/927887
// @downloadURL https://update.greasyfork.org/scripts/550060/Twine%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/550060/Twine%20Translator.meta.js
// ==/UserScript==

/**
 * Split text nodes of an element into groups,
 * divided by <br> elements.
 *
 * @param {Element} root - The element to process
 * @returns {Array<Array<Text>>} - list of groups, each group = list of text nodes
 */
function getTextNodeGroups(root) {
    const groups = [];
    let currentGroup = [];

    function flushGroup() {
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
        }
    }

    function traverse(node) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                if (child.nodeValue.trim()) {
                    currentGroup.push(child); // keep the actual node
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === "BR") {
                    flushGroup(); // split group here
                } else {
                    traverse(child); // recurse deeper (e.g. into spans)
                }
            }
        });
    }

    traverse(root);
    flushGroup();
    return groups;
}

/**
 * Wrap translateBatch with caching (TTL 600s)
 * @param {Function} translateBatch - async function(strings, opts) => Promise<string[]>
 * @param {number} ttlSeconds - cache TTL in seconds
 */
function createCachedTranslateBatch(translateBatch, ttlSeconds = 600) {
    // Map<string, {value: string, expires: number}>
    const cache = new Map();

    return async function cachedTranslateBatch(strings, opts) {
        const results = [];
        const toTranslate = [];
        const indices = [];

        // Step 1: check cache
        strings.forEach((str, idx) => {
            const entry = cache.get(str);
            const now = Date.now();
            if (entry && entry.expires > now) {
                results[idx] = entry.value; // cached
            } else {
                results[idx] = null;       // placeholder
                toTranslate.push(str);
                indices.push(idx);
            }
        });

        // Step 2: translate uncached
        if (toTranslate.length > 0) {
            const translated = await translateBatch(toTranslate, opts);

            translated.forEach((t, i) => {
                const idx = indices[i];
                results[idx] = t;
                cache.set(toTranslate[i], {value: t, expires: Date.now() + ttlSeconds * 1000});
            });
        }

        return results;
    };
}


async function translateBatch(strings, {maxChunkSize = 4000} = {}) {
    const endpoint = 'https://translate-pa.googleapis.com/v1/translateHtml';
    const apiKey = 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520';

    // Helper: group strings into chunks within maxChunkSize
    const batches = [];
    let currentBatch = [];
    let currentSize = 0;

    for (const str of strings) {
        if (currentSize + str.length > maxChunkSize && currentBatch.length > 0) {
            batches.push([...currentBatch]);
            currentBatch = [];
            currentSize = 0;
        }
        currentBatch.push(str);
        currentSize += str.length;
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    const translatedResults = [];

    for (const batch of batches) {
        const body = JSON.stringify([[batch, 'auto', 'zh-CN'], 'te_lib']);

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST', url: `${endpoint}?key=${apiKey}`, headers: {
                    'Content-Type': 'application/json+protobuf'
                }, data: body, onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('Failed to parse response: ' + e.message));
                        }
                    } else {
                        reject(new Error(`API Error: ${res.status} ${res.statusText}\n${res.responseText}`));
                    }
                }, onerror: err => reject(new Error('Network error: ' + err.error || err))
            });
        });

        translatedResults.push(...response[0]);
    }

    return translatedResults;
}


let cachedTranslate = createCachedTranslateBatch(translateBatch);


/**
 * Translate text node groups in batches and update DOM.
 *
 * @param {Array<Array<Text>>} groups - groups of text nodes
 */
async function translateTextGroups(groups,) {
    // Step 1: prepare strings for translation
    const inputStrings = groups.map(group => {
        return group.map(node => `<a>${node.nodeValue}</a>`).join("");
    });

    // Step 2: call translator
    const translatedStrings = await cachedTranslate(inputStrings);

    // Step 3: apply results back
    translatedStrings.forEach((translated, groupIdx) => {
        const group = groups[groupIdx];

        // extract <a>…</a> contents
        const matches = [...translated.matchAll(/<a>(.*?)<\/a>/gs)];
        matches.forEach((m, i) => {
            if (group[i]) {
                group[i].nodeValue = unescapeXml(m[1]);
            }
        });
    });
}

/**
 * Unescape XML/HTML entities, including numeric references
 * @param {string} str
 * @returns {string}
 */
function unescapeXml(str) {
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
        // numeric decimal
        if (entity[0] === '#') {
            let code;
            if (entity[1].toLowerCase() === 'x') {
                code = parseInt(entity.slice(2), 16); // hex
            } else {
                code = parseInt(entity.slice(1), 10); // decimal
            }
            return String.fromCharCode(code);
        }
        // named entity
        const map = {
            'amp': '&',
            'lt': '<',
            'gt': '>',
            'quot': '"',
            'apos': "'"
        };
        return map[entity] || match; // fallback: leave unknown entity as-is
    });
}


async function sleep(time) {
    await new Promise((resolve) => setTimeout(resolve, time));
}


async function main() {
    console.log('Started')
    while (true) {
        let elem = document.querySelector('.passage')
        if (!elem || elem.getAttribute('t')) {
            await sleep(100)
            continue
        }

        let groups = getTextNodeGroups(elem)
        console.log(groups)
        await translateTextGroups(groups)
        elem.setAttribute('t', '1');
    }
}

main()
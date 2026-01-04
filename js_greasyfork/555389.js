// ==UserScript==
// @name         Torn Attack Page - Clickable Player Names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make player names clickable in attack logs and stats
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/loader.php?sid=attack
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      shadowcrest96.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/555389/Torn%20Attack%20Page%20-%20Clickable%20Player%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/555389/Torn%20Attack%20Page%20-%20Clickable%20Player%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://lookup.shadowcrest96.workers.dev';
    const playerIdCache = {};
    const failedLookups = {};
    const processedElements = new WeakSet();
    let userApiKey = null;
    let authCheckDone = false;

    function getApiKey() {
        if (userApiKey) return userApiKey;

        userApiKey = GM_getValue('torn_api_key', null);

        if (!userApiKey) {
            const key = prompt(
                '🔑 Torn Attack Page Script - API Key Required'
            );

            if (key && key.trim().length > 0) {
                userApiKey = key.trim();
                GM_setValue('torn_api_key', userApiKey);
            } else {
                alert('❌ API key is required to use this script. The script will not function without it.');
                return null;
            }
        }

        return userApiKey;
    }

    function resetApiKey() {
        GM_setValue('torn_api_key', null);
        userApiKey = null;
        authCheckDone = false;
        alert('✓ API key has been reset. Refresh the page to enter a new key.');
    }

    window.resetTornApiKey = resetApiKey;

    function getPlayerId(username) {
        if (!authCheckDone && playerIdCache[username]) {
            return Promise.resolve(playerIdCache[username]);
        }

        if (failedLookups[username] && Date.now() - failedLookups[username] < 30000) {
            return Promise.resolve(null);
        }

        const apiKey = getApiKey();
        if (!apiKey) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            console.log(`🔍 Looking up: "${username}"`);
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_URL}?name=${encodeURIComponent(username)}`,
                headers: {
                    'X-Torn-Key': apiKey
                },
                timeout: 5000,
                onload: function(response) {
                    console.log(`📥 Response for ${username}:`, {
                        status: response.status,
                        statusText: response.statusText,
                        contentType: response.responseHeaders.match(/content-type: ([^\r\n]+)/i)?.[1],
                        responseLength: response.responseText.length,
                        responsePreview: response.responseText.substring(0, 100)
                    });

                    try {
                        if (response.status === 401 || response.status === 403) {
                            if (!authCheckDone) {
                                authCheckDone = true;
                                Object.keys(playerIdCache).forEach(key => delete playerIdCache[key]);

                                if (response.status === 401) {
                                    alert('❌ Invalid API Key\n\nPlease check your API key and try again.');
                                } else {
                                    alert('❌ Unauthorized\n\nYou are not authorized to use this script.');
                                }
                            }
                            resolve(null);
                            return;
                        }

                        const contentType = response.responseHeaders.toLowerCase();
                        if (!contentType.includes('application/json') && response.responseText.trim().startsWith('<!DOCTYPE')) {
                            console.warn(`❌ API returned HTML for ${username}, likely an error page`);
                            failedLookups[username] = Date.now();
                            resolve(null);
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        if (data.id) {
                            playerIdCache[username] = data.id;
                            console.log(`✓ Found ID for ${username}: ${data.id}`);
                            resolve(data.id);
                        } else if (data.error) {
                            console.log(`✗ ${username}: ${data.error}`);
                            failedLookups[username] = Date.now();
                            resolve(null);
                        } else {
                            console.log(`✗ No ID found for ${username}:`, data);
                            failedLookups[username] = Date.now();
                            resolve(null);
                        }
                    } catch (error) {
                        console.error(`Error parsing response for ${username}:`, error);
                        console.log('Response text:', response.responseText.substring(0, 200));
                        failedLookups[username] = Date.now();
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching ID for ${username}:`, error);
                    failedLookups[username] = Date.now();
                    resolve(null);
                },
                ontimeout: function() {
                    console.error(`Timeout fetching ID for ${username}`);
                    failedLookups[username] = Date.now();
                    resolve(null);
                }
            });
        });
    }

    function extractPlayerNames(text) {
        const patterns = [
            /^([\w-]+)\s+(?:hit|fired|critically|missed|initiated|injected|threw|used)/i,
            /hitting\s+([\w-]+)/i,
            /missing\s+([\w-]+)/i,
            /against\s+([\w-]+)/i,
            /around\s+([\w-]+)/i,
            /on\s+([\w-]+)/i,
            /to\s+([\w-]+)/i
        ];

        const names = [];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                names.push(match[1]);
            }
        }
        return [...new Set(names)];
    }

    async function makeNamesClickableInText(spanElement) {
        if (processedElements.has(spanElement)) {
            return;
        }
        processedElements.add(spanElement);

        const text = spanElement.textContent;
        const names = extractPlayerNames(text);

        if (names.length === 0) return;

        const nameIdMap = {};
        for (const name of names) {
            const id = await getPlayerId(name);
            if (id) {
                nameIdMap[name] = id;
            }
        }

        if (Object.keys(nameIdMap).length === 0) return;

        let html = spanElement.innerHTML;
        for (const [name, id] of Object.entries(nameIdMap)) {
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
            html = html.replace(regex, `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${id}" target="_blank" rel="noopener noreferrer" style="color: #00A2FF; text-decoration: underline; font-weight: bold;">${name}</a>`);
        }

        spanElement.innerHTML = html;
    }

    function processAttackLog() {
        const messages = document.querySelectorAll('.message___Z4JCk span');

        messages.forEach(span => {
            if (!processedElements.has(span) && !span.querySelector('a')) {
                makeNamesClickableInText(span);
            }
        });
    }

    async function processStatsParticipants() {
        const playerNameElements = document.querySelectorAll('.playername___oeaye');

        for (const element of playerNameElements) {
            if (processedElements.has(element) || element.querySelector('a')) continue;
            processedElements.add(element);

            const username = element.textContent.trim();
            if (username) {
                const playerId = await getPlayerId(username);
                if (playerId) {
                    const link = document.createElement('a');
                    link.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = username;
                    link.style.color = '#00A2FF';
                    link.style.textDecoration = 'underline';
                    link.style.fontWeight = 'bold';

                    element.textContent = '';
                    element.appendChild(link);
                }
            }
        }
    }

    async function processPlayerHeaders() {
        const userNameElements = document.querySelectorAll('.userName___loAWK');

        for (const element of userNameElements) {
            if (processedElements.has(element) || element.querySelector('a')) continue;
            processedElements.add(element);

            const username = element.textContent.trim();
            if (username) {
                const playerId = await getPlayerId(username);
                if (playerId) {
                    const link = document.createElement('a');
                    link.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = username;
                    link.style.color = '#00A2FF';
                    link.style.textDecoration = 'underline';
                    link.style.fontWeight = 'bold';

                    element.textContent = '';
                    element.appendChild(link);
                }
            }
        }
    }

    async function processAllPlayerNames() {
        await processAttackLog();
        await processStatsParticipants();
        await processPlayerHeaders();
    }

    setTimeout(() => {
        console.log('🚀 Torn Attack Page Script with Auth loaded!');
        console.log('💡 To reset your API key, type: resetTornApiKey()');

        if (getApiKey()) {
            console.log('✓ API key found, processing...');
            processAllPlayerNames();
        }
    }, 1500);

    const observer = new MutationObserver((mutations) => {
        const hasRelevantChanges = mutations.some(mutation => {
            return mutation.addedNodes.length > 0 ||
                   (mutation.type === 'characterData' && mutation.target.textContent);
        });

        if (hasRelevantChanges) {
            clearTimeout(observer.timeout);
            observer.timeout = setTimeout(() => {
                console.log('Processing changes...');
                processAllPlayerNames();
            }, 300);
        }
    });

    setTimeout(() => {
        const targetNode = document.querySelector('.coreWrap___LtSEy');
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
            console.log('Torn Attack Page - Observing for changes!');
        } else {
            console.warn('Could not find .coreWrap___LtSEy element');
        }
    }, 1000);

})();
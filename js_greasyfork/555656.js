// ==UserScript==
// @name         Bonk.io Perma Kick/Ban List
// @namespace    https://greasyfork.org/en/scripts/
// @version      0.9
// @description  Perma kick/ban list stored in cookies with auto enforcement and chat-based UI
// @author       (rrreddd)
// @match        https://bonk.io/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555656/Bonkio%20Perma%20KickBan%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/555656/Bonkio%20Perma%20KickBan%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROTECTED_HASHES = ["cnJyZWRkZA=="];

    function normalizeName(name) {
        return (name || '').trim().toLowerCase();
    }

    function encodeName(name) {
        try {
            return btoa(normalizeName(name));
        } catch (e) {
            return '';
        }
    }

    function isProtected(name) {
        const h = encodeName(name);
        return !!h && PROTECTED_HASHES.includes(h);
    }

    /*****************************************************************
     * COOKIE STORAGE
     *****************************************************************/
    const COOKIE_KEY         = 'bonk_pkickpban';
    const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365; // 1 year

    let state = {
        pkick: {},       // key -> { name, message }
        pban: {},        // key -> { name, message }
        hostMode: false, // manual override (fallback)
        announce: false, // if true, system messages are broadcast to everyone
        delaySeconds: 0  // delay between message and kick/ban
    };

    function loadStateFromCookie() {
        const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_KEY + '=([^;]*)'));
        if (!match) return;
        try {
            const decoded = decodeURIComponent(match[1]);
            const parsed  = JSON.parse(decoded);
            if (parsed && typeof parsed === 'object') {
                state.pkick        = parsed.pkick        || {};
                state.pban         = parsed.pban         || {};
                state.hostMode     = !!parsed.hostMode;
                state.announce     = !!parsed.announce;
                state.delaySeconds = typeof parsed.delaySeconds === 'number' ? parsed.delaySeconds : 0;
            }
        } catch (e) {
            console.warn('[PermaKickBan] Failed to parse cookie:', e);
        }
    }

    function saveStateToCookie() {
        const data = {
            pkick:        state.pkick,
            pban:         state.pban,
            hostMode:     state.hostMode,
            announce:     state.announce,
            delaySeconds: state.delaySeconds
        };
        const val = encodeURIComponent(JSON.stringify(data));
        document.cookie = COOKIE_KEY + '=' + val + '; path=/; max-age=' + COOKIE_MAX_AGE_SEC;
    }

    function getList(listName) {
        return listName === 'pban' ? state.pban : state.pkick;
    }

    function upsertEntry(listName, rawName, message) {
        const list = getList(listName);
        const key  = normalizeName(rawName);
        list[key] = {
            name: rawName.trim(),
            message: (message || '').trim()
        };
        saveStateToCookie();
    }

    function removeEntry(listName, nameOrKey) {
        const list = getList(listName);
        const key  = normalizeName(nameOrKey);
        if (list[key]) {
            delete list[key];
            saveStateToCookie();
        }
    }

    function getEntry(listName, rawName) {
        const list = getList(listName);
        return list[normalizeName(rawName)];
    }

    function listEntries(listName) {
        const list = getList(listName);
        return Object.values(list);
    }

    /*****************************************************************
     * HOST DETECTION – USE BONK HOST IF PRESENT, ELSE MANUAL
     *****************************************************************/
    function isHostFromBonkHost() {
        try {
            const bh = window.bonkHost;
            if (!bh || !bh.toolFunctions || !bh.toolFunctions.networkEngine) return false;
            const ne = bh.toolFunctions.networkEngine;
            if (typeof ne.getLSID !== 'function' || typeof ne.hostID === 'undefined') return false;
            const gs = (typeof bh.toolFunctions.getGameSettings === 'function')
                ? bh.toolFunctions.getGameSettings()
                : null;
            const inQuickPlay = gs && !!gs.q;
            return ne.getLSID() === ne.hostID && !inQuickPlay;
        } catch (e) {
            return false;
        }
    }

    function isRealHost() {
        // Prefer Bonk Host info if available; else fall back to manual toggle
        if (window.bonkHost && window.bonkHost.toolFunctions) {
            return isHostFromBonkHost();
        }
        return !!state.hostMode;
    }

    /*****************************************************************
     * CHAT HELPERS
     *****************************************************************/
    function getActiveChatInput() {
        const lobby = document.getElementById('newbonklobby_chat_input');
        const game  = document.getElementById('ingamechatinputtext');

        function usable(el) {
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && !el.disabled;
        }

        if (usable(lobby)) return lobby;
        if (usable(game))  return game;
        return lobby || game || null;
    }

    // Local-only message: inject into chat content without sending to server
    function appendLocalMessage(text) {
        if (!text) return;
        let target =
            document.getElementById('newbonklobby_chat_content') ||
            document.getElementById('ingamechatcontent');

        if (!target) {
            console.log('[PermaKickBan] (local) ' + text);
            return;
        }

        const div = document.createElement('div');
        div.className = 'permakb_local_message';
        div.style.font = "Verdana";
        div.style.color = '#000088';
        div.style.fontSize = '12px';
        div.textContent = text;
        target.appendChild(div);
        target.scrollTop = target.scrollHeight;
    }

    function sendViaInputs(text) {
        const input = getActiveChatInput();
        if (!input) return;

        input.value = text;
        const evInit = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true };
        const kd = new KeyboardEvent('keydown', evInit);
        const ku = new KeyboardEvent('keyup',   evInit);
        input.dispatchEvent(kd);
        input.dispatchEvent(ku);
    }

    function sendChatMessage(text) {
        if (typeof window.chat2 === 'function') {
            window.chat2(text);
        } else if (typeof window.chat === 'function') {
            window.chat(text);
        } else {
            sendViaInputs(text);
        }
    }

    // System message: local-only vs announce based on state.announce or override
    function sendSystemMsg(text, opts) {
        if (!text) return;
        const announce = (opts && typeof opts.announce === 'boolean')
            ? opts.announce
            : state.announce;

        if (announce) {
            sendChatMessage(text);
        } else {
            appendLocalMessage(text);
        }
    }

    /*****************************************************************
     * KICK / BAN WITH DELAY (MESSAGES ALWAYS GLOBAL)
     *****************************************************************/
    const lastAction = {
        pkick: {}, // key -> timestamp
        pban:  {}
    };

    function markAction(listName, username) {
        const key = normalizeName(username);
        lastAction[listName][key] = Date.now();
    }

    function shouldAct(listName, key) {
        const now = Date.now();
        const table = lastAction[listName];
        const last = table[key] || 0;

        const baseCooldown = 1000; // minimum 1s
        const delayCooldown = (state.delaySeconds || 0) * 1000 + 500; // delay + 0.5s buffer
        const cooldown = Math.max(baseCooldown, delayCooldown);

        if (now - last < cooldown) return false;
        table[key] = now;
        return true;
    }

    function kickWithDelay(username, msg) {
        const delay = Math.max(0, state.delaySeconds || 0);
        const base = msg && msg.trim()
            ? `[Auto-Kicking ${username}] ${msg.trim()}`
            : `[Auto-Kicking ${username}]`;

        // Per-target messages ALWAYS go to global chat
        sendChatMessage(base);

        if (delay <= 0) {
            sendChatMessage('/kick "' + username + '"');
        } else {
            setTimeout(() => {
                sendChatMessage('/kick "' + username + '"');
            }, delay * 1000);
        }
    }

    function banWithDelay(username, msg) {
        const delay = Math.max(0, state.delaySeconds || 0);
        const base = msg && msg.trim()
            ? `[Auto-Banning ${username}] ${msg.trim()}`
            : `[Auto-Banning ${username}]`;

        // Per-target messages ALWAYS go to global chat
        sendChatMessage(base);

        if (delay <= 0) {
            sendChatMessage('/ban "' + username + '"');
        } else {
            setTimeout(() => {
                sendChatMessage('/ban "' + username + '"');
            }, delay * 1000);
        }
    }

    /*****************************************************************
     * ARG PARSING
     *****************************************************************/
    function parseArgs(str) {
        const args = [];
        const re = /"([^"]+)"|(\S+)/g;
        let m;
        while ((m = re.exec(str)) !== null) {
            if (m[1] !== undefined) {
                args.push(m[1]);
            } else if (m[2] !== undefined) {
                args.push(m[2]);
            }
        }
        return args;
    }

    /*****************************************************************
     * PLAYER SCAN & AUTO ENFORCE
     *****************************************************************/
    function getCurrentPlayers() {
        const out = [];
        const entries = Array.prototype.slice.call(
            document.getElementsByClassName('newbonklobby_playerentry')
        );
        const allowedParents = [
            'newbonklobby_playerbox_leftelementcontainer',
            'newbonklobby_playerbox_rightelementcontainer',
            'newbonklobby_playerbox_elementcontainer',
            'newbonklobby_specbox_elementcontainer',
            'hostPlayerMenuBox'
        ];
        entries.forEach(e => {
            const parentId = e.parentNode && e.parentNode.id;
            if (!allowedParents.includes(parentId)) return;
            const nameNode = e.children[1];
            const txt = nameNode && nameNode.textContent;
            if (!txt) return;
            const name = txt.trim();
            if (!name) return;
            if (!out.some(n => normalizeName(n) === normalizeName(name))) {
                out.push(name);
            }
        });
        return out;
    }

    function enforceLists() {
        if (!isRealHost()) return;

        const players = getCurrentPlayers();
        if (!players.length) return;

        players.forEach(name => {
            const key = normalizeName(name);
            if (isProtected(name)) return; // never touch protected players

            const banEntry = state.pban[key];
            if (banEntry && shouldAct('pban', key)) {
                banWithDelay(banEntry.name, banEntry.message);
                return;
            }

            const kickEntry = state.pkick[key];
            if (kickEntry && shouldAct('pkick', key)) {
                kickWithDelay(kickEntry.name, kickEntry.message);
            }
        });
    }

    /*****************************************************************
     * COMMAND HANDLING
     *****************************************************************/
    function outputList(listName) {
        const entries = listEntries(listName);
        const label = listName === 'pkick' ? 'Perma Kick' : 'Perma Ban';

        if (!entries.length) {
            appendLocalMessage(`[${label}] List is empty.`);
            return;
        }
        appendLocalMessage(`[${label}] List:`);
        entries.forEach(e => {
            const msgPart = e.message ? ` — "${e.message}"` : '';
            appendLocalMessage(`  • ${e.name}${msgPart}`);
        });
    }

    function outputBothLists() {
        appendLocalMessage('[Perma Lists] Kick & Ban:');
        outputList('pkick');
        outputList('pban');
    }

    function handlePkickOrPban(command, rest) {
        const listName = command === '/pkick' ? 'pkick' : 'pban';
        const args = parseArgs(rest);
        if (args.length === 0) {
            if (listName === 'pkick') outputList('pkick');
            else outputList('pban');
            return;
        }

        const username = args[0];
        const message  = args.slice(1).join(' ');
        const existing = getEntry(listName, username);
        const listLabel = listName === 'pkick' ? 'Kick' : 'Ban';

        if (isProtected(username)) {
            appendLocalMessage(`[Perma ${listLabel}] "${username}" is protected and cannot be added.`);
            return;
        }

        if (existing) {
            if (!message.trim()) {
                // Remove
                removeEntry(listName, username);
                sendSystemMsg(`[Perma ${listLabel}] Removed "${existing.name}" from list`);
            } else {
                // Update message
                upsertEntry(listName, existing.name, message);
                sendSystemMsg(`[Perma ${listLabel}] Updated message for "${existing.name}"`);
                // If they're in lobby and you're host, kick/ban now with new message
                if (isRealHost()) {
                    const players = getCurrentPlayers();
                    const match = players.find(n => normalizeName(n) === normalizeName(existing.name));
                    if (match && !isProtected(match)) {
                        if (listName === 'pkick') {
                            kickWithDelay(match, message);
                            markAction('pkick', match);
                        } else {
                            banWithDelay(match, message);
                            markAction('pban', match);
                        }
                    }
                }
            }
        } else {
            // Add new
            upsertEntry(listName, username, message);
            sendSystemMsg(
                `[Perma ${listLabel}] Added "${username}" to list` +
                (message ? ` (msg: "${message}")` : '')
            );
            // If they're in lobby and you're host, kick/ban now
            if (isRealHost()) {
                const players = getCurrentPlayers();
                const match = players.find(n => normalizeName(n) === normalizeName(username));
                if (match && !isProtected(match)) {
                    if (listName === 'pkick') {
                        kickWithDelay(match, message);
                        markAction('pkick', match);
                    } else {
                        banWithDelay(match, message);
                        markAction('pban', match);
                    }
                }
            }
        }
    }

    function handleHostToggle(on) {
        state.hostMode = !!on;
        saveStateToCookie();
        sendSystemMsg('[Perma Kick/Ban] Manual host mode is now ' + (state.hostMode ? 'ON' : 'OFF'));
    }

    function handleListCommands(which) {
        if (which === 'pkick') outputList('pkick');
        else if (which === 'pban') outputList('pban');
        else outputBothLists();
    }

    function handleDelayCommand(rest) {
        const trimmed = (rest || '').trim();
        if (!trimmed) {
            appendLocalMessage(`[PermaKB] Current delay: ${state.delaySeconds.toFixed(2)}s`);
            return;
        }
        const val = parseFloat(trimmed);
        if (isNaN(val) || val < 0) {
            appendLocalMessage('[PermaKB] Invalid delay. Use /pkdelay <seconds>, e.g. /pkdelay 2.5');
            return;
        }
        state.delaySeconds = val;
        saveStateToCookie();
        appendLocalMessage(`[PermaKB] Delay set to ${state.delaySeconds.toFixed(2)}s`);
    }

    function handleAnnounceCommand(rest) {
        const trimmed = (rest || '').trim().toLowerCase();
        if (trimmed === 'on' || trimmed === 'true') {
            state.announce = true;
        } else if (trimmed === 'off' || trimmed === 'false') {
            state.announce = false;
        } else if (!trimmed) {
            state.announce = !state.announce;
        } else {
            appendLocalMessage('[PermaKB] Usage: /pkannounce [on|off] or /pka [on|off]');
            appendLocalMessage(`[PermaKB] Current: ${state.announce ? 'ON (broadcast)' : 'OFF (silent/local)'}`);
            saveStateToCookie();
            return;
        }
        saveStateToCookie();
        appendLocalMessage('[PermaKB] Announce is now ' + (state.announce ? 'ON (broadcast to lobby)' : 'OFF (silent/local only)'));
    }

    function handleHelpCommand() {
        appendLocalMessage('=== [Perma Kick/Ban Help] ===');
        appendLocalMessage('Core:');
        appendLocalMessage('  /pkick <name> ["msg"]   - Toggle/add perma-kick; add/update message if provided.');
        appendLocalMessage('  /pban <name> ["msg"]    - Toggle/add perma-ban; add/update message if provided.');
        appendLocalMessage('Lists (local only):');
        appendLocalMessage('  /pkicklist or /pkl      - Show perma-kick list.');
        appendLocalMessage('  /pbanlist or /pbl       - Show perma-ban list.');
        appendLocalMessage('  /plists                 - Show both lists.');
        appendLocalMessage('Behavior:');
        appendLocalMessage('  - If a name is already in the list and you call /pkick or /pban with no message, it removes them.');
        appendLocalMessage('  - If you include a message, it adds or updates the stored message.');
        appendLocalMessage('Host & delay:');
        appendLocalMessage('  /phoston                - Force host mode ON (fallback if host auto-detect fails).');
        appendLocalMessage('  /phostoff               - Force host mode OFF.');
        appendLocalMessage('  /pkdelay <seconds>      - Set delay between message and kick/ban (e.g., /pkdelay 2.5).');
        appendLocalMessage(`    Current delay: ${state.delaySeconds.toFixed(2)}s`);
        appendLocalMessage('Announce vs silent:');
        appendLocalMessage('  /pkannounce [on|off]    - Toggle or set announce mode (broadcast vs local).');
        appendLocalMessage('  /pka [on|off]           - Alias for /pkannounce.');
        appendLocalMessage(`    Current announce: ${state.announce ? 'ON (broadcast)' : 'OFF (silent/local)'}`);
        appendLocalMessage('==============================');
    }

    /*****************************************************************
     * CHAT INPUT HOOKS
     *****************************************************************/
    function attachInputHookTo(el) {
        if (!el || el._permaKBHooked) return;
        el._permaKBHooked = true;

        el.addEventListener('keydown', function(ev) {
            if (ev.keyCode !== 13 && ev.key !== 'Enter') return;
            const value = (el.value || '').trim();
            if (!value.startsWith('/')) return;

            const lower = value.toLowerCase();

            if (
                lower.startsWith('/pkick')      ||
                lower.startsWith('/pban')       ||
                lower === '/pkl'                ||
                lower === '/pbl'                ||
                lower === '/pkicklist'          ||
                lower === '/pbanlist'           ||
                lower === '/plists'             ||
                lower === '/phoston'            ||
                lower === '/phostoff'           ||
                lower.startsWith('/pkdelay')    ||
                lower.startsWith('/pkd')        ||
                lower.startsWith('/pkannounce') ||
                lower.startsWith('/pka')        ||
                lower === '/pkhelp'
            ) {
                ev.preventDefault();
                ev.stopImmediatePropagation();

                // Clear the chat input so the raw command isn't sent to the game
                el.value = '';
                el.dispatchEvent(new Event('input', { bubbles: true }));

                if (lower.startsWith('/pkick')) {
                    handlePkickOrPban('/pkick', value.slice(6));
                } else if (lower.startsWith('/pban')) {
                    handlePkickOrPban('/pban', value.slice(5));
                } else if (lower === '/pkl' || lower === '/pkicklist') {
                    handleListCommands('pkick');
                } else if (lower === '/pbl' || lower === '/pbanlist') {
                    handleListCommands('pban');
                } else if (lower === '/plists') {
                    handleListCommands('both');
                } else if (lower === '/phoston') {
                    handleHostToggle(true);
                } else if (lower === '/phostoff') {
                    handleHostToggle(false);
                } else if (lower.startsWith('/pkdelay')) {
                    handleDelayCommand(value.slice(8));
                } else if (lower.startsWith('/pkd')) {
                    handleDelayCommand(value.slice(4));
                } else if (lower.startsWith('/pkannounce')) {
                    handleAnnounceCommand(value.slice(11));
                } else if (lower.startsWith('/pka')) {
                    handleAnnounceCommand(value.slice(4));
                } else if (lower === '/pkhelp') {
                    handleHelpCommand();
                }
            }
        }, true); // capture = true so we beat other handlers
    }

    function attachChatHooks() {
        const lobby = document.getElementById('newbonklobby_chat_input');
        const game  = document.getElementById('ingamechatinputtext');
        if (lobby) attachInputHookTo(lobby);
        if (game)  attachInputHookTo(game);
    }

    /*****************************************************************
     * INIT
     *****************************************************************/
    function init() {
        loadStateFromCookie();
        attachChatHooks();

        // Re-attach hooks & enforce regularly
        setInterval(attachChatHooks, 100);
        setInterval(enforceLists, 100);

        console.log('[PermaKickBan] Loaded. Commands: /pkick, /pban, /pkdelay, /pkannounce, /pkhelp');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', function() { setTimeout(init, 1500); });
    }

})();

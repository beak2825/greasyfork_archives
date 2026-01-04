// ==UserScript==
// @name           Auto Twitch PlateUp! Visit
// @name:tr        Otomatik Twitch PlateUp! Ziyaret
// @namespace      https://github.com/Arcdashckr/Auto-Twitch-PlateUp-Visit
// @version        1.0.0
// @description    Creates button for sending "!visit" to chat when streamer playing PlateUp!
// @description:tr Yayıncı PlateUp! oynarken sohbete "!visit" yazmak için bir buton oluşturur!
// @author         Arcdashckr
// @match          https://www.twitch.tv/*
// @icon           https://cdn.simpleicons.org/twitch/9146FF
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @license        MIT
// @supportURL     https://github.com/Arcdashckr/Auto-Twitch-PlateUp-Visit/issues
// @downloadURL https://update.greasyfork.org/scripts/556817/Auto%20Twitch%20PlateUp%21%20Visit.user.js
// @updateURL https://update.greasyfork.org/scripts/556817/Auto%20Twitch%20PlateUp%21%20Visit.meta.js
// ==/UserScript==

// Button Injection Credits: https://github.com/1011025m/userfiles/blob/main/userscripts/TwitchViewBotCommands.user.js
// Paste Simulation Credits: https://greasyfork.org/tr/scripts/534811-twitch-auto-join-command-slatejs-clipboard-injection

(() => {
    'use strict'

    const COMMAND = "!visit";
    const AUTO_ACCEPT_RULES = false;
    const CHECK_GAME = true;
    const GAME_NAME = 'PlateUp!';

    // Selectors
    const GAME_NAME_SELECTOR = 'a[data-a-target="stream-game-link"] span';
    const SEND_BUTTON_SELECTOR = 'button[data-a-target="chat-send-button"]';
    const RULES_BUTTON_SELECTOR = 'button[data-test-selector="chat-rules-ok-button"]';
    const CHAT_INPUT_SELECTOR = 'div[contenteditable="true"][role="textbox"][data-a-target="chat-input"]';

    // CSS Styles
    const plateup_visit_button_styles = document.createElement("style")
    plateup_visit_button_styles.innerText = `
    .plateup-visit-button {
        cursor:pointer !important;
        display:flex;
        justify-content:center;
        width:3rem;
        height:3rem;
        position:relative;
    }

    .plateup-visit-button:hover {
        border-radius:50%;
        background-color: var(--color-background-button-text-hover);
    }

    .plateup-visit-button button {
        border:0;
        background:transparent;
        color:#fff;
        width:3rem;
        height:3rem;
        padding:0.5rem;
    }
    `

    // Logging
    function log(tag, msg, ...rest) {
        const colors = {
            INIT: 'color:#e67e22; font-weight:700',
            CHAT: 'color:#9b59b6; font-weight:700',
            DEBUG: 'color:#3498db; font-weight:700',
            WARN: 'color:#e74c3c; font-weight:700'
        };
        const prefix = `%c[Auto-Twitch-PlateUp-Visit][${tag}]%c`;
        const message = ` ${msg}`;
        const tagStyle = colors[tag] || colors.DEBUG;
        console.log(prefix + message, tagStyle, 'color:inherit', ...rest);
    }

        function findRulesButton() {
            return document.querySelector(RULES_BUTTON_SELECTOR) || null;
        }

        async function isRulesPopup() {
            return await new Promise((resolve, reject) => {
                const storageKey = 'chat_rules_shown';
                const isAcceptedInStorage = () => {
                    try {
                        const raw = localStorage.getItem(storageKey);
                        if (!raw) return false;
                        const obj = JSON.parse(raw);
                        return !!obj?.[channelName];
                    } catch (e) {
                        log('WARN', 'Failed to parse localStorage chat_rules_shown.', e);
                        return false;
                    }
                };

                let rulesButton = findRulesButton();
                if (!rulesButton) return reject('no-popup');

                if (AUTO_ACCEPT_RULES) {
                    try {
                        rulesButton.click();
                        log('CHAT', 'Chat rules accepted (automatically).');
                        setTimeout(() => resolve(), 500);
                        return;
                    } catch (e) {
                        log('WARN', 'Auto-accept click failed.', e);
                    }
                }

                let storageInterval = null;

                const finishResolve = () => {
                    if (storageInterval) clearInterval(storageInterval);
                    observer.disconnect();
                    log('CHAT', `Chat rules accepted for ${channelName} by user (manually).`);
                    resolve();
                    return;
                };

                const finishReject = () => {
                    if (storageInterval) clearInterval(storageInterval);
                    observer.disconnect();
                    log('CHAT', 'Chat rules popup closed without acceptance.');
                    reject('closed-without-accept');
                    return;
                };

                const observer = new MutationObserver(() => {
                    const rulesButton = findRulesButton();
                    if (!rulesButton) {
                        // Popup removed; check if localStorage shows acceptance
                        if (isAcceptedInStorage()) finishResolve();
                        else finishReject();
                        return;
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                // Also poll localStorage for acceptance (some flows update storage before DOM changes)
                storageInterval = setInterval(() => {
                    if (isAcceptedInStorage()) {
                        finishResolve();
                        return;
                    }
                }, 300);
            });
        }

        // Wait for rules popup to appear after focus, but only using the RULES_BUTTON_SELECTOR
        function waitForRulesPopupAppearance(timeout = 2000) {
            return new Promise((resolve, reject) => {
                const existing = findRulesButton();
                if (existing) return resolve(existing);

                const observer = new MutationObserver(() => {
                    const found = findRulesButton();
                    if (found) {
                        observer.disconnect();
                        resolve(found);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                const to = setTimeout(() => {
                    observer.disconnect();
                    reject('timeout');
                }, timeout);
            });
        }

        // SlateJS Clipboard Injection
        async function simulatePaste(element, value, button) {
            let originalClipboard = '';
            const storeClipboard = async () => {
                // Store old clipboard data
                try {
                    if (navigator.clipboard && navigator.clipboard.readText) { originalClipboard = await navigator.clipboard.readText(); }
                } catch (e) {
                    log('WARN', 'Clipboard read failed, continuing with overwrite.', e);
                }
            };
            const writeClipboard = async (action) => {
                try {
                    if (action === 'write') {
                        // Place value onto clipboard (if permissions allow)
                        if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(value); }
                    } else if (action === 'restore') {
                        // Restore clipboard
                        if (originalClipboard && navigator.clipboard && navigator.clipboard.writeText) { setTimeout(() => { navigator.clipboard.writeText(originalClipboard); }, 100); }
                    };
                } catch (e) {
                    log('WARN', `Clipboard ${action} failed.`, e);
                    return
                }
            };
            const pasteClipboard = () => {
                try {
                    // Create a real paste event
                    const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: new DataTransfer() });
                    pasteEvent.clipboardData.setData('text/plain', value);
                    element.dispatchEvent(pasteEvent);
                    // Sometimes execCommand is still needed for full compatibility
                    try { document.execCommand('paste'); } catch (e) {}
                } catch (e) {
                    log('WARN', 'Simulated paste event failed.', e);
                }
            };
            const sendPastedText = async () => {
                await storeClipboard();
                await writeClipboard('write');
                pasteClipboard();
                await writeClipboard('restore');
                // Wait for paste and UI update
                await new Promise(res => setTimeout(res, 500));
                if (element.innerText.trim() === value) {
                    if (button) { button.click(); log('CHAT', '!visit message sended.'); return}
                }
                return
            };

            // Focus first, then watch for rules popup appearing as a result of focus.
            element.focus();

            try {
                // Wait shortly to see if rules popup appears. If not, proceed to paste.
                await waitForRulesPopupAppearance(2000);
                // If we get here, popup appeared
                log('CHAT', 'Chat rules popup detected after focus. Waiting for acceptance...');
                await isRulesPopup();
                // If accepted, focus back and paste
                element.focus();
                await sendPastedText();
            } catch (e) {
                // If no popup appeared within timeout, or popup wasn't accepted, act accordingly.
                if (e === 'timeout' || e === 'no-popup') {
                    // No popup -> proceed to paste
                    await sendPastedText();
                    return;
                }
                if (e === 'closed-without-accept') {
                    // Popup closed without acceptance -> do nothing
                    return;
                }
                // Unexpected error: do nothing but log
                log('WARN', 'Unexpected error while handling chat rules popup.', e);
                return;
            }
        }

    function findEnabledChatInput() {
        let inp = Array.from(document.querySelectorAll(CHAT_INPUT_SELECTOR)).find(el =>
            el.offsetParent &&
            el.getAttribute('aria-disabled') !== 'true' &&
            el.getAttribute('aria-readonly') !== 'true' &&
            !el.classList.contains('disabled')
        );
        return inp;
    }

    function findEnabledSendButton() {
        let btn = document.querySelector(SEND_BUTTON_SELECTOR);
        return btn && !btn.disabled ? btn : undefined;
    }

    async function sendCommand(chatInput, sendButton) {
        await simulatePaste(chatInput, COMMAND, sendButton)
        return;
    }

    function waitForChatThenSend() {
        let observer = new MutationObserver(() => {
            const input = findEnabledChatInput(), button = findEnabledSendButton();
            if (input && button) {
                observer.disconnect();
                sendCommand(input, button);
            } else log('DEBUG', 'Chat input and send button not found.')
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
        }, 5000);
    }

    function chatRoomState() {
        const chatRoomExists = document.querySelector('.chat-room__content')
        return chatRoomExists ? true : false;
    }

    function visitButtonState(action) {
        const visitButton = document.querySelector('.plateup-visit-button')
        if (!visitButton) return false;
        if (action === 'remove') { visitButton.remove(); buttonInjected = false; return false; }
        return true;
    }

    function injectVisitButton() {
        if (chatRoomState() && !visitButtonState('check')) {
            log('DEBUG', 'Button not found, injecting.')
            try {
                document.head.appendChild(plateup_visit_button_styles)
                const chatButtonsRightContainer = document.querySelector('.chat-input__buttons-container > div > div:has(button[data-a-target="chat-send-button"])')
                const plateupVisitButton = document.createElement('div')
                plateupVisitButton.classList.add('plateup-visit-button')
                chatButtonsRightContainer.insertAdjacentElement('beforebegin', plateupVisitButton)
                const childDiv = document.createElement('div')
                plateupVisitButton.append(childDiv)
                const childButton = document.createElement('button')
                childDiv.append(childButton)
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                svg.setAttribute('viewBox', '0 0 512 512')
                svg.setAttribute('style', 'width:100%;height:100%')
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                path.setAttribute('fill', '#808080')
                path.setAttribute('d', 'M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z')
                svg.appendChild(path)
                childButton.append(svg)
                childButton.onclick = () => {
                    waitForChatThenSend();
                }
                buttonInjected = true;
                log('DEBUG', 'Injected !visit button successfully.')
            }
            catch (e) {
                buttonInjected = false;
                log('WARN', 'Injecting !visit button failed.', e)
            }
        } else return;
    }

    function checkCurrentGame() {
        try {
            const elements = document.querySelectorAll(GAME_NAME_SELECTOR)
            for (const span of elements) {
                if (span.textContent.trim() == GAME_NAME) return true;
            }
            return false;
        } catch (e) {
            log('WARN', 'Current game name check failed.', e);
            return false;
        }
    }

    // Run
    let channelName = ""
    let buttonInjected = false
    log('INIT', 'Script initialized.')

    async function checkURL() {
        const currentURL = document.URL
        // URL addresses to ignore after twitch.tv/
        const noCheckAdresses = [
            'team',
            'user',
            'drops',
            '_deck',
            'videos',
            'wallet',
            'settings',
            'directory',
            'subscriptions'
        ]
        const channelNameRegEx = [
            /(?<=\/popout\/|\/embed\/|\/moderator\/)(.+?)(?=\/chat|\/|$)/,
            /(?<=twitch.tv\/)(?!popout|embed|moderator)(.+?)(?=[\/\?]|$)/
        ]
        for (const re of channelNameRegEx) {
            const reExec = re.exec(currentURL)
            if (reExec === null) continue
            if (noCheckAdresses.includes(reExec[0])) return;
            if (channelName !== reExec[0]) {
                channelName = reExec[0];
                log('INIT', `Channel changed to ${reExec[0]}`)
            };
            if (!CHECK_GAME) {
                injectVisitButton()
            } else if (checkCurrentGame()) {
                injectVisitButton()
            } else if (buttonInjected) {
                log('DEBUG', `Not playing ${GAME_NAME}, removing button.`)
                visitButtonState('remove')
                return
            }
        }
    }

    // Have to wait for 7TV to load first
    setTimeout(() => {
        if (window.seventv !== undefined) {
            log('INIT', "Cooling down for 7TV initialization...")
            setTimeout(() => {
                log('INIT', "Cooldown complete.")
                setInterval(checkURL, 2000)
            }, 1000)
        }
        else setInterval(checkURL, 2000)
    }, 2000)

    log('INIT', "Monitoring channel changes.")

})();
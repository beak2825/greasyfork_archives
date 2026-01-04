// ==UserScript==
// @name         TorrentBD Shoutbox Manager
// @namespace    TBD-Shoutbox-Manager
// @version      1.1.3
// @description  Complete shoutbox overhaul
// @author       CornHub
// @license      MIT
// @match        https://www.torrentbd.com/
// @match        https://www.torrentbd.net/
// @match        https://www.torrentbd.org/
// @match        https://www.torrentbd.me/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555189/TorrentBD%20Shoutbox%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/555189/TorrentBD%20Shoutbox%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Prevent multiple instances
    if (window.TBDMLoaded) return;
    window.TBDMLoaded = true;

    // ============================================================================
    // GLOBAL CONFIGURATION & STORAGE
    // ============================================================================

    const CONFIG = {
        // Cleaner Module
        cleaner_enabled: GM_getValue('tbdm_cleaner_enabled', false),
        cleaner_filters: GM_getValue('tbdm_cleaner_filters', {
            torrent: true,
            forumPost: true,
            forumTopic: true,
            request: true
        }),
        cleaner_hide_all_users: GM_getValue('tbdm_cleaner_hide_all_users', false),
        cleaner_block_users_enabled: GM_getValue('tbdm_cleaner_block_users_enabled', false),
        cleaner_blocked_user_ids: GM_getValue('tbdm_cleaner_blocked_user_ids', []),
        cleaner_block_keywords_enabled: GM_getValue('tbdm_cleaner_block_keywords_enabled', false),
        cleaner_blocked_keywords: GM_getValue('tbdm_cleaner_blocked_keywords', []),

        // Notifier Module
        notifier_enabled: GM_getValue('tbdm_notifier_enabled', false),
        notifier_username: GM_getValue('tbdm_notifier_username', ''),
        notifier_keywords: GM_getValue('tbdm_notifier_keywords', []),
        notifier_sound_volume: GM_getValue('tbdm_notifier_sound_volume', 0.5),
        notifier_highlight_color: GM_getValue('tbdm_notifier_highlight_color', '#2E4636'),
        notifier_processed_messages: GM_getValue('tbdm_notifier_processed_messages', []),

        // Image Upload Module
        image_upload_enabled: GM_getValue('tbdm_image_upload_enabled', false),

        // Easy Mention Module
        easy_mention_enabled: GM_getValue('tbdm_easy_mention_enabled', true),

        // URL Sender Module
        url_sender_enabled: GM_getValue('tbdm_url_sender_enabled', true),

        // Autocomplete Module
        autocomplete_username_enabled: GM_getValue('tbdm_autocomplete_username_enabled', false),
        autocomplete_sticker_enabled: GM_getValue('tbdm_autocomplete_sticker_enabled', false),
        autocomplete_mappings: GM_getValue('tbdm_autocomplete_mappings', {
            'hi': ':hello',
            'hello': ':hello',
            'no': ':negative',
            'nahi': ':sticker-mb-no',
            'sad': ':sticker-pepe-face',
            'lmao': ':lmao',
            'justsaid': ':justsaid',
            'wow': ':sticker-omg-wow',
            'lol': ':sticker-jjj-laugh',
            'why': ':sticker-cat-why',
            'ty': ':thankyou',
            'slap': ':slap',
            'wont': ':sticker-sr-no',
            'bruh': ':sticker-facepalm',
            'yay': ':yepdance',
            'aww': ':sticker-pepe-aw'
        }),

        // Focus Lock Module
        focus_lock_enabled: GM_getValue('tbdm_focus_lock_enabled', false),

        // Idle Prevention Module
        idle_prevention_enabled: GM_getValue('tbdm_idle_prevention_enabled', false)
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function saveConfig(key, value) {
        CONFIG[key] = value;
        GM_setValue(`tbdm_${key}`, value);
    }

    function detectUsername() {
        const allRankElements = document.querySelectorAll('.tbdrank');
        for (const rankElement of allRankElements) {
            if (!rankElement.closest('#shoutbox-container')) {
                if (rankElement && rankElement.firstChild && rankElement.firstChild.nodeType === Node.TEXT_NODE) {
                    return rankElement.firstChild.nodeValue.trim();
                }
            }
        }
        return 'Not Found';
    }

    // ============================================================================
    // MODULE 1: SHOUTBOX CLEANER
    // ============================================================================

    const CleanerModule = {
        systemFilters: {
            torrent: { phrase: "New Torrent :", label: "New Torrents" },
            forumPost: { phrase: "New Forum Post", label: "New Forum Posts" },
            forumTopic: { phrase: "New Forum Topic", label: "New Forum Topics" },
            request: { phrase: "New Request :", label: "New Requests" }
        },

        check() {
            if (!CONFIG.cleaner_enabled) return;

            const shoutItems = document.querySelectorAll(".shout-item");
            const blockedUserIDs = CONFIG.cleaner_blocked_user_ids.filter(Boolean);
            const blockedKeywords = CONFIG.cleaner_blocked_keywords.filter(Boolean);

            shoutItems.forEach((item) => {
                item.style.display = "";

                const textField = item.querySelector(".shout-text");
                if (!textField) return;

                const lowerCaseText = textField.textContent.toLowerCase();
                let shouldHide = false;

                let isSystemMessage = false;
                let systemMessageType = null;

                for (const key in this.systemFilters) {
                    if (lowerCaseText.includes(this.systemFilters[key].phrase.toLowerCase())) {
                        isSystemMessage = true;
                        systemMessageType = key;
                        break;
                    }
                }

                if (isSystemMessage) {
                    if (CONFIG.cleaner_filters[systemMessageType]) {
                        shouldHide = true;
                    }
                } else {
                    if (CONFIG.cleaner_hide_all_users) {
                        shouldHide = true;
                    } else if (CONFIG.cleaner_block_users_enabled && blockedUserIDs.length > 0) {
                        const idElement = item.querySelector('.shout-user [data-tid]');
                        const userID = idElement ? idElement.getAttribute('data-tid') : null;
                        if (userID && blockedUserIDs.includes(userID)) {
                            shouldHide = true;
                        }
                    }

                    // Check for blocked keywords
                    if (!shouldHide && CONFIG.cleaner_block_keywords_enabled && blockedKeywords.length > 0) {
                        for (const keyword of blockedKeywords) {
                            if (keyword && lowerCaseText.includes(keyword.toLowerCase())) {
                                shouldHide = true;
                                break;
                            }
                        }
                    }
                }

                if (shouldHide) {
                    item.style.display = "none";
                }
            });
        },

        init() {
            const shoutContainer = document.querySelector("#shouts-container");
            if (shoutContainer) {
                const observer = new MutationObserver(() => this.check());
                observer.observe(shoutContainer, { childList: true, subtree: true });
                this.check();
            }
        }
    };

   //============================================================================
    // MODULE 2: SHOUTBOX NOTIFIER
    // ============================================================================

    const NotifierModule = {
        MAX_PROCESSED_MESSAGES: 200,

        playSound() {
            if (CONFIG.notifier_sound_volume < 0.01) return;
            try {
                const audio = new Audio("https://raw.githubusercontent.com/5ifty6ix/custom-sounds/refs/heads/main/new-notification-010-352755.mp3");
                audio.volume = CONFIG.notifier_sound_volume;
                audio.play();
            } catch (e) {
                console.error('Notifier: Could not play sound.', e);
            }
        },

        notifyUser() {
            if (!document.title.startsWith('(1)')) {
                document.title = '(1) ' + document.title;
            }
            this.playSound();
        },

        highlightShout(shoutElement) {
            shoutElement.style.backgroundColor = CONFIG.notifier_highlight_color;
            shoutElement.style.borderLeft = '3px solid #14a76c';
            shoutElement.style.paddingLeft = '5px';
        },

        checkShout(shoutElement) {
            if (!CONFIG.notifier_enabled || !shoutElement || !shoutElement.id) return;

            const messageBody = shoutElement.querySelector('.shout-text');
            if (!messageBody) return;

            // Skip system messages (New Forum Post, New Torrent, etc.)
            const messageText = messageBody.textContent.toLowerCase();
            const systemPhrases = ['new forum post', 'new forum topic', 'new torrent', 'new request'];
            for (const phrase of systemPhrases) {
                if (messageText.includes(phrase)) {
                    return; // Skip this message
                }
            }

            const activeUsername = (CONFIG.notifier_username && CONFIG.notifier_username !== 'Not Found')
                ? [CONFIG.notifier_username] : [];
            const allKeywords = [...activeUsername, ...CONFIG.notifier_keywords]
                .filter(k => k && k.trim() !== '')
                .map(k => k.toLowerCase());

            if (allKeywords.length === 0) return;

            let keywordFound = false;
            for (const keyword of allKeywords) {
                const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const keywordRegex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
                if (keywordRegex.test(messageText)) {
                    this.highlightShout(shoutElement);
                    keywordFound = true;
                    break;
                }
            }

            if (keywordFound) {
                const processedMessages = CONFIG.notifier_processed_messages;
                if (!processedMessages.includes(shoutElement.id)) {
                    this.notifyUser();
                    processedMessages.push(shoutElement.id);
                    if (processedMessages.length > this.MAX_PROCESSED_MESSAGES) {
                        processedMessages.shift();
                    }
                    saveConfig('notifier_processed_messages', processedMessages);
                }
            }
        },

        init() {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && node.classList.contains('shout-item')) {
                                this.checkShout(node);
                            }
                        });
                    }
                }
            });

            const shoutbox = document.getElementById('shouts-container');
            if (shoutbox) {
                shoutbox.querySelectorAll('.shout-item').forEach(item => this.checkShout(item));
                observer.observe(shoutbox, { childList: true });
            }
        }
    };

    // ============================================================================
    // MODULE 3: IMAGE UPLOAD
    // ============================================================================

    const ImageUploadModule = {
        ENDPOINTS: [
            'https://timepass.fpureit.top/upload.php',
            'https://timepass.fpureit.top/index.php',
            'https://timepass.fpureit.top/'
        ],

        upload(file, input, i = 0, original = '') {
            if (i >= this.ENDPOINTS.length) {
                input.value = '[Upload failed]';
                setTimeout(() => input.value = original, 2500);
                input.disabled = false;
                return;
            }

            const fd = new FormData();
            fd.append('file', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: this.ENDPOINTS[i],
                data: fd,
                onload: res => {
                    if (res.status === 200) {
                        const match = res.responseText.match(/https?:\/\/timepass\.fpureit\.top\/[a-zA-Z0-9]+\.(png|jpe?g|gif|webp)/i);
                        if (match) {
                            input.value = (original ? original + ' ' : '') + match[0] + ' ';
                            input.disabled = false;
                            input.focus();
                            return;
                        }
                    }
                    this.upload(file, input, i + 1, original);
                },
                onerror: () => this.upload(file, input, i + 1, original)
            });
        },

        startUpload(file, input) {
            const original = input.value.replace(/\[Uploading.*?\]/, '').trim();
            input.value = '[Uploading...]';
            input.disabled = true;
            this.upload(file, input, 0, original);
        },

        init() {
            if (!CONFIG.image_upload_enabled) return;

            const input = document.querySelector('#shout_text');
            const tray = document.querySelector('#shout-ibb-container');
            if (!input || !tray || document.getElementById('tbdm-image-upload-btn')) return;

            // Paste handler
            input.addEventListener('paste', e => {
                const file = [...(e.clipboardData || e.originalEvent.clipboardData).items]
                    .find(i => i.type.startsWith('image/'))?.getAsFile();
                if (file) {
                    e.preventDefault();
                    this.startUpload(file, input);
                }
            });

            // Drag & drop handlers
            input.addEventListener('dragover', e => {
                e.preventDefault();
                input.style.border = '2px dashed #4cafef';
            });

            input.addEventListener('dragleave', e => {
                e.preventDefault();
                input.style.border = '';
            });

            input.addEventListener('drop', e => {
                e.preventDefault();
                input.style.border = '';
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.startUpload(file, input);
                }
            });

            // File picker
            const picker = Object.assign(document.createElement('input'), {
                type: 'file',
                accept: 'image/*',
                style: 'display:none'
            });
            document.body.appendChild(picker);
            picker.addEventListener('change', e => {
                if (e.target.files[0]) this.startUpload(e.target.files[0], input);
                picker.value = null;
            });

            // Upload button
            const btn = document.createElement('span');
            btn.id = 'tbdm-image-upload-btn';
            btn.className = 'inline-submit-btn';
            btn.title = 'Upload Image';
            btn.innerHTML = '<i class="material-icons">add_photo_alternate</i>';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', () => picker.click());
            tray.insertBefore(btn, tray.querySelector('#urlBtn') || null);
        }
    };

    // ============================================================================
    // MODULE 4: EASY MENTION
    // ============================================================================

    const EasyMentionModule = {
        isEnabled: false,
        handler: null,

        init() {
            if (!CONFIG.easy_mention_enabled || window.location.pathname !== "/") return;
            if (this.isEnabled) return; // Already initialized
            this.isEnabled = true;

            const shout = document.querySelector("#shout_text");
            if (!shout) return;

            // Detect browser
            if (navigator.vendor === "") {
                if (!document.body.classList.contains("firefox")) document.body.classList.add("firefox");
            } else {
                if (!document.body.classList.contains("chromium")) document.body.classList.add("chromium");
            }

            this.handler = (e) => {
                // Check if clicked element or its parent is the shout-time
                let target = e.target;
                let shoutTime = null;

                // If clicked on AM/PM span, get parent shout-time
                if (target.classList.contains('shout-time-lam')) {
                    shoutTime = target.parentElement;
                } else if (target.classList.contains('shout-time')) {
                    shoutTime = target;
                } else {
                    return;
                }

                if (document.body.classList.contains("chromium")) {
                    if (!shoutTime.matches(".chromium .shout-time:has(+ .shout-user [href^='account'])")) return;
                } else if (document.body.classList.contains("firefox")) {
                    if (!shoutTime.matches(".firefox .shout-time")) return;
                }

                const name = shoutTime.nextElementSibling.querySelector('[href^="account"] span');
                if (name) {
                    if (shout.value !== "" && shout.value.slice(-1) !== " ") shout.value += " ";
                    shout.value += "@" + name.innerText.trim() + " ";
                }
            };

            document.addEventListener("click", this.handler);
        },

        stop() {
            if (this.handler) {
                document.removeEventListener("click", this.handler);
                this.handler = null;
            }
            this.isEnabled = false;
        }
    };

    // ============================================================================
    // MODULE 5: URL SENDER
    // ============================================================================

    const URLSenderModule = {
        urlWindow: null,
        urlField: null,
        labelField: null,

        showUrlWindow() {
            this.urlWindow.classList.add("show");
            const shoutCont = document.querySelector("#shout-send-container");
            shoutCont.querySelectorAll("[id^='spotlight']").forEach(spotlight => {
                if (spotlight.classList.contains("shiner")) {
                    spotlight.classList.remove("shiner");
                    spotlight.classList.add("fader");
                }
            });
        },

        hideUrlWindow() {
            this.urlWindow.classList.remove("show");
        },

        clearFields() {
            this.urlField.value = "";
            this.labelField.value = "";
        },

        urlTagCreate() {
            const shout = document.querySelector("#shout_text");
            let rawURL = this.urlField.value.trim();
            let label = this.labelField.value;

            if (rawURL.length > 150) return "URL is too long.\nConsider shortening it using URL shorteners.";
            if (!/^https:\/\//i.test(rawURL)) return "Please enter a safe https URL.";
            if (!/^https:\/\/.*\./i.test(rawURL)) return "Please make sure the URL is correct.";

            if (shout.value !== "" && shout.value.slice(-1) !== " ") shout.value += " ";

            if (label !== "") {
                shout.value += `[url=${rawURL}]${label}[/url] `;
            } else {
                shout.value += `[url]${rawURL}[/url] `;
            }
            this.hideUrlWindow();
            this.clearFields();
            shout.focus();
        },

        init() {
            if (!CONFIG.url_sender_enabled || window.location.pathname !== "/") return;

            if (window.location.search.includes("spotlight")) document.body.classList.add("spotlight");

            const shout = document.querySelector("#shout_text");
            const ibbCont = document.querySelector("#shout-ibb-container");
            const shoutCont = document.querySelector("#shout-send-container");

            if (!shout || !ibbCont || !shoutCont) return;

            // Create URL window
            this.urlWindow = document.createElement("div");
            this.urlWindow.id = "urlWindow";
            shoutCont.appendChild(this.urlWindow);

            // URL field
            this.urlField = document.createElement("input");
            this.urlField.id = "urlField";
            this.urlField.classList.add("url-inputs");
            this.urlField.placeholder = "URL";
            this.urlWindow.appendChild(this.urlField);
            this.urlField.onmouseover = () => this.urlField.focus();

            // Label field
            this.labelField = document.createElement("input");
            this.labelField.id = "labelField";
            this.labelField.classList.add("url-inputs");
            this.labelField.placeholder = "Label (Optional)";
            this.urlWindow.appendChild(this.labelField);

            // Submit button
            const submitURL = document.createElement("input");
            submitURL.type = "button";
            submitURL.id = "submitURL";
            submitURL.value = "Submit";
            this.urlWindow.appendChild(submitURL);

            // URL button
            const urlBtn = document.createElement("span");
            urlBtn.id = "urlBtn";
            urlBtn.innerHTML = `<i class="material-icons">URL</i>`;
            urlBtn.classList.add("inline-submit-btn");
            ibbCont.insertBefore(urlBtn, ibbCont.childNodes[4]);

            // Event listeners
            urlBtn.addEventListener("click", e => {
                e.stopPropagation();
                if (shout.value !== "") shout.value += " ";
                this.urlWindow.classList.contains("show") ? this.hideUrlWindow() : this.showUrlWindow();
                this.urlField.focus();
            });

            document.addEventListener("click", e => {
                if (e.target.matches(".inline-submit-btn:not(#urlBtn) i")) {
                    this.hideUrlWindow();
                }
            });

            submitURL.onclick = () => {
                let error = this.urlTagCreate();
                if (error) {
                    alert(error);
                    this.clearFields();
                }
            };

            document.addEventListener("keypress", e => {
                if (e.target.matches(".url-inputs") && e.key === "Enter") {
                    let error = this.urlTagCreate();
                    if (error) {
                        alert(error);
                        this.clearFields();
                    }
                }
            });

            let initHeight = window.innerHeight;
            window.onresize = () => {
                if (window.innerHeight < initHeight && this.urlWindow.classList.contains("show")) {
                    shoutCont.scrollIntoView(false);
                }
            };
        }
    };


  // ============================================================================
// MODULE 6: AUTOCOMPLETE (Mobile Compatible)
// ============================================================================

const AutocompleteModule = {
    isEnabled: false,
    keyboardHandler: null,
    inputHandler: null,
    lastInputValue: '',
    lastInputTime: 0,

    performAutocomplete() {
        let shoutInputBox = document.querySelector("#shout_text");
        if (!shoutInputBox) return false;

        let typedText = shoutInputBox.value;
        let words = typedText.split(" ");
        let lastWord = words[words.length - 1].toLowerCase();

        // Skip if last word is empty
        if (!lastWord) return false;

        // Username autocomplete
        if (CONFIG.autocomplete_username_enabled) {
            let myShoutContainer = document.querySelector("#shouts-container");
            if (myShoutContainer) {
                let shoutUsers = myShoutContainer.querySelectorAll("div.shout-item span.shout-user span.tbdrank");

                for (let user of shoutUsers) {
                    if (user.innerText.toLowerCase().startsWith(lastWord) && typedText !== "") {
                        words[words.length - 1] = "@" + user.innerText;
                        shoutInputBox.value = words.join(" ");
                        // Set cursor to end
                        shoutInputBox.setSelectionRange(shoutInputBox.value.length, shoutInputBox.value.length);
                        return true;
                    }
                }
            }
        }

        // Sticker/emoji autocomplete
        if (CONFIG.autocomplete_sticker_enabled) {
            const mapping = CONFIG.autocomplete_mappings;
            if (mapping.hasOwnProperty(lastWord)) {
                words[words.length - 1] = mapping[lastWord];
                shoutInputBox.value = words.join(" ");
                // Set cursor to end
                shoutInputBox.setSelectionRange(shoutInputBox.value.length, shoutInputBox.value.length);
                return true;
            }
        }

        return false;
    },

    init() {
        if (this.isEnabled) return; // Already initialized
        this.isEnabled = true;

        // Keyboard handler for desktop (Tab key)
        this.keyboardHandler = (event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();

            let shoutInputBox = document.activeElement;
            if (
                shoutInputBox.tagName !== 'TEXTAREA' &&
                !(shoutInputBox.tagName === 'INPUT' && shoutInputBox.type === 'text')
            ) return;

            this.performAutocomplete();
        };

        // Input handler for mobile (detect double space)
        this.inputHandler = (event) => {
            const shoutInput = event.target;

            // Only trigger on the shoutbox input
            if (shoutInput.id !== 'shout_text') return;

            // Only use double space on mobile/touch devices
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                            || ('ontouchstart' in window)
                            || (navigator.maxTouchPoints > 0);

            if (!isMobile) return; // Skip on desktop

            const currentValue = shoutInput.value;
            const currentTime = Date.now();

            // Check if user typed two spaces in a row within 500ms
            if (currentValue.endsWith('  ') &&
                this.lastInputValue.length > 0 &&
                currentValue.length === this.lastInputValue.length + 1 &&
                currentTime - this.lastInputTime < 500) {

                // Remove both spaces
                shoutInput.value = currentValue.slice(0, -2);

                // Perform autocomplete
                const completed = this.performAutocomplete();

                // If autocomplete happened, add a space at the end for natural flow
                if (completed) {
                    shoutInput.value += ' ';
                    shoutInput.setSelectionRange(shoutInput.value.length, shoutInput.value.length);
                } else {
                    // If no autocomplete, restore single space
                    shoutInput.value += ' ';
                    shoutInput.setSelectionRange(shoutInput.value.length, shoutInput.value.length);
                }
            }

            // Store current value and time for next comparison
            this.lastInputValue = shoutInput.value;
            this.lastInputTime = currentTime;
        };

        // Add both handlers
        document.addEventListener("keydown", this.keyboardHandler);
        document.addEventListener("input", this.inputHandler);
    },

    stop() {
        if (this.keyboardHandler) {
            document.removeEventListener("keydown", this.keyboardHandler);
            this.keyboardHandler = null;
        }
        if (this.inputHandler) {
            document.removeEventListener("input", this.inputHandler);
            this.inputHandler = null;
        }
        this.isEnabled = false;
        this.lastInputValue = '';
        this.lastInputTime = 0;
    }
};
// ============================================================================
// MODULE 7: FOCUS LOCK (Hover-based Auto-focus)
// ============================================================================

const FocusLockModule = {
    shoutbox: null,
    shoutboxContainer: null,
    hoverHandler: null,

    focusInput() {
        // Only focus if user is not selecting text
        if (!window.getSelection().toString() && this.shoutbox) {
            this.shoutbox.focus();
        }
    },

    init() {
        if (!CONFIG.focus_lock_enabled) return;

        this.shoutbox = document.querySelector('input#shout_text.shoutbox-text');
        this.shoutboxContainer = document.querySelector('#shoutbox-container');

        if (!this.shoutbox || !this.shoutboxContainer) {
            setTimeout(() => this.init(), 500);
            return;
        }

        // Remove any existing hover handler
        if (this.hoverHandler) {
            this.shoutboxContainer.removeEventListener('mouseover', this.hoverHandler);
        }

        // Create new hover handler
        this.hoverHandler = (e) => {
            this.focusInput();
        };

        // Add hover event listener to shoutbox container
        this.shoutboxContainer.addEventListener('mouseover', this.hoverHandler);
    },

    stop() {
        if (this.hoverHandler && this.shoutboxContainer) {
            this.shoutboxContainer.removeEventListener('mouseover', this.hoverHandler);
            this.hoverHandler = null;
        }
    }
};

// Updated settings handler for Focus Lock
function setupFocusLockSettings() {
    const focusLock = document.getElementById('tbdm-focus-lock');
    if (!focusLock) return;

    focusLock.checked = CONFIG.focus_lock_enabled;

    focusLock.addEventListener('change', (e) => {
        saveConfig('focus_lock_enabled', e.target.checked);
        if (e.target.checked) {
            FocusLockModule.init();
        } else {
            FocusLockModule.stop();
        }
    });
}

    // ============================================================================
    // MODULE 8: IDLE PREVENTION
    // ============================================================================

    const IdlePreventionModule = {
        intervalId: null,
        observer: null,
        checkIntervalId: null,

        simulateActivity() {
            // Simulate multiple types of activity
            const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                document.dispatchEvent(event);
            });
        },

        hideIdleOverlays() {
            // Check for any overlay elements - cast wider net
            const selectors = [
                '#shoutbox-idle-overlay',
                '.shoutbox-idle',
                '.idle-overlay',
                '[class*="idle"]',
                '[id*="idle"]'
            ];

            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        // Only hide if it looks like an overlay (has certain styles)
                        const computed = window.getComputedStyle(el);
                        if (computed.position === 'fixed' || computed.position === 'absolute') {
                            if (computed.display !== 'none') {
                                el.style.display = 'none';
                                el.style.visibility = 'hidden';
                                el.style.opacity = '0';
                                el.style.pointerEvents = 'none';
                            }
                        }
                    });
                } catch (e) {
                    // Ignore invalid selectors
                }
            });
        },

        init() {
            if (!CONFIG.idle_prevention_enabled) return;

            // Simulate activity more frequently (every 5 seconds)
            this.intervalId = setInterval(() => this.simulateActivity(), 5000);

            // Check for and hide overlays frequently (every 2 seconds)
            this.checkIntervalId = setInterval(() => this.hideIdleOverlays(), 2000);

            // Initial check
            this.hideIdleOverlays();

            // Watch for new overlays being added
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node or its children match idle patterns
                            const nodeStr = node.className || node.id || '';
                            if (nodeStr.toLowerCase().includes('idle')) {
                                this.hideIdleOverlays();
                            }
                        }
                    });
                });
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id', 'style']
            });

            // Prevent visibility change detection
            document.addEventListener('visibilitychange', (e) => {
                if (document.hidden) {
                    e.stopImmediatePropagation();
                }
            }, true);
        },

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            if (this.checkIntervalId) {
                clearInterval(this.checkIntervalId);
                this.checkIntervalId = null;
            }
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    };

    // ============================================================================
    // SETTINGS UI
    // ============================================================================

    function createSettingsUI() {
        if (document.querySelector("#tbdm-modal-wrapper")) return;

        const uiWrapper = document.createElement("div");
        uiWrapper.id = "tbdm-modal-wrapper";
        uiWrapper.style.display = "none";
        uiWrapper.innerHTML = `
            <div id="tbdm-container">
                <div id="tbdm-header">
                    <h1>🛠️ Shoutbox Manager</h1>
                    <p>Complete control over your TorrentBD shoutbox experience</p>
                    <button id="tbdm-close-btn" title="Close">×</button>
                </div>
                <div id="tbdm-tabs">
                    <button class="tbdm-tab active" data-tab="features">⚡ Features</button>
                    <button class="tbdm-tab" data-tab="cleaner">🧹 Cleaner</button>
                    <button class="tbdm-tab" data-tab="notifier">🔔 Notifier</button>
                    <button class="tbdm-tab" data-tab="autocomplete">⌨️ Autocomplete</button>
                </div>
                <div id="tbdm-content">
                    <!-- Features Tab -->
                    <div class="tbdm-tab-content active" data-tab="features">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">🎨 Available Features</h2>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">📸</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Image Upload</div>
                                        <div class="tbdm-feature-desc">Paste, drag & drop, or click to upload</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-image-upload"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">@</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Easy Mention</div>
                                        <div class="tbdm-feature-desc">Click timestamp to mention users</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-easy-mention"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">🔗</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">URL Sender</div>
                                        <div class="tbdm-feature-desc">Easy URL formatting with labels</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-url-sender"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">🎯</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Focus Lock</div>
                                        <div class="tbdm-feature-desc">Keep input focused after clicking</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-focus-lock"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">⏰</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Idle Prevention</div>
                                        <div class="tbdm-feature-desc">Prevent auto-pause on idle</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-idle-prevention"><span class="tbdm-slider"></span></label>
                            </div>
                        </div>
                    </div>

                    <!-- Cleaner Tab -->
                    <div class="tbdm-tab-content" data-tab="cleaner">
                        <div class="tbdm-setting-row tbdm-master-switch">
                            <label for="tbdm-cleaner-enabled">Enable Cleaner</label>
                            <label class="tbdm-switch"><input type="checkbox" id="tbdm-cleaner-enabled"><span class="tbdm-slider"></span></label>
                        </div>
                        <hr class="tbdm-divider">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">Hide System Messages</h2>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-hide-all-users">Hide All User Messages</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-hide-all-users"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-filter-torrent">New Torrents</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-filter-torrent"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-filter-forumPost">New Forum Posts</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-filter-forumPost"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-filter-forumTopic">New Forum Topics</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-filter-forumTopic"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-filter-request">New Requests</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-filter-request"><span class="tbdm-slider"></span></label>
                            </div>
                        </div>
                        <hr class="tbdm-divider">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">Block Users</h2>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-block-users">Block by User ID</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-block-users"><span class="tbdm-slider"></span></label>
                            </div>
                            <textarea id="tbdm-blocked-user-ids" placeholder="Enter User IDs (one per line)"></textarea>
                        </div>
                        <hr class="tbdm-divider">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">Block Keywords</h2>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-block-keywords">Block by Keyword</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-block-keywords"><span class="tbdm-slider"></span></label>
                            </div>
                            <textarea id="tbdm-blocked-keywords" placeholder="Enter keywords to block (one per line)"></textarea>
                        </div>
                    </div>

                    <!-- Notifier Tab -->
                    <div class="tbdm-tab-content" data-tab="notifier">
                        <div class="tbdm-setting-row tbdm-master-switch">
                            <label for="tbdm-notifier-enabled">Enable Notifier</label>
                            <label class="tbdm-switch"><input type="checkbox" id="tbdm-notifier-enabled"><span class="tbdm-slider"></span></label>
                        </div>
                        <hr class="tbdm-divider">
                        <div class="tbdm-section">
                            <div class="tbdm-form-group">
                                <label>Your Username</label>
                                <div id="tbdm-username-display">Detecting...</div>
                            </div>
                            <div class="tbdm-form-group">
                                <div class="tbdm-label-row">
                                    <label for="tbdm-keywords">Additional Keywords (One per line)</label>
                                    <button id="tbdm-reset-keywords">Reset</button>
                                </div>
                                <textarea id="tbdm-keywords" placeholder="Add keywords to be notified about..."></textarea>
                            </div>
                            <div class="tbdm-controls-row">
                                <div class="tbdm-form-group">
                                    <label>Highlight Color</label>
                                    <div id="tbdm-color-picker-wrapper">
                                        <input type="color" id="tbdm-highlight-color">
                                    </div>
                                </div>
                                <div class="tbdm-form-group">
                                    <label for="tbdm-volume">Notification Volume</label>
                                    <div class="tbdm-volume-control">
                                        <div id="tbdm-volume-icon"></div>
                                        <input type="range" id="tbdm-volume" min="0" max="100" step="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Autocomplete Tab -->
                    <div class="tbdm-tab-content" data-tab="autocomplete">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">Autocomplete Options (Press Tab)</h2>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-autocomplete-username">Username Autocomplete</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-autocomplete-username"><span class="tbdm-slider"></span></label>
                            </div>
                            <div class="tbdm-setting-row">
                                <label for="tbdm-autocomplete-sticker">Sticker/Emoji Autocomplete</label>
                                <label class="tbdm-switch"><input type="checkbox" id="tbdm-autocomplete-sticker"><span class="tbdm-slider"></span></label>
                            </div>
                        </div>
                        <hr class="tbdm-divider">
                        <div class="tbdm-section">
                            <h2 class="tbdm-section-header">Custom Mappings</h2>
                            <div class="tbdm-mapping-header">
                                <p class="tbdm-help-text">Format: keyword = emoji/sticker (one per line)</p>
                                <button id="tbdm-reset-mappings" class="tbdm-secondary-btn">Reset to Defaults</button>
                            </div>
                            <div id="tbdm-mappings-container"></div>
                            <button id="tbdm-add-mapping" class="tbdm-primary-btn">+ Add New Mapping</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(uiWrapper);

        // Tab switching
        const tabs = uiWrapper.querySelectorAll('.tbdm-tab');
        const tabContents = uiWrapper.querySelectorAll('.tbdm-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                uiWrapper.querySelector(`.tbdm-tab-content[data-tab="${tabName}"]`).classList.add('active');
            });
        });

        // Close button
        document.getElementById('tbdm-close-btn').addEventListener('click', () => {
            uiWrapper.style.display = 'none';
        });

        uiWrapper.addEventListener('click', (e) => {
            if (e.target.id === 'tbdm-modal-wrapper') {
                uiWrapper.style.display = 'none';
            }
        });

        // Load and setup all settings
        setupCleanerSettings();
        setupNotifierSettings();
        setupFeaturesSettings();
        setupAutocompleteSettings();

        return uiWrapper;
    }

    function setupCleanerSettings() {
        const enabledSwitch = document.getElementById('tbdm-cleaner-enabled');
        const hideAllUsers = document.getElementById('tbdm-hide-all-users');
        const blockUsers = document.getElementById('tbdm-block-users');
        const blockedUserIds = document.getElementById('tbdm-blocked-user-ids');
        const blockKeywords = document.getElementById('tbdm-block-keywords');
        const blockedKeywords = document.getElementById('tbdm-blocked-keywords');

        // Load settings
        enabledSwitch.checked = CONFIG.cleaner_enabled;
        hideAllUsers.checked = CONFIG.cleaner_hide_all_users;
        blockUsers.checked = CONFIG.cleaner_block_users_enabled;
        blockedUserIds.value = CONFIG.cleaner_blocked_user_ids.join('\n');
        blockedUserIds.disabled = !CONFIG.cleaner_block_users_enabled;
        blockKeywords.checked = CONFIG.cleaner_block_keywords_enabled;
        blockedKeywords.value = CONFIG.cleaner_blocked_keywords.join('\n');
        blockedKeywords.disabled = !CONFIG.cleaner_block_keywords_enabled;

        for (const key in CleanerModule.systemFilters) {
            const checkbox = document.getElementById(`tbdm-filter-${key}`);
            checkbox.checked = CONFIG.cleaner_filters[key];
            checkbox.addEventListener('change', (e) => {
                CONFIG.cleaner_filters[key] = e.target.checked;
                saveConfig('cleaner_filters', CONFIG.cleaner_filters);
                CleanerModule.check();
            });
        }

        // Event listeners
        enabledSwitch.addEventListener('change', (e) => {
            saveConfig('cleaner_enabled', e.target.checked);
            if (!e.target.checked) {
                // When disabling, show all hidden messages immediately
                const shoutItems = document.querySelectorAll(".shout-item");
                shoutItems.forEach((item) => {
                    item.style.display = "";
                });
            } else {
                // When enabling, apply filters immediately
                CleanerModule.check();
            }
        });

        hideAllUsers.addEventListener('change', (e) => {
            saveConfig('cleaner_hide_all_users', e.target.checked);
            CleanerModule.check();
        });

        blockUsers.addEventListener('change', (e) => {
            saveConfig('cleaner_block_users_enabled', e.target.checked);
            blockedUserIds.disabled = !e.target.checked;
            CleanerModule.check();
        });

        blockedUserIds.addEventListener('input', () => {
            const ids = blockedUserIds.value.split('\n').map(u => u.trim()).filter(Boolean);
            saveConfig('cleaner_blocked_user_ids', ids);
            CleanerModule.check();
        });

        blockKeywords.addEventListener('change', (e) => {
            saveConfig('cleaner_block_keywords_enabled', e.target.checked);
            blockedKeywords.disabled = !e.target.checked;
            CleanerModule.check();
        });

        blockedKeywords.addEventListener('input', () => {
            const keywords = blockedKeywords.value.split('\n').map(k => k.trim()).filter(Boolean);
            saveConfig('cleaner_blocked_keywords', keywords);
            CleanerModule.check();
        });

        // Make setting rows clickable
        document.querySelectorAll('.tbdm-tab-content[data-tab="cleaner"] .tbdm-setting-row').forEach(row => {
            row.style.cursor = 'pointer';

            // Remove the for attribute from labels so they don't interfere
            const label = row.querySelector('label:first-child');
            if (label) label.removeAttribute('for');

            row.addEventListener('click', (e) => {
                if (e.target.closest('.tbdm-switch')) return;
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.click();
            });
        });
    }

    function setupNotifierSettings() {
        const enabledSwitch = document.getElementById('tbdm-notifier-enabled');
        const usernameDisplay = document.getElementById('tbdm-username-display');
        const keywords = document.getElementById('tbdm-keywords');
        const resetKeywords = document.getElementById('tbdm-reset-keywords');
        const highlightColor = document.getElementById('tbdm-highlight-color');
        const colorWrapper = document.getElementById('tbdm-color-picker-wrapper');
        const volumeSlider = document.getElementById('tbdm-volume');
        const volumeIcon = document.getElementById('tbdm-volume-icon');

        // Detect and load username
        const detectedUsername = detectUsername();
        if (!CONFIG.notifier_username || CONFIG.notifier_username === 'Not Found') {
            saveConfig('notifier_username', detectedUsername);
        }
        usernameDisplay.textContent = CONFIG.notifier_username;

        // Load settings
        enabledSwitch.checked = CONFIG.notifier_enabled;
        keywords.value = CONFIG.notifier_keywords.join('\n');
        highlightColor.value = CONFIG.notifier_highlight_color;
        colorWrapper.style.backgroundColor = CONFIG.notifier_highlight_color;
        volumeSlider.value = CONFIG.notifier_sound_volume * 100;

        const volumeIcons = {
            mute: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>`,
            on: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>`
        };

        function updateVolumeIcon() {
            volumeIcon.innerHTML = volumeSlider.value == 0 ? volumeIcons.mute : volumeIcons.on;
        }
        updateVolumeIcon();

        // Event listeners
        enabledSwitch.addEventListener('change', (e) => {
            saveConfig('notifier_enabled', e.target.checked);
            if (e.target.checked) NotifierModule.init();
        });

        keywords.addEventListener('input', () => {
            const keywordList = keywords.value.split('\n').map(k => k.trim()).filter(k => k);
            saveConfig('notifier_keywords', keywordList);
        });

        resetKeywords.addEventListener('click', () => {
            keywords.value = '';
            saveConfig('notifier_keywords', []);
        });

        highlightColor.addEventListener('input', () => {
            saveConfig('notifier_highlight_color', highlightColor.value);
            colorWrapper.style.backgroundColor = highlightColor.value;
        });

        volumeSlider.addEventListener('input', () => {
            saveConfig('notifier_sound_volume', parseFloat(volumeSlider.value) / 100);
            updateVolumeIcon();
        });

        // Make notifier setting rows clickable
        document.querySelectorAll('.tbdm-tab-content[data-tab="notifier"] .tbdm-setting-row').forEach(row => {
            row.style.cursor = 'pointer';

            // Remove the for attribute from labels so they don't interfere
            const label = row.querySelector('label:first-child');
            if (label) label.removeAttribute('for');

            row.addEventListener('click', (e) => {
                if (e.target.closest('.tbdm-switch')) return;
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.click();
            });
        });
    }

    function setupFeaturesSettings() {
        const imageUpload = document.getElementById('tbdm-image-upload');
        const easyMention = document.getElementById('tbdm-easy-mention');
        const urlSender = document.getElementById('tbdm-url-sender');
        const focusLock = document.getElementById('tbdm-focus-lock');
        const idlePrevention = document.getElementById('tbdm-idle-prevention');

        // Load settings
        imageUpload.checked = CONFIG.image_upload_enabled;
        easyMention.checked = CONFIG.easy_mention_enabled;
        urlSender.checked = CONFIG.url_sender_enabled;
        focusLock.checked = CONFIG.focus_lock_enabled;
        idlePrevention.checked = CONFIG.idle_prevention_enabled;

        // Make feature cards clickable
        document.querySelectorAll('.tbdm-feature-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.closest('.tbdm-switch')) return;
                const checkbox = card.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.click();
            });
        });


        // Event listeners
        imageUpload.addEventListener('change', (e) => {
            saveConfig('image_upload_enabled', e.target.checked);
            if (e.target.checked) {
                ImageUploadModule.init();
            } else {
                // Remove upload button if exists
                const uploadBtn = document.getElementById('tbdm-image-upload-btn');
                if (uploadBtn) uploadBtn.remove();
            }
        });

        easyMention.addEventListener('change', (e) => {
            saveConfig('easy_mention_enabled', e.target.checked);
            if (e.target.checked) {
                EasyMentionModule.init();
            } else {
                EasyMentionModule.stop();
            }
        });

        urlSender.addEventListener('change', (e) => {
            saveConfig('url_sender_enabled', e.target.checked);
            if (e.target.checked) {
                URLSenderModule.init();
            } else {
                // Remove URL button and window if exists
                const urlBtn = document.getElementById('urlBtn');
                const urlWindow = document.getElementById('urlWindow');
                if (urlBtn) urlBtn.remove();
                if (urlWindow) urlWindow.remove();
            }
        });

        focusLock.addEventListener('change', (e) => {
            saveConfig('focus_lock_enabled', e.target.checked);
            if (e.target.checked) {
                FocusLockModule.init();
            } else {
                FocusLockModule.deactivateFocusLock();
            }
        });

        idlePrevention.addEventListener('change', (e) => {
            saveConfig('idle_prevention_enabled', e.target.checked);
            if (e.target.checked) {
                IdlePreventionModule.init();
            } else {
                IdlePreventionModule.stop();
            }
        });
    }

    function setupAutocompleteSettings() {
        const usernameAutocomplete = document.getElementById('tbdm-autocomplete-username');
        const stickerAutocomplete = document.getElementById('tbdm-autocomplete-sticker');
        const mappingsContainer = document.getElementById('tbdm-mappings-container');
        const addMappingBtn = document.getElementById('tbdm-add-mapping');
        const resetMappingsBtn = document.getElementById('tbdm-reset-mappings');

        // Load settings
        usernameAutocomplete.checked = CONFIG.autocomplete_username_enabled;
        stickerAutocomplete.checked = CONFIG.autocomplete_sticker_enabled;

        // Event listeners
        usernameAutocomplete.addEventListener('change', (e) => {
            saveConfig('autocomplete_username_enabled', e.target.checked);
            if (e.target.checked || CONFIG.autocomplete_sticker_enabled) {
                AutocompleteModule.init();
            } else if (!e.target.checked && !CONFIG.autocomplete_sticker_enabled) {
                AutocompleteModule.stop();
            }
        });

        stickerAutocomplete.addEventListener('change', (e) => {
            saveConfig('autocomplete_sticker_enabled', e.target.checked);
            if (e.target.checked || CONFIG.autocomplete_username_enabled) {
                AutocompleteModule.init();
            } else if (!e.target.checked && !CONFIG.autocomplete_username_enabled) {
                AutocompleteModule.stop();
            }
        });

        // Render mappings
        function renderMappings() {
            mappingsContainer.innerHTML = '';
            const mappings = CONFIG.autocomplete_mappings;

            Object.keys(mappings).forEach(key => {
                const row = document.createElement('div');
                row.className = 'tbdm-mapping-row';
                row.innerHTML = `
                    <input type="text" class="tbdm-mapping-key" value="${key}" placeholder="keyword" data-original-key="${key}">
                    <span>=</span>
                    <input type="text" class="tbdm-mapping-value" value="${mappings[key]}" placeholder=":emoji" data-original-key="${key}">
                    <button class="tbdm-delete-mapping" title="Delete" data-key="${key}">×</button>
                `;
                mappingsContainer.appendChild(row);

                const keyInput = row.querySelector('.tbdm-mapping-key');
                const valueInput = row.querySelector('.tbdm-mapping-value');
                const deleteBtn = row.querySelector('.tbdm-delete-mapping');

                keyInput.addEventListener('blur', () => {
                    const originalKey = keyInput.getAttribute('data-original-key');
                    const newKey = keyInput.value.trim();
                    if (newKey && newKey !== originalKey) {
                        updateMappingKey(originalKey, newKey);
                        keyInput.setAttribute('data-original-key', newKey);
                        // Update the data attribute for valueInput as well
                        valueInput.setAttribute('data-original-key', newKey);
                        // Update the delete button's data-key
                        deleteBtn.setAttribute('data-key', newKey);
                    }
                });

                valueInput.addEventListener('blur', () => {
                    const currentKey = keyInput.getAttribute('data-original-key');
                    const newValue = valueInput.value.trim();
                    const mappings = CONFIG.autocomplete_mappings;
                    if (newValue && newValue !== mappings[currentKey]) {
                        updateMappingValue(currentKey, newValue);
                    }
                });

                deleteBtn.addEventListener('click', () => {
                    const keyToDelete = deleteBtn.getAttribute('data-key');
                    deleteMapping(keyToDelete);
                });
            });
        }

        function updateMappingKey(oldKey, newKey) {
            const mappings = CONFIG.autocomplete_mappings;
            if (mappings.hasOwnProperty(oldKey)) {
                const value = mappings[oldKey];
                delete mappings[oldKey];
                mappings[newKey] = value;
                saveConfig('autocomplete_mappings', mappings);
            }
        }

        function updateMappingValue(key, newValue) {
            const mappings = CONFIG.autocomplete_mappings;
            if (mappings.hasOwnProperty(key)) {
                mappings[key] = newValue;
                saveConfig('autocomplete_mappings', mappings);
            }
        }

        function deleteMapping(key) {
            const mappings = CONFIG.autocomplete_mappings;
            delete mappings[key];
            saveConfig('autocomplete_mappings', mappings);
            renderMappings();
        }

        addMappingBtn.addEventListener('click', () => {
            const mappings = CONFIG.autocomplete_mappings;
            let newKey = 'new';
            let counter = 1;
            while (mappings.hasOwnProperty(newKey)) {
                newKey = `new${counter++}`;
            }
            mappings[newKey] = ':emoji';
            saveConfig('autocomplete_mappings', mappings);
            renderMappings();
        });

        resetMappingsBtn.addEventListener('click', () => {
            if (confirm('Reset all mappings to defaults?')) {
                const defaultMappings = {
                    'hi': ':hello',
                    'hello': ':hello',
                    'no': ':negative',
                    'nahi': ':sticker-mb-no',
                    'sad': ':sticker-pepe-face',
                    'lmao': ':lmao',
                    'justsaid': ':justsaid',
                    'wow': ':sticker-omg-wow',
                    'lol': ':sticker-jjj-laugh',
                    'why': ':sticker-cat-why',
                    'ty': ':thankyou',
                    'slap': ':slap',
                    'wont': ':sticker-sr-no',
                    'bruh': ':sticker-facepalm',
                    'yay': ':yepdance',
                    'aww': ':sticker-pepe-aw'
                };
                saveConfig('autocomplete_mappings', defaultMappings);
                renderMappings();
            }
        });

        renderMappings();

        // Make autocomplete setting rows clickable
        document.querySelectorAll('.tbdm-tab-content[data-tab="autocomplete"] .tbdm-setting-row').forEach(row => {
            row.style.cursor = 'pointer';

            // Remove the for attribute from labels so they don't interfere
            const label = row.querySelector('label:first-child');
            if (label) label.removeAttribute('for');

            row.addEventListener('click', (e) => {
                if (e.target.closest('.tbdm-switch')) return;
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.click();
            });
        });
    }

    function addSettingsButton() {
        const titleElement = document.querySelector('#shoutbox-container .content-title h6.left');
        if (titleElement && !document.querySelector("#tbdm-settings-btn")) {
            const btn = document.createElement("span");
            btn.id = "tbdm-settings-btn";
            btn.title = "Shoutbox Manager Settings";
            btn.textContent = "⚙️";
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const modal = document.getElementById('tbdm-modal-wrapper');
                modal.style.display = "flex";
            });
            titleElement.style.display = 'flex';
            titleElement.style.alignItems = 'center';
            titleElement.appendChild(btn);
        }
    }

    // ============================================================================
    // STYLES
    // ============================================================================

    GM_addStyle(`
        /* Modal Wrapper with Glass Effect */
        #tbdm-modal-wrapper {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        #tbdm-container {
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            color: #e0e0e0;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 100px rgba(20,167,108,0.15);
            display: flex;
            flex-direction: column;
            max-height: 80vh;
            overflow: hidden;
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Header with Gradient */
        #tbdm-header {
            padding: 20px 20px 16px;
            text-align: center;
            position: relative;
            background: linear-gradient(135deg, rgba(20,167,108,0.15) 0%, rgba(59,130,246,0.1) 100%);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        #tbdm-header h1 {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #14a76c 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 4px 0;
            letter-spacing: -0.5px;
        }
        #tbdm-header p {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
            font-weight: 400;
        }
        #tbdm-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: transparent;
            color: #6b7280;
            cursor: pointer;
            font-size: 24px;
            font-weight: 400;
            transition: color .2s;
            padding: 0;
            margin: 0;
            line-height: 24px;
            width: 24px;
            height: 24px;
            display: inline-block;
            text-align: center;
        }
        #tbdm-close-btn:hover {
            color: #ef4444;
        }

        /* Modern Tabs */
        #tbdm-tabs {
            display: flex;
            padding: 0 14px;
            gap: 4px;
            background: rgba(0,0,0,0.2);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            overflow-x: auto;
            flex-shrink: 0;
        }
        #tbdm-tabs::-webkit-scrollbar { height: 3px; }
        #tbdm-tabs::-webkit-scrollbar-track { background: transparent; }
        #tbdm-tabs::-webkit-scrollbar-thumb { background: rgba(20,167,108,0.3); border-radius: 10px; }
        .tbdm-tab {
            background: none;
            border: none;
            color: #6b7280;
            padding: 10px 14px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 3px solid transparent;
            transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            position: relative;
        }
        .tbdm-tab:hover {
            color: #d1d5db;
            background: rgba(255,255,255,0.03);
        }
        .tbdm-tab.active {
            color: #14a76c;
            border-bottom-color: #14a76c;
            background: rgba(20,167,108,0.08);
        }
        .tbdm-tab.active::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #14a76c, #3b82f6);
            box-shadow: 0 0 10px rgba(20,167,108,0.5);
        }

        /* Content Area */
        #tbdm-content {
            padding: 16px;
            overflow-y: auto;
            flex: 1;
            background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 100%);
            min-height: 0;
        }
        #tbdm-content::-webkit-scrollbar { width: 6px; }
        #tbdm-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        #tbdm-content::-webkit-scrollbar-thumb { background: rgba(20,167,108,0.3); border-radius: 10px; }
        #tbdm-content::-webkit-scrollbar-thumb:hover { background: rgba(20,167,108,0.5); }

        .tbdm-tab-content { display: none; animation: fadeInContent 0.3s ease; }
        .tbdm-tab-content.active { display: block; }
        @keyframes fadeInContent { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Feature Cards - New Modern Style */
        .tbdm-feature-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .tbdm-feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(20,167,108,0.1) 0%, rgba(59,130,246,0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tbdm-feature-card:hover {
            background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
            border-color: rgba(20,167,108,0.3);
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3), 0 0 25px rgba(20,167,108,0.12);
        }
        .tbdm-feature-card:hover::before { opacity: 1; }

        .tbdm-feature-header {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            position: relative;
            z-index: 1;
        }
        .tbdm-feature-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: linear-gradient(135deg, rgba(20,167,108,0.2) 0%, rgba(59,130,246,0.2) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }
        .tbdm-feature-info {
            flex: 1;
        }
        .tbdm-feature-title {
            font-size: 13px;
            font-weight: 600;
            color: #f3f4f6;
            margin-bottom: 2px;
        }
        .tbdm-feature-desc {
            font-size: 11px;
            color: #9ca3af;
            font-weight: 400;
        }

        /* Sections */
        .tbdm-section {
            margin-bottom: 16px;
        }
        .tbdm-section-header {
            font-size: 11px;
            text-transform: uppercase;
            color: #14a76c;
            margin: 0 0 10px 0;
            letter-spacing: 0.8px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .tbdm-divider {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.08);
            margin: 14px 0;
            box-shadow: 0 1px 0 rgba(0,0,0,0.2);
        }

        /* Settings Row - Cleaner Style */
        .tbdm-setting-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            margin-bottom: 6px;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.2s;
        }
        .tbdm-setting-row:hover {
            background: rgba(255,255,255,0.05);
            border-color: rgba(20,167,108,0.2);
        }
        .tbdm-setting-row label {
            font-size: 13px !important;
            margin-bottom: 0 !important;
        }
        .tbdm-master-switch {
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(20,167,108,0.12) 0%, rgba(59,130,246,0.08) 100%);
            border: 1px solid rgba(20,167,108,0.3);
            margin-bottom: 10px;
        }
        .tbdm-master-switch label:first-child {
            font-size: 15px !important;
            font-weight: 700;
            color: #fff;
        }

        /* Compact Switch for Settings Rows */
        .tbdm-setting-row .tbdm-switch {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 24px;
            flex-shrink: 0;
            cursor: pointer;
        }
        .tbdm-setting-row .tbdm-switch input { opacity: 0; width: 0; height: 0; }
        .tbdm-setting-row .tbdm-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
            transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 24px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .tbdm-setting-row .tbdm-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
            transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .tbdm-setting-row input:checked + .tbdm-slider {
            background: linear-gradient(135deg, #14a76c 0%, #10b981 100%);
            box-shadow: 0 0 15px rgba(20,167,108,0.4), inset 0 1px 3px rgba(255,255,255,0.2);
        }
        .tbdm-setting-row input:checked + .tbdm-slider:before {
            transform: translateX(18px);
            background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
        }

        /* Modern Switch for Master and Feature Cards */
        .tbdm-master-switch .tbdm-switch,
        .tbdm-feature-card .tbdm-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 28px;
            flex-shrink: 0;
            cursor: pointer;
        }
        .tbdm-master-switch .tbdm-switch input,
        .tbdm-feature-card .tbdm-switch input { opacity: 0; width: 0; height: 0; }
        .tbdm-master-switch .tbdm-slider,
        .tbdm-feature-card .tbdm-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
            transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 28px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .tbdm-master-switch .tbdm-slider:before,
        .tbdm-feature-card .tbdm-slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
            transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .tbdm-master-switch input:checked + .tbdm-slider,
        .tbdm-feature-card input:checked + .tbdm-slider {
            background: linear-gradient(135deg, #14a76c 0%, #10b981 100%);
            box-shadow: 0 0 20px rgba(20,167,108,0.4), inset 0 1px 3px rgba(255,255,255,0.2);
        }
        .tbdm-master-switch input:checked + .tbdm-slider:before,
        .tbdm-feature-card input:checked + .tbdm-slider:before {
            transform: translateX(22px);
            background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
        }

        /* Form Elements with Glow */
        .tbdm-form-group { margin-bottom: 16px; }
        #tbdm-content label {
            font-weight: 600;
            color: #d1d5db;
            font-size: 12px;
            display: block;
            margin-bottom: 6px;
            letter-spacing: 0.3px;
        }
        .tbdm-label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        textarea {
            width: 100%;
            height: 80px;
            resize: vertical;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 10px 12px;
            font-size: 13px;
            box-sizing: border-box;
            color: #f3f4f6;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            transition: all 0.3s;
        }
        textarea:focus {
            outline: none;
            border-color: #14a76c;
            background: rgba(0,0,0,0.4);
            box-shadow: 0 0 0 3px rgba(20,167,108,0.15), 0 0 20px rgba(20,167,108,0.1);
        }
        textarea:disabled { opacity: 0.4; cursor: not-allowed; }

        #tbdm-username-display {
            background: rgba(20,167,108,0.12);
            border: 1px solid rgba(20,167,108,0.3);
            border-radius: 10px;
            color: #14a76c;
            padding: 12px 14px;
            font-size: 14px;
            font-weight: 600;
            box-sizing: border-box;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }
        #tbdm-keywords { height: 100px; }
        #tbdm-blocked-user-ids { height: 80px; }
        #tbdm-blocked-keywords { height: 80px; }

        /* Color Picker with Preview */
        .tbdm-controls-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 12px; }
        #tbdm-color-picker-wrapper {
            position: relative;
            width: 100%;
            height: 44px;
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        #tbdm-color-picker-wrapper:hover {
            border-color: rgba(20,167,108,0.4);
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(20,167,108,0.2);
        }
        #tbdm-highlight-color {
            position: absolute;
            top: -5px;
            left: -5px;
            width: calc(100% + 10px);
            height: calc(100% + 10px);
            border: none;
            padding: 0;
            cursor: pointer;
        }

        /* Volume Control */
        .tbdm-volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
            height: 44px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 0 14px;
            box-sizing: border-box;
            transition: all 0.3s;
        }
        .tbdm-volume-control:hover {
            border-color: rgba(20,167,108,0.3);
            background: rgba(0,0,0,0.4);
        }
        #tbdm-volume-icon { color: #14a76c; width: 20px; height: 20px; flex-shrink: 0; }
        #tbdm-volume {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 5px;
            background: linear-gradient(to right, #14a76c 0%, #374151 0%);
            border-radius: 5px;
            outline: none;
            transition: all 0.3s;
        }
        #tbdm-volume::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #14a76c 0%, #10b981 100%);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(20,167,108,0.4), 0 0 0 3px rgba(20,167,108,0.15);
            transition: all 0.2s;
            margin-top: -5.5px;
        }
        #tbdm-volume::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 10px rgba(20,167,108,0.6), 0 0 0 5px rgba(20,167,108,0.2);
        }
        #tbdm-volume::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #14a76c 0%, #10b981 100%);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(20,167,108,0.4);
        }
        #tbdm-volume::-webkit-slider-runnable-track {
            height: 5px;
            border-radius: 5px;
        }
        #tbdm-volume::-moz-range-track {
            height: 5px;
            border-radius: 5px;
        }

        /* Buttons with Gradients */
        button { font-family: inherit; }
        #tbdm-reset-keywords, .tbdm-secondary-btn {
            background: linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.1) 100%);
            border: 1px solid rgba(239,68,68,0.3);
            color: #f87171;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 6px;
            transition: all 0.3s;
            white-space: nowrap;
        }
        #tbdm-reset-keywords:hover, .tbdm-secondary-btn:hover {
            background: linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(220,38,38,0.15) 100%);
            border-color: rgba(239,68,68,0.5);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239,68,68,0.2);
        }
        .tbdm-primary-btn {
            background: linear-gradient(135deg, #14a76c 0%, #10b981 100%);
            border: none;
            color: #fff;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(20,167,108,0.3);
        }
        .tbdm-primary-btn:hover {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(20,167,108,0.4);
        }
        .tbdm-primary-btn:active {
            transform: translateY(0);
        }

        /* Mappings */
        .tbdm-mapping-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }
        .tbdm-help-text {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
            padding: 8px 12px;
            background: rgba(59,130,246,0.08);
            border-left: 3px solid #3b82f6;
            border-radius: 6px;
            flex: 1;
        }
        #tbdm-mappings-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 10px;
            max-height: 250px;
            overflow-y: auto;
            padding: 2px;
        }
        #tbdm-mappings-container::-webkit-scrollbar { width: 5px; }
        #tbdm-mappings-container::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        #tbdm-mappings-container::-webkit-scrollbar-thumb { background: rgba(20,167,108,0.3); border-radius: 10px; }

        .tbdm-mapping-row {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.03);
            padding: 4px 6px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.2s;
        }
        .tbdm-mapping-row:hover {
            background: rgba(255,255,255,0.05);
            border-color: rgba(20,167,108,0.2);
        }
        .tbdm-mapping-key, .tbdm-mapping-value {
            flex: 1;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 5px;
            padding: 6px 8px;
            font-size: 12px;
            color: #f3f4f6;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            transition: all 0.2s;
        }
        .tbdm-mapping-key:focus, .tbdm-mapping-value:focus {
            outline: none;
            border-color: #14a76c;
            background: rgba(0,0,0,0.4);
            box-shadow: 0 0 0 2px rgba(20,167,108,0.1);
        }
        .tbdm-mapping-row span {
            color: #6b7280;
            font-weight: bold;
            font-size: 12px;
        }
        .tbdm-delete-mapping {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.2);
            color: #f87171;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            transition: all 0.3s;
            flex-shrink: 0;
        }
        .tbdm-delete-mapping:hover {
            background: rgba(239,68,68,0.2);
            border-color: rgba(239,68,68,0.4);
            transform: scale(1.1) rotate(90deg);
        }

        /* Settings Button */
        #tbdm-settings-btn {
            cursor: pointer;
            margin-left: 10px;
            font-size: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all .3s ease;
            opacity: 0.7;
        }
        #tbdm-settings-btn:hover {
            opacity: 1;
            transform: rotate(90deg) scale(1.1);
        }

        /* Easy Mention Styles */
        .shout-user { user-select: none; }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]) { cursor: pointer; position: relative; }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover { margin-left: -1.5em; }
        .chromium span.shout-time:has(+ .shout-user [href^="account"])::after { content: ""; margin-left: .5em; height: 1em; rotate: 180deg; display: none; width: 1em; }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover::after { display: inline-block; }
        .firefox span.shout-time { cursor: pointer; position: relative; }
        .firefox span.shout-time:hover { margin-left: -1.5em; }
        .firefox span.shout-time::after { content: ""; margin-left: .5em; height: 1em; rotate: 180deg; display: none; width: 1em; }
        .firefox span.shout-time:hover::after { display: inline-block; }
        .dark-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>'); }
        .light-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>'); }
        .dark-scheme.firefox span.shout-time::after { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>'); }
        .light-scheme.firefox span.shout-time::after { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>'); }

        /* URL Sender Styles */
            #shout-ibb-container {
            display: flex;
            gap: 0 .5rem;
            margin-right: 0;
            padding-right: .5rem;
            right: 0;
            position: absolute;
        }

        /* Keep history button always on the right */
        #shoutHistoryBtn {
            margin-left: auto !important;
            order: 999 !important;
        }
        #shout-send-container { position: relative; }
        #urlWindow { position: absolute; width: 100%; left: 0; flex-flow: wrap; bottom: 7px; gap: 0.5rem; display: flex; transition: visibility 0s linear .2s, opacity .1s linear .1s, translate .2s linear; visibility: hidden; background: var(--main-bg); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding-top: 0.5rem; padding-bottom: 0.5rem; opacity: 0; }
        .spotlight #urlWindow { bottom: 28px; }
        #urlWindow.show { visibility: visible; translate: 0 -30px; transition-delay: 0s; opacity: 1; }
        .url-inputs { height: 37px; color: var(--text-color) !important; background: var(--main-bg); padding: 0px .5rem; border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color); border-left: none; border-right: none; outline: 0; }
        .spotlight .url-inputs { height: 60px; }
        #urlField { flex: 1 1 100%; }
        #labelField { flex: 4 1 auto; border-right: 1px solid var(--border-color); }
        #submitURL { flex: 1 1 auto; background: transparent; border: 1px solid var(--border-color); border-right: none; color: var(--text-color); font-weight: 600; font-size: 0.9rem; cursor: pointer; }
        #urlBtn i { line-height: 37px; font-size: 0.9rem; font-weight: 600; font-family: inherit; user-select: none; }
        input.shoutbox-text { width: auto !important; }
        input#shout_text { padding-right: 170px; }
        .spotlight input#shout_text { padding-left: .5rem; padding-right: calc(220px - .5rem); }
        @media(max-width: 767px) {
            .spotlight input#shout_text { padding-right: calc(200px - .5rem); }
            .spotlight #shout-ibb-container { padding-right: .5rem; }
            #tbdm-container { width: 95%; max-width: 95%; border-radius: 16px; }
            #tbdm-tabs { padding: 0 12px; gap: 4px; }
            .tbdm-tab { padding: 12px 14px; font-size: 13px; }
            .tbdm-controls-row { grid-template-columns: 1fr; }
        }

        /* Mobile Improvements */
        input#shout_text.shoutbox-text { -webkit-text-size-adjust: 100%; }
        input#shout_text { autocapitalize: on; }
    `);

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    let scriptInitialized = false;

    function waitForElement(selector, callback, maxRetries = 100) {
        let retries = 0;
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            }
            retries++;
            if (retries > maxRetries) clearInterval(checkInterval);
        }, 100);
    }

    function initializeScript() {
        if (scriptInitialized) return;

        const shoutboxContainer = document.querySelector('#shoutbox-container');
        if (!shoutboxContainer) {
            setTimeout(initializeScript, 500);
            return;
        }

        scriptInitialized = true;

        if (CONFIG.cleaner_enabled) CleanerModule.init();
        if (CONFIG.notifier_enabled) NotifierModule.init();
        if (CONFIG.image_upload_enabled) ImageUploadModule.init();
        if (CONFIG.easy_mention_enabled) EasyMentionModule.init();
        if (CONFIG.url_sender_enabled) URLSenderModule.init();
        if (CONFIG.autocomplete_username_enabled || CONFIG.autocomplete_sticker_enabled) AutocompleteModule.init();
        if (CONFIG.focus_lock_enabled) FocusLockModule.init();
        if (CONFIG.idle_prevention_enabled) IdlePreventionModule.init();

        createSettingsUI();

        waitForElement('#shoutbox-container .content-title h6.left', addSettingsButton);

        const shoutInput = document.querySelector("#shout_text");
        if (shoutInput) shoutInput.setAttribute("autocapitalize", "on");

        const viewport = document.querySelector("meta[name='viewport']");
        if (viewport) {
            viewport.setAttribute("content", "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no");
        }
    }

    setTimeout(initializeScript, 1000);
    setTimeout(initializeScript, 3000);
    if (document.readyState !== 'loading') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript);
    }

})();
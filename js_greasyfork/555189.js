// ==UserScript==
// @name         TorrentBD Shoutbox Manager
// @namespace    TBD-Shoutbox-Manager
// @version      1.2.3
// @description  Complete shoutbox overhaul
// @author       CornHub
// @license      MIT
// @match        https://www.torrentbd.com/
// @match        https://www.torrentbd.net/
// @match        https://www.torrentbd.org/
// @match        https://www.torrentbd.me/
// @match        https://www.torrentbd.net/?spotlight
// @match        https://www.torrentbd.com/?spotlight
// @match        https://www.torrentbd.org/?spotlight
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
        image_upload_enabled: GM_getValue('tbdm_image_upload_enabled', true),

        // Easy Mention Module
        easy_mention_enabled: GM_getValue('tbdm_easy_mention_enabled', true),

        // URL Sender Module
        url_sender_enabled: GM_getValue('tbdm_url_sender_enabled', false),

        // GIF Picker Module
        gif_picker_enabled: GM_getValue('tbdm_gif_picker_enabled', true),
        gif_picker_tenor_key: GM_getValue('tbdm_gif_picker_tenor_key', 'AIzaSyCGj4Qj1j0MBns1v2rWhlvJWRBkCNgIFyo'),
        gif_picker_giphy_key: GM_getValue('tbdm_gif_picker_giphy_key', ''),

        meme_creator_enabled: GM_getValue('tbdm_meme_creator_enabled', false),

        // Unicode Emoji Module
        unicode_emoji_enabled: GM_getValue('tbdm_unicode_emoji_enabled', false),

        // Image Viewer Module
        image_viewer_enabled: GM_getValue('tbdm_image_viewer_enabled', true),

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
            'wow': ':sticker-omg-wow',
            'lol': ':sticker-jjj-laugh',
            'why': ':sticker-cat-why',
            'ty': ':thankyou',
            'wont': ':sticker-sr-no',
            'bruh': ':sticker-facepalm',
            'yay': ':yepdance',
            'aww': ':sticker-pepe-aw',
            'laugh': ':sticker-pepe-laugh',
            'salute': ':sticker-pepe-salute',
            'ohh': ':sticker-cp-ohh',
            'doge': ':sticker-doge',
            'dance': ':sticker-dancing-doge',
            'pepeog': ':sticker-pepe-og',
            'ekb': ':sticker-ekb',
            'police': ':sticker-pepe-police',
            'yes': ':sticker-yes',
            'wut': ':sticker-pepe-wut',
            'exp': ':sticker-pepe-exp',
            'knock': ':sticker-death-knock',
            'rules': 'https://www.torrentbd.net/rules.php',
            'faq': 'https://www.torrentbd.net/faq.php'
        }),

        // Focus Lock Module
        focus_lock_enabled: GM_getValue('tbdm_focus_lock_enabled', true),

        // Idle Prevention Module
        idle_prevention_enabled: GM_getValue('tbdm_idle_prevention_enabled', true)
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

            // Close unicode emoji picker if open
            const unicodePicker = document.getElementById("spotlight-emojis");
            if (unicodePicker && unicodePicker.classList.contains("active")) {
                unicodePicker.classList.remove("active");
            }

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
    // MODULE 6: AUTOCOMPLETE
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
    // MODULE 7: INPUT LOCK
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
    // MODULE 9: GIF PICKER (FIXED)
    // ============================================================================

    const GifPickerModule = {
        TENOR_API_KEY: CONFIG.gif_picker_tenor_key,
        GIPHY_KEY_POOL_URL: 'https://giphyapitbd.mushi53566.workers.dev/keys',
        GIFS_PER_REQUEST: 20,

        modal: null,
        searchBox: null,
        resultsArea: null,
        gifButton: null,
        headerBar: null,
        currentGiphyKey: null,
        keyExpiryTime: 0,
        currentPage: 1,
        lastQuery: '',
        tenorPos: '',
        seenGifUrls: new Set(),
        activeInput: null,
        currentInputType: 'shoutbox',
        commandStartPos: 0,
        activeRequests: new Set(),
        requestId: 0,
        isDragging: false,
        hasMoved: false,

        CUSTOM_GIF_SVG: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 10H9.5C9.22386 10 9 10.2239 9 10.5V13.5C9 13.7761 9.22386 14 9.5 14H10V12.5H9.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 10V14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 10H17.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 12H17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 10V14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        createModal() {
            const html = `
                <div id="gif-tool-modal" role="dialog" style="position:fixed;width:440px;max-width:90vw;background:#2f3136;border:1px solid #444;border-radius:8px;z-index:2147483647;display:none;box-shadow:0 10px 30px rgba(0,0,0,0.8);overflow:hidden;flex-direction:column;top:auto;">
                    <div id="gif-tool-header" style="height:24px;background:#202225;cursor:grab;display:flex;align-items:center;justify-content:space-between;padding:0 8px;border-bottom:1px solid #36393f;flex-shrink:0;">
                        <span id="gif-tool-title" style="font-size:11px;color:#aaa;font-weight:bold;user-select:none;text-transform:uppercase;letter-spacing:0.5px;">Gif Picker</span>
                        <button id="gif-tool-close" aria-label="Close" style="background:none;border:none;color:#aaa;font-size:18px;cursor:pointer;line-height:1;padding:0;">&times;</button>
                    </div>
                    <div id="gif-tool-content" style="padding:8px;display:flex;flex-direction:column;gap:8px;">
                        <div id="gif-tool-results" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;max-height:320px;min-height:100px;overflow-y:auto;"></div>
                        <div id="gif-tool-controls" style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
                            <input id="gif-tool-search" placeholder="Search GIFs..." autocomplete="off" style="flex:1;padding:6px 10px;background:#40444b;border:1px solid #555;color:#fff;border-radius:6px;font-size:13px;outline:none;"/>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            this.modal = document.getElementById('gif-tool-modal');
            this.headerBar = document.getElementById('gif-tool-header');
            this.searchBox = document.getElementById('gif-tool-search');
            this.resultsArea = document.getElementById('gif-tool-results');

            const debouncedSearch = this.debounce((val) => this.handleSearch(val), 300);
            this.searchBox.addEventListener('input', () => debouncedSearch(this.searchBox.value.trim()));
            document.getElementById('gif-tool-close').addEventListener('click', () => this.closeModal());

            this.resultsArea.addEventListener('scroll', () => {
                if (this.resultsArea.scrollTop + this.resultsArea.clientHeight >= this.resultsArea.scrollHeight - 50) {
                    if (this.lastQuery.length > 2 && this.activeRequests.size === 0) this.fetchGifs(this.lastQuery, false);
                }
            });

            this.modal.addEventListener('mouseenter', () => {
                if (this.modal.style.display === 'flex' && !this.isDragging) {
                    this.searchBox.focus();
                }
            });

            this.modal.addEventListener('mouseover', (e) => {
                if (this.modal.style.display === 'flex' && !this.isDragging &&
                    document.activeElement !== this.searchBox &&
                    !e.target.closest('#gif-tool-results img')) {
                    this.searchBox.focus();
                }
            });

            this.setupDraggable();
        },

        setupDraggable() {
            let startX, startY, startLeft, startBottom;

            this.headerBar.addEventListener('mousedown', (e) => {
                if (e.target.id === 'gif-tool-close') return;
                e.preventDefault();
                this.isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = this.modal.getBoundingClientRect();
                startLeft = rect.left;

                const computedStyle = window.getComputedStyle(this.modal);
                const cssBottom = parseInt(computedStyle.bottom);
                if (isNaN(cssBottom)) {
                    startBottom = window.innerHeight - rect.bottom;
                } else {
                    startBottom = cssBottom;
                }

                const onMouseMove = (e) => {
                    if (!this.isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    this.modal.style.left = `${startLeft + dx}px`;
                    this.modal.style.bottom = `${startBottom - dy}px`;
                    this.modal.style.top = 'auto';
                };

                const onMouseUp = () => {
                    this.isDragging = false;
                    this.hasMoved = true;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    this.constrainToViewport();
                    this.savePosition();
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        },

        savePosition() {
            if (!this.modal) return;
            const rect = this.modal.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const pos = {
                rightDist: viewportWidth - rect.right,
                bottomDist: viewportHeight - rect.bottom,
                width: viewportWidth,
                height: viewportHeight
            };
            localStorage.setItem('tbd_gif_pos_v2', JSON.stringify(pos));
        },

        constrainToViewport() {
            if (!this.modal || this.modal.style.display !== 'flex') return;

            const rect = this.modal.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 10;

            let left = parseInt(this.modal.style.left) || rect.left;
            let bottom = parseInt(this.modal.style.bottom);

            if (isNaN(bottom)) {
                bottom = viewportHeight - rect.bottom;
            }

            const modalHeight = rect.height;
            const top = viewportHeight - bottom - modalHeight;

            const maxLeft = viewportWidth - rect.width - margin;
            if (left < margin) left = margin;
            if (left > maxLeft) left = maxLeft;

            if (top < margin) {
                bottom = viewportHeight - modalHeight - margin;
            }
            if (bottom < margin) {
                bottom = margin;
            }

            this.modal.style.left = `${left}px`;
            this.modal.style.bottom = `${bottom}px`;
            this.modal.style.top = 'auto';
        },

        restorePosition(anchor) {
            const saved = localStorage.getItem('tbd_gif_pos_v2');
            if (saved) {
                try {
                    const pos = JSON.parse(saved);
                    if (pos.rightDist !== undefined && pos.bottomDist !== undefined) {
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        const rect = this.modal.getBoundingClientRect();

                        const left = viewportWidth - pos.rightDist - rect.width;
                        const bottom = pos.bottomDist;

                        this.modal.style.left = `${left}px`;
                        this.modal.style.bottom = `${bottom}px`;
                        this.modal.style.top = 'auto';
                        this.hasMoved = true;
                        setTimeout(() => this.constrainToViewport(), 0);
                        return;
                    }
                } catch(e) { console.error('Invalid saved pos'); }
            }

            if (anchor && !this.hasMoved) {
                const rect = anchor.getBoundingClientRect();
                let left = rect.right - 440;
                if (left < 10) left = 10;
                const bottom = window.innerHeight - rect.top + 10;
                this.modal.style.left = `${left}px`;
                this.modal.style.bottom = `${bottom}px`;
                this.modal.style.top = 'auto';
                setTimeout(() => this.constrainToViewport(), 0);
            }
        },

        addGifButton() {
            const tray = document.querySelector('#shout-ibb-container');
            if (!tray || document.getElementById('tbdm-gif-tool-btn')) return;

            this.gifButton = document.createElement('span');
            this.gifButton.id = 'tbdm-gif-tool-btn';
            this.gifButton.className = 'inline-submit-btn';
            this.gifButton.title = 'Insert GIF';
            this.gifButton.innerHTML = this.CUSTOM_GIF_SVG;
            const isSpotlight = document.body.classList.contains('spotlight-mode') ||
                    window.location.search.includes('spotlight');

            const topValue = isSpotlight ? '17px' : '6px';
            this.gifButton.style.cssText = `display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#ccc;position:relative;top:${topValue};height:24px;width:28px;margin-left:4px;margin-right:2px;`;
            this.gifButton.addEventListener('click', (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                const input = document.querySelector('#shout_text');
                if (input) {
                    if(this.modal.style.display === 'flex') this.closeModal();
                    else this.openModal(input, 'shoutbox', this.gifButton);
                }
            });

            const targetBtn = tray.querySelector('#tbd-uploader-button')
                           || tray.querySelector('#imgbd-uploader-btn')
                           || tray.querySelector('#urlBtn')
                           || tray.querySelector('#tbdm-image-upload-btn');

            if (targetBtn) {
                tray.insertBefore(this.gifButton, targetBtn);
            } else {
                tray.appendChild(this.gifButton);
            }
        },

        handleSearch(q) {
            this.activeRequests.forEach(r => r && r.abort && r.abort());
            this.activeRequests.clear();
            if (!q || q.length <= 2) {
                this.resultsArea.innerHTML = '';
                this.lastQuery = '';
                this.tenorPos = '';
                return;
            }
            if (q !== this.lastQuery) {
                this.lastQuery = q;
                this.currentPage = 1;
                this.tenorPos = '';
                this.seenGifUrls.clear();
                this.resultsArea.innerHTML = '';
            }
            this.fetchGifs(q, true);
        },

        async fetchGiphyKey() {
            const now = Date.now();
            if (this.currentGiphyKey && now < this.keyExpiryTime) return this.currentGiphyKey;
            try {
                const resp = await fetch(this.GIPHY_KEY_POOL_URL);
                if (!resp.ok) throw new Error();
                const d = await resp.json();
                if (d.api_key) {
                    this.currentGiphyKey = d.api_key;
                    this.keyExpiryTime = Date.now() + 3600000;
                    return this.currentGiphyKey;
                }
            } catch (e) { return null; }
        },

        showLoading() {
            if (!this.resultsArea.querySelector('.gif-loading')) {
                const loader = document.createElement('div');
                loader.className = 'gif-loading';
                loader.style.cssText = 'text-align:center;color:#888;padding:20px;grid-column:1/-1;';
                loader.textContent = 'Loading...';
                this.resultsArea.appendChild(loader);
            }
        },

        hideLoading() {
            const el = this.resultsArea.querySelector('.gif-loading');
            if (el) el.remove();
        },

        async fetchGifs(query, isNewSearch) {
            if (!query) return;
            if (isNewSearch) this.showLoading();

            const myRequestId = ++this.requestId;
            await this.fetchGiphyKey();

            const tenorParams = new URLSearchParams({
                q: query,
                key: this.TENOR_API_KEY,
                limit: this.GIFS_PER_REQUEST,
                media_filter: 'minimal'
            });
            if (this.tenorPos) tenorParams.set('pos', this.tenorPos);

            const tenorReq = GM_xmlhttpRequest({
                method: 'GET',
                url: `https://tenor.googleapis.com/v2/search?${tenorParams}`,
                onload: (res) => {
                    this.activeRequests.delete(tenorReq);
                    if (myRequestId !== this.requestId || res.status !== 200) return this.checkRequestsComplete();
                    try {
                        const d = JSON.parse(res.responseText);
                        this.renderGifs(d.results, 'tenor');
                        this.tenorPos = d.next || '';
                    } catch (e) {}
                    this.checkRequestsComplete();
                },
                onerror: () => {
                    this.activeRequests.delete(tenorReq);
                    this.checkRequestsComplete();
                }
            });
            this.activeRequests.add(tenorReq);

            if (this.currentGiphyKey) {
                const offset = (this.currentPage - 1) * this.GIFS_PER_REQUEST;
                const giphyReq = GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.giphy.com/v1/gifs/search?api_key=${this.currentGiphyKey}&q=${encodeURIComponent(query)}&limit=${this.GIFS_PER_REQUEST}&offset=${offset}`,
                    onload: (res) => {
                        this.activeRequests.delete(giphyReq);
                        if (myRequestId !== this.requestId) return this.checkRequestsComplete();
                        if (res.status === 200) {
                            try {
                                this.renderGifs(JSON.parse(res.responseText).data, 'giphy');
                            } catch (e) {}
                        }
                        this.checkRequestsComplete();
                    },
                    onerror: () => {
                        this.activeRequests.delete(giphyReq);
                        this.checkRequestsComplete();
                    }
                });
                this.activeRequests.add(giphyReq);
            }
        },

        checkRequestsComplete() {
            if (this.activeRequests.size === 0) {
                this.hideLoading();
                this.currentPage++;
            }
        },

        renderGifs(results, source) {
            if (!results || results.length === 0) return;

            this.hideLoading();

            const fragment = document.createDocumentFragment();
            results.forEach(gif => {
                let thumb, direct;
                if (source === 'tenor') {
                    if (!gif.media_formats) return;
                    thumb = gif.media_formats.tinygif?.url || gif.media_formats.gif?.url;
                    direct = gif.media_formats.gif?.url || gif.url;
                } else {
                    thumb = gif.images?.fixed_height_small?.url || gif.images?.fixed_height?.url;
                    direct = gif.images?.original?.url;
                }
                if (!thumb || this.seenGifUrls.has(direct)) return;
                this.seenGifUrls.add(direct);

                const img = document.createElement('img');
                img.src = thumb;
                img.dataset.direct = direct;
                img.style.cssText = 'width:100%;height:80px;object-fit:cover;cursor:pointer;border-radius:4px;transition:all .12s;border:2px solid transparent;background:#202225;opacity:0;';
                img.onload = () => img.style.opacity = '1';
                img.onerror = () => { img.remove(); this.seenGifUrls.delete(direct); };
                img.onclick = (e) => {
                    e.stopPropagation();
                    this.insertGif(img.dataset.direct);
                };
                fragment.appendChild(img);
            });
            this.resultsArea.appendChild(fragment);
        },

        getShortenedUrl(direct) {
            const gmatch = direct.match(/giphy\.com\/media\/[^/]+\/([^/]+)\//);
            if (gmatch) return `https://i.giphy.com/${gmatch[1]}.webp`;
            const tmatch = direct.match(/media\.tenor\.com\/images\/([^/]+)\//) || direct.match(/media\.tenor\.com\/([^/]+)/);
            if (tmatch) return `https://c.tenor.com/${tmatch[1]}`;
            return direct;
        },

        insertGif(directUrl) {
            if (!this.activeInput) return;
            const text = (this.currentInputType === 'shoutbox')
                ? this.getShortenedUrl(directUrl)
                : `[img]${directUrl}[/img]`;

            const cur = this.activeInput.value;
            const before = cur.substring(0, this.commandStartPos);
            const after = cur.substring(this.activeInput.selectionStart || cur.length);
            const toInsert = text + ' ';

            this.activeInput.value = before + toInsert + after;
            const newCursorPos = before.length + toInsert.length;

            this.closeModal();
            setTimeout(() => {
                this.activeInput.focus();
                this.activeInput.setSelectionRange(newCursorPos, newCursorPos);
                this.activeInput = null;
            }, 50);
        },

        openModal(inputEl, inputType, anchorEl) {
            this.activeInput = inputEl;
            this.currentInputType = inputType || 'shoutbox';
            this.commandStartPos = inputEl.selectionStart || inputEl.value.length;
            this.restorePosition(anchorEl);
            this.modal.style.display = 'flex';
            this.searchBox.value = '';
            this.searchBox.focus();
            this.resultsArea.innerHTML = '';
            this.currentPage = 1;
            this.lastQuery = '';
            this.tenorPos = '';
            this.seenGifUrls.clear();
        },

        closeModal() {
            this.modal.style.display = 'none';
            this.searchBox.value = '';
            this.resultsArea.innerHTML = '';
            this.currentPage = 1;
            this.lastQuery = '';
            this.tenorPos = '';
            this.seenGifUrls.clear();
            this.activeRequests.forEach(r => r && r.abort && r.abort());
            this.activeRequests.clear();
        },

        setupInputListener() {
            const el = document.querySelector('#shout_text');
            if (!el) return;

            el.addEventListener('input', () => {
                const pos = el.selectionStart || 0;
                const before = el.value.substring(0, pos);
                const m = before.match(/\/gif\s*(.*)$/);

                if (m) {
                    this.commandStartPos = pos - m[0].length;
                    this.activeInput = el;
                    this.currentInputType = 'shoutbox';

                    if (this.modal.style.display !== 'flex') {
                        this.restorePosition(this.gifButton);
                        this.modal.style.display = 'flex';
                        this.searchBox.focus();
                    }

                    if (m[1].trim()) {
                        this.handleSearch(m[1].trim());
                    }
                } else if (this.modal.style.display === 'flex' && this.activeInput === el) {
                    this.closeModal();
                }
            });
        },

        init() {
            if (!CONFIG.gif_picker_enabled) return;
            this.TENOR_API_KEY = CONFIG.gif_picker_tenor_key;
            this.createModal();
            this.addGifButton();
            this.setupInputListener();

            const resizeHandler = this.debounce(() => {
                if (this.modal && this.modal.style.display === 'flex') {
                    this.constrainToViewport();
                    this.savePosition();
                }
            }, 150);
            window.addEventListener('resize', resizeHandler);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                    e.preventDefault();
                    this.closeModal();
                    if (this.activeInput) this.activeInput.focus();
                }
            });
        },

        stop() {
            const btn = document.getElementById('tbdm-gif-tool-btn');
            if (btn) btn.remove();
            if (this.modal) this.closeModal();
        }
    };



    // ============================================================================
    // MODULE 10: IMAGE VIEWER
    // ============================================================================

    const ImageViewerModule = {
        regex: {
            image: /https?:\/\/[^\s'"><]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s'">]*)?(?=[^\w\-]|$)/gi,
            tenor: /https?:\/\/(?:c|media)\.tenor\.com\/[^\s'"><]+/gi,
            giphy: /https?:\/\/i\.giphy\.com\/[^\s'"><]+/gi,
            lightshot: /https?:\/\/prnt\.sc\/[a-zA-Z0-9\-_]+/gi,
            ibb: /https?:\/\/ibb\.co\.com\/[a-zA-Z0-9\-_]+/gi,
            gifyu: /https?:\/\/gifyu\.com\/image\/[a-zA-Z0-9\-_]+/gi,
            imgbox: /https?:\/\/imgbox\.com\/[a-zA-Z0-9\-_]+/gi
        },

        resolvePageImage(url) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { "User-Agent": "Mozilla/5.0" },
                    onload: function (response) {
                        const html = response.responseText;
                        const match = html.match(/<meta[^>]+(?:name|property)=["'](?:twitter:image:src|og:image)["'][^>]+content=["']([^"']+)["']/i);
                        if (match && match[1]) {
                            resolve(match[1]);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function () {
                        resolve(null);
                    }
                });
            });
        },

        convertLinksInNode(node) {
            const textField = node.querySelector('.shout-text');
            if (!textField) return;

            const walker = document.createTreeWalker(textField, NodeFilter.SHOW_TEXT, null);
            const textNodes = [];
            let curr;
            while ((curr = walker.nextNode())) textNodes.push(curr);

            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const r = this.regex;

                if (!r.image.test(text) && !r.tenor.test(text) && !r.giphy.test(text) &&
                    !r.lightshot.test(text) && !r.ibb.test(text) && !r.gifyu.test(text) &&
                    !r.imgbox.test(text)) return;

                const frag = document.createDocumentFragment();
                let lastIndex = 0;

                r.image.lastIndex = 0;
                r.tenor.lastIndex = 0;
                r.giphy.lastIndex = 0;
                r.lightshot.lastIndex = 0;
                r.ibb.lastIndex = 0;
                r.gifyu.lastIndex = 0;
                r.imgbox.lastIndex = 0;

                while (true) {
                    const mImg = r.image.exec(text);
                    const mTen = r.tenor.exec(text);
                    const mGiphy = r.giphy.exec(text);
                    const mLs = r.lightshot.exec(text);
                    const mIbb = r.ibb.exec(text);
                    const mGifyu = r.gifyu.exec(text);
                    const mImgbox = r.imgbox.exec(text);

                    const matches = [
                        { type: 'img', m: mImg },
                        { type: 'tn', m: mTen },
                        { type: 'giphy', m: mGiphy },
                        { type: 'ls', m: mLs },
                        { type: 'ls', m: mIbb },
                        { type: 'ls', m: mGifyu },
                        { type: 'ls', m: mImgbox }
                    ].filter(x => x.m).sort((a, b) => a.m.index - b.m.index);

                    if (matches.length === 0) break;

                    let next = matches[0];
                    const m = next.m;
                    const url = m[0];

                    if (m.index > lastIndex) {
                        frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
                    }

                    if (next.type === 'img' && url.match(/^https?:\/\/(?:www\.)?tenor\.com\//i)) {
                        next.type = 'ls';
                    }

                    if (next.type === 'img' || next.type === 'tn' || next.type === 'giphy') {
                        const img = this.createImageElement(url, url);
                        frag.appendChild(document.createTextNode(' '));
                        frag.appendChild(img);
                        frag.appendChild(document.createTextNode(' '));
                        lastIndex = m.index + url.length;
                    } else if (next.type === 'ls') {
                        const placeholder = document.createElement('span');
                        const img = this.createImageElement(null, url);
                        img.alt = 'loading...';

                        placeholder.appendChild(document.createTextNode(' '));
                        placeholder.appendChild(img);
                        placeholder.appendChild(document.createTextNode(' '));

                        this.resolvePageImage(url).then(realUrl => {
                            if (realUrl) {
                                img.src = realUrl;
                                img.dataset.fullsrc = realUrl;
                                img.alt = 'image';
                            } else {
                                const parent = placeholder.parentNode;
                                if (parent) parent.replaceChild(document.createTextNode(url + ' '), placeholder);
                            }
                        });

                        frag.appendChild(placeholder);
                        lastIndex = m.index + url.length;
                    }

                    r.image.lastIndex = lastIndex;
                    r.tenor.lastIndex = lastIndex;
                    r.giphy.lastIndex = lastIndex;
                    r.lightshot.lastIndex = lastIndex;
                    r.ibb.lastIndex = lastIndex;
                    r.gifyu.lastIndex = lastIndex;
                    r.imgbox.lastIndex = lastIndex;
                }

                if (lastIndex < text.length) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                }

                textNode.parentNode.replaceChild(frag, textNode);
            });

            const links = textField.querySelectorAll('a');
            links.forEach(a => {
                if (a.dataset.gifProcessed) return;

                const href = a.href;
                const isTenorGif = /^https:\/\/media\.tenor\.com\/.*\.gif$/i.test(href);
                const isGiphyGif = /^https:\/\/i\.giphy\.com\//i.test(href);

                if (isTenorGif || isGiphyGif) {
                    a.dataset.gifProcessed = "true";
                    const img = this.createImageElement(href, href);
                    a.innerHTML = '';
                    a.appendChild(img);
                    a.onclick = (e) => e.preventDefault();
                }
            });
        },

        createImageElement(src, fullSrc) {
            const img = document.createElement('img');
            if (src) img.src = src;
            img.dataset.fullsrc = fullSrc;
            img.referrerPolicy = "no-referrer";
            img.style.cssText = 'max-width:100px; max-height:100px; vertical-align:middle; display:inline; margin:0 4px; cursor:pointer; border-radius:4px;';
            img.alt = 'image';
            return img;
        },

        createOverlay(img) {
            const existing = document.querySelector('.tbdm-image-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.className = 'tbdm-image-overlay';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.9); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = img.dataset.fullsrc || img.src;
            fullImg.referrerPolicy = "no-referrer";
            fullImg.style.cssText = `
                max-width: 90vw; max-height: 90vh;
                border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;

            overlay.appendChild(fullImg);
            overlay.onclick = () => overlay.remove();
            fullImg.onclick = (e) => e.stopPropagation();

            document.addEventListener('keydown', function escClose(e) {
                if (e.key === 'Escape') overlay.remove();
            }, { once: true });

            document.body.appendChild(overlay);
        },

        addClickHandlers() {
            document.querySelectorAll('.shout-text img[data-fullsrc]').forEach(img => {
                if (img.dataset.bound) return;
                img.dataset.bound = "true";

                img.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.createOverlay(img);
                };
                if (img.parentElement && img.parentElement.tagName === 'A') {
                    img.parentElement.onclick = (e) => e.preventDefault();
                }
            });
        },

        scanAllShouts() {
            document.querySelectorAll('.shout-item').forEach(node => this.convertLinksInNode(node));
            this.addClickHandlers();
        },

        observeChat() {
            const shoutContainer = document.querySelector('#shouts-container');
            if (shoutContainer) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((m) => {
                        m.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE &&
                                (node.classList?.contains('shout-item') || node.querySelector?.('.shout-item'))) {
                                const shoutItem = node.classList?.contains('shout-item') ? node : node.querySelector('.shout-item');
                                setTimeout(() => {
                                    this.convertLinksInNode(shoutItem);
                                    this.addClickHandlers();
                                }, 50);
                            }
                        });
                    });
                });
                observer.observe(shoutContainer, { childList: true, subtree: true });
            }
        },

        init() {
            if (!CONFIG.image_viewer_enabled) return;
            this.scanAllShouts();
            this.observeChat();
        },

        stop() {
            // Remove all converted images
            document.querySelectorAll('.shout-text img[data-fullsrc]').forEach(img => {
                const parent = img.parentNode;
                if (parent) {
                    parent.replaceChild(document.createTextNode(img.dataset.fullsrc + ' '), img);
                }
            });
        }
    };



// ============================================================================
// MODULE 11: UNICODE EMOJI PICKER (EXACT COPY FROM SPOTLIGHT)
// ============================================================================

const smileys = {"name":"Smileys & People","key":"smileys","mob":"😃","emojis":[{"obj":"😀","alt":"Grinning Face"},{"obj":"😃","alt":"Grinning Face with Big Eyes"},{"obj":"😄","alt":"Grinning Face with Smiling Eyes"},{"obj":"😁","alt":"Beaming Face with Smiling Eyes"},{"obj":"😆","alt":"Grinning Squinting Face"},{"obj":"😅","alt":"Grinning Face with Sweat"},{"obj":"🤣","alt":"Rolling on the Floor Laughing"},{"obj":"😂","alt":"Face with Tears of Joy"},{"obj":"🙂","alt":"Slightly Smiling Face"},{"obj":"🙃","alt":"Upside-Down Face"},{"obj":"🫠","alt":"Melting Face"},{"obj":"😉","alt":"Winking Face"},{"obj":"😊","alt":"Smiling Face with Smiling Eyes"},{"obj":"😇","alt":"Smiling Face with Halo"},{"obj":"🥰","alt":"Smiling Face with Hearts"},{"obj":"😍","alt":"Smiling Face with Heart-Eyes"},{"obj":"🤩","alt":"Star-Struck"},{"obj":"😘","alt":"Face Blowing a Kiss"},{"obj":"😗","alt":"Kissing Face"},{"obj":"☺️","alt":"Smiling Face"},{"obj":"😚","alt":"Kissing Face with Closed Eyes"},{"obj":"😙","alt":"Kissing Face with Smiling Eyes"},{"obj":"🥲","alt":"Smiling Face with Tear"},{"obj":"😋","alt":"Face Savoring Food"},{"obj":"😛","alt":"Face with Tongue"},{"obj":"😜","alt":"Winking Face with Tongue"},{"obj":"🤪","alt":"Zany Face"},{"obj":"😝","alt":"Squinting Face with Tongue"},{"obj":"🤑","alt":"Money-Mouth Face"},{"obj":"🤗","alt":"Smiling Face with Open Hands"},{"obj":"🤭","alt":"Face with Hand Over Mouth"},{"obj":"🫢","alt":"Face with Open Eyes and Hand Over Mouth"},{"obj":"🫣","alt":"Face with Peeking Eye"},{"obj":"🤫","alt":"Shushing Face"},{"obj":"🤔","alt":"Thinking Face"},{"obj":"🫡","alt":"Saluting Face"},{"obj":"🤐","alt":"Zipper-Mouth Face"},{"obj":"🤨","alt":"Face with Raised Eyebrow"},{"obj":"😐","alt":"Neutral Face"},{"obj":"😑","alt":"Expressionless Face"},{"obj":"😶","alt":"Face Without Mouth"},{"obj":"🫥","alt":"Dotted Line Face"},{"obj":"😶‍🌫️","alt":"Face in Clouds"},{"obj":"😏","alt":"Smirking Face"},{"obj":"😒","alt":"Unamused Face"},{"obj":"🙄","alt":"Face with Rolling Eyes"},{"obj":"😬","alt":"Grimacing Face"},{"obj":"😮‍💨","alt":"Face Exhaling"},{"obj":"🤥","alt":"Lying Face"},{"obj":"😌","alt":"Relieved Face"},{"obj":"😔","alt":"Pensive Face"},{"obj":"😪","alt":"Sleepy Face"},{"obj":"🤤","alt":"Drooling Face"},{"obj":"😴","alt":"Sleeping Face"},{"obj":"😷","alt":"Face with Medical Mask"},{"obj":"🤒","alt":"Face with Thermometer"},{"obj":"🤕","alt":"Face with Head-Bandage"},{"obj":"🤢","alt":"Nauseated Face"},{"obj":"🤮","alt":"Face Vomiting"},{"obj":"🤧","alt":"Sneezing Face"},{"obj":"🥵","alt":"Hot Face"},{"obj":"🥶","alt":"Cold Face"},{"obj":"🥴","alt":"Woozy Face"},{"obj":"😵","alt":"Face with Crossed-Out Eyes"},{"obj":"😵‍💫","alt":"Face with Spiral Eyes"},{"obj":"🤯","alt":"Exploding Head"},{"obj":"🤠","alt":"Cowboy Hat Face"},{"obj":"🥳","alt":"Partying Face"},{"obj":"🥸","alt":"Disguised Face"},{"obj":"😎","alt":"Smiling Face with Sunglasses"},{"obj":"🤓","alt":"Nerd Face"},{"obj":"🧐","alt":"Face with Monocle"},{"obj":"😕","alt":"Confused Face"},{"obj":"🫤","alt":"Face with Diagonal Mouth"},{"obj":"😟","alt":"Worried Face"},{"obj":"🙁","alt":"Slightly Frowning Face"},{"obj":"☹️","alt":"Frowning Face"},{"obj":"😮","alt":"Face with Open Mouth"},{"obj":"😯","alt":"Hushed Face"},{"obj":"😲","alt":"Astonished Face"},{"obj":"😳","alt":"Flushed Face"},{"obj":"🥺","alt":"Pleading Face"},{"obj":"🥹","alt":"Face Holding Back Tears"},{"obj":"😦","alt":"Frowning Face with Open Mouth"},{"obj":"😧","alt":"Anguished Face"},{"obj":"😨","alt":"Fearful Face"},{"obj":"😰","alt":"Anxious Face with Sweat"},{"obj":"😥","alt":"Sad but Relieved Face"},{"obj":"😢","alt":"Crying Face"},{"obj":"😭","alt":"Loudly Crying Face"},{"obj":"😱","alt":"Face Screaming in Fear"},{"obj":"😖","alt":"Confounded Face"},{"obj":"😣","alt":"Persevering Face"},{"obj":"😞","alt":"Disappointed Face"},{"obj":"😓","alt":"Downcast Face with Sweat"},{"obj":"😩","alt":"Weary Face"},{"obj":"😫","alt":"Tired Face"},{"obj":"🥱","alt":"Yawning Face"},{"obj":"😤","alt":"Face with Steam From Nose"},{"obj":"😡","alt":"Enraged Face"},{"obj":"😠","alt":"Angry Face"},{"obj":"🤬","alt":"Face with Symbols on Mouth"},{"obj":"😈","alt":"Smiling Face with Horns"},{"obj":"👿","alt":"Angry Face with Horns"},{"obj":"💀","alt":"Skull"},{"obj":"☠️","alt":"Skull and Crossbones"},{"obj":"💩","alt":"Pile of Poo"},{"obj":"🤡","alt":"Clown Face"},{"obj":"👹","alt":"Ogre"},{"obj":"👺","alt":"Goblin"},{"obj":"👻","alt":"Ghost"},{"obj":"👽","alt":"Alien"},{"obj":"👾","alt":"Alien Monster"},{"obj":"🤖","alt":"Robot"},{"obj":"😺","alt":"Grinning Cat"},{"obj":"😸","alt":"Grinning Cat with Smiling Eyes"},{"obj":"😹","alt":"Cat with Tears of Joy"},{"obj":"😻","alt":"Smiling Cat with Heart-Eyes"},{"obj":"😼","alt":"Cat with Wry Smile"},{"obj":"😽","alt":"Kissing Cat"},{"obj":"🙀","alt":"Weary Cat"},{"obj":"😿","alt":"Crying Cat"},{"obj":"😾","alt":"Pouting Cat"},{"obj":"💋","alt":"Kiss Mark"},{"obj":"👋","alt":"Waving Hand"},{"obj":"🤚","alt":"Raised Back of Hand"},{"obj":"🖐️","alt":"Hand with Fingers Splayed"},{"obj":"✋","alt":"Raised Hand"},{"obj":"🖖","alt":"Vulcan Salute"},{"obj":"🫱","alt":"Rightwards Hand"},{"obj":"🫲","alt":"Leftwards Hand"},{"obj":"🫳","alt":"Palm Down Hand"},{"obj":"🫴","alt":"Palm Up Hand"},{"obj":"👌","alt":"OK Hand"},{"obj":"🤌","alt":"Pinched Fingers"},{"obj":"🤏","alt":"Pinching Hand"},{"obj":"✌️","alt":"Victory Hand"},{"obj":"🤞","alt":"Crossed Fingers"},{"obj":"🫰","alt":"Hand with Index Finger and Thumb Crossed"},{"obj":"🤟","alt":"Love-You Gesture"},{"obj":"🤘","alt":"Sign of the Horns"},{"obj":"🤙","alt":"Call Me Hand"},{"obj":"👈","alt":"Backhand Index Pointing Left"},{"obj":"👉","alt":"Backhand Index Pointing Right"},{"obj":"👆","alt":"Backhand Index Pointing Up"},{"obj":"🖕","alt":"Middle Finger"},{"obj":"👇","alt":"Backhand Index Pointing Down"},{"obj":"☝️","alt":"Index Pointing Up"},{"obj":"🫵","alt":"Index Pointing at the Viewer"},{"obj":"👍","alt":"Thumbs Up"},{"obj":"👎","alt":"Thumbs Down"},{"obj":"✊","alt":"Raised Fist"},{"obj":"👊","alt":"Oncoming Fist"},{"obj":"🤛","alt":"Left-Facing Fist"},{"obj":"🤜","alt":"Right-Facing Fist"},{"obj":"👏","alt":"Clapping Hands"},{"obj":"🙌","alt":"Raising Hands"},{"obj":"🫶","alt":"Heart Hands"},{"obj":"👐","alt":"Open Hands"},{"obj":"🤲","alt":"Palms Up Together"},{"obj":"🤝","alt":"Handshake"},{"obj":"🙏","alt":"Folded Hands"},{"obj":"✍️","alt":"Writing Hand"},{"obj":"💅","alt":"Nail Polish"},{"obj":"🤳","alt":"Selfie"},{"obj":"💪","alt":"Flexed Biceps"},{"obj":"🦾","alt":"Mechanical Arm"},{"obj":"🦿","alt":"Mechanical Leg"},{"obj":"🦵","alt":"Leg"},{"obj":"🦶","alt":"Foot"},{"obj":"👂","alt":"Ear"},{"obj":"🦻","alt":"Ear with Hearing Aid"},{"obj":"👃","alt":"Nose"},{"obj":"🧠","alt":"Brain"},{"obj":"🫀","alt":"Anatomical Heart"},{"obj":"🫁","alt":"Lungs"},{"obj":"🦷","alt":"Tooth"},{"obj":"🦴","alt":"Bone"},{"obj":"👀","alt":"Eyes"},{"obj":"👁️","alt":"Eye"},{"obj":"👅","alt":"Tongue"},{"obj":"👄","alt":"Mouth"},{"obj":"🫦","alt":"Biting Lip"},{"obj":"👶","alt":"Baby"},{"obj":"🧒","alt":"Child"},{"obj":"👦","alt":"Boy"},{"obj":"👧","alt":"Girl"},{"obj":"🧑","alt":"Person"},{"obj":"👱","alt":"Person: Blond Hair"},{"obj":"👨","alt":"Man"},{"obj":"🧔","alt":"Person: Beard"},{"obj":"👨‍🦰","alt":"Man: Red Hair"},{"obj":"👨‍🦱","alt":"Man: Curly Hair"},{"obj":"👨‍🦳","alt":"Man: White Hair"},{"obj":"👨‍🦲","alt":"Man: Bald"},{"obj":"👩","alt":"Woman"},{"obj":"👩‍🦰","alt":"Woman: Red Hair"},{"obj":"🧑‍🦰","alt":"Person: Red Hair"},{"obj":"👩‍🦱","alt":"Woman: Curly Hair"},{"obj":"🧑‍🦱","alt":"Person: Curly Hair"},{"obj":"👩‍🦳","alt":"Woman: White Hair"},{"obj":"🧑‍🦳","alt":"Person: White Hair"},{"obj":"👩‍🦲","alt":"Woman: Bald"},{"obj":"🧑‍🦲","alt":"Person: Bald"},{"obj":"👱‍♀️","alt":"Woman: Blond Hair"},{"obj":"👱‍♂️","alt":"Man: Blond Hair"},{"obj":"🧓","alt":"Older Person"},{"obj":"👴","alt":"Old Man"},{"obj":"👵","alt":"Old Woman"},{"obj":"🙍","alt":"Person Frowning"},{"obj":"🙍‍♂️","alt":"Man Frowning"},{"obj":"🙍‍♀️","alt":"Woman Frowning"},{"obj":"🙎","alt":"Person Pouting"},{"obj":"🙎‍♂️","alt":"Man Pouting"},{"obj":"🙎‍♀️","alt":"Woman Pouting"},{"obj":"🙅","alt":"Person Gesturing No"},{"obj":"🙅‍♂️","alt":"Man Gesturing No"},{"obj":"🙅‍♀️","alt":"Woman Gesturing No"},{"obj":"🙆","alt":"Person Gesturing OK"},{"obj":"🙆‍♂️","alt":"Man Gesturing OK"},{"obj":"🙆‍♀️","alt":"Woman Gesturing OK"},{"obj":"💁","alt":"Person Tipping Hand"},{"obj":"💁‍♂️","alt":"Man Tipping Hand"},{"obj":"💁‍♀️","alt":"Woman Tipping Hand"},{"obj":"🙋","alt":"Person Raising Hand"},{"obj":"🙋‍♂️","alt":"Man Raising Hand"},{"obj":"🙋‍♀️","alt":"Woman Raising Hand"},{"obj":"🧏","alt":"Deaf Person"},{"obj":"🧏‍♂️","alt":"Deaf Man"},{"obj":"🧏‍♀️","alt":"Deaf Woman"},{"obj":"🙇","alt":"Person Bowing"},{"obj":"🙇‍♂️","alt":"Man Bowing"},{"obj":"🙇‍♀️","alt":"Woman Bowing"},{"obj":"🤦","alt":"Person Facepalming"},{"obj":"🤦‍♂️","alt":"Man Facepalming"},{"obj":"🤦‍♀️","alt":"Woman Facepalming"},{"obj":"🤷","alt":"Person Shrugging"},{"obj":"🤷‍♂️","alt":"Man Shrugging"},{"obj":"🤷‍♀️","alt":"Woman Shrugging"},{"obj":"🧑‍⚕️","alt":"Health Worker"},{"obj":"👨‍⚕️","alt":"Man Health Worker"},{"obj":"👩‍⚕️","alt":"Woman Health Worker"},{"obj":"🧑‍🎓","alt":"Student"},{"obj":"👨‍🎓","alt":"Man Student"},{"obj":"👩‍🎓","alt":"Woman Student"},{"obj":"🧑‍🏫","alt":"Teacher"},{"obj":"👨‍🏫","alt":"Man Teacher"},{"obj":"👩‍🏫","alt":"Woman Teacher"},{"obj":"🧑‍⚖️","alt":"Judge"},{"obj":"👨‍⚖️","alt":"Man Judge"},{"obj":"👩‍⚖️","alt":"Woman Judge"},{"obj":"🧑‍🌾","alt":"Farmer"},{"obj":"👨‍🌾","alt":"Man Farmer"},{"obj":"👩‍🌾","alt":"Woman Farmer"},{"obj":"🧑‍🍳","alt":"Cook"},{"obj":"👨‍🍳","alt":"Man Cook"},{"obj":"👩‍🍳","alt":"Woman Cook"},{"obj":"🧑‍🔧","alt":"Mechanic"},{"obj":"👨‍🔧","alt":"Man Mechanic"},{"obj":"👩‍🔧","alt":"Woman Mechanic"},{"obj":"🧑‍🏭","alt":"Factory Worker"},{"obj":"👨‍🏭","alt":"Man Factory Worker"},{"obj":"👩‍🏭","alt":"Woman Factory Worker"},{"obj":"🧑‍💼","alt":"Office Worker"},{"obj":"👨‍💼","alt":"Man Office Worker"},{"obj":"👩‍💼","alt":"Woman Office Worker"},{"obj":"🧑‍🔬","alt":"Scientist"},{"obj":"👨‍🔬","alt":"Man Scientist"},{"obj":"👩‍🔬","alt":"Woman Scientist"},{"obj":"🧑‍💻","alt":"Technologist"},{"obj":"👨‍💻","alt":"Man Technologist"},{"obj":"👩‍💻","alt":"Woman Technologist"},{"obj":"🧑‍🎤","alt":"Singer"},{"obj":"👨‍🎤","alt":"Man Singer"},{"obj":"👩‍🎤","alt":"Woman Singer"},{"obj":"🧑‍🎨","alt":"Artist"},{"obj":"👨‍🎨","alt":"Man Artist"},{"obj":"👩‍🎨","alt":"Woman Artist"},{"obj":"🧑‍✈️","alt":"Pilot"},{"obj":"👨‍✈️","alt":"Man Pilot"},{"obj":"👩‍✈️","alt":"Woman Pilot"},{"obj":"🧑‍🚀","alt":"Astronaut"},{"obj":"👨‍🚀","alt":"Man Astronaut"},{"obj":"👩‍🚀","alt":"Woman Astronaut"},{"obj":"🧑‍🚒","alt":"Firefighter"},{"obj":"👨‍🚒","alt":"Man Firefighter"},{"obj":"👩‍🚒","alt":"Woman Firefighter"},{"obj":"👮","alt":"Police Officer"},{"obj":"👮‍♂️","alt":"Man Police Officer"},{"obj":"👮‍♀️","alt":"Woman Police Officer"},{"obj":"🕵️","alt":"Detective"},{"obj":"🕵️‍♂️","alt":"Man Detective"},{"obj":"🕵️‍♀️","alt":"Woman Detective"},{"obj":"💂","alt":"Guard"},{"obj":"💂‍♂️","alt":"Man Guard"},{"obj":"💂‍♀️","alt":"Woman Guard"},{"obj":"🥷","alt":"Ninja"},{"obj":"👷","alt":"Construction Worker"},{"obj":"👷‍♂️","alt":"Man Construction Worker"},{"obj":"👷‍♀️","alt":"Woman Construction Worker"},{"obj":"🫅","alt":"Person with Crown"},{"obj":"🤴","alt":"Prince"},{"obj":"👸","alt":"Princess"},{"obj":"👳","alt":"Person Wearing Turban"},{"obj":"👳‍♂️","alt":"Man Wearing Turban"},{"obj":"👳‍♀️","alt":"Woman Wearing Turban"},{"obj":"👲","alt":"Person with Skullcap"},{"obj":"🧕","alt":"Woman with Headscarf"},{"obj":"🤵","alt":"Person in Tuxedo"},{"obj":"🤵‍♂️","alt":"Man in Tuxedo"},{"obj":"🤵‍♀️","alt":"Woman in Tuxedo"},{"obj":"👰","alt":"Person with Veil"},{"obj":"👰‍♂️","alt":"Man with Veil"},{"obj":"👰‍♀️","alt":"Woman with Veil"},{"obj":"🤰","alt":"Pregnant Woman"},{"obj":"🫃","alt":"Pregnant Man"},{"obj":"🫄","alt":"Pregnant Person"},{"obj":"🤱","alt":"Breast-Feeding"},{"obj":"👩‍🍼","alt":"Woman Feeding Baby"},{"obj":"👨‍🍼","alt":"Man Feeding Baby"},{"obj":"🧑‍🍼","alt":"Person Feeding Baby"},{"obj":"👼","alt":"Baby Angel"},{"obj":"🎅","alt":"Santa Claus"},{"obj":"🤶","alt":"Mrs. Claus"},{"obj":"🧑‍🎄","alt":"Mx Claus"},{"obj":"🦸","alt":"Superhero"},{"obj":"🦸‍♂️","alt":"Man Superhero"},{"obj":"🦸‍♀️","alt":"Woman Superhero"},{"obj":"🦹","alt":"Supervillain"},{"obj":"🦹‍♂️","alt":"Man Supervillain"},{"obj":"🦹‍♀️","alt":"Woman Supervillain"},{"obj":"🧙","alt":"Mage"},{"obj":"🧙‍♂️","alt":"Man Mage"},{"obj":"🧙‍♀️","alt":"Woman Mage"},{"obj":"🧚","alt":"Fairy"},{"obj":"🧚‍♂️","alt":"Man Fairy"},{"obj":"🧚‍♀️","alt":"Woman Fairy"},{"obj":"🧛","alt":"Vampire"},{"obj":"🧛‍♂️","alt":"Man Vampire"},{"obj":"🧛‍♀️","alt":"Woman Vampire"},{"obj":"🧜","alt":"Merperson"},{"obj":"🧜‍♂️","alt":"Merman"},{"obj":"🧜‍♀️","alt":"Mermaid"},{"obj":"🧝","alt":"Elf"},{"obj":"🧝‍♂️","alt":"Man Elf"},{"obj":"🧝‍♀️","alt":"Woman Elf"},{"obj":"🧞","alt":"Genie"},{"obj":"🧞‍♂️","alt":"Man Genie"},{"obj":"🧞‍♀️","alt":"Woman Genie"},{"obj":"🧟","alt":"Zombie"},{"obj":"🧟‍♂️","alt":"Man Zombie"},{"obj":"🧟‍♀️","alt":"Woman Zombie"},{"obj":"🧌","alt":"Troll"},{"obj":"💆","alt":"Person Getting Massage"},{"obj":"💆‍♂️","alt":"Man Getting Massage"},{"obj":"💆‍♀️","alt":"Woman Getting Massage"},{"obj":"💇","alt":"Person Getting Haircut"},{"obj":"💇‍♂️","alt":"Man Getting Haircut"},{"obj":"💇‍♀️","alt":"Woman Getting Haircut"},{"obj":"🚶","alt":"Person Walking"},{"obj":"🚶‍♂️","alt":"Man Walking"},{"obj":"🚶‍♀️","alt":"Woman Walking"},{"obj":"🧍","alt":"Person Standing"},{"obj":"🧍‍♂️","alt":"Man Standing"},{"obj":"🧍‍♀️","alt":"Woman Standing"},{"obj":"🧎","alt":"Person Kneeling"},{"obj":"🧎‍♂️","alt":"Man Kneeling"},{"obj":"🧎‍♀️","alt":"Woman Kneeling"},{"obj":"🧑‍🦯","alt":"Person with White Cane"},{"obj":"👨‍🦯","alt":"Man with White Cane"},{"obj":"👩‍🦯","alt":"Woman with White Cane"},{"obj":"🧑‍🦼","alt":"Person in Motorized Wheelchair"},{"obj":"👨‍🦼","alt":"Man in Motorized Wheelchair"},{"obj":"👩‍🦼","alt":"Woman in Motorized Wheelchair"},{"obj":"🧑‍🦽","alt":"Person in Manual Wheelchair"},{"obj":"👨‍🦽","alt":"Man in Manual Wheelchair"},{"obj":"👩‍🦽","alt":"Woman in Manual Wheelchair"},{"obj":"🏃","alt":"Person Running"},{"obj":"🏃‍♂️","alt":"Man Running"},{"obj":"🏃‍♀️","alt":"Woman Running"},{"obj":"💃","alt":"Woman Dancing"},{"obj":"🕺","alt":"Man Dancing"},{"obj":"🕴️","alt":"Person in Suit Levitating"},{"obj":"👯","alt":"People with Bunny Ears"},{"obj":"👯‍♂️","alt":"Men with Bunny Ears"},{"obj":"👯‍♀️","alt":"Women with Bunny Ears"},{"obj":"🧖","alt":"Person in Steamy Room"},{"obj":"🧖‍♂️","alt":"Man in Steamy Room"},{"obj":"🧖‍♀️","alt":"Woman in Steamy Room"},{"obj":"🧘","alt":"Person in Lotus Position"},{"obj":"🧑‍🤝‍🧑","alt":"People Holding Hands"},{"obj":"👭","alt":"Women Holding Hands"},{"obj":"👫","alt":"Woman and Man Holding Hands"},{"obj":"👬","alt":"Men Holding Hands"},{"obj":"💏","alt":"Kiss"},{"obj":"👩‍❤️‍💋‍👨","alt":"Kiss: Woman, Man"},{"obj":"👨‍❤️‍💋‍👨","alt":"Kiss: Man, Man"},{"obj":"👩‍❤️‍💋‍👩","alt":"Kiss: Woman, Woman"},{"obj":"💑","alt":"Couple with Heart"},{"obj":"👩‍❤️‍👨","alt":"Couple with Heart: Woman, Man"},{"obj":"👨‍❤️‍👨","alt":"Couple with Heart: Man, Man"},{"obj":"👩‍❤️‍👩","alt":"Couple with Heart: Woman, Woman"},{"obj":"👪","alt":"Family"},{"obj":"👨‍👩‍👦","alt":"Family: Man, Woman, Boy"},{"obj":"👨‍👩‍👧","alt":"Family: Man, Woman, Girl"},{"obj":"👨‍👩‍👧‍👦","alt":"Family: Man, Woman, Girl, Boy"},{"obj":"👨‍👩‍👦‍👦","alt":"Family: Man, Woman, Boy, Boy"},{"obj":"👨‍👩‍👧‍👧","alt":"Family: Man, Woman, Girl, Girl"},{"obj":"👨‍👨‍👦","alt":"Family: Man, Man, Boy"},{"obj":"👨‍👨‍👧","alt":"Family: Man, Man, Girl"},{"obj":"👨‍👨‍👧‍👦","alt":"Family: Man, Man, Girl, Boy"},{"obj":"👨‍👨‍👦‍👦","alt":"Family: Man, Man, Boy, Boy"},{"obj":"👨‍👨‍👧‍👧","alt":"Family: Man, Man, Girl, Girl"},{"obj":"👩‍👩‍👦","alt":"Family: Woman, Woman, Boy"},{"obj":"👩‍👩‍👧","alt":"Family: Woman, Woman, Girl"},{"obj":"👩‍👩‍👧‍👦","alt":"Family: Woman, Woman, Girl, Boy"},{"obj":"👩‍👩‍👦‍👦","alt":"Family: Woman, Woman, Boy, Boy"},{"obj":"👩‍👩‍👧‍👧","alt":"Family: Woman, Woman, Girl, Girl"},{"obj":"👨‍👦","alt":"Family: Man, Boy"},{"obj":"👨‍👦‍👦","alt":"Family: Man, Boy, Boy"},{"obj":"👨‍👧","alt":"Family: Man, Girl"},{"obj":"👨‍👧‍👦","alt":"Family: Man, Girl, Boy"},{"obj":"👨‍👧‍👧","alt":"Family: Man, Girl, Girl"},{"obj":"👩‍👦","alt":"Family: Woman, Boy"},{"obj":"👩‍👦‍👦","alt":"Family: Woman, Boy, Boy"},{"obj":"👩‍👧","alt":"Family: Woman, Girl"},{"obj":"👩‍👧‍👦","alt":"Family: Woman, Girl, Boy"},{"obj":"👩‍👧‍👧","alt":"Family: Woman, Girl, Girl"},{"obj":"🗣️","alt":"Speaking Head"},{"obj":"👤","alt":"Bust in Silhouette"},{"obj":"👥","alt":"Busts in Silhouette"},{"obj":"🫂","alt":"People Hugging"},{"obj":"👣","alt":"Footprints"},{"obj":"🧳","alt":"Luggage"},{"obj":"🌂","alt":"Closed Umbrella"},{"obj":"☂️","alt":"Umbrella"},{"obj":"🎃","alt":"Jack-O-Lantern"},{"obj":"🧵","alt":"Thread"},{"obj":"🧶","alt":"Yarn"},{"obj":"👓","alt":"Glasses"},{"obj":"🕶️","alt":"Sunglasses"},{"obj":"🥽","alt":"Goggles"},{"obj":"🥼","alt":"Lab Coat"},{"obj":"🦺","alt":"Safety Vest"},{"obj":"👔","alt":"Necktie"},{"obj":"👕","alt":"T-Shirt"},{"obj":"👖","alt":"Jeans"},{"obj":"🧣","alt":"Scarf"},{"obj":"🧤","alt":"Gloves"},{"obj":"🧥","alt":"Coat"},{"obj":"🧦","alt":"Socks"},{"obj":"👗","alt":"Dress"},{"obj":"👘","alt":"Kimono"},{"obj":"🥻","alt":"Sari"},{"obj":"🩱","alt":"One-Piece Swimsuit"},{"obj":"🩲","alt":"Briefs"},{"obj":"🩳","alt":"Shorts"},{"obj":"👙","alt":"Bikini"},{"obj":"👚","alt":"Woman’s Clothes"},{"obj":"👛","alt":"Purse"},{"obj":"👜","alt":"Handbag"},{"obj":"👝","alt":"Clutch Bag"},{"obj":"🎒","alt":"Backpack"},{"obj":"🩴","alt":"Thong Sandal"},{"obj":"👞","alt":"Man’s Shoe"},{"obj":"👟","alt":"Running Shoe"},{"obj":"🥾","alt":"Hiking Boot"},{"obj":"🥿","alt":"Flat Shoe"},{"obj":"👠","alt":"High-Heeled Shoe"},{"obj":"👡","alt":"Woman’s Sandal"},{"obj":"🩰","alt":"Ballet Shoes"},{"obj":"👢","alt":"Woman’s Boot"},{"obj":"👑","alt":"Crown"},{"obj":"👒","alt":"Woman’s Hat"},{"obj":"🎩","alt":"Top Hat"},{"obj":"🎓","alt":"Graduation Cap"},{"obj":"🧢","alt":"Billed Cap"},{"obj":"🪖","alt":"Military Helmet"},{"obj":"⛑️","alt":"Rescue Worker’s Helmet"},{"obj":"💄","alt":"Lipstick"},{"obj":"💍","alt":"Ring"},{"obj":"💼","alt":"Briefcase"},{"obj":"🩸","alt":"Drop of Blood"}]},
      nature = {"name":"Animals & Nature","key":"nature","mob":"🐻","emojis":[{"obj":"🙈","alt":"See-No-Evil Monkey"},{"obj":"🙉","alt":"Hear-No-Evil Monkey"},{"obj":"🙊","alt":"Speak-No-Evil Monkey"},{"obj":"💥","alt":"Collision"},{"obj":"💫","alt":"Dizzy"},{"obj":"💦","alt":"Sweat Droplets"},{"obj":"💨","alt":"Dashing Away"},{"obj":"🐵","alt":"Monkey Face"},{"obj":"🐒","alt":"Monkey"},{"obj":"🦍","alt":"Gorilla"},{"obj":"🦧","alt":"Orangutan"},{"obj":"🐶","alt":"Dog Face"},{"obj":"🐕","alt":"Dog"},{"obj":"🦮","alt":"Guide Dog"},{"obj":"🐕‍🦺","alt":"Service Dog"},{"obj":"🐩","alt":"Poodle"},{"obj":"🐺","alt":"Wolf"},{"obj":"🦊","alt":"Fox"},{"obj":"🦝","alt":"Raccoon"},{"obj":"🐱","alt":"Cat Face"},{"obj":"🐈","alt":"Cat"},{"obj":"🐈‍⬛","alt":"Black Cat"},{"obj":"🦁","alt":"Lion"},{"obj":"🐯","alt":"Tiger Face"},{"obj":"🐅","alt":"Tiger"},{"obj":"🐆","alt":"Leopard"},{"obj":"🐴","alt":"Horse Face"},{"obj":"🐎","alt":"Horse"},{"obj":"🦄","alt":"Unicorn"},{"obj":"🦓","alt":"Zebra"},{"obj":"🦌","alt":"Deer"},{"obj":"🦬","alt":"Bison"},{"obj":"🐮","alt":"Cow Face"},{"obj":"🐂","alt":"Ox"},{"obj":"🐃","alt":"Water Buffalo"},{"obj":"🐄","alt":"Cow"},{"obj":"🐷","alt":"Pig Face"},{"obj":"🐖","alt":"Pig"},{"obj":"🐗","alt":"Boar"},{"obj":"🐽","alt":"Pig Nose"},{"obj":"🐏","alt":"Ram"},{"obj":"🐑","alt":"Ewe"},{"obj":"🐐","alt":"Goat"},{"obj":"🐪","alt":"Camel"},{"obj":"🐫","alt":"Two-Hump Camel"},{"obj":"🦙","alt":"Llama"},{"obj":"🦒","alt":"Giraffe"},{"obj":"🐘","alt":"Elephant"},{"obj":"🦣","alt":"Mammoth"},{"obj":"🦏","alt":"Rhinoceros"},{"obj":"🦛","alt":"Hippopotamus"},{"obj":"🐭","alt":"Mouse Face"},{"obj":"🐁","alt":"Mouse"},{"obj":"🐀","alt":"Rat"},{"obj":"🐹","alt":"Hamster"},{"obj":"🐰","alt":"Rabbit Face"},{"obj":"🐇","alt":"Rabbit"},{"obj":"🐿️","alt":"Chipmunk"},{"obj":"🦫","alt":"Beaver"},{"obj":"🦔","alt":"Hedgehog"},{"obj":"🦇","alt":"Bat"},{"obj":"🐻","alt":"Bear"},{"obj":"🐻‍❄️","alt":"Polar Bear"},{"obj":"🐨","alt":"Koala"},{"obj":"🐼","alt":"Panda"},{"obj":"🦥","alt":"Sloth"},{"obj":"🦦","alt":"Otter"},{"obj":"🦨","alt":"Skunk"},{"obj":"🦘","alt":"Kangaroo"},{"obj":"🦡","alt":"Badger"},{"obj":"🐾","alt":"Paw Prints"},{"obj":"🦃","alt":"Turkey"},{"obj":"🐔","alt":"Chicken"},{"obj":"🐓","alt":"Rooster"},{"obj":"🐣","alt":"Hatching Chick"},{"obj":"🐤","alt":"Baby Chick"},{"obj":"🐥","alt":"Front-Facing Baby Chick"},{"obj":"🐦","alt":"Bird"},{"obj":"🐧","alt":"Penguin"},{"obj":"🕊️","alt":"Dove"},{"obj":"🦅","alt":"Eagle"},{"obj":"🦆","alt":"Duck"},{"obj":"🦢","alt":"Swan"},{"obj":"🦉","alt":"Owl"},{"obj":"🦤","alt":"Dodo"},{"obj":"🪶","alt":"Feather"},{"obj":"🦩","alt":"Flamingo"},{"obj":"🦚","alt":"Peacock"},{"obj":"🦜","alt":"Parrot"},{"obj":"🐸","alt":"Frog"},{"obj":"🐊","alt":"Crocodile"},{"obj":"🐢","alt":"Turtle"},{"obj":"🦎","alt":"Lizard"},{"obj":"🐍","alt":"Snake"},{"obj":"🐲","alt":"Dragon Face"},{"obj":"🐉","alt":"Dragon"},{"obj":"🦕","alt":"Sauropod"},{"obj":"🦖","alt":"T-Rex"},{"obj":"🐳","alt":"Spouting Whale"},{"obj":"🐋","alt":"Whale"},{"obj":"🐬","alt":"Dolphin"},{"obj":"🦭","alt":"Seal"},{"obj":"🐟","alt":"Fish"},{"obj":"🐠","alt":"Tropical Fish"},{"obj":"🐡","alt":"Blowfish"},{"obj":"🦈","alt":"Shark"},{"obj":"🐙","alt":"Octopus"},{"obj":"🐚","alt":"Spiral Shell"},{"obj":"🪸","alt":"Coral"},{"obj":"🐌","alt":"Snail"},{"obj":"🦋","alt":"Butterfly"},{"obj":"🐛","alt":"Bug"},{"obj":"🐜","alt":"Ant"},{"obj":"🐝","alt":"Honeybee"},{"obj":"🪲","alt":"Beetle"},{"obj":"🐞","alt":"Lady Beetle"},{"obj":"🦗","alt":"Cricket"},{"obj":"🪳","alt":"Cockroach"},{"obj":"🕷️","alt":"Spider"},{"obj":"🕸️","alt":"Spider Web"},{"obj":"🦂","alt":"Scorpion"},{"obj":"🦟","alt":"Mosquito"},{"obj":"🪰","alt":"Fly"},{"obj":"🪱","alt":"Worm"},{"obj":"🦠","alt":"Microbe"},{"obj":"💐","alt":"Bouquet"},{"obj":"🌸","alt":"Cherry Blossom"},{"obj":"💮","alt":"White Flower"},{"obj":"🪷","alt":"Lotus"},{"obj":"🏵️","alt":"Rosette"},{"obj":"🌹","alt":"Rose"},{"obj":"🥀","alt":"Wilted Flower"},{"obj":"🌺","alt":"Hibiscus"},{"obj":"🌻","alt":"Sunflower"},{"obj":"🌼","alt":"Blossom"},{"obj":"🌷","alt":"Tulip"},{"obj":"🌱","alt":"Seedling"},{"obj":"🪴","alt":"Potted Plant"},{"obj":"🌲","alt":"Evergreen Tree"},{"obj":"🌳","alt":"Deciduous Tree"},{"obj":"🌴","alt":"Palm Tree"},{"obj":"🌵","alt":"Cactus"},{"obj":"🌾","alt":"Sheaf of Rice"},{"obj":"🌿","alt":"Herb"},{"obj":"☘️","alt":"Shamrock"},{"obj":"🍀","alt":"Four Leaf Clover"},{"obj":"🍁","alt":"Maple Leaf"},{"obj":"🍂","alt":"Fallen Leaf"},{"obj":"🍃","alt":"Leaf Fluttering in Wind"},{"obj":"🪹","alt":"Empty Nest"},{"obj":"🪺","alt":"Nest with Eggs"},{"obj":"🍄","alt":"Mushroom"},{"obj":"🌰","alt":"Chestnut"},{"obj":"🦀","alt":"Crab"},{"obj":"🦞","alt":"Lobster"},{"obj":"🦐","alt":"Shrimp"},{"obj":"🦑","alt":"Squid"},{"obj":"🌍","alt":"Globe Showing Europe-Africa"},{"obj":"🌎","alt":"Globe Showing Americas"},{"obj":"🌏","alt":"Globe Showing Asia-Australia"},{"obj":"🌐","alt":"Globe with Meridians"},{"obj":"🪨","alt":"Rock"},{"obj":"🌑","alt":"New Moon"},{"obj":"🌒","alt":"Waxing Crescent Moon"},{"obj":"🌓","alt":"First Quarter Moon"},{"obj":"🌔","alt":"Waxing Gibbous Moon"},{"obj":"🌕","alt":"Full Moon"},{"obj":"🌖","alt":"Waning Gibbous Moon"},{"obj":"🌗","alt":"Last Quarter Moon"},{"obj":"🌘","alt":"Waning Crescent Moon"},{"obj":"🌙","alt":"Crescent Moon"},{"obj":"🌚","alt":"New Moon Face"},{"obj":"🌛","alt":"First Quarter Moon Face"},{"obj":"🌜","alt":"Last Quarter Moon Face"},{"obj":"☀️","alt":"Sun"},{"obj":"🌝","alt":"Full Moon Face"},{"obj":"🌞","alt":"Sun with Face"},{"obj":"⭐","alt":"Star"},{"obj":"🌟","alt":"Glowing Star"},{"obj":"🌠","alt":"Shooting Star"},{"obj":"☁️","alt":"Cloud"},{"obj":"⛅","alt":"Sun Behind Cloud"},{"obj":"⛈️","alt":"Cloud with Lightning and Rain"},{"obj":"🌤️","alt":"Sun Behind Small Cloud"},{"obj":"🌥️","alt":"Sun Behind Large Cloud"},{"obj":"🌦️","alt":"Sun Behind Rain Cloud"},{"obj":"🌧️","alt":"Cloud with Rain"},{"obj":"🌨️","alt":"Cloud with Snow"},{"obj":"🌩️","alt":"Cloud with Lightning"},{"obj":"🌪️","alt":"Tornado"},{"obj":"🌫️","alt":"Fog"},{"obj":"🌬️","alt":"Wind Face"},{"obj":"🌈","alt":"Rainbow"},{"obj":"☂️","alt":"Umbrella"},{"obj":"☔","alt":"Umbrella with Rain Drops"},{"obj":"⚡","alt":"High Voltage"},{"obj":"❄️","alt":"Snowflake"},{"obj":"☃️","alt":"Snowman"},{"obj":"⛄","alt":"Snowman Without Snow"},{"obj":"☄️","alt":"Comet"},{"obj":"🔥","alt":"Fire"},{"obj":"💧","alt":"Droplet"},{"obj":"🌊","alt":"Water Wave"},{"obj":"🎄","alt":"Christmas Tree"},{"obj":"✨","alt":"Sparkles"},{"obj":"🎋","alt":"Tanabata Tree"},{"obj":"🎍","alt":"Pine Decoration"},{"obj":"🫧","alt":"Bubbles"}]},
      food = {"name":"Food & Drink","key":"food","mob":"🍔","emojis":[{"obj":"🍇","alt":"Grapes"},{"obj":"🍈","alt":"Melon"},{"obj":"🍉","alt":"Watermelon"},{"obj":"🍊","alt":"Tangerine"},{"obj":"🍋","alt":"Lemon"},{"obj":"🍌","alt":"Banana"},{"obj":"🍍","alt":"Pineapple"},{"obj":"🥭","alt":"Mango"},{"obj":"🍎","alt":"Red Apple"},{"obj":"🍏","alt":"Green Apple"},{"obj":"🍐","alt":"Pear"},{"obj":"🍑","alt":"Peach"},{"obj":"🍒","alt":"Cherries"},{"obj":"🍓","alt":"Strawberry"},{"obj":"🫐","alt":"Blueberries"},{"obj":"🥝","alt":"Kiwi Fruit"},{"obj":"🍅","alt":"Tomato"},{"obj":"🫒","alt":"Olive"},{"obj":"🥥","alt":"Coconut"},{"obj":"🥑","alt":"Avocado"},{"obj":"🍆","alt":"Eggplant"},{"obj":"🥔","alt":"Potato"},{"obj":"🥕","alt":"Carrot"},{"obj":"🌽","alt":"Ear of Corn"},{"obj":"🌶️","alt":"Hot Pepper"},{"obj":"🫑","alt":"Bell Pepper"},{"obj":"🥒","alt":"Cucumber"},{"obj":"🥬","alt":"Leafy Green"},{"obj":"🥦","alt":"Broccoli"},{"obj":"🧄","alt":"Garlic"},{"obj":"🧅","alt":"Onion"},{"obj":"🍄","alt":"Mushroom"},{"obj":"🥜","alt":"Peanuts"},{"obj":"🫘","alt":"Beans"},{"obj":"🌰","alt":"Chestnut"},{"obj":"🍞","alt":"Bread"},{"obj":"🥐","alt":"Croissant"},{"obj":"🥖","alt":"Baguette Bread"},{"obj":"🫓","alt":"Flatbread"},{"obj":"🥨","alt":"Pretzel"},{"obj":"🥯","alt":"Bagel"},{"obj":"🥞","alt":"Pancakes"},{"obj":"🧇","alt":"Waffle"},{"obj":"🧀","alt":"Cheese Wedge"},{"obj":"🍖","alt":"Meat on Bone"},{"obj":"🍗","alt":"Poultry Leg"},{"obj":"🥩","alt":"Cut of Meat"},{"obj":"🥓","alt":"Bacon"},{"obj":"🍔","alt":"Hamburger"},{"obj":"🍟","alt":"French Fries"},{"obj":"🍕","alt":"Pizza"},{"obj":"🌭","alt":"Hot Dog"},{"obj":"🥪","alt":"Sandwich"},{"obj":"🌮","alt":"Taco"},{"obj":"🌯","alt":"Burrito"},{"obj":"🫔","alt":"Tamale"},{"obj":"🥙","alt":"Stuffed Flatbread"},{"obj":"🧆","alt":"Falafel"},{"obj":"🥚","alt":"Egg"},{"obj":"🍳","alt":"Cooking"},{"obj":"🥘","alt":"Shallow Pan of Food"},{"obj":"🍲","alt":"Pot of Food"},{"obj":"🫕","alt":"Fondue"},{"obj":"🥣","alt":"Bowl with Spoon"},{"obj":"🥗","alt":"Green Salad"},{"obj":"🍿","alt":"Popcorn"},{"obj":"🧈","alt":"Butter"},{"obj":"🧂","alt":"Salt"},{"obj":"🥫","alt":"Canned Food"},{"obj":"🍱","alt":"Bento Box"},{"obj":"🍘","alt":"Rice Cracker"},{"obj":"🍙","alt":"Rice Ball"},{"obj":"🍚","alt":"Cooked Rice"},{"obj":"🍛","alt":"Curry Rice"},{"obj":"🍜","alt":"Steaming Bowl"},{"obj":"🍝","alt":"Spaghetti"},{"obj":"🍠","alt":"Roasted Sweet Potato"},{"obj":"🍢","alt":"Oden"},{"obj":"🍣","alt":"Sushi"},{"obj":"🍤","alt":"Fried Shrimp"},{"obj":"🍥","alt":"Fish Cake with Swirl"},{"obj":"🥮","alt":"Moon Cake"},{"obj":"🍡","alt":"Dango"},{"obj":"🥟","alt":"Dumpling"},{"obj":"🥠","alt":"Fortune Cookie"},{"obj":"🥡","alt":"Takeout Box"},{"obj":"🦪","alt":"Oyster"},{"obj":"🍦","alt":"Soft Ice Cream"},{"obj":"🍧","alt":"Shaved Ice"},{"obj":"🍨","alt":"Ice Cream"},{"obj":"🍩","alt":"Doughnut"},{"obj":"🍪","alt":"Cookie"},{"obj":"🎂","alt":"Birthday Cake"},{"obj":"🍰","alt":"Shortcake"},{"obj":"🧁","alt":"Cupcake"},{"obj":"🥧","alt":"Pie"},{"obj":"🍫","alt":"Chocolate Bar"},{"obj":"🍬","alt":"Candy"},{"obj":"🍭","alt":"Lollipop"},{"obj":"🍮","alt":"Custard"},{"obj":"🍯","alt":"Honey Pot"},{"obj":"🍼","alt":"Baby Bottle"},{"obj":"🥛","alt":"Glass of Milk"},{"obj":"☕","alt":"Hot Beverage"},{"obj":"🫖","alt":"Teapot"},{"obj":"🍵","alt":"Teacup Without Handle"},{"obj":"🍶","alt":"Sake"},{"obj":"🍾","alt":"Bottle with Popping Cork"},{"obj":"🍷","alt":"Wine Glass"},{"obj":"🍸","alt":"Cocktail Glass"},{"obj":"🍹","alt":"Tropical Drink"},{"obj":"🍺","alt":"Beer Mug"},{"obj":"🍻","alt":"Clinking Beer Mugs"},{"obj":"🥂","alt":"Clinking Glasses"},{"obj":"🥃","alt":"Tumbler Glass"},{"obj":"🫗","alt":"Pouring Liquid"},{"obj":"🥤","alt":"Cup with Straw"},{"obj":"🧋","alt":"Bubble Tea"},{"obj":"🧃","alt":"Beverage Box"},{"obj":"🧉","alt":"Mate"},{"obj":"🧊","alt":"Ice"},{"obj":"🥢","alt":"Chopsticks"},{"obj":"🍽️","alt":"Fork and Knife with Plate"},{"obj":"🍴","alt":"Fork and Knife"},{"obj":"🥄","alt":"Spoon"},{"obj":"🫙","alt":"Jar"}]},
      activity = {"name":"Activity","key":"activity","mob":"⚽","emojis":[{"obj":"🕴️","alt":"Person in Suit Levitating"},{"obj":"🧗","alt":"Person Climbing"},{"obj":"🧗‍♂️","alt":"Man Climbing"},{"obj":"🧗‍♀️","alt":"Woman Climbing"},{"obj":"🤺","alt":"Person Fencing"},{"obj":"🏇","alt":"Horse Racing"},{"obj":"⛷️","alt":"Skier"},{"obj":"🏂","alt":"Snowboarder"},{"obj":"🏌️","alt":"Person Golfing"},{"obj":"🏌️‍♂️","alt":"Man Golfing"},{"obj":"🏌️‍♀️","alt":"Woman Golfing"},{"obj":"🏄","alt":"Person Surfing"},{"obj":"🏄‍♂️","alt":"Man Surfing"},{"obj":"🏄‍♀️","alt":"Woman Surfing"},{"obj":"🚣","alt":"Person Rowing Boat"},{"obj":"🚣‍♂️","alt":"Man Rowing Boat"},{"obj":"🚣‍♀️","alt":"Woman Rowing Boat"},{"obj":"🏊","alt":"Person Swimming"},{"obj":"🏊‍♂️","alt":"Man Swimming"},{"obj":"🏊‍♀️","alt":"Woman Swimming"},{"obj":"⛹️","alt":"Person Bouncing Ball"},{"obj":"⛹️‍♂️","alt":"Man Bouncing Ball"},{"obj":"⛹️‍♀️","alt":"Woman Bouncing Ball"},{"obj":"🏋️","alt":"Person Lifting Weights"},{"obj":"🏋️‍♂️","alt":"Man Lifting Weights"},{"obj":"🏋️‍♀️","alt":"Woman Lifting Weights"},{"obj":"🚴","alt":"Person Biking"},{"obj":"🚴‍♂️","alt":"Man Biking"},{"obj":"🚴‍♀️","alt":"Woman Biking"},{"obj":"🚵","alt":"Person Mountain Biking"},{"obj":"🚵‍♂️","alt":"Man Mountain Biking"},{"obj":"🚵‍♀️","alt":"Woman Mountain Biking"},{"obj":"🤸","alt":"Person Cartwheeling"},{"obj":"🤸‍♂️","alt":"Man Cartwheeling"},{"obj":"🤸‍♀️","alt":"Woman Cartwheeling"},{"obj":"🤼","alt":"People Wrestling"},{"obj":"🤼‍♂️","alt":"Men Wrestling"},{"obj":"🤼‍♀️","alt":"Women Wrestling"},{"obj":"🤽","alt":"Person Playing Water Polo"},{"obj":"🤽‍♂️","alt":"Man Playing Water Polo"},{"obj":"🤽‍♀️","alt":"Woman Playing Water Polo"},{"obj":"🤾","alt":"Person Playing Handball"},{"obj":"🤾‍♂️","alt":"Man Playing Handball"},{"obj":"🤾‍♀️","alt":"Woman Playing Handball"},{"obj":"🤹","alt":"Person Juggling"},{"obj":"🤹‍♂️","alt":"Man Juggling"},{"obj":"🤹‍♀️","alt":"Woman Juggling"},{"obj":"🧘","alt":"Person in Lotus Position"},{"obj":"🧘‍♂️","alt":"Man in Lotus Position"},{"obj":"🧘‍♀️","alt":"Woman in Lotus Position"},{"obj":"🎪","alt":"Circus Tent"},{"obj":"🛹","alt":"Skateboard"},{"obj":"🛼","alt":"Roller Skate"},{"obj":"🛶","alt":"Canoe"},{"obj":"🎗️","alt":"Reminder Ribbon"},{"obj":"🎟️","alt":"Admission Tickets"},{"obj":"🎫","alt":"Ticket"},{"obj":"🎖️","alt":"Military Medal"},{"obj":"🏆","alt":"Trophy"},{"obj":"🏅","alt":"Sports Medal"},{"obj":"🥇","alt":"1st Place Medal"},{"obj":"🥈","alt":"2nd Place Medal"},{"obj":"🥉","alt":"3rd Place Medal"},{"obj":"⚽","alt":"Soccer Ball"},{"obj":"⚾","alt":"Baseball"},{"obj":"🥎","alt":"Softball"},{"obj":"🏀","alt":"Basketball"},{"obj":"🏐","alt":"Volleyball"},{"obj":"🏈","alt":"American Football"},{"obj":"🏉","alt":"Rugby Football"},{"obj":"🎾","alt":"Tennis"},{"obj":"🥏","alt":"Flying Disc"},{"obj":"🎳","alt":"Bowling"},{"obj":"🏏","alt":"Cricket Game"},{"obj":"🏑","alt":"Field Hockey"},{"obj":"🏒","alt":"Ice Hockey"},{"obj":"🥍","alt":"Lacrosse"},{"obj":"🏓","alt":"Ping Pong"},{"obj":"🏸","alt":"Badminton"},{"obj":"🥊","alt":"Boxing Glove"},{"obj":"🥋","alt":"Martial Arts Uniform"},{"obj":"🥅","alt":"Goal Net"},{"obj":"⛳","alt":"Flag in Hole"},{"obj":"⛸️","alt":"Ice Skate"},{"obj":"🎣","alt":"Fishing Pole"},{"obj":"🎽","alt":"Running Shirt"},{"obj":"🎿","alt":"Skis"},{"obj":"🛷","alt":"Sled"},{"obj":"🥌","alt":"Curling Stone"},{"obj":"🎯","alt":"Bullseye"},{"obj":"🎱","alt":"Pool 8 Ball"},{"obj":"🎮","alt":"Video Game"},{"obj":"🎰","alt":"Slot Machine"},{"obj":"🎲","alt":"Game Die"},{"obj":"🧩","alt":"Puzzle Piece"},{"obj":"🪩","alt":"Mirror Ball"},{"obj":"♟️","alt":"Chess Pawn"},{"obj":"🎭","alt":"Performing Arts"},{"obj":"🎨","alt":"Artist Palette"},{"obj":"🧵","alt":"Thread"},{"obj":"🧶","alt":"Yarn"},{"obj":"🎼","alt":"Musical Score"},{"obj":"🎤","alt":"Microphone"},{"obj":"🎧","alt":"Headphone"},{"obj":"🎷","alt":"Saxophone"},{"obj":"🪗","alt":"Accordion"},{"obj":"🎸","alt":"Guitar"},{"obj":"🎹","alt":"Musical Keyboard"},{"obj":"🎺","alt":"Trumpet"},{"obj":"🎻","alt":"Violin"},{"obj":"🥁","alt":"Drum"},{"obj":"🪘","alt":"Long Drum"},{"obj":"🎬","alt":"Clapper Board"},{"obj":"🏹","alt":"Bow and Arrow"}]},
      places = {"name":"Travel & Places","key":"places","mob":"🚀","emojis":[{"obj":"🚣","alt":"Person Rowing Boat"},{"obj":"🗾","alt":"Map of Japan"},{"obj":"🏔️","alt":"Snow-Capped Mountain"},{"obj":"⛰️","alt":"Mountain"},{"obj":"🌋","alt":"Volcano"},{"obj":"🗻","alt":"Mount Fuji"},{"obj":"🏕️","alt":"Camping"},{"obj":"🏖️","alt":"Beach with Umbrella"},{"obj":"🏜️","alt":"Desert"},{"obj":"🏝️","alt":"Desert Island"},{"obj":"🏞️","alt":"National Park"},{"obj":"🏟️","alt":"Stadium"},{"obj":"🏛️","alt":"Classical Building"},{"obj":"🏗️","alt":"Building Construction"},{"obj":"🛖","alt":"Hut"},{"obj":"🏘️","alt":"Houses"},{"obj":"🏚️","alt":"Derelict House"},{"obj":"🏠","alt":"House"},{"obj":"🏡","alt":"House with Garden"},{"obj":"🏢","alt":"Office Building"},{"obj":"🏣","alt":"Japanese Post Office"},{"obj":"🏤","alt":"Post Office"},{"obj":"🏥","alt":"Hospital"},{"obj":"🏦","alt":"Bank"},{"obj":"🏨","alt":"Hotel"},{"obj":"🏩","alt":"Love Hotel"},{"obj":"🏪","alt":"Convenience Store"},{"obj":"🏫","alt":"School"},{"obj":"🏬","alt":"Department Store"},{"obj":"🏭","alt":"Factory"},{"obj":"🏯","alt":"Japanese Castle"},{"obj":"🏰","alt":"Castle"},{"obj":"💒","alt":"Wedding"},{"obj":"🗼","alt":"Tokyo Tower"},{"obj":"🗽","alt":"Statue of Liberty"},{"obj":"⛪","alt":"Church"},{"obj":"🕌","alt":"Mosque"},{"obj":"🛕","alt":"Hindu Temple"},{"obj":"🕍","alt":"Synagogue"},{"obj":"⛩️","alt":"Shinto Shrine"},{"obj":"🕋","alt":"Kaaba"},{"obj":"⛲","alt":"Fountain"},{"obj":"⛺","alt":"Tent"},{"obj":"🌁","alt":"Foggy"},{"obj":"🌃","alt":"Night with Stars"},{"obj":"🏙️","alt":"Cityscape"},{"obj":"🌄","alt":"Sunrise Over Mountains"},{"obj":"🌅","alt":"Sunrise"},{"obj":"🌆","alt":"Cityscape at Dusk"},{"obj":"🌇","alt":"Sunset"},{"obj":"🌉","alt":"Bridge at Night"},{"obj":"🎠","alt":"Carousel Horse"},{"obj":"🛝","alt":"Playground Slide"},{"obj":"🎡","alt":"Ferris Wheel"},{"obj":"🎢","alt":"Roller Coaster"},{"obj":"🚂","alt":"Locomotive"},{"obj":"🚃","alt":"Railway Car"},{"obj":"🚄","alt":"High-Speed Train"},{"obj":"🚅","alt":"Bullet Train"},{"obj":"🚆","alt":"Train"},{"obj":"🚇","alt":"Metro"},{"obj":"🚈","alt":"Light Rail"},{"obj":"🚉","alt":"Station"},{"obj":"🚊","alt":"Tram"},{"obj":"🚝","alt":"Monorail"},{"obj":"🚞","alt":"Mountain Railway"},{"obj":"🚋","alt":"Tram Car"},{"obj":"🚌","alt":"Bus"},{"obj":"🚍","alt":"Oncoming Bus"},{"obj":"🚎","alt":"Trolleybus"},{"obj":"🚐","alt":"Minibus"},{"obj":"🚑","alt":"Ambulance"},{"obj":"🚒","alt":"Fire Engine"},{"obj":"🚓","alt":"Police Car"},{"obj":"🚔","alt":"Oncoming Police Car"},{"obj":"🚕","alt":"Taxi"},{"obj":"🚖","alt":"Oncoming Taxi"},{"obj":"🚗","alt":"Automobile"},{"obj":"🚘","alt":"Oncoming Automobile"},{"obj":"🚙","alt":"Sport Utility Vehicle"},{"obj":"🛻","alt":"Pickup Truck"},{"obj":"🚚","alt":"Delivery Truck"},{"obj":"🚛","alt":"Articulated Lorry"},{"obj":"🚜","alt":"Tractor"},{"obj":"🏎️","alt":"Racing Car"},{"obj":"🏍️","alt":"Motorcycle"},{"obj":"🛵","alt":"Motor Scooter"},{"obj":"🛺","alt":"Auto Rickshaw"},{"obj":"🚲","alt":"Bicycle"},{"obj":"🛴","alt":"Kick Scooter"},{"obj":"🚏","alt":"Bus Stop"},{"obj":"🛣️","alt":"Motorway"},{"obj":"🛤️","alt":"Railway Track"},{"obj":"⛽","alt":"Fuel Pump"},{"obj":"🛞","alt":"Wheel"},{"obj":"🚨","alt":"Police Car Light"},{"obj":"🚥","alt":"Horizontal Traffic Light"},{"obj":"🚦","alt":"Vertical Traffic Light"},{"obj":"🚧","alt":"Construction"},{"obj":"⚓","alt":"Anchor"},{"obj":"🛟","alt":"Ring Buoy"},{"obj":"⛵","alt":"Sailboat"},{"obj":"🚤","alt":"Speedboat"},{"obj":"🛳️","alt":"Passenger Ship"},{"obj":"⛴️","alt":"Ferry"},{"obj":"🛥️","alt":"Motor Boat"},{"obj":"🚢","alt":"Ship"},{"obj":"✈️","alt":"Airplane"},{"obj":"🛩️","alt":"Small Airplane"},{"obj":"🛫","alt":"Airplane Departure"},{"obj":"🛬","alt":"Airplane Arrival"},{"obj":"🪂","alt":"Parachute"},{"obj":"💺","alt":"Seat"},{"obj":"🚁","alt":"Helicopter"},{"obj":"🚟","alt":"Suspension Railway"},{"obj":"🚠","alt":"Mountain Cableway"},{"obj":"🚡","alt":"Aerial Tramway"},{"obj":"🛰️","alt":"Satellite"},{"obj":"🚀","alt":"Rocket"},{"obj":"🛸","alt":"Flying Saucer"},{"obj":"🪐","alt":"Ringed Planet"},{"obj":"🌠","alt":"Shooting Star"},{"obj":"🌌","alt":"Milky Way"},{"obj":"⛱️","alt":"Umbrella on Ground"},{"obj":"🎆","alt":"Fireworks"},{"obj":"🎇","alt":"Sparkler"},{"obj":"🎑","alt":"Moon Viewing Ceremony"},{"obj":"💴","alt":"Yen Banknote"},{"obj":"💵","alt":"Dollar Banknote"},{"obj":"💶","alt":"Euro Banknote"},{"obj":"💷","alt":"Pound Banknote"},{"obj":"🗿","alt":"Moai"},{"obj":"🛂","alt":"Passport Control"},{"obj":"🛃","alt":"Customs"},{"obj":"🛄","alt":"Baggage Claim"},{"obj":"🛅","alt":"Left Luggage"}]},
      objects = {"name":"Objects","key":"objects","mob":"💿","emojis":[{"obj":"💌","alt":"Love Letter"},{"obj":"🕳️","alt":"Hole"},{"obj":"💣","alt":"Bomb"},{"obj":"🛀","alt":"Person Taking Bath"},{"obj":"🛌","alt":"Person in Bed"},{"obj":"🔪","alt":"Kitchen Knife"},{"obj":"🏺","alt":"Amphora"},{"obj":"🗺️","alt":"World Map"},{"obj":"🧭","alt":"Compass"},{"obj":"🧱","alt":"Brick"},{"obj":"💈","alt":"Barber Pole"},{"obj":"🦽","alt":"Manual Wheelchair"},{"obj":"🦼","alt":"Motorized Wheelchair"},{"obj":"🛢️","alt":"Oil Drum"},{"obj":"🛎️","alt":"Bellhop Bell"},{"obj":"🧳","alt":"Luggage"},{"obj":"⌛","alt":"Hourglass Done"},{"obj":"⏳","alt":"Hourglass Not Done"},{"obj":"⌚","alt":"Watch"},{"obj":"⏰","alt":"Alarm Clock"},{"obj":"⏱️","alt":"Stopwatch"},{"obj":"⏲️","alt":"Timer Clock"},{"obj":"🕰️","alt":"Mantelpiece Clock"},{"obj":"🌡️","alt":"Thermometer"},{"obj":"⛱️","alt":"Umbrella on Ground"},{"obj":"🧨","alt":"Firecracker"},{"obj":"🎈","alt":"Balloon"},{"obj":"🎉","alt":"Party Popper"},{"obj":"🎊","alt":"Confetti Ball"},{"obj":"🎎","alt":"Japanese Dolls"},{"obj":"🎏","alt":"Carp Streamer"},{"obj":"🎐","alt":"Wind Chime"},{"obj":"🧧","alt":"Red Envelope"},{"obj":"🎀","alt":"Ribbon"},{"obj":"🎁","alt":"Wrapped Gift"},{"obj":"🤿","alt":"Diving Mask"},{"obj":"🪀","alt":"Yo-Yo"},{"obj":"🪁","alt":"Kite"},{"obj":"🔮","alt":"Crystal Ball"},{"obj":"🪄","alt":"Magic Wand"},{"obj":"🧿","alt":"Nazar Amulet"},{"obj":"🪬","alt":"Hamsa"},{"obj":"🕹️","alt":"Joystick"},{"obj":"🧸","alt":"Teddy Bear"},{"obj":"🪅","alt":"Piñata"},{"obj":"🪆","alt":"Nesting Dolls"},{"obj":"🖼️","alt":"Framed Picture"},{"obj":"🧵","alt":"Thread"},{"obj":"🪡","alt":"Sewing Needle"},{"obj":"🧶","alt":"Yarn"},{"obj":"🪢","alt":"Knot"},{"obj":"🛍️","alt":"Shopping Bags"},{"obj":"📿","alt":"Prayer Beads"},{"obj":"💎","alt":"Gem Stone"},{"obj":"📯","alt":"Postal Horn"},{"obj":"🎙️","alt":"Studio Microphone"},{"obj":"🎚️","alt":"Level Slider"},{"obj":"🎛️","alt":"Control Knobs"},{"obj":"📻","alt":"Radio"},{"obj":"🪕","alt":"Banjo"},{"obj":"📱","alt":"Mobile Phone"},{"obj":"📲","alt":"Mobile Phone with Arrow"},{"obj":"☎️","alt":"Telephone"},{"obj":"📞","alt":"Telephone Receiver"},{"obj":"📟","alt":"Pager"},{"obj":"📠","alt":"Fax Machine"},{"obj":"🔋","alt":"Battery"},{"obj":"🔌","alt":"Electric Plug"},{"obj":"💻","alt":"Laptop"},{"obj":"🖥️","alt":"Desktop Computer"},{"obj":"🖨️","alt":"Printer"},{"obj":"⌨️","alt":"Keyboard"},{"obj":"🖱️","alt":"Computer Mouse"},{"obj":"🖲️","alt":"Trackball"},{"obj":"💽","alt":"Computer Disk"},{"obj":"💾","alt":"Floppy Disk"},{"obj":"💿","alt":"Optical Disk"},{"obj":"📀","alt":"DVD"},{"obj":"🧮","alt":"Abacus"},{"obj":"🎥","alt":"Movie Camera"},{"obj":"🎞️","alt":"Film Frames"},{"obj":"📽️","alt":"Film Projector"},{"obj":"📺","alt":"Television"},{"obj":"📷","alt":"Camera"},{"obj":"📸","alt":"Camera with Flash"},{"obj":"📹","alt":"Video Camera"},{"obj":"📼","alt":"Videocassette"},{"obj":"🔍","alt":"Magnifying Glass Tilted Left"},{"obj":"🔎","alt":"Magnifying Glass Tilted Right"},{"obj":"🕯️","alt":"Candle"},{"obj":"💡","alt":"Light Bulb"},{"obj":"🔦","alt":"Flashlight"},{"obj":"🏮","alt":"Red Paper Lantern"},{"obj":"🪔","alt":"Diya Lamp"},{"obj":"📔","alt":"Notebook with Decorative Cover"},{"obj":"📕","alt":"Closed Book"},{"obj":"📖","alt":"Open Book"},{"obj":"📗","alt":"Green Book"},{"obj":"📘","alt":"Blue Book"},{"obj":"📙","alt":"Orange Book"},{"obj":"📚","alt":"Books"},{"obj":"📓","alt":"Notebook"},{"obj":"📒","alt":"Ledger"},{"obj":"📃","alt":"Page with Curl"},{"obj":"📜","alt":"Scroll"},{"obj":"📄","alt":"Page Facing Up"},{"obj":"📰","alt":"Newspaper"},{"obj":"🗞️","alt":"Rolled-Up Newspaper"},{"obj":"📑","alt":"Bookmark Tabs"},{"obj":"🔖","alt":"Bookmark"},{"obj":"🏷️","alt":"Label"},{"obj":"💰","alt":"Money Bag"},{"obj":"🪙","alt":"Coin"},{"obj":"💴","alt":"Yen Banknote"},{"obj":"💵","alt":"Dollar Banknote"},{"obj":"💶","alt":"Euro Banknote"},{"obj":"💷","alt":"Pound Banknote"},{"obj":"💸","alt":"Money with Wings"},{"obj":"💳","alt":"Credit Card"},{"obj":"🧾","alt":"Receipt"},{"obj":"✉️","alt":"Envelope"},{"obj":"📧","alt":"E-Mail"},{"obj":"📨","alt":"Incoming Envelope"},{"obj":"📩","alt":"Envelope with Arrow"},{"obj":"📤","alt":"Outbox Tray"},{"obj":"📥","alt":"Inbox Tray"},{"obj":"📦","alt":"Package"},{"obj":"📫","alt":"Closed Mailbox with Raised Flag"},{"obj":"📪","alt":"Closed Mailbox with Lowered Flag"},{"obj":"📬","alt":"Open Mailbox with Raised Flag"},{"obj":"📭","alt":"Open Mailbox with Lowered Flag"},{"obj":"📮","alt":"Postbox"},{"obj":"🗳️","alt":"Ballot Box with Ballot"},{"obj":"✏️","alt":"Pencil"},{"obj":"✒️","alt":"Black Nib"},{"obj":"🖋️","alt":"Fountain Pen"},{"obj":"🖊️","alt":"Pen"},{"obj":"🖌️","alt":"Paintbrush"},{"obj":"🖍️","alt":"Crayon"},{"obj":"📝","alt":"Memo"},{"obj":"📁","alt":"File Folder"},{"obj":"📂","alt":"Open File Folder"},{"obj":"🗂️","alt":"Card Index Dividers"},{"obj":"📅","alt":"Calendar"},{"obj":"📆","alt":"Tear-Off Calendar"},{"obj":"🗒️","alt":"Spiral Notepad"},{"obj":"🗓️","alt":"Spiral Calendar"},{"obj":"📇","alt":"Card Index"},{"obj":"📈","alt":"Chart Increasing"},{"obj":"📉","alt":"Chart Decreasing"},{"obj":"📊","alt":"Bar Chart"},{"obj":"📋","alt":"Clipboard"},{"obj":"📌","alt":"Pushpin"},{"obj":"📍","alt":"Round Pushpin"},{"obj":"📎","alt":"Paperclip"},{"obj":"🖇️","alt":"Linked Paperclips"},{"obj":"📏","alt":"Straight Ruler"},{"obj":"📐","alt":"Triangular Ruler"},{"obj":"✂️","alt":"Scissors"},{"obj":"🗃️","alt":"Card File Box"},{"obj":"🗄️","alt":"File Cabinet"},{"obj":"🗑️","alt":"Wastebasket"},{"obj":"🔒","alt":"Locked"},{"obj":"🔓","alt":"Unlocked"},{"obj":"🔏","alt":"Locked with Pen"},{"obj":"🔐","alt":"Locked with Key"},{"obj":"🔑","alt":"Key"},{"obj":"🗝️","alt":"Old Key"},{"obj":"🔨","alt":"Hammer"},{"obj":"🪓","alt":"Axe"},{"obj":"⛏️","alt":"Pick"},{"obj":"⚒️","alt":"Hammer and Pick"},{"obj":"🛠️","alt":"Hammer and Wrench"},{"obj":"🗡️","alt":"Dagger"},{"obj":"⚔️","alt":"Crossed Swords"},{"obj":"🔫","alt":"Water Pistol"},{"obj":"🪃","alt":"Boomerang"},{"obj":"🛡️","alt":"Shield"},{"obj":"🪚","alt":"Carpentry Saw"},{"obj":"🔧","alt":"Wrench"},{"obj":"🪛","alt":"Screwdriver"},{"obj":"🔩","alt":"Nut and Bolt"},{"obj":"⚙️","alt":"Gear"},{"obj":"🗜️","alt":"Clamp"},{"obj":"⚖️","alt":"Balance Scale"},{"obj":"🦯","alt":"White Cane"},{"obj":"🔗","alt":"Link"},{"obj":"⛓️","alt":"Chains"},{"obj":"🪝","alt":"Hook"},{"obj":"🧰","alt":"Toolbox"},{"obj":"🧲","alt":"Magnet"},{"obj":"🪜","alt":"Ladder"},{"obj":"⚗️","alt":"Alembic"},{"obj":"🧪","alt":"Test Tube"},{"obj":"🧫","alt":"Petri Dish"},{"obj":"🧬","alt":"DNA"},{"obj":"🔬","alt":"Microscope"},{"obj":"🔭","alt":"Telescope"},{"obj":"📡","alt":"Satellite Antenna"},{"obj":"💉","alt":"Syringe"},{"obj":"🩸","alt":"Drop of Blood"},{"obj":"💊","alt":"Pill"},{"obj":"🩹","alt":"Adhesive Bandage"},{"obj":"🩼","alt":"Crutch"},{"obj":"🩺","alt":"Stethoscope"},{"obj":"🚪","alt":"Door"},{"obj":"🪞","alt":"Mirror"},{"obj":"🪟","alt":"Window"},{"obj":"🛏️","alt":"Bed"},{"obj":"🛋️","alt":"Couch and Lamp"},{"obj":"🪑","alt":"Chair"},{"obj":"🚽","alt":"Toilet"},{"obj":"🪠","alt":"Plunger"},{"obj":"🚿","alt":"Shower"},{"obj":"🛁","alt":"Bathtub"},{"obj":"🪤","alt":"Mouse Trap"},{"obj":"🪒","alt":"Razor"},{"obj":"🧴","alt":"Lotion Bottle"},{"obj":"🧷","alt":"Safety Pin"},{"obj":"🧹","alt":"Broom"},{"obj":"🧺","alt":"Basket"},{"obj":"🧻","alt":"Roll of Paper"},{"obj":"🪣","alt":"Bucket"},{"obj":"🧼","alt":"Soap"},{"obj":"🪥","alt":"Toothbrush"},{"obj":"🧽","alt":"Sponge"},{"obj":"🧯","alt":"Fire Extinguisher"},{"obj":"🛒","alt":"Shopping Cart"},{"obj":"🚬","alt":"Cigarette"},{"obj":"⚰️","alt":"Coffin"},{"obj":"🪦","alt":"Headstone"},{"obj":"⚱️","alt":"Funeral Urn"},{"obj":"🗿","alt":"Moai"},{"obj":"🪧","alt":"Placard"},{"obj":"🪪","alt":"Identification Card"},{"obj":"🚰","alt":"Potable Water"}]},
      symbols = {"name":"Symbols","key":"symbols","mob":"💗","emojis":[{"obj":"💘","alt":"Heart with Arrow"},{"obj":"💝","alt":"Heart with Ribbon"},{"obj":"💖","alt":"Sparkling Heart"},{"obj":"💗","alt":"Growing Heart"},{"obj":"💓","alt":"Beating Heart"},{"obj":"💞","alt":"Revolving Hearts"},{"obj":"💕","alt":"Two Hearts"},{"obj":"💟","alt":"Heart Decoration"},{"obj":"❣️","alt":"Heart Exclamation"},{"obj":"💔","alt":"Broken Heart"},{"obj":"❤️‍🔥","alt":"Heart on Fire"},{"obj":"❤️‍🩹","alt":"Mending Heart"},{"obj":"❤️","alt":"Red Heart"},{"obj":"🧡","alt":"Orange Heart"},{"obj":"💛","alt":"Yellow Heart"},{"obj":"💚","alt":"Green Heart"},{"obj":"💙","alt":"Blue Heart"},{"obj":"💜","alt":"Purple Heart"},{"obj":"🤎","alt":"Brown Heart"},{"obj":"🖤","alt":"Black Heart"},{"obj":"🤍","alt":"White Heart"},{"obj":"💯","alt":"Hundred Points"},{"obj":"💢","alt":"Anger Symbol"},{"obj":"💬","alt":"Speech Balloon"},{"obj":"👁️‍🗨️","alt":"Eye in Speech Bubble"},{"obj":"🗨️","alt":"Left Speech Bubble"},{"obj":"🗯️","alt":"Right Anger Bubble"},{"obj":"💭","alt":"Thought Balloon"},{"obj":"💤","alt":"Zzz"},{"obj":"💮","alt":"White Flower"},{"obj":"♨️","alt":"Hot Springs"},{"obj":"💈","alt":"Barber Pole"},{"obj":"🛑","alt":"Stop Sign"},{"obj":"🕛","alt":"Twelve O’Clock"},{"obj":"🕧","alt":"Twelve-Thirty"},{"obj":"🕐","alt":"One O’Clock"},{"obj":"🕜","alt":"One-Thirty"},{"obj":"🕑","alt":"Two O’Clock"},{"obj":"🕝","alt":"Two-Thirty"},{"obj":"🕒","alt":"Three O’Clock"},{"obj":"🕞","alt":"Three-Thirty"},{"obj":"🕓","alt":"Four O’Clock"},{"obj":"🕟","alt":"Four-Thirty"},{"obj":"🕔","alt":"Five O’Clock"},{"obj":"🕠","alt":"Five-Thirty"},{"obj":"🕕","alt":"Six O’Clock"},{"obj":"🕡","alt":"Six-Thirty"},{"obj":"🕖","alt":"Seven O’Clock"},{"obj":"🕢","alt":"Seven-Thirty"},{"obj":"🕗","alt":"Eight O’Clock"},{"obj":"🕣","alt":"Eight-Thirty"},{"obj":"🕘","alt":"Nine O’Clock"},{"obj":"🕤","alt":"Nine-Thirty"},{"obj":"🕙","alt":"Ten O’Clock"},{"obj":"🕥","alt":"Ten-Thirty"},{"obj":"🕚","alt":"Eleven O’Clock"},{"obj":"🕦","alt":"Eleven-Thirty"},{"obj":"🌀","alt":"Cyclone"},{"obj":"♠️","alt":"Spade Suit"},{"obj":"♥️","alt":"Heart Suit"},{"obj":"♦️","alt":"Diamond Suit"},{"obj":"♣️","alt":"Club Suit"},{"obj":"🃏","alt":"Joker"},{"obj":"🀄","alt":"Mahjong Red Dragon"},{"obj":"🎴","alt":"Flower Playing Cards"},{"obj":"🔇","alt":"Muted Speaker"},{"obj":"🔈","alt":"Speaker Low Volume"},{"obj":"🔉","alt":"Speaker Medium Volume"},{"obj":"🔊","alt":"Speaker High Volume"},{"obj":"📢","alt":"Loudspeaker"},{"obj":"📣","alt":"Megaphone"},{"obj":"📯","alt":"Postal Horn"},{"obj":"🔔","alt":"Bell"},{"obj":"🔕","alt":"Bell with Slash"},{"obj":"🎵","alt":"Musical Note"},{"obj":"🎶","alt":"Musical Notes"},{"obj":"💹","alt":"Chart Increasing with Yen"},{"obj":"🛗","alt":"Elevator"},{"obj":"🏧","alt":"ATM Sign"},{"obj":"🚮","alt":"Litter in Bin Sign"},{"obj":"🚰","alt":"Potable Water"},{"obj":"♿","alt":"Wheelchair Symbol"},{"obj":"🚹","alt":"Men’s Room"},{"obj":"🚺","alt":"Women’s Room"},{"obj":"🚻","alt":"Restroom"},{"obj":"🚼","alt":"Baby Symbol"},{"obj":"🚾","alt":"Water Closet"},{"obj":"⚠️","alt":"Warning"},{"obj":"🚸","alt":"Children Crossing"},{"obj":"⛔","alt":"No Entry"},{"obj":"🚫","alt":"Prohibited"},{"obj":"🚳","alt":"No Bicycles"},{"obj":"🚭","alt":"No Smoking"},{"obj":"🚯","alt":"No Littering"},{"obj":"🚱","alt":"Non-Potable Water"},{"obj":"🚷","alt":"No Pedestrians"},{"obj":"📵","alt":"No Mobile Phones"},{"obj":"🔞","alt":"No One Under Eighteen"},{"obj":"☢️","alt":"Radioactive"},{"obj":"☣️","alt":"Biohazard"},{"obj":"⬆️","alt":"Up Arrow"},{"obj":"↗️","alt":"Up-Right Arrow"},{"obj":"➡️","alt":"Right Arrow"},{"obj":"↘️","alt":"Down-Right Arrow"},{"obj":"⬇️","alt":"Down Arrow"},{"obj":"↙️","alt":"Down-Left Arrow"},{"obj":"⬅️","alt":"Left Arrow"},{"obj":"↖️","alt":"Up-Left Arrow"},{"obj":"↕️","alt":"Up-Down Arrow"},{"obj":"↔️","alt":"Left-Right Arrow"},{"obj":"↩️","alt":"Right Arrow Curving Left"},{"obj":"↪️","alt":"Left Arrow Curving Right"},{"obj":"⤴️","alt":"Right Arrow Curving Up"},{"obj":"⤵️","alt":"Right Arrow Curving Down"},{"obj":"🔃","alt":"Clockwise Vertical Arrows"},{"obj":"🔄","alt":"Counterclockwise Arrows Button"},{"obj":"🔙","alt":"Back Arrow"},{"obj":"🔚","alt":"End Arrow"},{"obj":"🔛","alt":"On! Arrow"},{"obj":"🔜","alt":"Soon Arrow"},{"obj":"🔝","alt":"Top Arrow"},{"obj":"🛐","alt":"Place of Worship"},{"obj":"⚛️","alt":"Atom Symbol"},{"obj":"🕉️","alt":"Om"},{"obj":"✡️","alt":"Star of David"},{"obj":"☸️","alt":"Wheel of Dharma"},{"obj":"☯️","alt":"Yin Yang"},{"obj":"✝️","alt":"Latin Cross"},{"obj":"☦️","alt":"Orthodox Cross"},{"obj":"☪️","alt":"Star and Crescent"},{"obj":"☮️","alt":"Peace Symbol"},{"obj":"🕎","alt":"Menorah"},{"obj":"🔯","alt":"Dotted Six-Pointed Star"},{"obj":"♈","alt":"Aries"},{"obj":"♉","alt":"Taurus"},{"obj":"♊","alt":"Gemini"},{"obj":"♋","alt":"Cancer"},{"obj":"♌","alt":"Leo"},{"obj":"♍","alt":"Virgo"},{"obj":"♎","alt":"Libra"},{"obj":"♏","alt":"Scorpio"},{"obj":"♐","alt":"Sagittarius"},{"obj":"♑","alt":"Capricorn"},{"obj":"♒","alt":"Aquarius"},{"obj":"♓","alt":"Pisces"},{"obj":"⛎","alt":"Ophiuchus"},{"obj":"🔀","alt":"Shuffle Tracks Button"},{"obj":"🔁","alt":"Repeat Button"},{"obj":"🔂","alt":"Repeat Single Button"},{"obj":"▶️","alt":"Play Button"},{"obj":"⏩","alt":"Fast-Forward Button"},{"obj":"⏭️","alt":"Next Track Button"},{"obj":"⏯️","alt":"Play or Pause Button"},{"obj":"◀️","alt":"Reverse Button"},{"obj":"⏪","alt":"Fast Reverse Button"},{"obj":"⏮️","alt":"Last Track Button"},{"obj":"🔼","alt":"Upwards Button"},{"obj":"⏫","alt":"Fast Up Button"},{"obj":"🔽","alt":"Downwards Button"},{"obj":"⏬","alt":"Fast Down Button"},{"obj":"⏸️","alt":"Pause Button"},{"obj":"⏹️","alt":"Stop Button"},{"obj":"⏺️","alt":"Record Button"},{"obj":"⏏️","alt":"Eject Button"},{"obj":"🎦","alt":"Cinema"},{"obj":"🔅","alt":"Dim Button"},{"obj":"🔆","alt":"Bright Button"},{"obj":"📶","alt":"Antenna Bars"},{"obj":"📳","alt":"Vibration Mode"},{"obj":"📴","alt":"Mobile Phone Off"},{"obj":"♀️","alt":"Female Sign"},{"obj":"♂️","alt":"Male Sign"},{"obj":"✖️","alt":"Multiply"},{"obj":"➕","alt":"Plus"},{"obj":"➖","alt":"Minus"},{"obj":"➗","alt":"Divide"},{"obj":"🟰","alt":"Heavy Equals Sign"},{"obj":"♾️","alt":"Infinity"},{"obj":"‼️","alt":"Double Exclamation Mark"},{"obj":"⁉️","alt":"Exclamation Question Mark"},{"obj":"❓","alt":"Red Question Mark"},{"obj":"❔","alt":"White Question Mark"},{"obj":"❕","alt":"White Exclamation Mark"},{"obj":"❗","alt":"Red Exclamation Mark"},{"obj":"〰️","alt":"Wavy Dash"},{"obj":"💱","alt":"Currency Exchange"},{"obj":"💲","alt":"Heavy Dollar Sign"},{"obj":"⚕️","alt":"Medical Symbol"},{"obj":"♻️","alt":"Recycling Symbol"},{"obj":"⚜️","alt":"Fleur-de-lis"},{"obj":"🔱","alt":"Trident Emblem"},{"obj":"📛","alt":"Name Badge"},{"obj":"🔰","alt":"Japanese Symbol for Beginner"},{"obj":"⭕","alt":"Hollow Red Circle"},{"obj":"✅","alt":"Check Mark Button"},{"obj":"☑️","alt":"Check Box with Check"},{"obj":"✔️","alt":"Check Mark"},{"obj":"❌","alt":"Cross Mark"},{"obj":"❎","alt":"Cross Mark Button"},{"obj":"➰","alt":"Curly Loop"},{"obj":"➿","alt":"Double Curly Loop"},{"obj":"〽️","alt":"Part Alternation Mark"},{"obj":"✳️","alt":"Eight-Spoked Asterisk"},{"obj":"✴️","alt":"Eight-Pointed Star"},{"obj":"❇️","alt":"Sparkle"},{"obj":"©️","alt":"Copyright"},{"obj":"®️","alt":"Registered"},{"obj":"™️","alt":"Trade Mark"},{"obj":"#️⃣","alt":"Keycap Number Sign"},{"obj":"*️⃣","alt":"Keycap Asterisk"},{"obj":"0️⃣","alt":"Keycap Digit Zero"},{"obj":"1️⃣","alt":"Keycap Digit One"},{"obj":"2️⃣","alt":"Keycap Digit Two"},{"obj":"3️⃣","alt":"Keycap Digit Three"},{"obj":"4️⃣","alt":"Keycap Digit Four"},{"obj":"5️⃣","alt":"Keycap Digit Five"},{"obj":"6️⃣","alt":"Keycap Digit Six"},{"obj":"7️⃣","alt":"Keycap Digit Seven"},{"obj":"8️⃣","alt":"Keycap Digit Eight"},{"obj":"9️⃣","alt":"Keycap Digit Nine"},{"obj":"🔟","alt":"Keycap: 10"},{"obj":"🔠","alt":"Input Latin Uppercase"},{"obj":"🔡","alt":"Input Latin Lowercase"},{"obj":"🔢","alt":"Input Numbers"},{"obj":"🔣","alt":"Input Symbols"},{"obj":"🔤","alt":"Input Latin Letters"},{"obj":"🅰️","alt":"A Button (Blood Type)"},{"obj":"🆎","alt":"AB Button (Blood Type)"},{"obj":"🅱️","alt":"B Button (Blood Type)"},{"obj":"🆑","alt":"CL Button"},{"obj":"🆒","alt":"Cool Button"},{"obj":"🆓","alt":"Free Button"},{"obj":"ℹ️","alt":"Information"},{"obj":"🆔","alt":"ID Button"},{"obj":"Ⓜ️","alt":"Circled M"},{"obj":"🆕","alt":"New Button"},{"obj":"🆖","alt":"NG Button"},{"obj":"🅾️","alt":"O Button (Blood Type)"},{"obj":"🆗","alt":"OK Button"},{"obj":"🅿️","alt":"P Button"},{"obj":"🆘","alt":"SOS Button"},{"obj":"🆙","alt":"Up! Button"},{"obj":"🆚","alt":"Vs Button"},{"obj":"🈁","alt":"Japanese “Here” Button"},{"obj":"🈂️","alt":"Japanese “Service Charge” Button"},{"obj":"🈷️","alt":"Japanese “Monthly Amount” Button"},{"obj":"🈶","alt":"Japanese “Not Free of Charge” Button"},{"obj":"🈯","alt":"Japanese “Reserved” Button"},{"obj":"🉐","alt":"Japanese “Bargain” Button"},{"obj":"🈹","alt":"Japanese “Discount” Button"},{"obj":"🈚","alt":"Japanese “Free of Charge” Button"},{"obj":"🈲","alt":"Japanese “Prohibited” Button"},{"obj":"🉑","alt":"Japanese “Acceptable” Button"},{"obj":"🈸","alt":"Japanese “Application” Button"},{"obj":"🈴","alt":"Japanese “Passing Grade” Button"},{"obj":"🈳","alt":"Japanese “Vacancy” Button"},{"obj":"㊗️","alt":"Japanese “Congratulations” Button"},{"obj":"㊙️","alt":"Japanese “Secret” Button"},{"obj":"🈺","alt":"Japanese “Open for Business” Button"},{"obj":"🈵","alt":"Japanese “No Vacancy” Button"},{"obj":"🔴","alt":"Red Circle"},{"obj":"🟠","alt":"Orange Circle"},{"obj":"🟡","alt":"Yellow Circle"},{"obj":"🟢","alt":"Green Circle"},{"obj":"🔵","alt":"Blue Circle"},{"obj":"🟣","alt":"Purple Circle"},{"obj":"🟤","alt":"Brown Circle"},{"obj":"⚫","alt":"Black Circle"},{"obj":"⚪","alt":"White Circle"},{"obj":"🟥","alt":"Red Square"},{"obj":"🟧","alt":"Orange Square"},{"obj":"🟨","alt":"Yellow Square"},{"obj":"🟩","alt":"Green Square"},{"obj":"🟦","alt":"Blue Square"},{"obj":"🟪","alt":"Purple Square"},{"obj":"🟫","alt":"Brown Square"},{"obj":"⬛","alt":"Black Large Square"},{"obj":"⬜","alt":"White Large Square"},{"obj":"◼️","alt":"Black Medium Square"},{"obj":"◻️","alt":"White Medium Square"},{"obj":"◾","alt":"Black Medium-Small Square"},{"obj":"◽","alt":"White Medium-Small Square"},{"obj":"▪️","alt":"Black Small Square"},{"obj":"▫️","alt":"White Small Square"},{"obj":"🔶","alt":"Large Orange Diamond"},{"obj":"🔷","alt":"Large Blue Diamond"},{"obj":"🔸","alt":"Small Orange Diamond"},{"obj":"🔹","alt":"Small Blue Diamond"},{"obj":"🔺","alt":"Red Triangle Pointed Up"},{"obj":"🔻","alt":"Red Triangle Pointed Down"},{"obj":"💠","alt":"Diamond with a Dot"},{"obj":"🔘","alt":"Radio Button"},{"obj":"🔳","alt":"White Square Button"},{"obj":"🔲","alt":"Black Square Button"},]},
      flags = {"name":"Flags","key":"flags","mob":"🎌","emojis":[{"obj":"🏁","alt":"Chequered Flag"},{"obj":"🚩","alt":"Triangular Flag"},{"obj":"🎌","alt":"Crossed Flags"},{"obj":"🏴","alt":"Black Flag"},{"obj":"🏳️","alt":"White Flag"},{"obj":"🏳️‍🌈","alt":"Rainbow Flag"},{"obj":"🏳️‍⚧️","alt":"Transgender Flag"},{"obj":"🏴‍☠️","alt":"Pirate Flag"},{"obj":"🇦🇨","alt":"Flag: Ascension Island"},{"obj":"🇦🇩","alt":"Flag: Andorra"},{"obj":"🇦🇪","alt":"Flag: United Arab Emirates"},{"obj":"🇦🇫","alt":"Flag: Afghanistan"},{"obj":"🇦🇬","alt":"Flag: Antigua & Barbuda"},{"obj":"🇦🇮","alt":"Flag: Anguilla"},{"obj":"🇦🇱","alt":"Flag: Albania"},{"obj":"🇦🇲","alt":"Flag: Armenia"},{"obj":"🇦🇴","alt":"Flag: Angola"},{"obj":"🇦🇶","alt":"Flag: Antarctica"},{"obj":"🇦🇷","alt":"Flag: Argentina"},{"obj":"🇦🇸","alt":"Flag: American Samoa"},{"obj":"🇦🇹","alt":"Flag: Austria"},{"obj":"🇦🇺","alt":"Flag: Australia"},{"obj":"🇦🇼","alt":"Flag: Aruba"},{"obj":"🇦🇽","alt":"Flag: Åland Islands"},{"obj":"🇦🇿","alt":"Flag: Azerbaijan"},{"obj":"🇧🇦","alt":"Flag: Bosnia & Herzegovina"},{"obj":"🇧🇧","alt":"Flag: Barbados"},{"obj":"🇧🇩","alt":"Flag: Bangladesh"},{"obj":"🇧🇪","alt":"Flag: Belgium"},{"obj":"🇧🇫","alt":"Flag: Burkina Faso"},{"obj":"🇧🇬","alt":"Flag: Bulgaria"},{"obj":"🇧🇭","alt":"Flag: Bahrain"},{"obj":"🇧🇮","alt":"Flag: Burundi"},{"obj":"🇧🇯","alt":"Flag: Benin"},{"obj":"🇧🇱","alt":"Flag: St. Barthélemy"},{"obj":"🇧🇲","alt":"Flag: Bermuda"},{"obj":"🇧🇳","alt":"Flag: Brunei"},{"obj":"🇧🇴","alt":"Flag: Bolivia"},{"obj":"🇧🇶","alt":"Flag: Caribbean Netherlands"},{"obj":"🇧🇷","alt":"Flag: Brazil"},{"obj":"🇧🇸","alt":"Flag: Bahamas"},{"obj":"🇧🇹","alt":"Flag: Bhutan"},{"obj":"🇧🇻","alt":"Flag: Bouvet Island"},{"obj":"🇧🇼","alt":"Flag: Botswana"},{"obj":"🇧🇾","alt":"Flag: Belarus"},{"obj":"🇧🇿","alt":"Flag: Belize"},{"obj":"🇨🇦","alt":"Flag: Canada"},{"obj":"🇨🇨","alt":"Flag: Cocos (Keeling) Islands"},{"obj":"🇨🇩","alt":"Flag: Congo - Kinshasa"},{"obj":"🇨🇫","alt":"Flag: Central African Republic"},{"obj":"🇨🇬","alt":"Flag: Congo - Brazzaville"},{"obj":"🇨🇭","alt":"Flag: Switzerland"},{"obj":"🇨🇮","alt":"Flag: Côte d’Ivoire"},{"obj":"🇨🇰","alt":"Flag: Cook Islands"},{"obj":"🇨🇱","alt":"Flag: Chile"},{"obj":"🇨🇲","alt":"Flag: Cameroon"},{"obj":"🇨🇳","alt":"Flag: China"},{"obj":"🇨🇴","alt":"Flag: Colombia"},{"obj":"🇨🇵","alt":"Flag: Clipperton Island"},{"obj":"🇨🇷","alt":"Flag: Costa Rica"},{"obj":"🇨🇺","alt":"Flag: Cuba"},{"obj":"🇨🇻","alt":"Flag: Cape Verde"},{"obj":"🇨🇼","alt":"Flag: Curaçao"},{"obj":"🇨🇽","alt":"Flag: Christmas Island"},{"obj":"🇨🇾","alt":"Flag: Cyprus"},{"obj":"🇨🇿","alt":"Flag: Czechia"},{"obj":"🇩🇪","alt":"Flag: Germany"},{"obj":"🇩🇬","alt":"Flag: Diego Garcia"},{"obj":"🇩🇯","alt":"Flag: Djibouti"},{"obj":"🇩🇰","alt":"Flag: Denmark"},{"obj":"🇩🇲","alt":"Flag: Dominica"},{"obj":"🇩🇴","alt":"Flag: Dominican Republic"},{"obj":"🇩🇿","alt":"Flag: Algeria"},{"obj":"🇪🇦","alt":"Flag: Ceuta & Melilla"},{"obj":"🇪🇨","alt":"Flag: Ecuador"},{"obj":"🇪🇪","alt":"Flag: Estonia"},{"obj":"🇪🇬","alt":"Flag: Egypt"},{"obj":"🇪🇭","alt":"Flag: Western Sahara"},{"obj":"🇪🇷","alt":"Flag: Eritrea"},{"obj":"🇪🇸","alt":"Flag: Spain"},{"obj":"🇪🇹","alt":"Flag: Ethiopia"},{"obj":"🇪🇺","alt":"Flag: European Union"},{"obj":"🇫🇮","alt":"Flag: Finland"},{"obj":"🇫🇯","alt":"Flag: Fiji"},{"obj":"🇫🇰","alt":"Flag: Falkland Islands"},{"obj":"🇫🇲","alt":"Flag: Micronesia"},{"obj":"🇫🇴","alt":"Flag: Faroe Islands"},{"obj":"🇫🇷","alt":"Flag: France"},{"obj":"🇬🇦","alt":"Flag: Gabon"},{"obj":"🇬🇧","alt":"Flag: United Kingdom"},{"obj":"🇬🇩","alt":"Flag: Grenada"},{"obj":"🇬🇪","alt":"Flag: Georgia"},{"obj":"🇬🇫","alt":"Flag: French Guiana"},{"obj":"🇬🇬","alt":"Flag: Guernsey"},{"obj":"🇬🇭","alt":"Flag: Ghana"},{"obj":"🇬🇮","alt":"Flag: Gibraltar"},{"obj":"🇬🇱","alt":"Flag: Greenland"},{"obj":"🇬🇲","alt":"Flag: Gambia"},{"obj":"🇬🇳","alt":"Flag: Guinea"},{"obj":"🇬🇵","alt":"Flag: Guadeloupe"},{"obj":"🇬🇶","alt":"Flag: Equatorial Guinea"},{"obj":"🇬🇷","alt":"Flag: Greece"},{"obj":"🇬🇸","alt":"Flag: South Georgia & South Sandwich Islands"},{"obj":"🇬🇹","alt":"Flag: Guatemala"},{"obj":"🇬🇺","alt":"Flag: Guam"},{"obj":"🇬🇼","alt":"Flag: Guinea-Bissau"},{"obj":"🇬🇾","alt":"Flag: Guyana"},{"obj":"🇭🇰","alt":"Flag: Hong Kong SAR China"},{"obj":"🇭🇲","alt":"Flag: Heard & McDonald Islands"},{"obj":"🇭🇳","alt":"Flag: Honduras"},{"obj":"🇭🇷","alt":"Flag: Croatia"},{"obj":"🇭🇹","alt":"Flag: Haiti"},{"obj":"🇭🇺","alt":"Flag: Hungary"},{"obj":"🇮🇨","alt":"Flag: Canary Islands"},{"obj":"🇮🇩","alt":"Flag: Indonesia"},{"obj":"🇮🇪","alt":"Flag: Ireland"},{"obj":"🇮🇱","alt":"Flag: Israel"},{"obj":"🇮🇲","alt":"Flag: Isle of Man"},{"obj":"🇮🇳","alt":"Flag: India"},{"obj":"🇮🇴","alt":"Flag: British Indian Ocean Territory"},{"obj":"🇮🇶","alt":"Flag: Iraq"},{"obj":"🇮🇷","alt":"Flag: Iran"},{"obj":"🇮🇸","alt":"Flag: Iceland"},{"obj":"🇮🇹","alt":"Flag: Italy"},{"obj":"🇯🇪","alt":"Flag: Jersey"},{"obj":"🇯🇲","alt":"Flag: Jamaica"},{"obj":"🇯🇴","alt":"Flag: Jordan"},{"obj":"🇯🇵","alt":"Flag: Japan"},{"obj":"🇰🇪","alt":"Flag: Kenya"},{"obj":"🇰🇬","alt":"Flag: Kyrgyzstan"},{"obj":"🇰🇭","alt":"Flag: Cambodia"},{"obj":"🇰🇮","alt":"Flag: Kiribati"},{"obj":"🇰🇲","alt":"Flag: Comoros"},{"obj":"🇰🇳","alt":"Flag: St. Kitts & Nevis"},{"obj":"🇰🇵","alt":"Flag: North Korea"},{"obj":"🇰🇷","alt":"Flag: South Korea"},{"obj":"🇰🇼","alt":"Flag: Kuwait"},{"obj":"🇰🇾","alt":"Flag: Cayman Islands"},{"obj":"🇰🇿","alt":"Flag: Kazakhstan"},{"obj":"🇱🇦","alt":"Flag: Laos"},{"obj":"🇱🇧","alt":"Flag: Lebanon"},{"obj":"🇱🇨","alt":"Flag: St. Lucia"},{"obj":"🇱🇮","alt":"Flag: Liechtenstein"},{"obj":"🇱🇰","alt":"Flag: Sri Lanka"},{"obj":"🇱🇷","alt":"Flag: Liberia"},{"obj":"🇱🇸","alt":"Flag: Lesotho"},{"obj":"🇱🇹","alt":"Flag: Lithuania"},{"obj":"🇱🇺","alt":"Flag: Luxembourg"},{"obj":"🇱🇻","alt":"Flag: Latvia"},{"obj":"🇱🇾","alt":"Flag: Libya"},{"obj":"🇲🇦","alt":"Flag: Morocco"},{"obj":"🇲🇨","alt":"Flag: Monaco"},{"obj":"🇲🇩","alt":"Flag: Moldova"},{"obj":"🇲🇪","alt":"Flag: Montenegro"},{"obj":"🇲🇫","alt":"Flag: St. Martin"},{"obj":"🇲🇬","alt":"Flag: Madagascar"},{"obj":"🇲🇭","alt":"Flag: Marshall Islands"},{"obj":"🇲🇰","alt":"Flag: North Macedonia"},{"obj":"🇲🇱","alt":"Flag: Mali"},{"obj":"🇲🇲","alt":"Flag: Myanmar (Burma)"},{"obj":"🇲🇳","alt":"Flag: Mongolia"},{"obj":"🇲🇴","alt":"Flag: Macao Sar China"},{"obj":"🇲🇵","alt":"Flag: Northern Mariana Islands"},{"obj":"🇲🇶","alt":"Flag: Martinique"},{"obj":"🇲🇷","alt":"Flag: Mauritania"},{"obj":"🇲🇸","alt":"Flag: Montserrat"},{"obj":"🇲🇹","alt":"Flag: Malta"},{"obj":"🇲🇺","alt":"Flag: Mauritius"},{"obj":"🇲🇻","alt":"Flag: Maldives"},{"obj":"🇲🇼","alt":"Flag: Malawi"},{"obj":"🇲🇽","alt":"Flag: Mexico"},{"obj":"🇲🇾","alt":"Flag: Malaysia"},{"obj":"🇲🇿","alt":"Flag: Mozambique"},{"obj":"🇳🇦","alt":"Flag: Namibia"},{"obj":"🇳🇨","alt":"Flag: New Caledonia"},{"obj":"🇳🇪","alt":"Flag: Niger"},{"obj":"🇳🇫","alt":"Flag: Norfolk Island"},{"obj":"🇳🇬","alt":"Flag: Nigeria"},{"obj":"🇳🇮","alt":"Flag: Nicaragua"},{"obj":"🇳🇱","alt":"Flag: Netherlands"},{"obj":"🇳🇴","alt":"Flag: Norway"},{"obj":"🇳🇵","alt":"Flag: Nepal"},{"obj":"🇳🇷","alt":"Flag: Nauru"},{"obj":"🇳🇺","alt":"Flag: Niue"},{"obj":"🇳🇿","alt":"Flag: New Zealand"},{"obj":"🇴🇲","alt":"Flag: Oman"},{"obj":"🇵🇦","alt":"Flag: Panama"},{"obj":"🇵🇪","alt":"Flag: Peru"},{"obj":"🇵🇫","alt":"Flag: French Polynesia"},{"obj":"🇵🇬","alt":"Flag: Papua New Guinea"},{"obj":"🇵🇭","alt":"Flag: Philippines"},{"obj":"🇵🇰","alt":"Flag: Pakistan"},{"obj":"🇵🇱","alt":"Flag: Poland"},{"obj":"🇵🇲","alt":"Flag: St. Pierre & Miquelon"},{"obj":"🇵🇳","alt":"Flag: Pitcairn Islands"},{"obj":"🇵🇷","alt":"Flag: Puerto Rico"},{"obj":"🇵🇸","alt":"Flag: Palestinian Territories"},{"obj":"🇵🇹","alt":"Flag: Portugal"},{"obj":"🇵🇼","alt":"Flag: Palau"},{"obj":"🇵🇾","alt":"Flag: Paraguay"},{"obj":"🇶🇦","alt":"Flag: Qatar"},{"obj":"🇷🇪","alt":"Flag: Réunion"},{"obj":"🇷🇴","alt":"Flag: Romania"},{"obj":"🇷🇸","alt":"Flag: Serbia"},{"obj":"🇷🇺","alt":"Flag: Russia"},{"obj":"🇷🇼","alt":"Flag: Rwanda"},{"obj":"🇸🇦","alt":"Flag: Saudi Arabia"},{"obj":"🇸🇧","alt":"Flag: Solomon Islands"},{"obj":"🇸🇨","alt":"Flag: Seychelles"},{"obj":"🇸🇩","alt":"Flag: Sudan"},{"obj":"🇸🇪","alt":"Flag: Sweden"},{"obj":"🇸🇬","alt":"Flag: Singapore"},{"obj":"🇸🇭","alt":"Flag: St. Helena"},{"obj":"🇸🇮","alt":"Flag: Slovenia"},{"obj":"🇸🇯","alt":"Flag: Svalbard & Jan Mayen"},{"obj":"🇸🇰","alt":"Flag: Slovakia"},{"obj":"🇸🇱","alt":"Flag: Sierra Leone"},{"obj":"🇸🇲","alt":"Flag: San Marino"},{"obj":"🇸🇳","alt":"Flag: Senegal"},{"obj":"🇸🇴","alt":"Flag: Somalia"},{"obj":"🇸🇷","alt":"Flag: Suriname"},{"obj":"🇸🇸","alt":"Flag: South Sudan"},{"obj":"🇸🇹","alt":"Flag: São Tomé & Príncipe"},{"obj":"🇸🇻","alt":"Flag: El Salvador"},{"obj":"🇸🇽","alt":"Flag: Sint Maarten"},{"obj":"🇸🇾","alt":"Flag: Syria"},{"obj":"🇸🇿","alt":"Flag: Eswatini"},{"obj":"🇹🇦","alt":"Flag: Tristan Da Cunha"},{"obj":"🇹🇨","alt":"Flag: Turks & Caicos Islands"},{"obj":"🇹🇩","alt":"Flag: Chad"},{"obj":"🇹🇫","alt":"Flag: French Southern Territories"},{"obj":"🇹🇬","alt":"Flag: Togo"},{"obj":"🇹🇭","alt":"Flag: Thailand"},{"obj":"🇹🇯","alt":"Flag: Tajikistan"},{"obj":"🇹🇰","alt":"Flag: Tokelau"},{"obj":"🇹🇱","alt":"Flag: Timor-Leste"},{"obj":"🇹🇲","alt":"Flag: Turkmenistan"},{"obj":"🇹🇳","alt":"Flag: Tunisia"},{"obj":"🇹🇴","alt":"Flag: Tonga"},{"obj":"🇹🇷","alt":"Flag: Turkey"},{"obj":"🇹🇹","alt":"Flag: Trinidad & Tobago"},{"obj":"🇹🇻","alt":"Flag: Tuvalu"},{"obj":"🇹🇼","alt":"Flag: Taiwan"},{"obj":"🇹🇿","alt":"Flag: Tanzania"},{"obj":"🇺🇦","alt":"Flag: Ukraine"},{"obj":"🇺🇬","alt":"Flag: Uganda"},{"obj":"🇺🇲","alt":"Flag: U.S. Outlying Islands"},{"obj":"🇺🇳","alt":"Flag: United Nations"},{"obj":"🇺🇸","alt":"Flag: United States"},{"obj":"🇺🇾","alt":"Flag: Uruguay"},{"obj":"🇺🇿","alt":"Flag: Uzbekistan"},{"obj":"🇻🇦","alt":"Flag: Vatican City"},{"obj":"🇻🇨","alt":"Flag: St. Vincent & Grenadines"},{"obj":"🇻🇪","alt":"Flag: Venezuela"},{"obj":"🇻🇬","alt":"Flag: British Virgin Islands"},{"obj":"🇻🇮","alt":"Flag: U.S. Virgin Islands"},{"obj":"🇻🇳","alt":"Flag: Vietnam"},{"obj":"🇻🇺","alt":"Flag: Vanuatu"},{"obj":"🇼🇫","alt":"Flag: Wallis & Futuna"},{"obj":"🇼🇸","alt":"Flag: Samoa"},{"obj":"🇽🇰","alt":"Flag: Kosovo"},{"obj":"🇾🇪","alt":"Flag: Yemen"},{"obj":"🇾🇹","alt":"Flag: Mayotte"},{"obj":"🇿🇦","alt":"Flag: South Africa"},{"obj":"🇿🇲","alt":"Flag: Zambia"},{"obj":"🇿🇼","alt":"Flag: Zimbabwe"},{"obj":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","alt":"Flag: England"},{"obj":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","alt":"Flag: Scotland"},{"obj":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","alt":"Flag: Wales"},{"obj":"🏴󠁵󠁳󠁴󠁸󠁿","alt":"Flag for Texas (US-TX)"}]};



const UnicodeEmojiModule = {
    // Determine active theme to set button color
    color: (() => {
        if (localStorage.themeDark && localStorage.themeLight) {
            return "var(--engine-content-title)";
        }
        return "ghostwhite";
    })(),

  // CSS for emoji picker
    emojiCSS: `
#spotlight-emojis {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--main-bg);
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
    padding: 0 1rem;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    transition: height 0.2s linear, opacity 0.1s linear, padding 0.2s linear;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
body.spotlight-mode #spotlight-emojis {
    position: absolute;
    bottom: 0;
    left: 0.7%;
    right: 0.7%;
    width: auto;
    margin-bottom: calc(4rem + 8px);
    overflow-y: auto;
}
#spotlight-emojis.active {
    opacity: 1;
    height: 20rem;
    max-height: 20rem;
    padding: 1rem;
}
body.spotlight-mode #spotlight-emojis.active {
    height: 30vh;
}
#spotlight-emojis spotfilter {
    display: flex;
    gap: 1rem;
    flex-flow: row wrap;
    padding: 0 4px;
}
#spotlight-emojis spotfilter key {
    cursor: pointer;
    padding: 0.6rem 0.8rem 0.8rem 0.8rem;
    word-break: keep-all;
    color: #00838f;
    background: transparent;
    border-radius: 4px;
    border: 1px solid teal;
    transition: transform 0.1s linear;
}
#spotlight-emojis spotfilter key:active {
    transform: scale(0.9);
}
#spotlight-emojis spotfilter key.active {
    cursor: default;
    transform: scale(1) !important;
    background: teal;
    color: ghostwhite;
}
#spotlight-emojis spotfilter key:hover,
#spotlight-emojis spotfilter key:focus {
    background: teal;
    color: ghostwhite;
}
#spotlight-emojis spotfilter key span:last-of-type {
    margin-left: 0.25rem;
    margin-right: 3px;
}
@media screen and (max-width: 1274px) {
    #spotlight-emojis spotfilter key {
        padding: 0.4rem 0.6rem 0.6rem 0.6rem;
    }
    #spotlight-emojis spotfilter key span {
        font-size: 1.2rem;
    }
    #spotlight-emojis spotfilter key span:last-of-type {
        display: none;
    }
}
@media screen and (max-width: 509px) {
    #spotlight-emojis spotfilter key {
        padding: 0.3rem 0.5rem 0.5rem 0.5rem;
    }
}
@media screen and (max-width: 485px) {
    #spotlight-emojis spotfilter {
        gap: 0.75rem;
    }
    #spotlight-emojis spotfilter key {
        padding: 0.3rem 0.4rem 0.4rem 0.4rem;
    }
}
@media screen and (max-width: 435px) {
    #spotlight-emojis spotfilter {
        gap: 0.65rem;
    }
    #spotlight-emojis spotfilter key {
        padding: 0.2rem 0.3rem 0.3rem 0.3rem;
    }
}
@media screen and (max-width: 400px) {
    #spotlight-emojis spotfilter key span {
        font-size: 1rem;
    }
}
#spotlight-emojis spotmoji {
    display: flex;
    flex-flow: row wrap;
    gap: 0 0.75rem;
    font-size: 1.4rem;
    overflow-y: auto;
    overflow-x: hidden;
}
#spotlight-emojis spotmoji x.emoji {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.4rem;
    width: 2.4rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: transform 0.1s linear;
}
#spotlight-emojis spotmoji x.emoji:hover,
#spotlight-emojis spotmoji x.emoji:focus {
    transform: scale(1.4);
}
#spotlight-emojis spotmoji x.emoji:active {
    transform: scale(1.1);
}
#emoji-toggle-btn {
    cursor: pointer;
    color: ${(() => {
        if (localStorage.themeDark && localStorage.themeLight) {
            return "var(--engine-content-title)";
        }
        return "ghostwhite";
    })()};
}
#emoji-toggle-btn:hover {
    color: var(--link-color);
}
    `,

    // JavaScript for emoji functionality
    emojiJS: `
// Replace custom css to filter visible emojis
function emojistyle(key) {
    let style = "#spotlight-emojis spotmoji x.emoji:not(." + key + ") {display: none;}";
    return style;
}

// Show activity and emojis when a filter key is clicked
function filterKey(type, num) {
    let emojiCSS = document.getElementById("emoji-filter");

    document.querySelector("#spotlight-emojis spotfilter key.active").removeAttribute("class");
    document.querySelectorAll("#spotlight-emojis spotfilter key")[num].classList.add("active");

    emojiCSS.innerHTML = emojistyle(type);
    document.querySelector("#spotlight-emojis spotmoji").scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle emoji picker
function toggleEmojiPicker() {
    let picker = document.getElementById("spotlight-emojis");

    // Close spotlight smileys if open
    let spotlightSmileys = document.getElementById("spotlight-smileys");
    if (spotlightSmileys && spotlightSmileys.classList.contains("shiner")) {
        spotlightSmileys.classList.remove("shiner");
        setTimeout(function() {
            spotlightSmileys.classList.add("fader");
        }, 200);
    }

    // Close smilies-outline if open (for homepage)
    let sOutline = document.getElementById("smilies-outline");
    if (sOutline && sOutline.style.display !== "none") {
        $('#smilies-outline').slideToggle(200);
        setTimeout(function() {
            sOutline.classList.remove("smileys");
            sOutline.classList.remove("emojis");
        }, 200);
    }

    if (picker.classList.contains("active")) {
        picker.classList.remove("active");
    } else {
        picker.classList.add("active");
        document.querySelector("#spotlight-emojis spotmoji").scrollTo({ top: 0, behavior: 'smooth' });
    }
}
    `,

    // Style base for filtering emojis
    emojistyle(key) {
        let style = "#spotlight-emojis spotmoji x.emoji:not(." + key + ") {display: none;}";
        return style;
    },

    // Function for printing the Emojiboard
    print: '',

    echo(key) {
        this.print = this.print + key;
    },

    // Function for Pushing Filter Keys
    setKey(input, num, keyclass) {
        this.echo(`<key `);
        if (keyclass) {
            this.echo(`class="${keyclass}" `);
        }
        this.echo(`onclick="filterKey('${input.key}',${num})">`);
        this.echo(`<span>${input.mob}</span><span>${input.name}</span>`);
        this.echo(`</key>`);
    },

    // Function for Pushing Emojis
    setEmoji(input) {
        for (let x = 0; x < input.emojis.length; x++) {
            this.echo(`<x class="emoji ${input.key}" `);
            this.echo(`title="${input.emojis[x].alt}">`);
            this.echo(input.emojis[x].obj);
            this.echo(`</x>`);
        }
    },

    // Build emoji picker HTML
    buildEmojiHTML() {
        this.print = '';
        this.echo(`<spotfilter>`);
        this.setKey(smileys, 0, "active");
        this.setKey(nature, 1);
        this.setKey(food, 2);
        this.setKey(activity, 3);
        this.setKey(places, 4);
        this.setKey(objects, 5);
        this.setKey(symbols, 6);
        this.setKey(flags, 7);
        this.echo(`</spotfilter>`);
        this.echo(`<spotmoji>`);
        this.setEmoji(smileys);
        this.setEmoji(nature);
        this.setEmoji(food);
        this.setEmoji(activity);
        this.setEmoji(places);
        this.setEmoji(objects);
        this.setEmoji(symbols);
        this.setEmoji(flags);
        this.echo(`</spotmoji>`);
        return this.print;
    },

    // Function for adding styles
    addStyle(css, id) {
        let head = document.getElementsByTagName("head")[0];
        if (!head) {window.location.reload();}
        let style = document.createElement("style");
        if (id) {style.id = id;}
        style.setAttribute("type", "text/css");
        style.innerHTML = css;
        head.appendChild(style);
    },

    // Function for adding scripts
    addScript(js) {
        let body = document.getElementsByTagName("body")[0];
        if (!body) {window.location.reload();}
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = js;
        body.appendChild(script);
    },

    // Add emoji button to shoutbox
    addEmojiButton() {
        let ibbc = document.getElementById("shout-ibb-container");
        let befr = document.getElementById("shoutHistoryBtn");
        if (!ibbc || !befr) return;

        let face = document.createElement("span");
        face.id = "emoji-toggle-btn";
        face.classList.add("inline-submit-btn");
        face.title = "Unicode Emojis";
        face.setAttribute("onclick", "toggleEmojiPicker()");
        face.innerHTML = "<i class='material-icons'>face</i>";
        ibbc.insertBefore(face, befr);
    },

    // Add emoji picker container
    addEmojiPicker() {
        let container = document.getElementById("smilies-outline");
        if (!container) return;

        let div = document.createElement("div");
        div.id = "spotlight-emojis";
        div.innerHTML = this.buildEmojiHTML();
        container.parentNode.insertBefore(div, container.nextSibling);
    },

init() {
    if (!CONFIG.unicode_emoji_enabled) return;

    // Detect if in spotlight mode and add class to body
    if (location.href.includes("?spotlight")) {
        document.body.classList.add("spotlight-mode");
    }

    // Add CSS
    this.addStyle(this.emojiCSS);
    this.addStyle(this.emojistyle("smileys"), "emoji-filter");

    // Add JS
    this.addScript(this.emojiJS);

    // Add UI elements
    this.addEmojiButton();
    this.addEmojiPicker();

    // Fix the smilies-outline container for homepage
    if (location.href === location.origin + "/") {
        const smiliesOutline = document.getElementById('smilies-outline');
        if (smiliesOutline && !smiliesOutline.querySelector('#spotlight-smileys')) {
            const smileyDiv = document.createElement('div');
            smileyDiv.id = 'spotlight-smileys';
            smiliesOutline.insertBefore(smileyDiv, smiliesOutline.firstChild);
        }
    }

    // Add click handler for emojis
    document.addEventListener("click", function(event) {
        if (!event.target.tagName.match(/x/i)) return;
        if (!event.target.className.match(/emoji/i)) return;
        if (!event.target.parentNode.tagName.match(/spotmoji/i)) return;

        let shoutText = document.getElementById("shout_text");
        if (!shoutText) return;

        let thisEmoji = event.target.innerHTML;
        shoutText.value = shoutText.value + thisEmoji;
        shoutText.focus();
    });

    // Close picker when sending message
    let sendBtn = document.getElementById("sendShoutBtn");
    if (sendBtn) {
        sendBtn.addEventListener("click", function() {
            let picker = document.getElementById("spotlight-emojis");
            if (picker && picker.classList.contains("active")) {
                picker.classList.remove("active");
            }
        });
    }

    // Close picker on Enter key
    let shoutText = document.getElementById("shout_text");
    if (shoutText) {
        shoutText.addEventListener("keydown", function(e) {
            if (e.key !== "Enter") return;
            let picker = document.getElementById("spotlight-emojis");
            if (picker && picker.classList.contains("active")) {
                picker.classList.remove("active");
            }
        });
    }
},
    stop() {
        const btn = document.getElementById('emoji-toggle-btn');
        if (btn) btn.remove();

        const picker = document.getElementById('spotlight-emojis');
        if (picker) picker.remove();

        const filterStyle = document.getElementById('emoji-filter');
        if (filterStyle) filterStyle.remove();

        document.body.classList.remove("spotlight-mode");
    }
};



// ============================================================================
// MODULE 12: SPOTLIGHT MODE
// ============================================================================

const UIImprovementsModule = {
    // Determine active theme to set button color
    color: (() => {
        if (localStorage.themeDark && localStorage.themeLight) {
            return "var(--engine-content-title)";
        }
        return "ghostwhite";
    })(),

    // CSS for shoutbox
    shoutboxCSS: `
#shout-expander {
    display: none;
}
.shoutbox-container .content-title {
    position: relative;
}
.shoutbox-container span.toggle-indicator,
.shoutbox-container .content-title > div.right {
    position: absolute;
    right: 16px;
}
.shoutbox-container h6 {
    padding: 0.5rem 0 0.4rem 0;
    margin: 0;
    width: 100%;
}
#spotbtns {
    display: flex;
    position: absolute;
    right: 48px;
    gap: 12px;
    margin-top: 1.475px;
}
#spotlight, #greasylight, #forumlight {
    cursor: pointer;
    padding-top: 4px;
    color: ${(() => {
        if (localStorage.themeDark && localStorage.themeLight) {
            return "var(--engine-content-title)";
        }
        return "ghostwhite";
    })()};
    transition: transform 0.1s;
}
#spotlight:hover, #spotlight:focus,
#greasylight:hover, #greasylight:focus,
#forumlight:hover, #forumlight:focus {
    color: var(--link-color);
    transform: scale(1);
}
#spotlight:active,
#greasylight:active,
#forumlight:active {
    transform: scale(0.8);
}
#spotlight {
    order: 3;
}
#shout-ibb-container {
    display: flex;
    gap: 0 0.5rem;
}
#shouts-container {
    display: flex;
    flex-direction: column;
}
    `,

    // Spotlight mode CSS
    spotlightCSS: `
header, #kuddus-trigger-container, footer, .drag-target, #left-block, #middle-block .row.card-panel:not(.shoutbox-container), br, .shoutbox-container .toggle-indicator, #smilies-outline {
    display: none !important;
}
html, body, main, #parent-block, #middle-block, #middle-block div.shoutbox-container {
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 16px !important;
}
.shouts, .shouts i {
    font-size: 1rem !important;
}
@media screen and (max-width: 743px) {
    html, body {
        font-size: 15px !important;
    }
}
main {
    margin-top: 0;
    padding-top: 0 !important;
}
#middle-block {
    margin: 0;
    padding: 0.5rem;
}
#spotbtns {
    right: 1rem;
}
#greasylight {
    order: 4;
}
#forumlight {
    order: 5;
}
.shoutbox-container {
    margin: auto;
}
.shoutbox-container .content-title {
    padding: 0 1rem;
    height: 4.375rem;
    display: flex;
    align-items: center;
}
.shoutbox-container .toggle-indicator {
    cursor: pointer;
}
#shoutbox-outline {
    width: 100%;
    height: 100%;
    display: flex !important;
    flex-direction: column;
}
#shouts-container {
    min-height: 100px;
    height: calc(calc(100% - 8.375rem) - 15px);
    padding: 0 0.7%;
}
#shout-send-container {
    height: 4rem;
    padding: 0;
    position: relative;
}
#shout_text {
    height: 100%;
    padding-left: 1.5rem;
    padding-right: calc(140px + 2.5rem);
}
#shout-ibb-container {
    margin-right: 0;
    padding-right: 1.5rem;
    position: absolute;
    right: 0;
    bottom: 0;
}
#shout-ibb-container .inline-submit-btn i {
    line-height: calc(4rem - 2px);
}
#spotlight-smileys {
    display: flex;
    flex-flow: row wrap;
    gap: 1rem;
    position: absolute;
    bottom: 1%;
    padding: 1rem;
    margin-bottom: calc(4rem - 2px);
    background: var(--main-bg);
    width: 100%;
    height: 0;
    opacity: 0;
    transition: height 0.2s linear, opacity 0.1s linear;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: var(--border-color);
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: auto;
}
#spotlight-smileys.shiner {
    opacity: 1;
    height: 30vh;
}
#spotlight-smileys.fader {
    display: none;
}
#spotlight-smileys a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.4rem;
    width: 2.4rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: transform 0.1s linear;
}
#spotlight-smileys a:hover,
#spotlight-smileys a:focus {
    transform: scale(1.4);
}
#spotlight-smileys a:active {
    transform: scale(1.1);
}
    `,

    // Homepage CSS
    shouthomeCSS: `
.shoutbox-container > .content-title {
    padding: 2px;
}
.shoutbox-container h6 {
    padding-left: 14px;
    padding-right: 14px;
}
#spotlight-smileys, #spotlight-emojis {
    display: none;
}
#smilies-outline.smileys #spotlight-smileys {
    display: flex;
}
#smilies-outline.emojis #spotlight-emojis {
    display: flex;
}
#smilies-outline {
    padding: 0 !important;
    margin: 0 !important;
}
#smilies-outline.smileys {
    padding: 1rem !important;
}
#smilies-outline.emojis {
    padding: 1rem !important;
}
#smilies-outline.emojis #spotlight-smileys {
    display: none !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
}
#smilies-outline.smileys #spotlight-emojis {
    display: none !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
}
#spotlight-smileys:empty {
    display: none !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
}
#spotlight-smileys, #spotlight-emojis {
    flex-direction: column;
    gap: 1.5rem;
    background: var(--main-bg);
    width: 103%;
    height: 100%;
    max-height: 20rem;
    transition: height 0.2s linear, opacity 0.1s linear;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0;
    margin: 0;
}
#smilies-outline.emojis {
    padding: 1rem;
}
#smilies-outline.emojis #spotlight-smileys {
    display: none !important;
}
#smilies-outline.smileys #spotlight-emojis {
    display: none !important;
}
#smilies-outline {
    max-width: 98%;
    margin: 0 auto;
}
#spotlight-smileys {
    flex-flow: row wrap;
    gap: 1rem 0.75rem;
    overflow-y: auto;
}
#spotlight-smileys a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.4rem;
    width: 2.4rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: transform 0.1s linear;
}
#spotlight-smileys a:hover,
#spotlight-smileys a:focus {
    transform: scale(1.4);
}
#spotlight-smileys a:active {
    transform: scale(1.1);
}
#shout-send-container {
    padding: 0;
    position: relative;
}
#shout_text {
    padding-left: 0.5rem;
    padding-right: 140px;
}
#shout-ibb-container {
    margin-right: 0;
    padding-right: 0.5rem;
    position: absolute;
    right: 0;
}
    `,
    // Spotlight mode JS for emojis
    spotlightJS_emojis: `
// Toggle Smileys
function toggleSmilemoji(id, alt) {
    let emojibox = document.getElementById(id);

    // Close unicode emoji picker if open
    let unicodePicker = document.getElementById("spotlight-emojis");
    if (unicodePicker && unicodePicker.classList.contains("active")) {
        unicodePicker.classList.remove("active");
    }

    if (emojibox.className.match(/shiner/i)) {
        emojibox.classList.remove("shiner");
        setTimeout(function() {
            emojibox.classList.add("fader");
        }, 200);
    } else {
        emojibox.classList.remove("fader");
        setTimeout(function() {
            emojibox.classList.add("shiner");
        }, 100);
    }
}
// Toggle button for smileys
function toggleSmileys() {
    toggleSmilemoji("spotlight-smileys");
}
// Load the smileys ahead of time in new container
(function() {
    if (!smiliesLoaded) {
        $.post(
            siteUrl + "ajscripts.php", {
                task: 'getSmilies'
            },
            function(data) {
                $('#spotlight-smileys').html(data);
                smiliesLoaded = true;
            }
        );
    }
})();
    `,

// Homepage JS for emojis
homepageJS_emojis: `
// Quick Toggle for Smileys
function toggleQuickES(main, sub) {
    let sOutline = document.getElementById("smilies-outline");

    sOutline.classList.add(main);
    sOutline.classList.remove(sub);

    // If outline is hidden, show it
    if (sOutline.style.display === "none" || !sOutline.style.display) {
        $('#smilies-outline').slideDown(150);
    } else {
        // If outline is visible, hide it with easeOutQuad for smoother closing
        $('#smilies-outline').slideUp(150, 'linear', function() {
            sOutline.classList.remove(main);
            sOutline.classList.remove(sub);
        });
    }
}

// Handle Opposite Clicks on Smileys
function toggleSmilemoji(one, alt) {
    let sOutline = document.getElementById("smilies-outline"),
        oneRE = new RegExp(one, "i"),
        altRE = new RegExp(alt, "i");

    // Close unicode emoji picker if open
    let unicodePicker = document.getElementById("spotlight-emojis");
    if (unicodePicker && unicodePicker.classList.contains("active")) {
        unicodePicker.classList.remove("active");
        // Force open the smiley outline after closing unicode picker
        setTimeout(function() {
            sOutline.classList.add(one);
            sOutline.classList.remove(alt);
            if (sOutline.style.display === "none" || !sOutline.style.display) {
                $('#smilies-outline').slideDown(150);
            }
        }, 150);
        return;
    }

    // Normal toggle logic when unicode picker is not open
    if (altRE.test(sOutline.className)) {
        // If switching from emoji to smiley or vice versa, close then open
        $('#smilies-outline').slideUp(150, 'linear', function() {
            sOutline.classList.remove(alt);
            sOutline.classList.add(one);
            $('#smilies-outline').slideDown(150);
        });
    } else {
        toggleQuickES(one, alt);
    }
}

// Make room for Smileys in the same container
(function() {
    let sOutline = document.getElementById("smilies-outline");
    sOutline.innerHTML = "<div id='spotlight-smileys'></div>";
})();

// Load the smileys ahead of time in new container
(function() {
    if (!smiliesLoaded) {
        $.post(
            siteUrl + "ajscripts.php", {
                task: 'getSmilies'
            },
            function(data) {
                $('#spotlight-smileys').html(data);
                smiliesLoaded = true;
            }
        );
    }
})();
`,
    addStyle(css, id) {
        let head = document.getElementsByTagName("head")[0];
        if (!head) {window.location.reload();}
        let style = document.createElement("style");
        if (id) {style.id = id;}
        style.setAttribute("type", "text/css");
        style.innerHTML = css;
        head.appendChild(style);
    },

    addScript(js) {
        let body = document.getElementsByTagName("body")[0];
        if (!body) {window.location.reload();}
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = js;
        body.appendChild(script);
    },

    spotlightJS(key, link, icon) {
        let spotHead = document.querySelector(".shoutbox-container .content-title.toggle");
        if (!spotHead) return;

        spotHead.removeAttribute("onclick");

        if (key.match(/enter/i)) {
            spotHead.children[0].setAttribute("onclick","toggleShoutbox()");
            spotHead.children[1].setAttribute("onclick","toggleShoutbox()");
        } else {
            if (spotHead.children[1]) spotHead.children[1].remove();
            spotHead.classList.remove("toggle");
        }

        let newCon = document.createElement("div");
        newCon.id = "spotbtns";
        spotHead.appendChild(newCon);

        newCon = document.getElementById("spotbtns");

        let anchor = document.createElement("a");
        anchor.id = "spotlight";
        anchor.title = key + " Spotlight";
        anchor.href = link;
        anchor.innerHTML = `<i class="material-icons">${icon}</i>`;
        newCon.appendChild(anchor);

    },

    whiteNull() {
        const shoutsContainer = document.getElementById("shouts-container");
        if (shoutsContainer) {
            shoutsContainer.innerHTML = shoutsContainer.innerHTML.replace(/>\s+</g,'><');
        }
    },

    smileyJS() {
        let container = document.getElementById("shout-send-container");
        let bottom = document.getElementById("shout_text");
        let toggle = document.querySelector("#shout-ibb-container span[onclick*='toggleSmilies']");

        if (!container || !bottom) return;

        let div = document.createElement("div");
        div.id = "spotlight-smileys";
        div.classList.add("fader");
        container.insertBefore(div, bottom);

        if (toggle) {
            toggle.setAttribute("onclick","toggleSmileys()");
        }
    },

    initSpotlightMode() {
        // Update material icons
        try {
            const iconLink = document.querySelector("link[href*='material-icons.css']");
            if (iconLink) {
                iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
            }
        } catch(e) {}

        // Set new document title
        document.title = "Shoutbox - TorrentBD";

        // Set cookie for expanded Shoutbox
        document.cookie = "hideShoutbox=0";

        // Push the styles in head
        this.addStyle(this.shoutboxCSS + this.spotlightCSS, "spotlight");

        // Change stuff when page loads
        const initSpotlight = () => {
            this.addScript(this.spotlightJS_emojis);
            this.spotlightJS("Exit", location.origin, "fullscreen_exit");
            this.whiteNull();
            this.smileyJS();

            // Auto-close smileys after picking one
            document.addEventListener("click", function(event) {
                if (!event.target.closest("#spotlight-smileys a")) {return;}

                let emojibox = document.getElementById("spotlight-smileys");
                if (emojibox && emojibox.className.match(/shiner/i)) {
                    emojibox.classList.remove("shiner");
                    setTimeout(function() {
                        emojibox.classList.add("fader");
                    }, 200);
                }
            });

            // Add ESC key handler to exit spotlight mode
            document.addEventListener("keydown", function(event) {
                if (event.key === "Escape") {
                    window.location.href = location.origin;
                }
            });

            // Observe shoutbox
            let observer = new MutationObserver(function() {
                const shoutsContainer = document.getElementById("shouts-container");
                if (!shoutsContainer || !shoutsContainer.children[0]) {return;}

                let shoutID = parseInt(shoutsContainer.children[0].id.replace(/.*-/,''));

                if (!window.lastShoutID) {
                    window.lastShoutID = shoutID;
                    return;
                }

                if (window.lastShoutID >= shoutID) {return;}

                window.lastShoutID = shoutID;
            });

            const shoutsContainer = document.getElementById("shouts-container");
            if (shoutsContainer) {
                observer.observe(shoutsContainer, {childList: true});
            }
        };

        if (document.readyState === 'loading') {
            window.addEventListener('load', initSpotlight);
        } else {
            initSpotlight();
        }
    },

    initHomepage() {
        // Update material icons
        try {
            const iconLink = document.querySelector("link[href*='material-icons.css']");
            if (iconLink) {
                iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
            }
        } catch(e) {}

        // Push the styles in head
        this.addStyle(this.shoutboxCSS + this.shouthomeCSS, "shouthome");


        // Change stuff when page loads
        const initHome = () => {
            this.addScript(this.homepageJS_emojis);
            this.spotlightJS("Enter", "?spotlight", "fullscreen");
            this.whiteNull();

            // Change button to use new toggle function
            let emojiOrigin = document.querySelector("#shout-ibb-container span[onclick='toggleSmilies()']");
            if (emojiOrigin) {
                emojiOrigin.setAttribute("onclick","toggleSmilemoji('smileys','emojis')");
            }
        };

        if (document.readyState === 'loading') {
            window.addEventListener('load', initHome);
        } else {
            initHome();
        }
    },

    init() {
        // Check if spotlight URL matches
        if (location.href === location.origin + "/?spotlight") {
            this.initSpotlightMode();
        }
        // Check if user is on the homepage
        else if (location.href === location.origin + "/") {
            this.initHomepage();
        }
    }
};



// ============================================================================
// MODULE 13: MEME CREATOR
// ============================================================================

const MemeCreatorModule = {
    IMGFLIP_CONFIG: {
        username: 'puls3',
        password: 'cornhub69',
        apiUrl: 'https://api.imgflip.com'
    },

    modal: null,
    templatesArea: null,
    editorArea: null,
    memeButton: null,
    allTemplates: [],
    currentTemplate: null,
    activeInput: null,
    isDragging: false,
    hasMoved: false,

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    addStyles() {
        const css = `
            #meme-tool-modal {
                position: fixed;
                width: 520px;
                max-width: 90vw;
                max-height: 90vh;
                background: #2f3136;
                border: 1px solid #444;
                border-radius: 8px;
                z-index: 2147483647;
                display: none;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                overflow: hidden;
                flex-direction: column;
                top: auto;
            }
            #meme-tool-header {
                height: 24px;
                background: #202225;
                cursor: grab;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 8px;
                border-bottom: 1px solid #36393f;
                flex-shrink: 0;
            }
            #meme-tool-header:active { cursor: grabbing; background: #18191c; }
            #meme-tool-title { font-size: 11px; color: #aaa; font-weight: bold; user-select: none; text-transform: uppercase; letter-spacing: 0.5px; }
            #meme-tool-content { padding: 10px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1; }
            #meme-tool-templates {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px,1fr));
                gap: 8px;
                max-height: 400px;
                min-height: 200px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #202225 #2f3136;
            }
            #meme-tool-templates::-webkit-scrollbar { width: 8px; }
            #meme-tool-templates::-webkit-scrollbar-track { background: #2f3136; }
            #meme-tool-templates::-webkit-scrollbar-thumb { background-color: #202225; border-radius: 4px; }
            .meme-template {
                cursor: pointer;
                border: 2px solid transparent;
                border-radius: 6px;
                overflow: hidden;
                transition: all 0.15s;
                position: relative;
                background: #202225;
            }
            .meme-template:hover { border-color: #00bfff; transform: scale(1.03); }
            .meme-template.selected { border-color: #00ff00; box-shadow: 0 0 0 2px #00ff00; }
            .meme-template img { width: 100%; height: 100px; object-fit: contain; display: block; background: #18191c; }
            .meme-template-name {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 4px 3px;
                font-size: 10px;
                text-align: center;
                line-height: 1.1;
            }
            #meme-tool-editor { display: none; }
            #meme-tool-editor.active { display: flex; flex-direction: column; overflow-y: auto; flex: 1; }
            .meme-preview {
                text-align: center;
                margin-bottom: 10px;
                background: #202225;
                padding: 12px;
                border-radius: 6px;
                flex-shrink: 0;
            }
            .meme-preview img {
                max-width: 100%;
                max-height: 200px;
                border-radius: 6px;
                object-fit: contain;
            }
            .meme-template-info {
                text-align: center;
                color: #aaa;
                font-size: 11px;
                margin-top: 6px;
            }
            .meme-input {
                margin-bottom: 8px;
            }
            .meme-input label {
                display: block;
                margin-bottom: 3px;
                font-weight: 600;
                color: #ccc;
                font-size: 12px;
            }
            .meme-input input {
                width: 100%;
                padding: 8px;
                background: #40444b;
                border: 1px solid #555;
                border-radius: 4px;
                font-size: 13px;
                box-sizing: border-box;
                color: #fff;
            }
            .meme-input input:focus {
                outline: none;
                border-color: #00bfff;
            }
            #meme-generation-controls {
                flex-shrink: 0;
            }
            .meme-btn {
                width: 100%;
                padding: 10px;
                background: #5865f2;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.15s;
                margin-bottom: 6px;
            }
            .meme-btn:hover { background: #4752c4; }
            .meme-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .meme-btn-secondary {
                background: #4f545c;
            }
            .meme-btn-secondary:hover {
                background: #686d73;
            }
            .meme-status {
                text-align: center;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 12px;
                display: none;
            }
            .meme-status.info {
                background: #2c3e50;
                color: #3498db;
            }
            .meme-status.success {
                background: #1e4620;
                color: #4caf50;
            }
            .meme-status.error {
                background: #4a1c1c;
                color: #f44336;
            }
            .meme-result {
                margin-top: 10px;
                text-align: center;
                flex-shrink: 0;
            }
            .meme-result img {
                max-width: 100%;
                max-height: 50vh;
                border-radius: 6px;
                margin-bottom: 8px;
                object-fit: contain;
            }
            .meme-loading {
                text-align: center;
                padding: 15px;
                color: #aaa;
                font-size: 12px;
            }
            #meme-tool-close { background:none; border:none; color:#aaa; font-size: 18px; cursor:pointer; line-height: 1; padding: 0; }
            #meme-tool-close:hover { color:#fff; }
        `;
        GM_addStyle(css);
    },

    createModal() {
        const html = `
            <div id="meme-tool-modal" role="dialog">
                <div id="meme-tool-header">
                    <span id="meme-tool-title">Meme Generator</span>
                    <button id="meme-tool-close" aria-label="Close">&times;</button>
                </div>
                <div id="meme-tool-content">
                    <div id="meme-tool-templates"></div>
                    <div id="meme-tool-editor">
                        <div class="meme-preview" id="meme-preview"></div>
                        <div id="meme-inputs-container"></div>
                        <div class="meme-status info" id="meme-status"></div>
                        <div id="meme-generation-controls">
                            <button class="meme-btn" id="meme-generate">Create Meme</button>
                            <button class="meme-btn meme-btn-secondary" id="meme-back">← Back to Templates</button>
                        </div>
                        <div class="meme-result" id="meme-result"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        this.modal = document.getElementById('meme-tool-modal');
        const headerBar = document.getElementById('meme-tool-header');
        this.templatesArea = document.getElementById('meme-tool-templates');
        this.editorArea = document.getElementById('meme-tool-editor');

        document.getElementById('meme-tool-close').addEventListener('click', () => this.closeModal());
        document.getElementById('meme-back').addEventListener('click', () => {
            this.editorArea.classList.remove('active');
            this.templatesArea.style.display = 'grid';
            document.getElementById('meme-preview').style.display = 'block';
            document.getElementById('meme-inputs-container').style.display = 'block';
            document.getElementById('meme-generation-controls').style.display = 'block';
            document.getElementById('meme-status').style.display = 'none';
            document.getElementById('meme-result').innerHTML = '';
        });

        this.setupDraggable(headerBar);
    },

    setupDraggable(handle) {
        let startX, startY, startLeft, startBottom;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.id === 'meme-tool-close') return;
            e.preventDefault();
            this.isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = this.modal.getBoundingClientRect();
            startLeft = rect.left;

            const computedStyle = window.getComputedStyle(this.modal);
            const cssBottom = parseInt(computedStyle.bottom);
            if (isNaN(cssBottom)) {
                startBottom = window.innerHeight - rect.bottom;
            } else {
                startBottom = cssBottom;
            }

            const onMouseMove = (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.modal.style.left = `${startLeft + dx}px`;
                this.modal.style.bottom = `${startBottom - dy}px`;
                this.modal.style.top = 'auto';
            };

            const onMouseUp = () => {
                this.isDragging = false;
                this.hasMoved = true;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.constrainToViewport();
                this.savePosition();
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    },

    savePosition() {
        if (!this.modal) return;
        const rect = this.modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const pos = {
            rightDist: viewportWidth - rect.right,
            bottomDist: viewportHeight - rect.bottom,
            width: viewportWidth,
            height: viewportHeight
        };
        localStorage.setItem('tbd_meme_pos_v1', JSON.stringify(pos));
    },

    constrainToViewport() {
        if (!this.modal || this.modal.style.display !== 'flex') return;

        const rect = this.modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 10;

        let left = parseInt(this.modal.style.left) || rect.left;
        let bottom = parseInt(this.modal.style.bottom);

        if (isNaN(bottom)) {
            bottom = viewportHeight - rect.bottom;
        }

        const modalHeight = rect.height;
        const top = viewportHeight - bottom - modalHeight;

        const maxLeft = viewportWidth - rect.width - margin;
        if (left < margin) left = margin;
        if (left > maxLeft) left = maxLeft;

        if (top < margin) {
            bottom = viewportHeight - modalHeight - margin;
        }
        if (bottom < margin) {
            bottom = margin;
        }

        this.modal.style.left = `${left}px`;
        this.modal.style.bottom = `${bottom}px`;
        this.modal.style.top = 'auto';
    },

    restorePosition(anchor) {
        const saved = localStorage.getItem('tbd_meme_pos_v1');
        if (saved) {
            try {
                const pos = JSON.parse(saved);
                if (pos.rightDist !== undefined && pos.bottomDist !== undefined) {
                    const viewportWidth = window.innerWidth;
                    const rect = this.modal.getBoundingClientRect();

                    const left = viewportWidth - pos.rightDist - rect.width;
                    const bottom = pos.bottomDist;

                    this.modal.style.left = `${left}px`;
                    this.modal.style.bottom = `${bottom}px`;
                    this.modal.style.top = 'auto';
                    this.hasMoved = true;
                    setTimeout(() => this.constrainToViewport(), 0);
                    return;
                }
            } catch(e) { console.error('Invalid saved pos'); }
        }

        if (anchor && !this.hasMoved) {
            const rect = anchor.getBoundingClientRect();
            let left = rect.right - 520;
            if (left < 10) left = 10;
            const bottom = window.innerHeight - rect.top + 10;
            this.modal.style.left = `${left}px`;
            this.modal.style.bottom = `${bottom}px`;
            this.modal.style.top = 'auto';
            setTimeout(() => this.constrainToViewport(), 0);
        }
    },

    addMemeButton() {
        const tray = document.querySelector('#shout-ibb-container');
        if (!tray || document.getElementById('meme-tool-btn')) return;

        this.memeButton = document.createElement('span');
        this.memeButton.id = 'meme-tool-btn';
        this.memeButton.className = 'inline-submit-btn';
        this.memeButton.title = 'Create Meme';
        this.memeButton.innerHTML = '<i class="material-icons">theater_comedy</i>';

        const isSpotlight = document.body.classList.contains('spotlight-mode') ||
                window.location.search.includes('spotlight');
        const topValue = isSpotlight ? '17px' : '6px';
        this.memeButton.style.cssText = `display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#ccc;position:relative;top:${topValue};height:24px;width:28px;margin-left:4px;margin-right:2px;`;

        this.memeButton.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const input = document.querySelector('#shout_text');
            if (input) {
                if(this.modal.style.display === 'flex') this.closeModal();
                else this.openModal(input, this.memeButton);
            }
        });

        const targetBtn = tray.querySelector('#tbd-uploader-button')
                       || tray.querySelector('#imgbd-uploader-btn')
                       || tray.querySelector('#urlBtn')
                       || tray.querySelector('#tbdm-image-upload-btn')
                       || tray.querySelector('#tbdm-gif-tool-btn');

        if (targetBtn) {
            tray.insertBefore(this.memeButton, targetBtn);
        } else {
            tray.appendChild(this.memeButton);
        }
    },

    loadTemplates() {
        const CUSTOM_TEMPLATES_URL = 'https://imgflip.mushi53566.workers.dev/';

        // Fetch Imgflip templates
        GM_xmlhttpRequest({
            method: 'GET',
            url: this.IMGFLIP_CONFIG.apiUrl + '/get_memes',
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.success) {
                        const apiTemplates = data.data.memes;

                        // Fetch custom templates
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: CUSTOM_TEMPLATES_URL,
                            onload: (customRes) => {
                                try {
                                    const customData = JSON.parse(customRes.responseText);
                                    if (customData.success) {
                                        const customTemplates = customData.data.memes;
                                        const merged = [];
                                        const interval = Math.floor(apiTemplates.length / customTemplates.length);

                                        let customIndex = 0;
                                        for (let i = 0; i < apiTemplates.length; i++) {
                                            merged.push(apiTemplates[i]);
                                            if ((i + 1) % interval === 0 && customIndex < customTemplates.length) {
                                                merged.push(customTemplates[customIndex]);
                                                customIndex++;
                                            }
                                        }

                                        while (customIndex < customTemplates.length) {
                                            merged.push(customTemplates[customIndex]);
                                            customIndex++;
                                        }

                                        this.allTemplates = merged;
                                        this.renderTemplates();
                                    }
                                } catch (e) {
                                    // If custom templates fail, just use API templates
                                    this.allTemplates = apiTemplates;
                                    this.renderTemplates();
                                }
                            },
                            onerror: () => {
                                // Fallback to API templates only
                                this.allTemplates = apiTemplates;
                                this.renderTemplates();
                            }
                        });
                    }
                } catch (e) {
                    console.error('Error loading templates');
                }
            },
            onerror: () => console.error('Network error')
        });
    },

    renderTemplates() {
        this.templatesArea.innerHTML = this.allTemplates.map(t => `
            <div class="meme-template" data-id="${t.id}" data-url="${t.url}" data-boxes="${t.box_count}" data-name="${t.name}">
                <img src="${t.url}" alt="${t.name}" loading="lazy">
                <div class="meme-template-name">${t.name}</div>
            </div>
        `).join('');

        this.templatesArea.querySelectorAll('.meme-template').forEach(el => {
            el.onclick = () => this.selectTemplate(el);
        });
    },

    selectTemplate(el) {
        document.querySelectorAll('.meme-template').forEach(t => t.classList.remove('selected'));
        el.classList.add('selected');

        const id = el.dataset.id;
        const url = el.dataset.url;
        const boxes = parseInt(el.dataset.boxes) || 2;
        const name = el.dataset.name;

        this.currentTemplate = { id, url, boxes, name };

        document.getElementById('meme-preview').innerHTML = `
            <img src="${url}">
            <div class="meme-template-info">
                ${name} - ${boxes} text ${boxes === 1 ? 'box' : 'boxes'}
            </div>
        `;

        this.createTextInputs(boxes);

        this.templatesArea.style.display = 'none';
        this.editorArea.classList.add('active');
        document.getElementById('meme-result').innerHTML = '';

        document.getElementById('meme-generate').onclick = () => this.generateMeme();
    },

    createTextInputs(count) {
        const container = document.getElementById('meme-inputs-container');
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            container.innerHTML += `
                <div class="meme-input">
                    <label>Text Box ${i + 1}</label>
                    <input type="text" id="meme-text${i}" placeholder="Enter text for box ${i + 1}">
                </div>
            `;
        }
    },

    generateMeme() {
        if (!this.currentTemplate) return;

        const boxes = [];
        for (let i = 0; i < this.currentTemplate.boxes; i++) {
            const text = document.getElementById(`meme-text${i}`)?.value || '';
            boxes.push({ text });
        }

        const hasText = boxes.some(box => box.text.trim() !== '');
        if (!hasText) {
            this.showStatus('Enter at least one text', 'error');
            return;
        }

        const btn = document.getElementById('meme-generate');
        btn.disabled = true;
        btn.textContent = 'Generating...';
        this.showStatus('Creating meme...', 'info');

        let formData = `template_id=${this.currentTemplate.id}&username=${this.IMGFLIP_CONFIG.username}&password=${this.IMGFLIP_CONFIG.password}`;

        boxes.forEach((box, index) => {
            formData += `&boxes[${index}][text]=${encodeURIComponent(box.text)}`;
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: this.IMGFLIP_CONFIG.apiUrl + '/caption_image',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: formData,
            onload: (res) => {
                btn.disabled = false;
                btn.textContent = 'Create Meme';
                try {
                    const result = JSON.parse(res.responseText);
                    if (result.success) {
                        this.showStatus('Meme created! Click to insert.', 'success');
                        const memeUrl = result.data.url;

                        document.getElementById('meme-preview').style.display = 'none';
                        document.getElementById('meme-inputs-container').style.display = 'none';
                        document.getElementById('meme-generation-controls').style.display = 'none';
                        document.getElementById('meme-status').style.display = 'none';

                        document.getElementById('meme-result').innerHTML = `
                            <img src="${memeUrl}">
                            <button class="meme-btn" id="meme-insert-action">Insert Meme</button>
                        `;
                        document.getElementById('meme-insert-action').onclick = () => {
                            this.insertMeme(memeUrl);
                        };
                    } else {
                        this.showStatus('Error: ' + result.error_message, 'error');
                    }
                } catch (e) {
                    this.showStatus('Failed to create meme', 'error');
                }
            },
            onerror: () => {
                btn.disabled = false;
                btn.textContent = 'Create Meme';
                this.showStatus('Network error', 'error');
            }
        });
    },

    insertMeme(url) {
        if (!this.activeInput) return;

        const cur = this.activeInput.value;
        const cursorPos = this.activeInput.selectionStart || cur.length;
        const before = cur.substring(0, cursorPos);
        const after = cur.substring(cursorPos);
        const toInsert = url + ' ';

        this.activeInput.value = before + toInsert + after;
        const newCursorPos = before.length + toInsert.length;

        this.closeModal();
        setTimeout(() => {
            this.activeInput.focus();
            this.activeInput.setSelectionRange(newCursorPos, newCursorPos);
        }, 50);
    },

    showStatus(msg, type) {
        const status = document.getElementById('meme-status');
        if (status) {
            status.textContent = msg;
            status.className = 'meme-status ' + type;
            status.style.display = 'block';
        }
    },

    openModal(inputEl, anchorEl) {
        this.activeInput = inputEl;
        this.restorePosition(anchorEl);
        this.modal.style.display = 'flex';

        if (this.allTemplates.length === 0) {
            this.loadTemplates();
        }
    },

    closeModal() {
        this.modal.style.display = 'none';
        this.editorArea.classList.remove('active');
        this.templatesArea.style.display = 'grid';

        document.getElementById('meme-preview').style.display = 'block';
        document.getElementById('meme-inputs-container').style.display = 'block';
        document.getElementById('meme-generation-controls').style.display = 'block';
        document.getElementById('meme-status').style.display = 'none';
        document.getElementById('meme-result').innerHTML = '';
    },

    init() {
        if (!CONFIG.meme_creator_enabled) return;
        this.addStyles();
        this.createModal();
        this.addMemeButton();

        const resizeHandler = this.debounce(() => {
            if (this.modal && this.modal.style.display === 'flex') {
                this.constrainToViewport();
                this.savePosition();
            }
        }, 150);
        window.addEventListener('resize', resizeHandler);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                e.preventDefault();
                this.closeModal();
                if (this.activeInput) this.activeInput.focus();
            }
        });
    },

    stop() {
        const btn = document.getElementById('meme-tool-btn');
        if (btn) btn.remove();
        if (this.modal) this.closeModal();
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
                                        <div class="tbdm-feature-title">Shoutbox Input Lock</div>
                                        <div class="tbdm-feature-desc">Put mouse anywhere on the shoutbox</div>
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
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">🎬</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">GIF Picker</div>
                                        <div class="tbdm-feature-desc">Search and insert GIFs (Tenor/Giphy)</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch">
                                    <input type="checkbox" id="tbdm-gif-picker">
                                    <span class="tbdm-slider"></span>
                                </label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">🖼️</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Image Viewer</div>
                                        <div class="tbdm-feature-desc">Display image links as thumbnails</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch">
                                    <input type="checkbox" id="tbdm-image-viewer">
                                    <span class="tbdm-slider"></span>
                                </label>
                           </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">😊</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Unicode Emoji</div>
                                        <div class="tbdm-feature-desc">Pick and insert unicode emojis</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch">
                                    <input type="checkbox" id="tbdm-unicode-emoji">
                                    <span class="tbdm-slider"></span>
                                </label>
                            </div>
                            <div class="tbdm-feature-card">
                                <div class="tbdm-feature-header">
                                    <div class="tbdm-feature-icon">🎭</div>
                                    <div class="tbdm-feature-info">
                                        <div class="tbdm-feature-title">Meme Creator</div>
                                        <div class="tbdm-feature-desc">Create and insert memes</div>
                                    </div>
                                </div>
                                <label class="tbdm-switch">
                                    <input type="checkbox" id="tbdm-meme-creator">
                                    <span class="tbdm-slider"></span>
                                </label>
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
        const gifPicker = document.getElementById('tbdm-gif-picker');
        const imageViewer = document.getElementById('tbdm-image-viewer');
        const unicodeEmoji = document.getElementById('tbdm-unicode-emoji');

        // Load settings
        unicodeEmoji.checked = CONFIG.unicode_emoji_enabled;

        // Event listener
        unicodeEmoji.addEventListener('change', (e) => {
            saveConfig('unicode_emoji_enabled', e.target.checked);
            if (e.target.checked) {
                UnicodeEmojiModule.init();
            } else {
                UnicodeEmojiModule.stop();
            }
        });

        //
        const memeCreator = document.getElementById('tbdm-meme-creator');

        // Load settings
        memeCreator.checked = CONFIG.meme_creator_enabled;

        // Event listener
        memeCreator.addEventListener('change', (e) => {
            saveConfig('meme_creator_enabled', e.target.checked);
            if (e.target.checked) {
                MemeCreatorModule.init();
            } else {
                MemeCreatorModule.stop();
            }
        });

        // Load settings
        gifPicker.checked = CONFIG.gif_picker_enabled;
        imageViewer.checked = CONFIG.image_viewer_enabled;

        // Event listeners
        gifPicker.addEventListener('change', (e) => {
            saveConfig('gif_picker_enabled', e.target.checked);
            if (e.target.checked) {
                GifPickerModule.init();
            } else {
                GifPickerModule.stop();
            }
        });

        imageViewer.addEventListener('change', (e) => {
            saveConfig('image_viewer_enabled', e.target.checked);
            if (e.target.checked) {
                ImageViewerModule.init();
            } else {
                ImageViewerModule.stop();
            }
        });

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

        /* GIF Tool Modal Styles */
        #gif-tool-modal {
            position: fixed;
            width: 440px;
            max-width: 90vw;
            background: #2f3136;
            border: 1px solid #444;
            border-radius: 8px;
            z-index: 2147483647;
            display: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            overflow: hidden;
            flex-direction: column;
            top: auto;
        }
        #gif-tool-header {
            height: 24px;
            background: #202225;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;
            border-bottom: 1px solid #36393f;
            flex-shrink: 0;
        }
        #gif-tool-header:active { cursor: grabbing; background: #18191c; }
        #gif-tool-title {
            font-size: 11px;
            color: #aaa;
            font-weight: bold;
            user-select: none;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #gif-tool-content {
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #gif-tool-results {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px,1fr));
            gap: 6px;
            max-height: 320px;
            min-height: 100px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #202225 #2f3136;
        }
        #gif-tool-results::-webkit-scrollbar { width: 8px; }
        #gif-tool-results::-webkit-scrollbar-track { background: #2f3136; }
        #gif-tool-results::-webkit-scrollbar-thumb { background-color: #202225; border-radius: 4px; }
        #gif-tool-results img {
            width:100%;
            height:80px;
            object-fit:cover;
            cursor:pointer;
            border-radius:4px;
            transition:all .12s;
            border:2px solid transparent;
            background: #202225;
        }
        #gif-tool-results img:hover {
            transform:scale(1.04);
            border-color:#00bfff;
            z-index: 1;
        }
        #gif-tool-controls {
            display:flex;
            gap:8px;
            align-items:center;
            flex-shrink: 0;
        }
        #gif-tool-search {
            flex:1;
            padding:6px 10px;
            background:#40444b;
            border:1px solid #555;
            color:#fff;
            border-radius:6px;
            font-size:13px;
            outline:none;
        }
        #gif-tool-search:focus { border-color: #00bfff; }
        #gif-tool-close {
            background:none;
            border:none;
            color:#aaa;
            font-size: 18px;
            cursor:pointer;
            line-height: 1;
            padding: 0;
        }
        #gif-tool-close:hover { color:#fff; }

#tbdm-gif-tool-btn {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    height: 28px;
    width: 28px;
    margin-left: 4px;
    margin-right: 2px;
    cursor: pointer;
    color: #ccc;
    transition: color 0.1s, transform 0.1s;
}
#tbdm-gif-tool-btn svg {
    position: relative;
    top: 1px;
}

        #tbdm-gif-tool-btn svg { display: block; }
        #tbdm-gif-tool-btn:hover { color: #fff; transform: translateY(-1px); }


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
        if (CONFIG.gif_picker_enabled) GifPickerModule.init();
        if (CONFIG.image_viewer_enabled) ImageViewerModule.init();
        if (CONFIG.meme_creator_enabled) MemeCreatorModule.init();


        UIImprovementsModule.init();
        if (CONFIG.unicode_emoji_enabled) UnicodeEmojiModule.init();
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
// ==UserScript==
// @name         YT Comment Filter (Improved)
// @namespace    YT Comment Filter (Improved)
// @version      6.2
// @description  Automatically hide YouTube comments based on username, specific keywords, and spam text patterns. Features Dual-Mode Observer.
// @author       Mochamad Adi MR (adimuham.mad)
// @match        *://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @supportURL   https://buymeacoffee.com/mochadimr
// @homepageURL  https://gist.github.com/adimuhamad/143a06052413aaecb6ddf1a4e39103c1
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557464/YT%20Comment%20Filter%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557464/YT%20Comment%20Filter%20%28Improved%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = {
        STORAGE_KEY_USERS: "yt_filter_custom_words",
        STORAGE_KEY_KEYWORDS: "yt_filter_custom_content_keywords",
        STORAGE_KEY_MODE: "yt_filter_observer_mode",
        THROTTLE_DELAY: 1000,
        SELECTORS: {
            COMMENT_CONTAINER: "ytd-comment-view-model",
            COMMENT_TEXT: "#content-text",
            AUTHOR_TEXT: "#author-text span",
            HEADER_TARGET: "ytd-comments-header-renderer #additional-section",
            THREAD_RENDERER: "ytd-comment-thread-renderer",
            REPLIES_CONTAINER: "#replies",
        },
        CLASSES: {
            HIDDEN: "yt-comment-filter-hidden",
            SHOW_HIDDEN: "yt-filter-showing-hidden",
        },
        DEFAULTS: {
            BLOCKED_USERS: ["vip"],
            BLOCKED_KEYWORDS: ["pulauwin"],
            MODE: "efficient",
        },
        REGEX_NON_LATIN:
            /[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u02B0-\u02FF\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u087F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u125F\u1280-\u12BF\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1A5F\u1A80-\u1AFF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C90-\u1CBF\u1CC0-\u1CCF\u1CD0-\u1CFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u20CF\u20D0-\u20FF\u2150-\u218F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA3F\uAA40-\uAA6F\uAA70-\uAAAB\uAAAC-\uAAAF\uAAB0-\uAABF\uAAC0-\uAADF\uAAE0-\uAAEF\uAAF0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF]/,
    };

    const UI_CONSTANTS = {
        ID: {
            DIALOG_MAIN: "yt-filter-dialog-main",
            DIALOG_CONFIRM: "yt-filter-dialog-confirm",
            OVERLAY: "yt-filter-overlay",
            USER_INPUT: "yt-filter-input-users",
            KEYWORD_INPUT: "yt-filter-input-keywords",
        },
    };

    const Theme = {
        getColors() {
            const isDark =
                document.documentElement.getAttribute("dark") === "true" ||
                (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

            return {
                background: isDark ? "#212121" : "#ffffff",
                text: isDark ? "#f1f1f1" : "#0f0f0f",
                textSec: isDark ? "#aaaaaa" : "#606060",
                border: isDark ? "#3e3e3e" : "#e5e5e5",
                primary: "#3ea6ff",
                danger: "#ff4e45",
                buttonBg: isDark ? "#303030" : "#f2f2f2",
                inputBg: isDark ? "#121212" : "#f9f9f9",
                overlay: "rgba(0,0,0,0.7)",
                shadow: "rgba(0,0,0,0.5)",
            };
        },
    };

    const Utils = {
        debounce: (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        },
        throttle: (func, limit) => {
            let inThrottle;
            return function () {
                const args = arguments,
                    context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        },
        escapeRegExp: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        createLeetPattern: (word) => {
            return Utils.escapeRegExp(word)
                .replace(/a/gi, "[a4@]")
                .replace(/i/gi, "[i1l]")
                .replace(/e/gi, "[e3]")
                .replace(/o/gi, "[o0]")
                .replace(/s/gi, "[s5$]")
                .replace(/t/gi, "[t7+]")
                .replace(/g/gi, "[g9]");
        },
        setStyle: (element, styles) => Object.assign(element.style, styles),
    };

    const State = {
        isShowingHidden: false,
        forbiddenUserRegex: null,
        forbiddenContentRegex: null,
        observerMode: "efficient",

        loadSettings: () => {
            State.observerMode = GM_getValue(CONFIG.STORAGE_KEY_MODE, CONFIG.DEFAULTS.MODE);

            const loadRegex = (key, defaults) => {
                const saved = GM_getValue(key, "");
                const custom = saved
                    ? saved
                          .split(",")
                          .map((w) => w.trim())
                          .filter(Boolean)
                    : [];
                const all = [...new Set([...defaults, ...custom])];
                return all.length > 0 ? new RegExp(all.map(Utils.createLeetPattern).join("|"), "i") : null;
            };

            State.forbiddenUserRegex = loadRegex(CONFIG.STORAGE_KEY_USERS, CONFIG.DEFAULTS.BLOCKED_USERS);
            State.forbiddenContentRegex = loadRegex(CONFIG.STORAGE_KEY_KEYWORDS, CONFIG.DEFAULTS.BLOCKED_KEYWORDS);
        },

        saveSettings: (usersStr, keywordsStr) => {
            GM_setValue(CONFIG.STORAGE_KEY_USERS, usersStr);
            GM_setValue(CONFIG.STORAGE_KEY_KEYWORDS, keywordsStr);
            State.loadSettings();
            FilterEngine.processAll();
        },

        applySwitchMode: () => {
            const newMode = State.observerMode === "efficient" ? "fast" : "efficient";
            GM_setValue(CONFIG.STORAGE_KEY_MODE, newMode);
            State.observerMode = newMode;
            ObserverManager.start();
        },
    };

    const SettingsUI = {
        openSettings() {
            if (document.getElementById(UI_CONSTANTS.ID.DIALOG_MAIN)) return;
            const colors = Theme.getColors();
            const userVal = GM_getValue(CONFIG.STORAGE_KEY_USERS, "");
            const keywordVal = GM_getValue(CONFIG.STORAGE_KEY_KEYWORDS, "");

            this._createModal(
                UI_CONSTANTS.ID.DIALOG_MAIN,
                "Filter Configuration",
                colors,
                1000,
                (contentDiv) => {
                    contentDiv.append(this._createLabel("Blocked Usernames", colors));

                    const userArea = this._createTextarea(
                        UI_CONSTANTS.ID.USER_INPUT,
                        userVal,
                        "Example: login, browser, search, google, etc",
                        colors
                    );

                    contentDiv.append(userArea);
                    const spacer = document.createElement("div");
                    Utils.setStyle(spacer, { height: "16px" });
                    contentDiv.append(spacer);
                    contentDiv.append(this._createLabel("Blocked Keywords (Content)", colors));

                    const keyArea = this._createTextarea(
                        UI_CONSTANTS.ID.KEYWORD_INPUT,
                        keywordVal,
                        "Example: winningisland, luckyeagle, gambletoto, etc",
                        colors
                    );

                    contentDiv.append(keyArea);
                    setTimeout(() => userArea.focus(), 100);
                },
                (footerDiv) => {
                    const btnReset = this._createBtn("Reset Filters", "transparent", colors.danger, colors);
                    Utils.setStyle(btnReset, { border: `1px solid ${colors.danger}` });

                    btnReset.onmouseover = () => {
                        btnReset.style.backgroundColor = colors.danger;
                        btnReset.style.color = "#fff";
                    };

                    btnReset.onmouseout = () => {
                        btnReset.style.backgroundColor = "transparent";
                        btnReset.style.color = colors.danger;
                    };

                    btnReset.onclick = () => {
                        this.openConfirm(
                            "Reset All Filters?",
                            "This will delete all custom usernames and keywords.\nAre you sure?",
                            "Yes, Reset",
                            colors.danger,
                            () => {
                                document.getElementById(UI_CONSTANTS.ID.USER_INPUT).value = "";
                                document.getElementById(UI_CONSTANTS.ID.KEYWORD_INPUT).value = "";
                                State.saveSettings("", "");
                            }
                        );
                    };

                    const btnSave = this._createBtn("Save Changes", colors.primary, "#ffffff", colors);

                    btnSave.onclick = () => {
                        const uVal = document.getElementById(UI_CONSTANTS.ID.USER_INPUT).value;
                        const kVal = document.getElementById(UI_CONSTANTS.ID.KEYWORD_INPUT).value;
                        State.saveSettings(uVal, kVal);
                        this.close(UI_CONSTANTS.ID.DIALOG_MAIN);
                    };

                    footerDiv.append(btnReset, btnSave);
                }
            );
        },

        openModeSwitcher() {
            if (document.getElementById(UI_CONSTANTS.ID.DIALOG_CONFIRM)) return;
            const colors = Theme.getColors();
            const currentMode = State.observerMode.toUpperCase();
            const targetMode = currentMode === "EFFICIENT" ? "FAST" : "EFFICIENT";

            const desc =
                targetMode === "FAST"
                    ? "Comments will disappear instantly, but browser CPU usage may increase slightly."
                    : "Saves battery and CPU usage. Comments disappear after scroll stops.";

            this.openConfirm(
                "Switch Observer Mode?",
                `Current Mode: <b>${currentMode}</b>\n\nDo you want to switch to <b>${targetMode}</b> mode?\n${desc}`,
                `Switch to ${targetMode}`,
                colors.primary,
                () => {
                    State.applySwitchMode();
                }
            );
        },

        openConfirm(title, messageHtml, confirmBtnText, confirmBtnColor, onConfirmCallback) {
            const colors = Theme.getColors();

            this._createModal(
                UI_CONSTANTS.ID.DIALOG_CONFIRM,
                title,
                colors,
                2000,
                (contentDiv) => {
                    const p = document.createElement("p");
                    p.innerHTML = messageHtml.replace(/\n/g, "<br>");
                    
                    Utils.setStyle(p, { 
                        lineHeight: "1.5", 
                        fontSize: "14px", 
                        color: colors.textSec 
                    });
                    
                    contentDiv.append(p);
                },
                (footerDiv) => {
                    const btnCancel = this._createBtn("Cancel", "transparent", colors.text, colors);
                    btnCancel.onclick = () => this.close(UI_CONSTANTS.ID.DIALOG_CONFIRM);
                    const btnConfirm = this._createBtn(confirmBtnText, confirmBtnColor, "#ffffff", colors);
                    
                    btnConfirm.onclick = () => {
                        onConfirmCallback();
                        this.close(UI_CONSTANTS.ID.DIALOG_CONFIRM);
                    };

                    footerDiv.append(btnCancel, btnConfirm);
                }
            );
        },

        _createModal(dialogId, titleText, colors, zIndex, contentBuilder, actionBuilder) {
            const overlay = document.createElement("div");
            overlay.id = dialogId + "-overlay";

            Utils.setStyle(overlay, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: colors.overlay,
                zIndex: zIndex,
                backdropFilter: "blur(3px)",
            });

            const dialog = document.createElement("div");
            dialog.id = dialogId;

            Utils.setStyle(dialog, {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: "12px",
                padding: "24px",
                width: "450px",
                maxWidth: "90vw",
                maxHeight: "85vh",
                zIndex: zIndex + 1,
                boxShadow: `0 10px 25px ${colors.shadow}`,
                fontFamily: "Roboto, Arial, sans-serif",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
            });

            const header = document.createElement("div");

            Utils.setStyle(header, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
            });

            const title = document.createElement("h2");
            title.textContent = titleText;

            Utils.setStyle(title, {
                margin: "0", 
                fontSize: "20px", 
                fontWeight: "500"
            });

            const closeBtn = document.createElement("button");
            closeBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:${colors.text}"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

            Utils.setStyle(closeBtn, {
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                padding: "4px"
            });

            closeBtn.onclick = () => this.close(dialogId);
            header.append(title, closeBtn);
            const content = document.createElement("div");
            contentBuilder(content);
            const actions = document.createElement("div");

            Utils.setStyle(actions, {
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "10px", 
                marginTop: "24px"
            });

            actionBuilder(actions);
            dialog.append(header, content, actions);
            document.body.append(overlay, dialog);

            const escHandler = (e) => {
                if (e.key === "Escape") this.close(dialogId);
            };

            dialog.dataset.escHandler = "true";
            document.addEventListener("keydown", escHandler);
            this._escHandlers = this._escHandlers || {};
            this._escHandlers[dialogId] = escHandler;
        },

        _createLabel(text, colors) {
            const lbl = document.createElement("label");
            lbl.textContent = text;

            Utils.setStyle(lbl, {
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: "500",
                color: colors.text,
            });

            return lbl;
        },

        _createTextarea(id, val, placeholder, colors) {
            const ta = document.createElement("textarea");
            ta.id = id;
            ta.value = val;
            ta.placeholder = placeholder;

            Utils.setStyle(ta, {
                width: "100%",
                height: "80px",
                backgroundColor: colors.inputBg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "monospace",
                fontSize: "12px",
                resize: "vertical",
                boxSizing: "border-box",
                outline: "none",
            });

            ta.onfocus = () => {
                ta.style.borderColor = colors.primary;
            };

            ta.onblur = () => {
                ta.style.borderColor = colors.border;
            };

            return ta;
        },

        _createBtn(text, bg, textColor, colors) {
            const btn = document.createElement("button");
            btn.textContent = text;

            Utils.setStyle(btn, {
                padding: "8px 16px",
                backgroundColor: bg,
                color: textColor,
                border: bg === "transparent" ? `1px solid ${colors.border}` : "none",
                borderRadius: "18px",
                cursor: "pointer",
                fontWeight: "500",
            });

            if (bg === "transparent") {
                btn.onmouseover = () => (btn.style.backgroundColor = colors.buttonBg);
                btn.onmouseout = () => (btn.style.backgroundColor = "transparent");
            }

            return btn;
        },

        close(dialogId) {
            const dialog = document.getElementById(dialogId);
            const overlay = document.getElementById(dialogId + "-overlay");
            if (dialog) dialog.remove();
            if (overlay) overlay.remove();

            if (this._escHandlers && this._escHandlers[dialogId]) {
                document.removeEventListener("keydown", this._escHandlers[dialogId]);
                delete this._escHandlers[dialogId];
            }
        },
    };

    const FilterEngine = {
        isSpam: (commentText, username) => {
            if (CONFIG.REGEX_NON_LATIN.test(commentText)) return true;
            if (username && State.forbiddenUserRegex?.test(username)) return true;
            if (commentText && State.forbiddenContentRegex?.test(commentText)) return true;
            return false;
        },
        processAll: () => {
            const comments = document.querySelectorAll(CONFIG.SELECTORS.COMMENT_CONTAINER);
            let hiddenCount = 0;
            let totalCount = comments.length;

            comments.forEach((container) => {
                const textEl = container.querySelector(CONFIG.SELECTORS.COMMENT_TEXT);
                const userEl = container.querySelector(CONFIG.SELECTORS.AUTHOR_TEXT);
                if (!textEl) return;
                const text = textEl.innerText;
                const user = userEl ? userEl.innerText : "";

                if (FilterEngine.isSpam(text, user)) {
                    FilterEngine.hideComment(container);
                    hiddenCount++;
                } else {
                    FilterEngine.showComment(container);
                }
            });

            UIManager.updateCount(hiddenCount, totalCount);
        },
        hideComment: (container) => {
            if (!container.classList.contains(CONFIG.CLASSES.HIDDEN)) {
                container.style.display = "none";
                container.classList.add(CONFIG.CLASSES.HIDDEN);

                if (container.id === "comment") {
                    const thread = container.closest(CONFIG.SELECTORS.THREAD_RENDERER);
                    const replies = thread?.querySelector(CONFIG.SELECTORS.REPLIES_CONTAINER);
                    if (replies) replies.style.display = "none";
                }
            }
        },
        showComment: (container) => {
            if (container.classList.contains(CONFIG.CLASSES.HIDDEN)) {
                container.style.display = "";
                container.classList.remove(CONFIG.CLASSES.HIDDEN);

                if (container.id === "comment") {
                    const thread = container.closest(CONFIG.SELECTORS.THREAD_RENDERER);
                    const replies = thread?.querySelector(CONFIG.SELECTORS.REPLIES_CONTAINER);
                    if (replies) replies.style.display = "";
                }
            }
        },
    };

    const UIManager = {
        injectStyles: () => {
            GM_addStyle(`
                .${CONFIG.CLASSES.HIDDEN} { display: none; }
                body.${CONFIG.CLASSES.SHOW_HIDDEN} .${CONFIG.CLASSES.HIDDEN} {
                    display: block !important; opacity: 0.6; border: 1px dashed rgba(255, 0, 0, 0.5);
                    border-radius: 8px; margin-bottom: 8px !important;
                }
            `);
        },
        createButton: () => {
            if (document.getElementById("yt-filter-toggle")) return;
            const target = document.querySelector(CONFIG.SELECTORS.HEADER_TARGET);
            if (!target) return;
            const btn = document.createElement("span");
            btn.id = "yt-filter-toggle";

            Utils.setStyle(btn, {
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                fontFamily: '"Roboto","Arial",sans-serif',
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--yt-spec-text-secondary)",
                marginLeft: "32px",
                position: "relative",
                bottom: "3px",
            });

            const iconStyle = "width:24px;height:24px;fill:currentColor;margin-right:4px";

            const svgs = {
                on: `<svg class="icon-vis-on" style="${iconStyle}" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5s5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>`,
                off: `<svg class="icon-vis-off" style="${iconStyle};display:none" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L21.73 23 23 21.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.93 1.57 3.5 3.5 3.5.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-3.04 0-5.5-2.46-5.5-5.5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.93-1.57-3.5-3.5-3.5l-.16.02z"/></svg>`,
            };

            btn.innerHTML = `${svgs.on}${svgs.off}<span class="yt-filter-label">Hidden</span><span class="yt-filter-status" style="margin: 0 4px;">OFF</span><span class="yt-filter-info" style="display:none">(0/0)</span>`;
            btn.addEventListener("click", UIManager.toggleHidden);
            target.after(btn);
        },
        toggleHidden: () => {
            State.isShowingHidden = !State.isShowingHidden;
            document.body.classList.toggle(CONFIG.CLASSES.SHOW_HIDDEN, State.isShowingHidden);
            UIManager.updateCount();
        },
        updateCount: (passedHidden, passedTotal) => {
            const btn = document.getElementById("yt-filter-toggle");
            if (!btn) return;
            let hiddenCount = passedHidden ?? document.querySelectorAll(`.${CONFIG.CLASSES.HIDDEN}`).length;
            let totalCount = passedTotal ?? document.querySelectorAll(CONFIG.SELECTORS.COMMENT_CONTAINER).length;
            const statusEl = btn.querySelector(".yt-filter-status");
            const infoEl = btn.querySelector(".yt-filter-info");
            const iconOn = btn.querySelector(".icon-vis-on");
            const iconOff = btn.querySelector(".icon-vis-off");

            if (State.isShowingHidden) {
                statusEl.textContent = "OFF";
                infoEl.style.display = "none";
                iconOn.style.display = "none";
                iconOff.style.display = "block";
            } else {
                statusEl.textContent = "ON";
                infoEl.textContent = `(${hiddenCount}/${totalCount})`;
                infoEl.style.display = "inline";
                iconOn.style.display = "block";
                iconOff.style.display = "none";
            }
        },
    };

    const ObserverManager = {
        activeObserver: null,
        start: () => {
            if (ObserverManager.activeObserver) ObserverManager.activeObserver.disconnect();
            if (State.observerMode === "fast") ObserverManager.startFastMode();
            else ObserverManager.startEfficientMode();
        },
        startEfficientMode: () => {
            console.log("[YT Filter] EFFICIENT Mode.");
            const debouncedProcess = Utils.debounce(FilterEngine.processAll, 500);
            ObserverManager.activeObserver = new MutationObserver((mutations) => {
                let shouldProcess = false;

                for (const m of mutations) {
                    if (
                        m.target.nodeName === "YTD-COMMENT-VIEW-MODEL" ||
                        m.target.id === "contents" ||
                        m.target.id === "comments"
                    ) {
                        shouldProcess = true;
                        break;
                    }
                }

                if (shouldProcess || document.readyState === "loading") debouncedProcess();
            });

            ObserverManager.activeObserver.observe(document.body, { childList: true, subtree: true });
        },
        startFastMode: () => {
            console.log("[YT Filter] FAST Mode.");
            const throttledProcess = Utils.throttle(FilterEngine.processAll, CONFIG.THROTTLE_DELAY);
            ObserverManager.activeObserver = new MutationObserver(() => throttledProcess());
            ObserverManager.activeObserver.observe(document.body, { childList: true, subtree: true });
        },
    };

    const init = () => {
        State.loadSettings();
        UIManager.injectStyles();
        GM_registerMenuCommand("⚙ Configure Filter Settings", SettingsUI.openSettings.bind(SettingsUI));
        GM_registerMenuCommand("🔁 Switch Observer Mode", SettingsUI.openModeSwitcher.bind(SettingsUI));
        GM_registerMenuCommand("👁️‍🗨️ Toggle Button Check", UIManager.createButton);

        const btnInterval = setInterval(() => {
            if (document.querySelector(CONFIG.SELECTORS.HEADER_TARGET)) {
                UIManager.createButton();
                clearInterval(btnInterval);
            }
        }, 2000);

        ObserverManager.start();
        setTimeout(FilterEngine.processAll, 2000);
    };

    init();
})();
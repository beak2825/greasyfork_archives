// ==UserScript==
// @name         SangTacViet ExtraTools
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Thiết lập đọc full màn hình, tự động nhặt bảo trên sangtacviet, chặn tính năng copy bẩn
// @author       @nntoan
// @match        *sangtacviet.pro/truyen/*
// @match        *sangtacvietfpt.com/truyen/*
// @match        *sangtacviet.com/truyen/*
// @match        *sangtacviet.me/truyen/*
// @match        *sangtacviet.vip/truyen/*
// @match        *sangtacviet.app/truyen/*
// @match        *14.225.254.182/truyen/*
// @icon         http://14.225.254.182/favicon.png
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558573/SangTacViet%20ExtraTools.user.js
// @updateURL https://update.greasyfork.org/scripts/558573/SangTacViet%20ExtraTools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const CONFIG = {
        DOM: {
            nameInput: "#namewd",
            nameSettingBox: "#nsbox",
            contentBox: "#content-container .contentbox",
            configBox: "#configBox",
            settingBtn: "#btnshowns",
            highlightBtn: "#highlightBtn",
            settingIcon: ".fa-cogs.fas",
        },

        CLASSNAMES: {
            button85: "button-85",
            notifier: "cp-notifier",
            button: "cp-floating-btn",
        },

        ATTRIBUTES: {
            IS_NAME: "isname",
            EXTRA_ID_PREFIX: "exran",
        },

        ACTIONS_TO_RELOAD: [
            "addSuperName('hv','z')",
            "addSuperName('hv','f')",
            "addSuperName('hv','s')",
            "addSuperName('hv','l')",
            "addSuperName('hv','a')",
            "addSuperName('el')",
            "addSuperName('vp')",
            "addSuperName('kn')",
            "saveNS();excute();",
            "excute()",
        ],

        REGEX: {
            REVERSE_TRIM_TEXT: {
                pattern: /[\w\s\p{L}\p{M}]+/gu,
                replace: " $& ",
            },
            START_SIGNS: {
                pattern: /^\s*([^\w\s\p{L}\p{M}]+(?:\s+[^\w\s\p{L}\p{M}]+)*)(.*)$/u,
                replace: "$2",
            },
            END_SIGNS: {
                pattern: /^(.*?)([^\w\s\p{L}\p{M}]+(?:\s+[^\w\s\p{L}\p{M}]+)*)\s*$/u,
                replace: "$1",
            },
            ENDS: {
                pattern: /[.;:!?“【[]$/,
                replace: null,
            },
            CHINESE_UNICODE: {
                pattern: /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\U0002f800-\U0002fa1f]/g,
                replace: null,
            },
            NUMBER_COUNT_5: {
                pattern: /(?<!\d)\d{5,}(?!\d)/g,
                replace: null,
            },
            NUMBER_COMMA: {
                pattern: /\B(?=(\d{3})+(?!\d))/g,
                replace: " ",
            },
        },

        RULES: {
            OPEN_BRACKET: {
                pattern: /【/g,
                replace: "[",
            },
            CLOSE_BRACKET: {
                pattern: /】/g,
                replace: "]",
            },
            OPEN_ARROW: {
                pattern: /《/g,
                replace: "《",
            },
            CLOSE_ARROW: {
                pattern: /》/g,
                replace: "》",
            },
            ADD_MID_SPACE: {
                pattern: /([,.:;!?，。！？、；：])([?{‘“"])/g,
                replace: "$1 $2",
            },
            ADD_PREVIOUS_SPACE: {
                pattern: /[》({<“‘]+/g,
                replace: " $&",
            },
            ADD_NEXT_SPACE: {
                pattern: /[《)}>”’,.:;!?，；#$^&%]+/g,
                replace: "$& ",
            },
            ADD_BOTH_SIDES_SPACE: {
                pattern: /[\+*=≠~—→·⑩⑨⑧⑦⑥⑤④③②①⓪\[\]|<>{}]/g,
                replace: " $& ",
            },
            REMOVE_MULTI_BETWEEN_SPACE: {
                pattern: /([^\w\s\p{L}\p{M}])\s+([^\w\s\p{L}\p{M}])/gu,
                replace: "$1 $2",
            },
            REMOVE_PREVIOUS_SPACE: {
                pattern: /\s+([)”’,.:;!?，；#$^&%])/g,
                replace: "$1",
            },
            REMOVE_NEXT_SPACE: {
                pattern: /([(“‘])\s+/g,
                replace: "$1",
            },
            REMOVE_BOTH_SIDES_NUMBER_SPACE: {
                pattern: /(?<=\d)\s*([ .:])\s*(?=\d)/g,
                replace: "$1",
            },
        },

        MESSAGES: {
            SORTED: "✨ Sorted!",
            CLEANED: "✨ Cleaned!",
            COPY_SUCCESS: "📋 Names copied!",
            COPY_FAILED: "❌ Copy failed!",
            MODE_ON: "☕️ Highlight mode: On",
            MODE_OFF: "🍵 Highlight mode: Off",
        },

        CSS: `
            .listchapitem {
                border: none;
                padding: 10px 5px;
            }

            #namewd {
                padding: 2px;
                line-height: 1.8;
            }

            .fa-cogs.fas {
                color: #ffffff !important;
            }

            #configBox {
                right: 85px !important;
            }

            #btnshowns .fa-cogs.fas {
                color: white !important;
                font-size: 24px !important;
            }

            .button-85 {
                font-weight: bold;
                font-size: 12px;
                border: 1px solid rgb(103, 103, 103, 103);
                border-radius: 999px;
                width: 50px;
                height: 50px;
                background-color: #212121;
                cursor: pointer;
                color: white;
                transition: background-color ease-in-out 0.1s,
                    letter-spacing ease-in-out 0.1s, transform ease-in-out 0.1s;
            }

            .button-85:active {
                background-color: fuchsia;
                transform: scale(0.95);
            }

            .button-85:focus {
                outline: none;
            }

            .cp-notifier {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                width: auto;
                height: auto;
                padding: 10px 20px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                opacity: 0;
                pointer-events: none;
                backdrop-filter: blur(6px);
                z-index: 1001;
                transition: opacity 0.4s ease, transform 0.4s ease;
            }

            .cp-floating-btn {
                position: fixed;
                right: 16px;
                z-index: 1000;
            }
        `,
    };

    const app = {
        isHighlighted: true,
        domCache: {},
        count: 0,
        waitTime: 0,
        cType: 0,
        _autoCollectInterval: null,

        init() {
            GM_addStyle(CONFIG.CSS);

            window.addEventListener("DOMContentLoaded", () => {
                const targetNode = document.querySelector(
                    CONFIG.DOM.contentBox
                );
                if (!targetNode) return;

                const observer = new MutationObserver(
                    (mutationsList, observer) => {
                        if (
                            document.querySelector(CONFIG.DOM.contentBox + " i")
                        ) {
                            observer.disconnect();
                            setTimeout(() => {
                                this.run();
                            }, 2000);
                        }
                    }
                );

                observer.observe(targetNode, {
                    childList: true,
                    subtree: true,
                });

                if (document.querySelector(CONFIG.DOM.contentBox + " i")) {
                    observer.disconnect();
                    setTimeout(() => {
                        this.run();
                    }, 2000);
                }
            });

            // Initialize features that don't depend on content loading
            this._initGlobalFeatures();
        },

        _initGlobalFeatures() {
            this._setupBackgroundColor();
            this._setupCopyOverride();
            this._setupKeyboardShortcuts();
            this._startAutoCollect();
        },

        _setupBackgroundColor() {
            window.localStorage.setItem('backgroundcolor', 'rgb(234, 228, 211)');
        },

        _setupCopyOverride() {
            document.oncopy = function () {
                document.execCommand("copy");
                return;
            };
        },

        _setupKeyboardShortcuts() {
            window.onkeydown = function (event) {
                console.log(event.keyCode);
                if (event.keyCode === 27) {
                    pageWindow.hideNS();
                }
            };
        },

        _startAutoCollect() {
            setInterval(() => {
                this._applyBackgroundStyles();
                this._checkForTreasure();
            }, 1000);
        },

        _applyBackgroundStyles() {
            const bodyBg = document.getElementById('full');
            const contentBg = document.querySelector('#content-container .contentbox');
            const bgColor = "rgba(234, 228, 211, 0.7)";

            if (bodyBg) bodyBg.style.backgroundColor = bgColor;
            if (contentBg) contentBg.style.backgroundColor = bgColor;
        },

        _checkForTreasure() {
            const btn = document.querySelector('.contentbox .btn.btn-info[id]');

            if (this.count === 0) {
                this.waitTime = this._randomInt();
            }

            if (btn) {
                this.count++;
                pageWindow.ui.notif(`Phát hiện bảo vật (${this.count}) - Chờ trong ${this.waitTime} ms sẽ tự động nhặt vật phẩm`);
                console.log("STVAuto: Phát hiện bảo vật...", this.count);

                if (this.count === 1) {
                    this._collectTreasure(btn);
                }
            } else {
                this.count = 0;
            }
        },

        _collectTreasure(btn) {
            this._randomTimeout(this.waitTime, async () => {
                const item = await this._fetchCollectInfo();

                const format = `color:red;font-size:16px;font-weight:bold;`;
                console.log("STVAuto: ------------------------");
                console.log("STVAuto: Tìm thấy " + item.name);
                console.log(`%c${item.name}, Level: ${item.level}, ${item.info}`, format);

                await this._sleep();
                await this._submitCollect(item);

                console.log("STVAuto: ------------------------");

                pageWindow.jQuery('.contentbox .btn.btn-info[id]')
                    .css('font-size', '270px')
                    .css('filter', 'none');
                btn.remove();
            });
        },

        _fetchCollectInfo() {
            return new Promise((resolve) => {
                const itemInfo = {
                    name: "",
                    info: "",
                    level: "",
                    error: "",
                    message: "",
                    type: 3
                };

                try {
                    const params = "ngmar=collect&ajax=collect";
                    const http = new XMLHttpRequest();
                    http.open('POST', '/index.php', true);
                    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                    http.onreadystatechange = () => {
                        if (http.readyState === 4 && http.status === 200) {
                            try {
                                const data = JSON.parse(http.responseText);
                                Object.assign(itemInfo, data);

                                pageWindow.g("cInfo").innerHTML = data.info;
                                pageWindow.g("cName").innerHTML = data.name;
                                pageWindow.g("cLevel").innerHTML = data.level;
                                itemInfo.message = `Tên: <b style="color:red">${data.name}</b><br/>Cấp: ${data.level}<br/>Thông tin: ${data.info}`;

                                this.cType = data.type;

                                if (this.cType === 3 || this.cType === 4) {
                                    this._enableCustomNameInput();
                                }

                                resolve(itemInfo);
                            } catch (e) {
                                alert(http.responseText);
                                itemInfo.error = http.responseText;
                                resolve(itemInfo);
                            }
                        }
                    };

                    http.send(params);
                } catch (err) {
                    console.error(err);
                    itemInfo.error = err;
                    resolve(itemInfo);
                }
            });
        },

        _enableCustomNameInput() {
            const cInfo = pageWindow.g("cInfo");
            const cName = pageWindow.g("cName");

            cInfo.contentEditable = true;
            cInfo.style.border = "1px solid black";
            cName.contentEditable = true;
            cName.style.border = "1px solid black";

            pageWindow.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
        },

        _submitCollect(item) {
            return new Promise((resolve) => {
                try {
                    let params = "ajax=fcollect&c=137";

                    if (this.cType === 3 || this.cType === 4) {
                        const nname = pageWindow.g("cName").innerText;
                        if (nname.length > 80) {
                            alert("Tên công pháp/vũ kỹ quá dài.");
                            return resolve("Name too long");
                        }
                        params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(pageWindow.g("cInfo").innerText);
                    }

                    const http = new XMLHttpRequest();
                    http.open('POST', '/index.php', true);
                    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                    http.onreadystatechange = () => {
                        if (http.readyState === 4 && http.status === 200) {
                            try {
                                const x = JSON.parse(http.responseText);
                                if (x.code === 1) {
                                    pageWindow.ui.notif("Thành công");
                                } else {
                                    const errMsg = x.err.includes("không nhặt được gì")
                                    ? "Thật đáng tiếc, kỳ ngộ đã không cánh mà bay, có duyên gặp lại ah."
                                    : x.err;
                                    pageWindow.ui.alert(errMsg);
                                }

                                this._showSuccessNotification(item);
                                resolve("Nhặt bảo thành công");
                            } catch (e) {
                                console.error("Nhặt bảo thất bại(ex2)");
                                resolve(http.responseText);
                            }
                        }
                    };

                    http.send(params);
                } catch (err) {
                    console.error(err);
                    resolve("Nhặt bảo thất bại(ex1)");
                }
            });
        },

        _showSuccessNotification(item) {
            let showTime = 10;
            const handle = setInterval(() => {
                showTime--;
                pageWindow.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây</a></b>`);
                if (showTime <= 1) {
                    clearInterval(handle);
                }
            }, 1000);
            console.log("STVAuto: Nhặt bảo thành công " + item.name);
        },

        _randomInt(min = 1000, max = 10000) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        _randomTimeout(time, action) {
            time = time || this._randomInt();
            console.log("STVAuto delay start in ", time, "ms");

            const handle = setTimeout(() => {
                action();
                clearTimeout(handle);
                console.log("STVAuto delay end in ", time, "ms");
            }, time);
        },

        _sleep(time) {
            time = time || this._randomInt(500, 3000);
            console.log("STVAuto sleep in ", time, "ms");
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        registerMenuCommand() {
            GM_registerMenuCommand("🔁 Toggle Highlight", () => this.switchHighlight());
            GM_registerMenuCommand("🔼 Sort name", () => this.sort());
            GM_registerMenuCommand("📋 Copy name", () => this.copyName());
            GM_registerMenuCommand("🧹 Clean", () => this.format());
        },

        run() {
            console.clear();
            this.cacheDOMElements();
            //this.setupAutoFormat();
            //this.format();
            this.registerMenuCommand();

            this.createUI();
        },

        cacheDOMElements() {
            this.domCache = {
                nameInput: document.querySelector(CONFIG.DOM.nameInput),
                contentBox: document.querySelector(CONFIG.DOM.contentBox),
                settingBtn: document.querySelector(CONFIG.DOM.settingBtn),
            };
        },

        createUI() {
            createButton("fixCleanBtn", "Clean", () => this.format(), 150);
            createButton("copyBtn", "Copy", () => this.copyName(), 85);
            createButton(
                "highlightBtn",
                "On",
                () => this.switchHighlight(),
                215
            );

            if (!this.domCache.settingBtn) return;
            this.domCache.settingBtn.classList.add(CONFIG.CLASSNAMES.button85);

            function createButton(id, text, onClick, bottom) {
                const btn = document.createElement("button");
                btn.id = id;
                btn.className = `${CONFIG.CLASSNAMES.button85} ${CONFIG.CLASSNAMES.button}`;
                btn.textContent = text;
                btn.onclick = onClick;
                btn.style.bottom = `${bottom}px`;

                document.body.appendChild(btn);
                return btn;
            }
        },

        setupAutoFormat() {
            CONFIG.ACTIONS_TO_RELOAD.forEach((action) => {
                const el = document.querySelector(`[onclick="${action}"]`);
                if (!el) return;
                el.addEventListener("click", this.format.bind(this));
            });
        },

        showNotify(message, duration = 2000) {
            const el = document.createElement("div");
            el.className = `${CONFIG.CLASSNAMES.button85} ${CONFIG.CLASSNAMES.notifier}`;
            el.textContent = message;

            document.body.appendChild(el);

            void el.offsetWidth;

            el.style.opacity = "1";
            el.style.transform = "translateX(-50%) translateY(0)";

            setTimeout(() => {
                el.style.opacity = "0";
                el.style.transform = "translateX(-50%) translateY(20px)";
                el.addEventListener("transitionend", () => el.remove());
            }, duration);
        },

        format() {
            if (!this.domCache.contentBox) return;

            this.removeEmptyITags();
            this.domCache.contentBox.normalize();

            this.processITags();
            this.processTextNodes();

            this.showNotify(CONFIG.MESSAGES.CLEANED);
        },

        isFollowedByImageDiv(iTag) {
            const next = iTag.nextElementSibling;
            return !(next &&
                     next.tagName.toLowerCase() === "div" &&
                     next.getAttribute("data-fanqie-type") === "image" &&
                     next.getAttribute("source") === "user");
        },


        removeEmptyITags() {
            this.domCache.contentBox.querySelectorAll("i").forEach((i) => {
                if (!this.isFollowedByImageDiv(i)) return;
                if (!i.textContent.trim()) i.remove();
            });
        },

        processITags() {
            this.domCache.contentBox.querySelectorAll("i").forEach((i) => {

                if (!this.isFollowedByImageDiv(i)) return;

                separatorSigns(i);
                formalizeITag(i);
                toLowercase(i);
                capitalizeStart(i);

                if (!i.textContent.trim()) i.remove();
            });

            function separatorSigns(i) {
                if (!i.id?.startsWith("exran")) return;

                const parent = i.parentNode;
                let textContent = i.textContent;

                textContent = handleStartSign(i, textContent, parent);
                handleEndSign(i, textContent, parent);

                if (i.textContent.trim() === "") {
                    parent.removeChild(i);
                }
            }

            function handleStartSign(i, textContent, parent) {
                const startMatch = textContent.match(
                    CONFIG.REGEX.START_SIGNS.pattern
                );
                if (!startMatch) return textContent;

                const prevSibling = i.previousSibling;
                const isPrevTextNode = prevSibling?.nodeType === Node.TEXT_NODE;
                const textStart = startMatch[1];
                const remainingText = startMatch[2];

                if (isPrevTextNode && prevSibling.nodeValue.trim() === "") {
                    parent.replaceChild(
                        document.createTextNode(textStart),
                        prevSibling
                    );
                    i.textContent = remainingText;
                    return remainingText;
                }

                if (isPrevTextNode) {
                    prevSibling.nodeValue += textStart;
                    i.textContent = remainingText;
                    return remainingText;
                }

                i.insertAdjacentText("beforebegin", textStart);
                i.textContent = remainingText;
                return remainingText;
            }

            function handleEndSign(i, textContent, parent) {
                const endMatch = textContent.match(
                    CONFIG.REGEX.END_SIGNS.pattern
                );
                if (!endMatch) return textContent;

                const nextSibling = i.nextSibling;
                const isNextTextNode = nextSibling?.nodeType === Node.TEXT_NODE;
                const textEnd = endMatch[2];
                const remainingText = endMatch[1];

                if (isNextTextNode && nextSibling.nodeValue.trim() === "") {
                    parent.replaceChild(
                        document.createTextNode(textEnd),
                        nextSibling
                    );
                    i.textContent = remainingText;
                    return remainingText;
                }

                if (isNextTextNode) {
                    nextSibling.nodeValue = textEnd + nextSibling.nodeValue;
                    i.textContent = remainingText;
                    return remainingText;
                }

                i.insertAdjacentText("afterend", textEnd);
                i.textContent = remainingText;
                return remainingText;
            }

            function formalizeITag(i) {
                if (!i) return;
                const prev = i.previousSibling;
                const next = i.nextSibling;

                i.textContent = i.textContent.trim();

                if (prev && prev.nodeType === 1 && prev.tagName === "I") {
                    i.parentNode.insertBefore(document.createTextNode(" "), i);
                }

                if (next && next.nodeType === 1 && next.tagName === "I") {
                    i.parentNode.insertBefore(
                        document.createTextNode(" "),
                        next
                    );
                }
            }

            function toLowercase(i) {
                const shouldLowercase =
                      !i.hasAttribute(CONFIG.ATTRIBUTES.IS_NAME) &&
                      !i.id?.startsWith(CONFIG.ATTRIBUTES.EXTRA_ID_PREFIX);

                if (shouldLowercase) {
                    i.textContent = i.textContent.toLowerCase();
                }
            }

            function capitalizeStart(i) {
                const prevEl = i.previousElementSibling;
                const prevNode = i.previousSibling;

                const getText = (dom) => dom?.textContent?.trim() || "";

                const shouldCapitalize =
                      prevEl === null ||
                      prevEl.nodeName === "BR" ||
                      prevEl.nodeName === "HEADER" ||
                      CONFIG.REGEX.ENDS.pattern.test(getText(prevNode));

                if (!shouldCapitalize || !i.innerHTML) return;

                const txt = i.innerHTML;
                i.innerHTML = txt[0].toUpperCase() + txt.slice(1);
            }
        },

        processTextNodes() {
            const walker = document.createTreeWalker(
                this.domCache.contentBox,
                NodeFilter.SHOW_TEXT
            );

            while (walker.nextNode()) {
                normalizeText(walker.currentNode);
            }

            function normalizeText(node) {
                if (!node?.nodeValue?.trim()) return;

                let txt = node.nodeValue.trim();
                const originalText = node.nodeValue;

                if (isTextNodeOutsideITag(node)) {
                    const { pattern, replace } = CONFIG.REGEX.REVERSE_TRIM_TEXT;
                    txt = txt.replace(pattern, replace);
                }

                Object.keys(CONFIG.RULES).forEach((rule) => {
                    const { pattern, replace } = CONFIG.RULES[rule];
                    txt = txt.replace(pattern, replace);
                });

                txt = txt.replace(CONFIG.REGEX.NUMBER_COUNT_5.pattern, (s) =>
                                  s.replace(
                    CONFIG.REGEX.NUMBER_COMMA.pattern,
                    CONFIG.REGEX.NUMBER_COMMA.replace
                )
                                 );

                if (!isTextNodeOutsideITag(node)) {
                    txt = txt.trim();
                }

                if (txt !== originalText) {
                    node.nodeValue = txt;
                }
            }

            function isTextNodeOutsideITag(textNode) {
                return (
                    textNode.nodeType === Node.TEXT_NODE &&
                    textNode.parentElement.tagName !== "I"
                );
            }
        },

        copyName() {
            const text = this.domCache.nameInput?.value || "";
            GM.setClipboard(text);
            this.showNotify(CONFIG.MESSAGES.COPY_SUCCESS);
        },

        switchHighlight(forceOn = false) {
            if (forceOn) this.isHighlighted = true;

            const btn = document.querySelector(CONFIG.DOM.highlightBtn);
            if (btn) btn.textContent = this.isHighlighted ? "Off" : "On";

            const COLOR_DANGER = "oklch(81% 0.117 11.638)";
            const I_NAME = "i[" + CONFIG.ATTRIBUTES.IS_NAME + "]";

            this.domCache.contentBox.querySelectorAll(I_NAME).forEach((i) => {
                i.style.color = this.isHighlighted ? COLOR_DANGER : "";
                i.style.fontWeight = this.isHighlighted ? "bold" : "normal";
            });

            this.isHighlighted = !this.isHighlighted;
            this.showNotify(
                this.isHighlighted
                ? CONFIG.MESSAGES.MODE_OFF
                : CONFIG.MESSAGES.MODE_ON
            );
        },

        sort() {
            const originalText = this.domCache.nameInput.value.trim();
            if (!originalText) {
                console.log("No text found in input field");
                return;
            }

            const sortedText = sortNames(originalText);
            this.domCache.nameInput.value = sortedText;
            this.showNotify(CONFIG.MESSAGES.SORTED);

            function sortNames(text) {
                const items = text
                .split("\n")
                .filter((line) => line.trim() && line.includes("="))
                .map((line) => {
                    const [keyPart, ...valueParts] = line.split("=");
                    const key = keyPart.replace("$", "").trim();
                    const value = valueParts.join("=").trim();
                    return { key, value };
                });

                const itemsWithStats = items.map((item) => {
                    const chineseCharCount = (
                        item.key.match(CONFIG.REGEX.CHINESE_UNICODE.pattern) ||
                        []
                    ).length;

                    const firstChar = item.value.charAt(0);
                    const isCapitalized =
                          firstChar === firstChar.toUpperCase() &&
                          firstChar !== firstChar.toLowerCase();

                    return {
                        ...item,
                        chineseCharCount,
                        caseType: isCapitalized ? "capitalized" : "lowercase",
                    };
                });

                itemsWithStats.sort((a, b) => {
                    if (a.chineseCharCount !== b.chineseCharCount) {
                        return a.chineseCharCount - b.chineseCharCount;
                    }
                    return a.value.localeCompare(b.value);
                });

                const groupedItems = itemsWithStats.reduce((acc, item) => {
                    acc[item.caseType] = acc[item.caseType] || [];
                    acc[item.caseType].push(item);
                    return acc;
                }, {});

                const capitalizedText = (groupedItems.capitalized || [])
                .map((item) => `$${item.key}=${item.value}`)
                .join("\n");

                const lowercaseText = (groupedItems.lowercase || [])
                .map((item) => `$${item.key}=${item.value}`)
                .join("\n");

                return `\n${capitalizedText}\n\n` + `\n${lowercaseText}`;
            }
        },
    };

    app.init();
})();
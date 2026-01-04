// ==UserScript==
// @name         Christmas Town Helper
// @namespace    hardy.ct.helper
// @version      3.0.12
// @description  Christmas Town Helper. Highlights Items, Chests, NPCs. And Games Cheat
// @author       Hardy [2131687] & Updated by SuperGogu [3580072]
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/560343/Christmas%20Town%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/560343/Christmas%20Town%20Helper.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const version = "3.0.7";
    const waitObj = {};
    const metadata = { "cache": { "spawn_rate": 0, "speed_rate": 0, "hangman": { "list": [], "chars": [], "len": false } }, "settings": { "games": { "wordFix": false } } };
    let saved;
    let cdForTypingGame;
    let cdForGarland;
    const chirp = new Audio("https://www.torn.com/js/chat/sounds/Chirp_1.mp3");
    const options = { "checkbox": { "items": { "name": "Highlight Items", "def": "yes", "color": "#e4e461" }, "gold_chest": { "name": "Highlight Golden Chests", "def": "yes", "color": "#e4e461" }, "silver_chest": { "name": "Highlight Silver Chests", "def": "yes", "color": "#e4e461" }, "bronze_chest": { "name": "Highlight Bronze Chests", "def": "yes", "color": "#e4e461" }, "combo_chest": { "name": "Highlight Combination Chests", "def": "yes", "color": "#e4e461" }, "chest_keys": { "name": "Highlight Keys", "def": "yes", "color": "#e4e461" }, "highlight_santa": { "name": "Highlight Santa", "def": "yes", "color": "#ff6200" }, "highlight_npc": { "name": "Highlight Other NPCs", "def": "yes", "color": "#ff6200" }, "wreath": { "name": "Christmas Wreath Helper", "def": "yes" }, "snowball_shooter": { "name": "Snowball Shooter Helper", "def": "yes" }, "santa_clawz": { "name": "Santa Clawz Helper", "def": "yes" }, "word_fixer": { "name": "Word Fixer Helper", "def": "yes" }, "hangman": { "name": "Hangman Helper", "def": "yes" }, "typoGame": { "name": "Typocalypse Helper", "def": "yes" }, "garland": { "name": "Garland Assemble Helper", "def": "yes" }, "chirp_alert_ct": { "name": "Chirp Alert", "def": "no" }, "nearby_item_flicker": { "name": "Nearby item (Mystery Gift/Key) flicker", "def": "yes" }, "combo_chest_flicker": { "name": "Combination chest flicker", "def": "yes" } }, "api_ct": "" };

    const wordList = ["holly and ivy", "elf", "eve", "fir", "ham", "icy", "ivy", "joy", "pie", "toy", "gift", "gold", "list", "love", "nice", "sled", "star", "wish", "wrap", "xmas", "yule", "angel", "bells", "cider", "elves", "goose", "holly", "jesus", "merry", "myrrh", "party", "skate", "visit", "candle", "creche", "cookie", "eggnog", "family", "frosty", "icicle", "joyful", "manger", "season", "spirit", "tinsel", "turkey", "unwrap", "wonder", "winter", "wreath", "charity", "chimney", "festive", "holiday", "krampus", "mittens", "naughty", "package", "pageant", "rejoice", "rudolph", "scrooge", "snowman", "sweater", "tidings", "firewood", "nativity", "reindeer", "shopping", "snowball", "stocking", "toboggan", "trimming", "vacation", "wise men", "workshop", "yuletide", "chestnuts", "christmas", "fruitcake", "greetings", "mince pie", "mistletoe", "ornaments", "snowflake", "tradition", "candy cane", "decoration", "ice skates", "jack frost", "north pole", "nutcracker", "saint nick", "yule log", "card", "jolly", "hope", "scarf", "candy", "sleigh", "parade", "snowy", "wassail", "blizzard", "noel", "partridge", "give", "carols", "tree", "fireplace", "socks", "lights", "kings", "goodwill", "sugarplum", "bonus", "coal", "snow", "happy", "presents", "pinecone"];
    const original_fetch = unsafeWindow.fetch;
    const gameHelper = {
        "state": "Inactive",
        "html": "",
        "start": function () {
            if (!document.querySelector(".ctHelperGameBox")) {
                const node = document.createElement("div");
                node.className = "ctHelperGameBox";
                const reference = document.querySelector(".ct-wrap");
                reference.parentNode.insertBefore(node, reference);
            }
            document.querySelector(".ctHelperGameBox").innerHTML = `<div class="hardyCTHeader">${this.state} Helper</div><div class="hardyGameBoxContent"></div>`;
        },
        "fixWord": function () {
            if (metadata.settings.games.wordFix) {
                const jumbled = metadata.settings.games.wordFix;
                metadata.settings.games.wordFix = false;
                let wordSolution = null;
                for (const word of wordList) {
                    if (sortWord(word) === sortWord(jumbled)) {
                        wordSolution = word.toUpperCase();
                        break;
                    }
                }
                if (!wordSolution) {
                    GM_setClipboard(`CT Helper Normal Version: ${version}\nFailed to find a solution for WordFixer game for the word: ${jumbled}`);
                    wordSolution = `No solution found. The word has been copied to your clipboard. Kindly <a href="https://www.torn.com/messages.php#/p=compose&XID=2131687">mail</a> it to me(<a href="https://www.torn.com/profiles.php?XID=2131687">Father[2131687]</a>), so that I can look further into this issue.`;
                    this.html = `<label class="ctHelperError">${wordSolution}</label>`;
                    this.update();
                } else {
                    this.html = `<label class="ctHelperSuccess">${wordSolution}</label>`;
                    this.update();
                }
            }
        },
        "update": function () {
            const node = document.querySelector(".hardyGameBoxContent");
            if (node) {
                node.innerHTML = this.html;
                this.html = "";
            }
        },
        "stop": function () {
            const node = document.querySelector(".ctHelperGameBox");
            if (node) {
                node.remove();
            }
            if (this.state === "Word Fixer") {
                metadata.settings.games.wordFix = false;
            } else if (this.state === "Hangman") {
                metadata.cache.hangman.len = false;
                metadata.cache.hangman.list = [];
                metadata.cache.hangman.chars = [];
            } else if (this.state === "Typocalypse") {
                try {
                    clearInterval(cdForTypingGame);
                } catch (error) {
                    console.log(`CT Helper: ${error}`);
                }
            }
            this.state = "Inactive";
            this.html = "";
            this.garlandAssembleGrid = {};
            this.garlandAssembleGrid_solved = {};
        },
        "hangman_charLength": function () {
            const lengthList = metadata.cache.hangman.len;
            if (lengthList.length > 1) {
                const numOfWords = lengthList.length;
                let termLength = 0;
                for (const length of lengthList) {
                    termLength += length;
                }
                termLength += numOfWords - 1;
                const array = [];
                for (const word of wordList) {
                    if (word.length === termLength) {
                        const wordSplit = word.split(" ");
                        if (wordSplit.length === numOfWords) {
                            let isValid = true;
                            for (let index = 0; index < numOfWords; index++) {
                                if (wordSplit[index].length !== lengthList[index]) {
                                    isValid = false;
                                    break;
                                }
                            }
                            if (isValid) {
                                array.push(word.toUpperCase());
                            }
                        }
                    }
                }
                metadata.cache.hangman.list = array;
            } else {
                const len = lengthList[0];
                const array = [];
                for (const word of wordList) {
                    if (word.length === len && !word.split(" ")[1]) {
                        array.push(word.toUpperCase());
                    }
                }
                metadata.cache.hangman.list = array;
            }
            this.hangman_suggestion();
        },
        "hangman_suggestion": function () {
            const obj = {};
            const list = metadata.cache.hangman.list;
            for (const word of list) {
                const letters = getUniqueLetter(word.replace(/\s/g, "").split(""));
                for (const letter of letters) {
                    if (obj[letter]) {
                        obj[letter] += 1;
                    } else {
                        obj[letter] = 1;
                    }
                }
            }
            const sortable = [];
            const list_len = list.length
            for (const key in obj) {
                sortable.push([key, obj[key], String(+((obj[key] / list_len) * 100).toFixed(2)) + "% chance"]);
            }
            sortable.sort(function (a, b) {
                return b[1] - a[1];
            });
            const lettersArray = [];
            const limit = Math.min(5, sortable.length);
            for (let mkl = 0; mkl < limit; mkl++) {
                const letter = sortable[mkl];
                lettersArray.push(`${letter[0].toUpperCase()} <label class="helcostrDoesntLikeGreenCommas">(${letter[2]})</label>`);
            }
            this.html = `<p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Possible Solutions</p><p class="ctHelperSuccess">${list.join('<label class="helcostrDoesntLikeGreenCommas">, </label>')}</p><p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Suggested Letters</p><p class="ctHelperSuccess">${lettersArray.join('<label class="helcostrDoesntLikeGreenCommas">, </label>')}</p>`;
            this.update();
        },
        'gameTypocalypseStart': function () {
            document.querySelector(".hardyGameBoxContent").addEventListener("click", (e) => {
                const target = e.target;
                if (target.className === "hardyCTTypoAnswer") {
                    const input = document.querySelector("div[class^='game'] div[class^='board'] input");
                    if (input) {
                        input.value = target.getAttribute("hardy").replace("-", " ");//the answer that has to be typed
                        const event = new Event('input', { bubbles: true });
                        const tracker = input._valueTracker;
                        if (tracker) {
                            tracker.setValue('');
                        }
                        input.dispatchEvent(event);
                    }
                }
            });
            cdForTypingGame = setInterval(() => {
                const boxes = document.querySelectorAll("div[class^='game'] div[class^='board'] div[class^='gift']");
                const length = boxes.length;
                const array = [];
                if (length > 0) {
                    for (const gift of boxes) {
                        let phrase = gift.innerText;
                        phrase = phrase.replace(" ", "-")
                        array.push(`<button class="hardyCTTypoAnswer" hardy="${phrase}">${phrase}</button>`);
                    }
                    array.reverse();
                }
                this.html = array.join("");
                this.update();
            }, 500);
        },
        "garlandAssembleSolve": function (gridData) {
            const instance = new GarlandSolver(gridData);
            gameHelper.html = `Solving...`
            gameHelper.update();
            instance.solve()
                .then(solution => {
                    const clicks = calculateClicks(gridData, solution);
                    garlandColor(clicks);
                    gameHelper.html = `<label class="ctHelperSuccess">Solve the puzzle by continuously clicking on yellow tiles until they no longer appear yellow.</label> However, click slowly to avoid unnecessary clicks. Do not interact with any other tiles.`;
                    gameHelper.update();
                }).catch(error => {
                    const message = error.message;
                    if (error ===  "No solution found.") {
                        GM_setClipboard(`CT Helper Normal Version: ${version}\nFailed to find a solution for Garland Assemble game: ${JSON.stringify(gridData)}`);
                        gameHelper.html = `<label class="ctHelperError">No solution found. The puzzle grid information has been copied to your clipboard. Paste it in a <a href="https://pastebin.com/" target="_blank">Pastebin</a> or any other text pasting site you like and send it to me(<a href="https://www.torn.com/profiles.php?XID=2131687">Father[2131687]</a>) so that I can look further into this issue.</label>`;
                    } else {
                        gameHelper.html = `<label class="ctHelperError">Failed to solve the puzzle. The error message is: ${message}  </label>`;
                    }
                    gameHelper.update();
                });

        }


    }
    const chirp_sound = {
        "getLast": function () {
            const last_chirp = GM_getValue("last_chirp", 0);
            metadata.cache.last_chirp = last_chirp;
        },
        "setLast": function () {
            metadata.cache.last_chirp = Math.round(Date.now() / 1000);
            GM_setValue("last_chirp", metadata.cache.last_chirp);
        },
        "play": function () {
            if (saved.checkbox.chirp_alert_ct === "yes") {
                const last_chirp = metadata.cache.last_chirp;
                const now = Math.round(Date.now() / 1000);
                const diff = now - last_chirp;
                if (diff >= 60) {
                    chirp.play();
                    chirp_sound.setLast();
                }
            }
        }
    }

    GM_addStyle(`
#map { position: relative !important; }
#hardy_ct_direction_overlay { position: absolute; inset: 0; pointer-events: none; z-index: 9999; }
#hardy_ct_direction_overlay svg { width: 100%; height: 100%; }
.hardyNearbyActive { border: 2px solid #39ff14 !important; box-shadow: 0 0 10px #39ff14 !important; }
.hardyNearbyFlicker { animation: hardyNearbyFlicker 1s step-start infinite; }
@keyframes hardyNearbyFlicker {
  0%, 49% { border-color: #39ff14; box-shadow: 0 0 10px #39ff14; }
  50%, 100% { border-color: transparent; box-shadow: none; }
}
`);
    /////
    initiate();

    unsafeWindow.fetch = async (url, init) => {
        const response_ = await original_fetch(url, init);
        const urlStr = typeof url === "string" ? url : (url && url.url ? url.url : "");
        const shouldParse = urlStr.includes("christmas_town.php?q=move") ||
            urlStr.includes("christmas_town.php?q=initMap") ||
            urlStr.includes("christmas_town.php?q=miniGameAction") ||
            urlStr.includes("q=openChest");

        if (!shouldParse) return response_;

        const response = response_.clone();
        response.json().then((data) => {
            if (urlStr.includes("christmas_town.php?q=move") || urlStr.includes("christmas_town.php?q=initMap")) {
                if (gameHelper.state !== "Inactive") {
                    gameHelper.stop();
                }
                if (data.mapData) {
                    if (data.mapData.items) {
                        let items = data.mapData.items;
                        if (items.length > 0) {
                            metadata.settings.count = 1;
                            const itemArray = [];
                            const chestArray = [];
                            let mysteryFound = false;
                            let comboFound = false;
                            for (const item of items) {
                                const { image, position } = item;
                                const info = ctHelperGetInfo(image.url);
                                if (["chests", "combo_chest"].includes(info.type)) {
                                    if (info.type === "combo_chest") comboFound = true;
                                    chestArray.push([info.name, position.x, position.y, info.index]);
                                } else {
                                    if (info.type === "items" || info.type === "chest_keys") mysteryFound = true;
                                    itemArray.push([info.name, position.x, position.y]);
                                }
                            }
                            chestArray.sort((a, b) => a[3] - b[3]);
                            ctHelperChangeHTML(itemArray, "hardyNearbyItems", "Nearby Items");
                            ctHelperChangeHTML(chestArray, "hardyNearbyChests", "Nearby Chests");
                            highlightItems();
                            setNearbyBoxState("hardyNearbyItems", itemArray.length > 0, mysteryFound && saved.checkbox.nearby_item_flicker === "yes");
                            setNearbyBoxState("hardyNearbyChests", chestArray.length > 0, comboFound && saved.checkbox.combo_chest_flicker === "yes");
                            scheduleDirectionOverlayUpdate();
                            chirp_sound.play();
                        } else {
                            if (metadata.settings.count == 1) {
                                document.querySelector(".hardyNearbyChests").innerHTML = '<label>Nearby Chests(0)</label><div class="content"></div>';
                                document.querySelector(".hardyNearbyItems").innerHTML = '<label>Nearby Items(0)</label><div class="content"></div>';
                                metadata.settings.count = 0;
                                setNearbyBoxState("hardyNearbyItems", false, false);
                                setNearbyBoxState("hardyNearbyChests", false, false);
                                clearDirectionOverlay();
                            }
                        }
                    }
                    if (data.mapData.inventory && data.mapData.inventory.length > 0) {
                        metadata.cache.spawn_rate = 0;
                        metadata.cache.speed_rate = 0;
                        for (const item of data.mapData.inventory) {
                            if (item.category === "ornaments") {
                                if (item.modifierType === "itemSpawn") {
                                    metadata.cache.spawn_rate += item.modifier;
                                } else if (item.modifierType === "speed") {
                                    metadata.cache.speed_rate += item.modifier;
                                }
                            }
                        }
                        updateModifierText();
                    }
                    if (data.mapData.trigger && data.mapData.trigger.item) {
                        const trigger = data.mapData.trigger;
                        if (trigger.message.includes("You find")) {
                            const itemUrl = trigger.item.image.url;
                            const regx = /\/images\/items\/([0-9]+)\/large\.png/g;
                            if (regx.test(itemUrl)) {
                                const itemId = itemUrl.split("/")[3];
                                const savedData = getRecordedPrizes();
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                                setRecordPrizes(savedData);
                            }
                        }
                    }
                    if (data.mapData.cellEvent && data.mapData.cellEvent.prizes && data.mapData.cellEvent.prizes.length > 0) {
                        const savedData = getRecordedPrizes();
                        for (const prize of data.mapData.cellEvent.prizes) {
                            if (prize.category === "tornItems") {
                                const itemId = prize.type;
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                            }
                        }
                        setRecordPrizes(savedData);
                    }
                    highlightNPC();
                }
            } else if (urlStr.includes("christmas_town.php?q=miniGameAction")) {
                let body = false;
                if (init && init.body) {
                    body = JSON.parse(init.body);
                }
                if (data.prizes && data.prizes.length > 0) {
                    const savedData = getRecordedPrizes();
                    for (const prize of data.prizes) {
                        if (prize.category === "tornItems") {
                            const itemId = prize.type;
                            if (savedData.items[itemId]) {
                                savedData.items[itemId] += 1;
                            } else {
                                savedData.items[itemId] = 1;
                            }
                        }
                    }
                    setRecordPrizes(savedData);
                }
                if (body && body.action && body.action === "start") {
                    if (body.gameType) {
                        const gameType = body.gameType;
                        if (gameType === "gameWordFixer" && saved.checkbox.word_fixer === "yes") {
                            gameHelper.state = "Word Fixer";
                            gameHelper.start();
                            metadata.settings.games.wordFix = data.progress.word;
                            gameHelper.fixWord();
                        } else if (gameType === "gameHangman" && saved.checkbox.hangman === "yes") {
                            gameHelper.state = "Hangman";
                            gameHelper.start();
                            metadata.cache.hangman.len = data.progress.words;
                            gameHelper.hangman_charLength();
                        } else if (gameType === "gameTypocalypse" && saved.checkbox.typoGame === "yes") {
                            if (gameHelper.state !== "Typocalypse") {
                                gameHelper.state = "Typocalypse";
                                gameHelper.start();
                                gameHelper.gameTypocalypseStart();
                            }
                        } else if (gameType === "gameGarlandAssemble" && saved.checkbox.garland === "yes") {
                            gameHelper.state = "Garland Assemble";
                            gameHelper.start();
                            setTimeout(() => gameHelper.garlandAssembleSolve(data)
                                , 500);
                        }
                    }
                } else {
                    if (gameHelper.state === "Word Fixer") {
                        if (data.finished) {
                            gameHelper.stop();
                        } else {
                            if (data.progress && data.progress.word) {
                                metadata.settings.games.wordFix = data.progress.word;
                                gameHelper.fixWord();
                            }
                        }
                    } else if (gameHelper.state === "Hangman") {
                        if (data.mistakes === 6 || data.message.startsWith("Congratulations")) {
                            gameHelper.stop();
                        } else {
                            const letter = body.result.character.toUpperCase();
                            metadata.cache.hangman.chars.push(letter);
                            if (data.positions.length === 0) {
                                const array = [];
                                for (const word of metadata.cache.hangman.list) {
                                    if (word.indexOf(letter) === -1) {
                                        array.push(word);
                                    }
                                }
                                metadata.cache.hangman.list = array;
                                gameHelper.hangman_suggestion();
                            } else {
                                const array = [];
                                const positions = data.positions;
                                const length = positions.length;
                                for (const word of metadata.cache.hangman.list) {
                                    let index = 0;
                                    for (const position of positions) {
                                        if (word[position] === letter) {
                                            index += 1;
                                        }
                                    }
                                    if (index === length && countLetter(word, letter) == length) {
                                        array.push(word);
                                    }
                                }
                                metadata.cache.hangman.list = createUniqueArray(array);
                                gameHelper.hangman_suggestion();
                            }
                        }
                    }
                }
            } else if (urlStr.includes("q=openChest")) {
                if (data.status && data.status === "success" && data.prizes && data.prizes.length > 0) {
                    const savedData = getRecordedPrizes();
                    for (const prize of data.prizes) {
                        if (prize.category === "tornItems") {
                            const itemId = prize.type;
                            if (savedData.items[itemId]) {
                                savedData.items[itemId] += 1;
                            } else {
                                savedData.items[itemId] = 1;
                            }
                        }
                    }
                    setRecordPrizes(savedData);
                }
            }
        }).catch(() => {});

        return response_;
    }
///////////////////functions/////////////////////
    function ctHelperGetInfo(link) {
        let type = "items";
        const categories = ["/keys/", "/chests/", "/combinationChest/"];
        for (const category of categories) {
            if (link.indexOf(category) !== -1) {
                const typetxt = category.replace(/\//g, "");
                if (typetxt === "combinationChest") type = "combo_chest";
                else if (typetxt === "keys") type = "chest_keys";
                else if (typetxt === "chests") type = "chests";
                break;
            }
        }
        let name, index;
        switch (type) {
            case "chest_keys":
                if (link.includes("bronze")) name = "Bronze Key";
                else if (link.includes("gold")) name = "Golden Key";
                else if (link.includes("silver")) name = "Silver Key";
                break;
            case "chests":
                if (link.includes("1.gif")) { name = "Gold Chest"; index = 0; }
                else if (link.includes("2.gif")) { name = "Silver Chest"; index = 1; }
                else if (link.includes("3.gif")) { name = "Bronze Chest"; index = 3; }
                break;
            case "combo_chest":
                name = "Combination Chest";
                index = 2;
                break;
            default:
                name = "Mystery Gift";
        }
        return { type, name, index };
    }
    function ctHelperChangeHTML(array, selector, label) {
        const length = array.length;
        const content = length ? array.map(element => `<p>${element[0]} at ${element[1]}, ${element[2]}&nbsp;</p>`).join("") : "";
        document.querySelector(`.${selector}`).innerHTML = `<label>${label}(${length})</label><div class="content">${content}</div>`;
    }
    
    function setNearbyBoxState(boxClass, active, flicker) {
        const el = document.querySelector(`.${boxClass}`);
        if (!el) return;
        if (active) {
            el.classList.add("hardyNearbyActive");
            if (flicker) el.classList.add("hardyNearbyFlicker");
            else el.classList.remove("hardyNearbyFlicker");
        } else {
            el.classList.remove("hardyNearbyActive");
            el.classList.remove("hardyNearbyFlicker");
        }
    }

    function scheduleDirectionOverlayUpdate() {
        if (metadata.cache.directionOverlayTimer) return;
        metadata.cache.directionOverlayTimer = setTimeout(() => {
            metadata.cache.directionOverlayTimer = null;
            updateDirectionOverlay();
        }, 50);
    }

    function getMapElement() {
        return document.querySelector("#map") || document.querySelector("#user-map") || document.querySelector(".user-map") || null;
    }

    function getYouElement() {
        let el = document.querySelector(".users-layer .img-wrap.you");
        if (el) return el;
        const users = document.querySelectorAll(".users-layer .ct-user");
        for (const u of users) {
            const img = u.querySelector(".img-wrap.you");
            if (img) return img;
        }
        return null;
    }

    function ensureDirectionOverlay(mapEl) {
        let overlay = document.querySelector("#hardy_ct_direction_overlay");
        if (!overlay) {
            overlay = createElement("div", { id: "hardy_ct_direction_overlay" });
            overlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"></svg>`;
            mapEl.appendChild(overlay);
        } else if (overlay.parentElement !== mapEl) {
            overlay.remove();
            return ensureDirectionOverlay(mapEl);
        }
        return overlay.querySelector("svg");
    }

    function clearDirectionOverlay() {
        const svg = document.querySelector("#hardy_ct_direction_overlay svg");
        if (svg) svg.innerHTML = "";
    }

    function updateDirectionOverlay() {
        const mapEl = getMapElement();
        if (!mapEl) return;
        const mapRect = mapEl.getBoundingClientRect();
        if (!mapRect.width || !mapRect.height) return;

        const youEl = getYouElement();
        if (!youEl) { clearDirectionOverlay(); return; }

        const items = document.querySelectorAll(".items-layer .ct-item");
        if (!items.length) { clearDirectionOverlay(); return; }

        const svg = ensureDirectionOverlay(mapEl);
        svg.setAttribute("viewBox", `0 0 ${mapRect.width} ${mapRect.height}`);
        svg.innerHTML = "";

        const youRect = youEl.getBoundingClientRect();
        const ox = (youRect.left + youRect.width / 2) - mapRect.left;
        const oy = (youRect.top + youRect.height / 2) - mapRect.top;

        for (const item of items) {
            const img = item.querySelector("img");
            if (!img) continue;
            const rect = item.getBoundingClientRect();
            const tx = (rect.left + rect.width / 2) - mapRect.left;
            const ty = (rect.top + rect.height / 2) - mapRect.top;

            const dx = tx - ox;
            const dy = ty - oy;
            const dist = Math.hypot(dx, dy);
            if (!dist || dist < 10) continue;
            const ux = dx / dist;
            const uy = dy / dist;

            const startOffset = 12;
            const arrowLen = Math.min(60, Math.max(18, dist - startOffset));
            const x1 = ox + ux * startOffset;
            const y1 = oy + uy * startOffset;
            const x2 = ox + ux * (startOffset + arrowLen);
            const y2 = oy + uy * (startOffset + arrowLen);

            const info = ctHelperGetInfo(img.src);
            let color = "#39ff14";
            if (info.type === "items") color = "#ff2d2d";
            else if (info.type === "chest_keys") color = "#39ff14";
            else if (info.type === "combo_chest") color = "#2d7dff";
            else if (info.type === "chests") color = "#ff9f1a";

            svgDrawArrow(svg, x1, y1, x2, y2, color);
        }
    }

    function svgDrawArrow(svg, x1, y1, x2, y2, color) {
        const svgns = "http://www.w3.org/2000/svg";
        const line = document.createElementNS(svgns, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-linecap", "round");
        line.style.filter = `drop-shadow(0 0 6px ${color})`;
        svg.appendChild(line);

        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 10;
        const headAngle = Math.PI / 7;
        const hx1 = x2 - headLen * Math.cos(angle - headAngle);
        const hy1 = y2 - headLen * Math.sin(angle - headAngle);
        const hx2 = x2 - headLen * Math.cos(angle + headAngle);
        const hy2 = y2 - headLen * Math.sin(angle + headAngle);

        const poly = document.createElementNS(svgns, "polygon");
        poly.setAttribute("points", `${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`);
        poly.setAttribute("fill", color);
        poly.style.filter = `drop-shadow(0 0 6px ${color})`;
        svg.appendChild(poly);
    }

function initiate() {
        if (window.location.href.includes("page=ctitemsFound")) {
            createItemsTable();
        } else {
            createStorage();
            addBox();
            window.addEventListener("resize", scheduleDirectionOverlayUpdate);
            highlighter_css()
            gamesHelper_css();
            getItemInfoFromSheet()
            //pruneOldFinds();
        }
    }
    function updateModifierText() {
        setTimeout(() => {
            document.querySelector(".ctHelperSpawnRate").innerHTML = `You have a spawn rate bonus of ${metadata.cache.spawn_rate}%.`;
            document.querySelector(".ctHelperSpeedRate").innerHTML = `You have a speed rate bonus of ${metadata.cache.speed_rate}%.`;
        }, 3000);
    }
    function addBox() {
        if (!document.querySelector(".hardyCTBox")) {
            waitForElement("#christmastownroot div[class^='appCTContainer']", 900, 999, "dhjdvefvasvduqwdufdevshacqweu").then((element) => {
                const newBox = createElement("div", { 'class': 'hardyCTBox' });
                newBox.innerHTML = `<div class="hardyCTHeader">Christmas Town Helper</div> <div class="hardyCTContent"> <div style="display: flex; align-items: center; justify-content: space-between;"> <div style="flex-grow: 1; text-align: center;"> <p class="ctHelperSpawnRate ctHelperSuccess">&nbsp;</p> <p class="ctHelperSpeedRate ctHelperSuccess">&nbsp;</p> </div> <button class="ctRecordLink"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"> <path fill="currentColor" d="M8 6a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM7 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm3.618-3.602a.708.708 0 0 1-.824-.567l-.26-1.416a.354.354 0 0 0-.275-.282a6.072 6.072 0 0 0-2.519 0a.354.354 0 0 0-.275.282l-.259 1.416a.71.71 0 0 1-.936.538l-1.359-.484a.355.355 0 0 0-.382.095a5.99 5.99 0 0 0-1.262 2.173a.352.352 0 0 0 .108.378l1.102.931a.704.704 0 0 1 0 1.076l-1.102.931a.352.352 0 0 0-.108.378A5.986 5.986 0 0 0 3.53 12.02a.355.355 0 0 0 .382.095l1.36-.484a.708.708 0 0 1 .936.538l.258 1.416c.026.14.135.252.275.281a6.075 6.075 0 0 0 2.52 0a.353.353 0 0 0 .274-.281l.26-1.416a.71.71 0 0 1 .936-.538l1.359.484c.135.048.286.01.382-.095a5.99 5.99 0 0 0 1.262-2.173a.352.352 0 0 0-.108-.378l-1.102-.931a.703.703 0 0 1 0-1.076l1.102-.931a.352.352 0 0 0 .108-.378A5.985 5.985 0 0 0 12.47 3.98a.355.355 0 0 0-.382-.095l-1.36.484a.71.71 0 0 1-.111.03Zm-6.62.58l.937.333a1.71 1.71 0 0 0 2.255-1.3l.177-.97a5.105 5.105 0 0 1 1.265 0l.178.97a1.708 1.708 0 0 0 2.255 1.3L12 4.977c.255.334.467.698.63 1.084l-.754.637a1.704 1.704 0 0 0 0 2.604l.755.637a4.99 4.99 0 0 1-.63 1.084l-.937-.334a1.71 1.71 0 0 0-2.255 1.3l-.178.97a5.099 5.099 0 0 1-1.265 0l-.177-.97a1.708 1.708 0 0 0-2.255-1.3L4 11.023a4.987 4.987 0 0 1-.63-1.084l.754-.638a1.704 1.704 0 0 0 0-2.603l-.755-.637a5.06 5.06 0 0 1 .63-1.084Z"></path> </svg> </button> </div> <div class="nearby-items-chests"> <div class="hardyNearbyItems"> <label>Nearby Items(0)</label> <div class="content"></div> </div> <div class="hardyNearbyChests"> <label>Nearby Chests(0)</label> <div class="content"></div> </div> </div> </div>`;
                element.insertBefore(newBox, element.firstChild.nextSibling);
                newBox.querySelector(".ctRecordLink").addEventListener("click", (event) => {
                    createPreferencesBox('#hardy_pref_box_q-links');
                })
                metadata.settings.spawn = 1;
                metadata.settings.speed = 1;
            }).catch(error => {
                console.log(error);
            });
        }
        let pageUrl = window.location.href;
        if (pageUrl.includes("mapeditor") || pageUrl.includes("parametereditor") || pageUrl.includes("mymaps")) {
            document.querySelector(".hardyCTBox").style.display = "none";
        } else {
            const box = document.querySelector(".hardyCTBox")
            if (box) {
                box.style.display = "block";
            }
        }
        //hideDoctorn(); TODOOO
    }
    function highlightItems() {
        const items = document.querySelectorAll(".items-layer .ct-item");
        const obj = { "Mystery Gift": "items", "Gold Chest": "gold_chest", "Silver Chest": "silver_chest", "Bronze Chest": "bronze_chest", "Combination Chest": "combo_chest", "Golden Key": "chest_keys", "Silver Key": "chest_keys", "Bronze Key": "chest_keys" };
        for (const item of items) {
            const link = item.querySelector("img").src;
            const info = ctHelperGetInfo(link);
            const name = info.name;
            const key = obj[name];
            if (key && saved.checkbox[key] === "yes") {
                item.setAttribute(`hardy_highlight_${key}`, "yes");
            }
        }
    }
    function highlighter_css() {
        const to_be_highlighted_items = [];
        const array = [];
        for (const element of ["items", "gold_chest", "combo_chest", "silver_chest", "bronze_chest", "chest_keys"]) {
            if (saved.checkbox[element] === "yes") {
                to_be_highlighted_items.push(`.items-layer .ct-item[hardy_highlight_${element}="yes"]`);
                array.push(element);
            }
        }
        if (to_be_highlighted_items.length > 0) {
            const elementsAll = to_be_highlighted_items.join(", ");
            const styleAll = ` {
                position: absolute;
                border-radius: 50%;
                animation: 2s ease-in-out infinite pulse;
            }
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: .5;
                }
                50% {
                    transform: scale(1.8);
                    opacity: .8;
                }
            }`;
            let styleString = ``;
            for (const element of array) {
                const color = saved.color[`color_${element}`];
                styleString += `
                .items-layer .ct-item[hardy_highlight_${element}="yes"] {
                    border: 10px solid ${color};
                }`;
            }
            styleString += `${elementsAll} ${styleAll}`;
            GM_addStyle(styleString);
        }
        const to_be_highlighted_npcs = [];
        if (saved.checkbox["highlight_santa"] === "yes") {
            to_be_highlighted_npcs.push(".ct-user[npctype='santa']");
        }
        if (saved.checkbox["highlight_npc"] === "yes") {
            to_be_highlighted_npcs.push(".ct-user[npctype='other']");
        }
        if (to_be_highlighted_npcs.length > 0) {
            const elementsAll = to_be_highlighted_npcs.join(", ");
            const styleAll = '{position:relative;z-index:10}';
            let styleString = `${elementsAll} ${styleAll}`;
            styleString += `.ct-user[npctype='santa']::before, .ct-user[npctype='other']::before `;
            styleString += ` {content:"";position:absolute;top:50%;left:50%;width:70px;height:70px;border-radius:50%;transform:translate(-50%,-50%);animation:1.5s ease-in-out infinite pulse-santa;pointer-events:none} @keyframes pulse-santa{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.8}50%{transform:translate(-50%,-50%) scale(1.8);opacity:.4}}`;
            styleString += `.ct-user[npctype='santa']::before {border: 30px solid ${saved.color["color_highlight_santa"]};} .ct-user[npctype='other']::before {border: 30px solid ${saved.color["color_highlight_npc"]};}`;
            GM_addStyle(styleString);
        }
    }

    function highlightNPC() {
        const npcList = document.querySelectorAll(".ct-user.npc");
        for (const npc of npcList) {
            if (npc.querySelector("svg").getAttribute("fill").toUpperCase() === "#FA5B27") {
                if (saved.checkbox["highlight_santa"] === "yes") {
                    npc.setAttribute("npctype", "santa");
                }
            } else {
                if (saved.checkbox["highlight_npc"] === "yes") {
                    npc.setAttribute("npctype", "other");
                }
            }
        }
    }
    //For Hangman
    function getUniqueLetter(argArray) {
        const newArray = [];
        const array = createUniqueArray(argArray);
        for (const letter of array) {
            if (metadata.cache.hangman.chars.indexOf(letter) === -1) {
                newArray.push(letter);
            }
        }
        return newArray;
    }
    function countLetter(string, letter) {
        const array = string.split("");
        const obj = {};
        obj.count = 0;
        for (const element of array) {
            if (element === letter) {
                obj.count += 1;
            }
        }
        return obj.count;
    }
    /// pre-made functions
    function waitForElement(selector, duration, maxTries, identifier) {
        return new Promise(function (resolve, reject) {
            const value = Math.floor(Math.random() * 1000000000);
            waitObj[identifier] = value;
            let attempts = 0;
            const intervalId = setInterval(() => {
                if (attempts > maxTries) {
                    clearInterval(intervalId);
                    reject(`Selector Listener Expired: ${selector}, Reason: Dead bcoz u didnt cum on time!!!!`);
                } else if (waitObj[identifier] !== value) {
                    clearInterval(intervalId);
                    reject(`Selector Listener Expired: ${selector}, Reason: Dead coz u didnt luv me enough and got another SeLecTor!!!!`);
                }
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
                attempts += 1;
            }, duration);
        });
    }
    function createElement(tagName, attributes) {
        const element = document.createElement(tagName);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }
    function createStorage() {
        const info = GM_getValue("cthelper_hardy_prefs");
        if (!info) {
            saved = {};
            saved.color = {};
            for (const option in options) {
                const type = option;
                if (type === "checkbox") {
                    if (!saved.checkbox) {
                        saved.checkbox = {};
                    }
                    for (const checkbox in options.checkbox) {
                        saved.checkbox[checkbox] = options.checkbox[checkbox].def;
                        if (options.checkbox[checkbox].color) {
                            saved.color[`color_${checkbox}`] = options.checkbox[checkbox].color;
                        }
                    }
                } /*else {
                    if (!saved.misc) {
                        saved.misc = {};
                    }
                    saved.misc[option] = options[option];
                }*/
            }
            savePrefs();
        } else {
            saved = JSON.parse(info);
            for (const title in options.checkbox) {
                if (!saved.checkbox[title]) {
                    saved.checkbox[title] = options.checkbox[title].def;
                }
                if (!saved.color[`color_${title}`] && options.checkbox[title].color) {
                    saved.color[`color_${title}`] = options.checkbox[title].color;
                }
            }
        }
        chirp_sound.getLast();
    }

    function gamesHelper_css() {
        //christmas wreath
        if (saved.checkbox["wreath"] === "yes") {
            GM_addStyle(`img[alt='christmas wreath'] {display: none;}`);
        }
        //snowball shooter
        if (saved.checkbox["snowball_shooter"] === "yes") {
            GM_addStyle(`div[class^='moving-block'] img[alt^='santa'] {display: none;}`);
        }
        //santa clawz
        if (saved.checkbox["santa_clawz"] === "yes") {
            GM_addStyle(`[class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADuy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADu4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADms'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADjr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADSx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADPy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADOx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADLx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADKq'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADCS'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAD03'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACun'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACnk'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACmg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACSe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACGL'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC1U'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC0w'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAByX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAB7g'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACzVBMVEUAAACTM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAADlw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAAD67'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAACnR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADy2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADrw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADlt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADl5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgp'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgo'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADak'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADKx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADJn'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD57'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD16'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAClR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAACdN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAC0R'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAABxW'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKc'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC7lBMVEUAAACXN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADw7'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADvz'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADu6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADsx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADrx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADr1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADpv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADnt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADe6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADc2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADVg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADOv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADLh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADFV'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADEx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD68'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD28'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACup'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACQN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0p'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0l'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABpe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB2V'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB/e'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADt5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADf0'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADcr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADal'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADLv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADJx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACnl'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACWM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACMh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAC+Y'] {display: none;}`);
        }
        GM_addStyle(`div[ct_garland_clicks="num_1"], div[ct_garland_clicks="num_2"], div[ct_garland_clicks="num_3"] {
            background-color: yellow;
            }`);
    }
    function savePrefs() {
        GM_setValue("cthelper_hardy_prefs", JSON.stringify(saved));
    }
    function preferenceHandler(inpType, name, def, opt) {
        if (saved.checkbox[name]) {
            return saved.checkbox[name] === "yes" ? " checked" : "";
        } else {
            saved.checkbox[name] = def;
            return def === "yes" ? " checked" : "";
        }
    }
    function createPreferencesBox(selector) {
        const prefBox = document.querySelector(selector);
        if (!prefBox) {
            const box = createElement("div", { "id": selector, "class": "hardy_modal_dialog" });
            box.innerHTML = `<div class="hardy_modal"><div class="hardy_modal_header"><label>Christmas Town Helper Preferences</label></div><div style="text-align: right;"><button class="hardy_modal_close">Close</button></div><div style="overflow: auto;"><div class="hardy_modal_content"></div><div class="hardy_modal_msg"></div></div></div>`;
            box.querySelector(".hardy_modal_close").addEventListener("click", () => {
                box.remove();
            });
            let html = `<p>Highlighter</p>`;
            const checkboxes = saved.checkbox;
            for (const checkbox in checkboxes) {
                const info = options.checkbox[checkbox].name;
                const color = options.checkbox[checkbox].color;
                html += `<label>${info}: </label>${color ? `<input type="color" name="color_${checkbox}" value="${saved.color[`color_${checkbox}`]}">` : ''}<input type="checkbox" name="${checkbox}" ${preferenceHandler("checkbox", checkbox, options.checkbox[checkbox].def, "")}><br>`;
            }
            console.log(saved);
            //html += `<br><p>Miscellaneous</p><label>API Key(Public): </label><input type="text" name="api_ct" value="${saved.misc.api_ct}"><br>`;
            html += `<button class="hardy-save-prefs">Save</button> <button class="hardy-ct-itemstable">Items Table</button>`;
            box.querySelector(".hardy_modal_content").innerHTML = html;
            const firstgameHelperLabel = box.querySelector('input[name="wreath"]').previousSibling;
            const p = createElement("p", {});
            p.innerText = "Games Helper"
            firstgameHelperLabel.parentNode.insertBefore(p, firstgameHelperLabel);
            const chirpAlertLabel = box.querySelector('input[name="chirp_alert_ct"]').previousSibling;
            const pElement = createElement("p", {});
            pElement.innerText = "Miscellaneous";
            chirpAlertLabel.parentNode.insertBefore(pElement, chirpAlertLabel);
            document.body.insertBefore(box, document.body.firstChild);
            box.querySelectorAll('input[type="color"]').forEach((input) => {
                input.onchange = function () {
                    input.setAttribute("value", this.value);
                };
            });

            box.querySelector(".hardy-save-prefs").addEventListener("click", () => {
                const inputs = box.querySelectorAll("input");
                for (const input of inputs) {
                    const inpType = input.getAttribute("type");
                    const name = input.getAttribute("name");
                    if (inpType === "checkbox") {
                        if (input.checked === true) {
                            saved.checkbox[name] = "yes";
                        } else {
                            saved.checkbox[name] = "no";
                        }
                    } else if (inpType === "color") {
                        saved.color[`${name}`] = document.querySelector(`input[name="${name}"]`).getAttribute("value");
                    }
                    /* else if (inpType === "text") {
                        const value = input.value;
                        if (value === null || value === "" || typeof value === "undefined") {
                            saved.misc[name] = "";
                        } else {
                            saved.misc[name] = value;
                        }
                    } */
                }
                savePrefs();
                box.querySelector(".hardy_modal_msg").innerHTML = `Preferences have been saved successfully!! Refresh page to ensure that the changes are synced properly.`;
            });
            box.querySelector(".hardy-ct-itemstable").addEventListener("click", () => {
                window.location.href = "https://www.torn.com/christmas_town.php#/page=ctitemsFound";
                window.location.reload();
            });
        }
    }
    function sortWord(word) {
        const array = word.toUpperCase().split("");
        array.sort();
        return array.join("");
    }
    function createUniqueArray(array) {
        const newArray = [];
        for (const element of array) {
            if (newArray.indexOf(element) === -1) {
                newArray.push(element);
            }
        }
        return newArray;
    }
    //garland assemble utilities

    function calculateClicks(originalGrid, solutionGrid) {
        let a = 0;
        let b = 0;
        const array = [];
        for (let i = 0; i < 25; i++) {
            let clicks = 0;
            const orig_cell = originalGrid.tails[a][b];
            const sol_cell = solutionGrid.tails[a][b];
            if (orig_cell !== null && sol_cell !== null) {
                const img = orig_cell.imageName;
                if (!img.includes("cross")) {
                    const orig_rot = normaliseRotationValue(orig_cell.rotation, img);
                    const sol_rot = normaliseRotationValue(sol_cell.rotation, img);
                    if (orig_rot !== sol_rot) {
                        if (img.includes("straight")) {
                            clicks += 1;
                        } else if (img.includes("angle")) {
                            if (orig_rot > sol_rot) {
                                clicks += ((360 - orig_rot) / 90) + (sol_rot / 90)
                            } else {
                                clicks += (sol_rot - orig_rot) / 90;
                            }
                        }
                    }
                }
            }
            if (clicks > 0) {
                array.push([a, b, clicks]);
            }
            b += 1;
            if (b === 5) {
                b = 0;
                a += 1;
            }
        }
        return array;
    }
    function normaliseRotationValue(rotation, img) {
        let rot = rotation;
        if (rot >= 360) {
            while (rot >= 360) {
                rot -= 360;
            }
        }
        if (img.includes("straight")) {
            if (rot === 0 || rot === 180) {
                rot = 0;
            } else if (rot === 270 || rot === 90) {
                rot = 90;
            }
        } else if (img.includes("angle")) {
            if (rot === 0) {
                rot = 360;
            }
        }
        return rot;
    }

    function garlandColor(clicks) {
        if (!document.querySelector('div[ct_garland_xy_info="x_0_y_0"]')) {
            clearInterval(cdForGarland);
            const rows = document.querySelectorAll('div[class^="ctMiniGameWrapper"] div[class^="fixedSizeBoard"] div[class^="tileRow"]');
            let a = 0;
            let b = 0;
            for (const row of rows) {
                const cols = row.querySelectorAll('div[class^="tile"]');
                for (const col of cols) {
                    col.setAttribute("ct_garland_xy_info", `x_${a}_y_${b}`);
                    b += 1;
                    if (b === 5) {
                        b = 0;
                        a += 1;
                    }
                }
            }
            for (const click of clicks) {
                const x = click[0];
                const y = click[1];
                const num = click[2];
                const cell = document.querySelector(`div[ct_garland_xy_info="x_${x}_y_${y}"]`);
                if (cell) {
                    cell.setAttribute("ct_garland_clicks", `num_${num}`);
                    cell.addEventListener("click", (e) => {
                        const txt = e.target.getAttribute("ct_garland_clicks");
                        if (txt) {
                            const num = Number(txt.replace("num_", ""));
                            const rem = num - 1;
                            e.target.setAttribute("ct_garland_clicks", `num_${rem}`);
                        }
                    })
                }
            }
            cdForGarland = setInterval(() => {
                garlandColor(clicks)
            }, 2000);
        }
    }
    function getRecordedPrizes() {
        const storedInfo = localStorage.getItem("ctHelperFound") || '{"items":{}}';
        return JSON.parse(storedInfo);
    }
    function setRecordPrizes(obj) {
        localStorage.setItem("ctHelperFound", JSON.stringify(obj));
    }

    function getItemInfoFromSheet() {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbyRfg1Cx2Jm3IuCWASUu8czKeP3wm5jKsie4T4bxwZHzXTmPbaw4ybPRA/exec?key=getItems';
        const updateInterval = 14400;
        const requestTimeout = 20000;
        const lastUpdate = GM_getValue("last_update_item_metadata", 0);
        if ((Date.now() / 1000) - lastUpdate > updateInterval) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                timeout: requestTimeout,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && Array.isArray(data.items)) {
                            let itemsObject = {
                                items: data.items.reduce((acc, item) => {
                                    let [id, name, value] = item;
                                    acc[id] = { name, value };
                                    return acc;
                                }, {})
                            };
                            localStorage.setItem('ctHelperItemInfo', JSON.stringify(itemsObject));
                            GM_setValue("last_update_item_metadata", (Date.now() / 1000));
                        }
                    } catch (error) {
                        console.error('Error processing API response:', error.message);
                    }
                },
                onerror: function () {
                    console.error('Request failed. Unable to fetch item data.');
                },
                ontimeout: function () {
                    console.error('Request timed out.');
                }
            });
        }
    }
    function createItemsTable() {
        waitForElement(".content-wrapper", 1000, 40, "bdhhfbjvefefnleirfv").then(() => {
            if (document.querySelector('.hardyCTBox2')) return;

            const wrapper = document.querySelector('.content-wrapper');
            const container = document.createElement('div');
            container.className = 'hardyCTBox2';
            container.innerHTML = '<div class="hardyCTTable" style="overflow-x:auto;"></div><button id="hardyctHelperdelete">Delete Finds</button><button id="go_to_ct">Go back to Christmas Town</button><div class="hardyCTtextBox"></div>';
            wrapper.appendChild(container);
            container.addEventListener('click', handleButtonClick);
            populateItemTable();
            setTimeout(() => {
                const table = document.querySelector('#hardyCTTable-items-Found');
                if (table) {
                    const instance = new SourTable(table, [0]);
                    instance.initiate();
                    instance.sort(4, "desc");
                }
            }, 1000);


            function handleButtonClick(e) {
                const { id } = e.target;

                if (id === 'hardyctHelperdelete') {
                    updateTextBox(
                        `<p>Are you sure you want to delete the finds data?</p>
                     <button id="hardyCTConfirmDelete">Yes</button>
                     <button id="hardyCTNoDelete">No</button>`
                    );
                } else if (id === 'hardyCTConfirmDelete') {
                    clearSavedData();
                } else if (id === 'hardyCTNoDelete') {
                    updateTextBox('');
                } else if (id === 'go_to_ct') {
                    window.location.href = 'https://www.torn.com/christmas_town.php';
                }
            }

            function updateTextBox(content) {
                const textBox = document.querySelector('.hardyCTtextBox');
                if (textBox) textBox.innerHTML = content;
            }

            function clearSavedData() {
                localStorage.setItem('ctHelperFound', JSON.stringify({ items: {} }));
                updateTextBox('<label class="ctHelperSuccess">Data deleted!</label>');
                clearTableContent();
            }

            function clearTableContent() {
                const table = document.querySelector('.hardyCTTable');
                if (table) table.innerHTML = '';
            }

            function populateItemTable() {
                const itemData = localStorage.getItem('ctHelperItemInfo');
                const marketValueData = itemData ? JSON.parse(itemData) : null;

                if (!marketValueData) {
                    showErrorMessage(
                        'Unable to get data from the spreadsheet. Kindly refresh the page. Contact Father [2131687] if the problem persists.'
                    );
                    return;
                }

                const savedData = getRecordedPrizes();
                if (!Object.keys(savedData.items).length) {
                    showErrorMessage("You haven't found any items yet. Try again later!");
                    return;
                }

                displayItemTable(savedData.items, marketValueData.items);
            }

            function showErrorMessage(message) {
                document.querySelector('.hardyCTtextBox').innerHTML = `<label class="ctHelperError">${message}</label>`;
            }

            function displayItemTable(savedItems, marketItems) {
                let calc = { totalValue: 0, count: 0 };
                const rows = Object.entries(savedItems)
                    .map(([id, count]) => {
                        const item = marketItems[id];
                        const price = count * item.value;
                        calc.totalValue += price;
                        calc.count += count;

                        return `
                        <tr>
                            <td><img src="/images/items/${id}/medium.png" alt="${item.name}"></td>
                            <td><label>${item.name}</label></td>
                            <td><label>${count}</label></td>
                            <td><label>$${formatNumber(item.value)}</label></td>
                            <td><label>$${formatNumber(price)}</label></td>
                        </tr>`;
                    })
                    .sort((a, b) => b.price - a.price);

                document.querySelector('.hardyCTTable').innerHTML = `
                <table id="hardyCTTable-items-Found">
                <thead>
                    <tr><th>Image</th><th>Item Name</th><th>Amount</th><th>Price</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                    ${rows.join('')}
                    </tbody>
                </table>
                <p>Total value: $${formatNumber(calc.totalValue)}</p>
                <p>Number of Items: ${calc.count}</p>
                <p>Average value of an item: $${formatNumber(Math.round(calc.totalValue / calc.count))}</p>`;
            }
        })
    }

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function pruneOldFinds() {
        const last_prune = GM_getValue("last_prune");
        const stamp = Math.round(Date.now() / 1000);
        if (last_prune === null || typeof last_prune == "undefined" || last_prune == 0) {
            GM_setValue("last_prune", stamp);
        } else {
            if ((stamp - last_prune) >= 7776000) {
                localStorage.setItem('ctHelperFound', JSON.stringify({ items: {} }));
                GM_setValue("last_prune", stamp);
            }
        }
    }
    const innerWidth = window.innerWidth;
    if (innerWidth <= 600) {
        // General
        GM_addStyle(`.ct-user-wrap .user-map:before { display: none; }
.hardyGameBoxContent { background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 0 0 10px 10px; max-height: 150px; margin-bottom: 5px; padding: 10px; }
.helcostrDoesntLikeGreenCommas { color: black; }
.hardyCTBox { background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 10px; max-height: 250px; }
.hardyCTHeader { background-color: #200505; color: #f2f2f2; padding: 6px; font-size: 1.5em; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0; }
.hardyCTContent { padding: 10px; font-size: 1.2em; }
.ctRecordLink { color: #121212; border: none; padding: 8px; cursor: pointer; }
.nearby-items-chests { display: flex; justify-content: space-between; margin-top: 10px; }
.hardyNearbyItems, .hardyNearbyChests { background-color: #f9f9f9; padding: 5px; border: 1px solid #ddd; border-radius: 8px; flex: 1;}
.hardyNearbyItems { margin-right: 5px; }
.hardyNearbyChests { margin-left: 5px; }
.hardyNearbyItems label, .hardyNearbyChests label { display: block; text-align: center; font-weight: bold; font-size: 1.1em; }
.hardyNearbyItems .content, .hardyNearbyChests .content { padding: 10px; border-radius: 5px; text-align: left; font-size: 0.7em; line-height: 1.1; overflow-y: auto; max-height: 80px; }
.ctHelperSuccess { color: green; font-weight: bold; }
.hardyCTContent > div:first-child { display: flex; align-items: center; justify-content: space-between; }
.hardyCTContent > div:first-child > div { text-align: center; flex-grow: 1; }

body.dark-mode .hardyCTHeader { background-color: #191919; }
body.dark-mode .hardyCTBox { background-color: #333; border: 1px solid #444; }
body.dark-mode .hardyCTContent { color: #ddd; }
body.dark-mode .ctRecordLink { color: #f0f0f0; }
body.dark-mode .helcostrDoesntLikeGreenCommas { color: white; }
body.dark-mode .hardyNearbyItems, body.dark-mode .hardyNearbyChests { background-color: #2c2c2c; border: 1px solid #555; color: #ddd; }
body.dark-mode .ctHelperSuccess { color: lightgreen; }
body.dark-mode .hardyGameBoxContent { background-color: #333; }
.hardyCTTypoAnswer { padding: 5px 6px; background-color: #4a9f33; color: white; margin: 5px; border-radius: 5px; }
.hardyCTTypoAnswer:hover, .hardyCTTypoAnswer:focus { color: white; }`);
        //Dialog
        GM_addStyle(`.hardy_modal_dialog { position: fixed; z-index: 10211; padding-top: 6px; left: 0; top: 0; width: 100%; height: 80%; background-color: rgba(0, 0, 0, 0.4); }
.hardy_modal { position: absolute; top: 50%; left: 50%; height: auto; max-height: 80%; transform: translate(-50%, -50%); background-color: #f2f2f2; max-width: 70%; width: 80%; border-radius: 0.5rem; overflow: auto; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); }
.hardy_modal_header { background-color: #000; text-align: center; color: #fff; border-radius: 6px 6px 0 0; padding: 5px; width: 100%; }
.hardy_modal_close { padding: 5px 8px; background-color: #d76767; border-radius: 6px; margin: 5px; border: none; cursor: pointer; font-weight: bold; }
.hardy_modal_content { margin: 4px; display: block; padding: 10px; overflow-y: auto; overflow-x: auto;}
.hardy-save-prefs { background-color: #40d546; color: #000; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 1em; font-weight: bold; margin-top: 15px; }
.hardy_modal_msg { margin: 10px; padding: 5px; color: #191919; font-size: 0.9em; text-align: center; }
body.dark-mode .hardy_modal { background-color: #333; }
body.dark-mode .hardy_modal_header { background-color: #191919; }
body.dark-mode .hardy_modal_close { background-color: #d76767; color: #e2dbdb; }
body.dark-mode .hardy-save-prefs { background-color: #4CAF50; color: #e2dbdb; }
body.dark-mode .hardy_modal_msg { color: white; }
.hardy_modal_content p { text-align: center; font-size: 1.2em; font-weight: bold; }
.hardy_modal_content label { display: inline-block; width: 70%; margin-bottom: 10px; font-size: 1em; font-weight: bold; vertical-align: middle; }
.hardy_modal_content input[type = "checkbox"] { margin-left: 10px; vertical-align: middle; }
.hardy_modal_content input[type = "checkbox"] { transform: scale(1.2); }
.hardy_modal_content div { margin-bottom: 15px; }
.hardy-ct-itemstable { background-color: #3a8fe2; color: white; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 1em; margin-top: 15px; }`);
    } else {
        // General
        GM_addStyle(`.ct-user-wrap .user-map:before { display: none; }
.hardyGameBoxContent { background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 0 0 10px 10px; max-height: 150px; margin-bottom: 5px; padding: 10px; }
.helcostrDoesntLikeGreenCommas { color: black; }
.hardyCTBox { background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 10px; max-height: 250px; }
.hardyCTHeader { background-color: #200505; color: #f2f2f2; padding: 6px; font-size: 1.5em; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0; }
.hardyCTContent { padding: 10px; font-size: 1.2em; }
.ctRecordLink { color: #121212; border: none; padding: 8px; cursor: pointer; }
.nearby-items-chests { display: flex; justify-content: space-between; margin-top: 10px; }
.hardyNearbyItems, .hardyNearbyChests { background-color: #f9f9f9; padding: 5px; border: 1px solid #ddd; border-radius: 8px; flex: 1;}
.hardyNearbyItems { margin-right: 5px; }
.hardyNearbyChests { margin-left: 5px; }
.hardyNearbyItems label, .hardyNearbyChests label { display: block; text-align: center; font-weight: bold; font-size: 1.1em; }
.hardyNearbyItems .content, .hardyNearbyChests .content { padding: 10px; border-radius: 5px; text-align: left; font-size: 0.9em; line-height: 1.3; overflow-y: auto; max-height: 80px; }
.ctHelperSuccess { color: green; font-weight: bold; }
.hardyCTContent > div:first-child { display: flex; align-items: center; justify-content: space-between; }
.hardyCTContent > div:first-child > div { text-align: center; flex-grow: 1; }

body.dark-mode .hardyCTHeader { background-color: #191919; }
body.dark-mode .hardyCTBox { background-color: #333; border: 1px solid #444; }
body.dark-mode .hardyCTContent { color: #ddd; }
body.dark-mode .ctRecordLink { color: #f0f0f0; }
body.dark-mode .helcostrDoesntLikeGreenCommas { color: white; }
body.dark-mode .hardyNearbyItems, body.dark-mode .hardyNearbyChests { background-color: #2c2c2c; border: 1px solid #555; color: #ddd; }
body.dark-mode .ctHelperSuccess { color: lightgreen; }
body.dark-mode .hardyGameBoxContent { background-color: #333; }
.hardyCTTypoAnswer { padding: 5px 6px; background-color: #4a9f33; color: white; margin: 5px; border-radius: 5px; }
.hardyCTTypoAnswer:hover, .hardyCTTypoAnswer:focus { color: white; }`);
        //Dialog
        GM_addStyle(`.hardy_modal_dialog { position: fixed; z-index: 10211; padding-top: 6px; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); }
.hardy_modal { position: absolute; top: 50%; left: 50%; height: auto; transform: translate(-50%, -50%); background-color: #f2f2f2; width: 40%; border-radius: 0.5rem; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); }
.hardy_modal_header { background-color: #000; text-align: center; color: #fff; border-radius: 6px 6px 0 0; padding: 5px; width: 100%; }
.hardy_modal_close { padding: 5px 8px; background-color: #d76767; border-radius: 6px; margin: 5px; border: none; cursor: pointer; font-weight: bold; }
.hardy_modal_content { margin: 4px; display: block; padding: 10px; overflow-y: auto; }
.hardy-save-prefs { background-color: #40d546; color: #000; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 1em; font-weight: bold; margin-top: 15px; }
.hardy_modal_msg { margin: 10px; padding: 5px; color: #191919; font-size: 0.9em; text-align: center; }
body.dark-mode .hardy_modal { background-color: #333; }
body.dark-mode .hardy_modal_header { background-color: #191919; }
body.dark-mode .hardy_modal_close { background-color: #d76767; color: #e2dbdb; }
body.dark-mode .hardy-save-prefs { background-color: #4CAF50; color: #e2dbdb; }
body.dark-mode .hardy_modal_msg { color: white; }
.hardy_modal_content p { text-align: center; font-size: 1.2em; font-weight: bold; }
.hardy_modal_content label { display: inline-block; width: 70%; margin-bottom: 10px; font-size: 1em; font-weight: bold; vertical-align: middle; }
.hardy_modal_content input[type = "checkbox"] { margin-left: 10px; vertical-align: middle; }
.hardy_modal_content input[type = "checkbox"] { transform: scale(1.2); }
.hardy_modal_content div { margin-bottom: 15px; }
.hardy-ct-itemstable { background-color: #3a8fe2; color: white; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 1em; margin-top: 15px; }`);
    }
    //Table
    GM_addStyle(`.hardyCTBox2 { padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px; font-family: Arial, sans-serif; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
body.dark-mode .hardyCTBox2 { background-color: #1e1e1e; border: 1px solid #333; box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); color: #f0f0f0; }
.hardyCTTable { width: 100%; overflow-x: auto; margin-top: 20px; }
.hardyCTTable table { width: 100%; border-collapse: collapse; text-align: left; }
.hardyCTTable th, .hardyCTTable td { padding: 12px 15px; border: 1px solid #ddd; }
body.dark-mode .hardyCTTable th, body.dark-mode .hardyCTTable td { border: 1px solid #555; }
.hardyCTTable th { background-color: #007bff; color: white; font-weight: bold; text-transform: uppercase; font-size: 14px; }
body.dark-mode .hardyCTTable th { background-color: #0056b3; }
.hardyCTTable tr:nth-child(even) { background-color: #f2f2f2; }
body.dark-mode .hardyCTTable tr:nth-child(even) { background-color: #2a2a2a; }
.hardyCTTable tr:hover { background-color: #f1f9ff; }
body.dark-mode .hardyCTTable tr:hover { background-color: #333; }
.hardyCTTable td img { width: auto; height: 40px; display: block; margin: 0 auto; object-fit: contain; border-radius: 5px; }
.hardyCTTable td:nth-child(n+2) { padding: 8px; }
.hardyCTBox2 p { font-size: 16px; line-height: 1.6; color: #333; margin: 10px 0; }
body.dark-mode .hardyCTBox2 p, body.dark-mode .hardyCTBox2 td { color: #f0f0f0; }
.hardyCTBox2 p strong { color: #007bff; font-weight: bold; }
body.dark-mode .hardyCTBox2 p strong { color: #4ba3ff; }
.hardyCTTableBox { margin-top: 20px; }
.ctHelperError a{text-decoration:none;color:#5c5cc6}body.dark-mode .ctHelperError a{color:#a5a5e8}.ctHelperError{color:red;font-weight:700}body.dark-mode .ctHelperError{color:#f79696}
.ctHelperSuccess { color: green; font-weight: bold; }
body.dark-mode .ctHelperSuccess { color: #6fff6f; }
.hardy_modal_content button, .hardyCTBox2 button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; }
button#hardyCTConfirmDelete { background-color: #dc3545; color: white; }
body.dark-mode button#hardyCTConfirmDelete { background-color: #b02a37; }
button#hardyCTNoDelete { background-color: #6c757d; color: white; }
body.dark-mode button#hardyCTNoDelete { background-color: #555; }
button#hardyctHelperSave { background-color: #28a745; color: white; }
button#hardyctHelperdelete { background-color: #007bff; color: white; }
button#go_to_ct { background-color: #327732; color: white; }
body.dark-mode button#hardyctHelperdelete { background-color: #0056b3; }
hardy_modal_content button:hover, .hardyCTBox2 button:hover { opacity: 0.9; }
.hardyCTtextBox { margin-top: 10px; padding: 10px; background-color: #fff5f5; border: 1px solid #f5c2c2; border-radius: 5px; color: #d9534f; }
body.dark-mode .hardyCTtextBox { background-color: #2a1d1d; border: 1px solid #a03a3a; color: #ff6f6f; }
.ctRecordLink { display: inline-block; margin: 10px 0; text-decoration: none; color: #007bff; font-weight: bold; }
body.dark-mode .ctRecordLink { color: #4ba3ff; }
.ctRecordLink:hover { text-decoration: underline; }`);

    ////////

    class GarlandSolver {
        #problemGrid;
        #tempGrid;
        #possible_rotations_obj;
        constructor(grid) {
            try {
                // Validate grid is an object
                if (typeof grid !== 'object' || grid === null) {
                    throw new Error('Input must be a valid grid JSON object');
                }

                // Validate ends array
                if (!Array.isArray(grid.ends) || grid.ends.length !== 2) {
                    throw new Error('Grid must have exactly 2 ends');
                }

                // Validate each end
                grid.ends.forEach((end, index) => {
                    if (!Array.isArray(end.position) || end.position.length !== 2) {
                        throw new Error(`End ${index} position must be an array of [x,y] coordinates`);
                    }
                    if (!['l', 'r', 't', 'b'].includes(end.side)) {
                        throw new Error(`End ${index} side must be one of: l, r, t, b`);
                    }
                });

                // Validate tails structure
                if (!Array.isArray(grid.tails) || grid.tails.length !== 5) {
                    throw new Error('Grid must have 5 rows in tails array');
                }

                grid.tails.forEach((row, rowIndex) => {
                    if (!Array.isArray(row) || row.length !== 5) {
                        throw new Error(`Row ${rowIndex} must have exactly 5 columns`);
                    }

                    row.forEach((cell, colIndex) => {
                        if (cell !== null) {
                            // Validate cell structure
                            if (typeof cell !== 'object') {
                                throw new Error(`Cell at [${rowIndex},${colIndex}] must be an object or null`);
                            }

                            // Validate required cell properties
                            const requiredProps = ['imageName', 'rotation', 'connections'];
                            requiredProps.forEach(prop => {
                                if (!(prop in cell)) {
                                    throw new Error(`Cell at [${rowIndex},${colIndex}] missing required property: ${prop}`);
                                }
                            });

                            // Validate imageName
                            if (typeof cell.imageName !== 'string') {
                                throw new Error(`Cell at [${rowIndex},${colIndex}] imageName must be a string`);
                            }

                            // Validate connections
                            if (!Array.isArray(cell.connections)) {
                                throw new Error(`Cell at [${rowIndex},${colIndex}] connections must be an array`);
                            }

                            cell.connections.forEach(conn => {
                                if (!['l', 'r', 't', 'b'].includes(conn)) {
                                    throw new Error(`Cell at [${rowIndex},${colIndex}] has invalid connection direction: ${conn}`);
                                }
                            });
                        }
                    });
                });


                this.#problemGrid = grid;
                this.#possible_rotations_obj = {};
            } catch (error) {
                throw new Error(`Invalid grid structure: ${error.message}`);
            }
        }

        #getEnds(grid) {
            return { "end1_x": grid.ends[0].position[0], "end1_y": grid.ends[0].position[1], "end1_dir": grid.ends[0].side, "end2_x": grid.ends[1].position[0], "end2_y": grid.ends[1].position[1], "end2_dir": grid.ends[1].side }
        }
        #isEnd(ends, aa, bb) {
            if (ends.end1_x === aa && ends.end1_y === bb) return [ends.end1_dir, true];
            if (ends.end2_x === aa && ends.end2_y === bb) return [ends.end2_dir, true];
            return false;
        }
        #isNullOrOutOfBounds(grid, a, b) {
            if (a < 0 || a > 4 || b < 0 || b > 4) return true;
            return grid.tails[a][b] === null;
        }
        #removeDuplicates(array) {
            return array.filter((item, index, self) =>
                index === self.findIndex((t) =>
                    t.rot === item.rot && JSON.stringify(t.connections) === JSON.stringify(item.connections)
                )
            )
        }
        #getAdjacentCell(grid, a, b, direction) {
            switch (direction) {
                case "r":
                    if (this.#isNullOrOutOfBounds(grid, a, b + 1)) return null;
                    return grid.tails[a][b + 1];
                case "l":
                    if (this.#isNullOrOutOfBounds(grid, a, b - 1)) return null;
                    return grid.tails[a][b - 1];
                case "t":
                    if (this.#isNullOrOutOfBounds(grid, a - 1, b)) return null;
                    return grid.tails[a - 1][b];
                case "b":
                    if (this.#isNullOrOutOfBounds(grid, a + 1, b)) return null;
                    return grid.tails[a + 1][b];
            }
        }
        #getOppositeDir(direction) {
            const dir_obj = { "r": "l", "l": "r", "t": "b", "b": "t" };
            return dir_obj[direction];
        }
        #getAdjacentCords(a, b, direction) {
            switch (direction) {
                case "r":
                    return [a, b + 1];
                case "l":
                    return [a, b - 1];
                case "t":
                    return [a - 1, b];
                case "b":
                    return [a + 1, b];
            }
        }
        #isSolved(gridData) {
            let a = 0;
            let b = 0;
            const ends = this.#getEnds(gridData);
            for (let i = 0; i < 25; i++) {
                if (!this.#isNullOrOutOfBounds(gridData, a, b)) {
                    const cell = gridData.tails[a][b];
                    const connections = cell.connections;
                    for (const connection of connections) {
                        const adjacentCell = this.#getAdjacentCell(gridData, a, b, connection);
                        if (adjacentCell === null) {
                            if (ends.end1_x === a && ends.end1_y === b) {
                                if (!connections.includes(ends.end1_dir)) {
                                    return false;
                                }
                            } else if (ends.end2_x === a && ends.end2_y === b) {
                                if (!connections.includes(ends.end2_dir)) {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        } else {
                            const adjacentCellConnections = adjacentCell.connections;
                            if (!adjacentCellConnections.includes(this.#getOppositeDir(connection))) {
                                return false;
                            }
                        }
                    }
                }
                if (b === 4) {
                    b = 0;
                    a += 1;
                } else {
                    b += 1;
                }
            }
            ////
            return true;
        }

        //////
        #createPossibleOptions() {
            const gridData = this.#problemGrid;
            const ends = this.#getEnds(gridData);
            const matrix = gridData;
            this.#possible_rotations_obj = {};
            let a = 0;
            let b = 0;
            const addToPossibleRotations = (a, b, rot, connections) => {
                if (!this.#possible_rotations_obj[`${a}_${b}`]) {
                    this.#possible_rotations_obj[`${a}_${b}`] = [{ "rot": rot, "connections": connections }];
                } else {
                    this.#possible_rotations_obj[`${a}_${b}`].push({ "rot": rot, "connections": connections });
                }
            };

            ////the big boi loop
            for (let i = 0; i < 25; i++) {
                if (!this.#isNullOrOutOfBounds(gridData, a, b)) {
                    const img = matrix.tails[a][b].imageName;
                    if (!img.includes("cross")) {
                        if (img.includes("angle")) {
                            //top row. x=0
                            if (a === 0) {
                                if (!this.#isEnd(ends, a, b)) {
                                    // check left cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a, b - 1)) {
                                        addToPossibleRotations(a, b, 180, ["l", "b"]);
                                    }
                                    // check right cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a, b + 1)) {
                                        addToPossibleRotations(a, b, 90, ["r", "b"]);
                                    }
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === "t") {
                                        // check left cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a, b - 1)) {
                                            addToPossibleRotations(a, b, 270, ["l", "t"]);
                                        }
                                        // check right cell

                                        if (!this.#isNullOrOutOfBounds(gridData, a, b + 1)) {
                                            addToPossibleRotations(a, b, 0, ["r", "t"]);
                                        }
                                    } else if (endDir === "l") {
                                        addToPossibleRotations(a, b, 180, ["l", "b"]);
                                    } else if (endDir === "r") {
                                        addToPossibleRotations(a, b, 90, ["r", "b"]);
                                    }
                                }
                            } else if (a === 4) {
                                if (!this.#isEnd(ends, a, b)) {
                                    // check left cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a, b - 1)) {
                                        addToPossibleRotations(a, b, 270, ["l", "t"]);
                                    }
                                    // check right cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a, b + 1)) {
                                        addToPossibleRotations(a, b, 0, ["r", "t"]);
                                    }
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === "b") {
                                        // check left cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a, b - 1)) {
                                            addToPossibleRotations(a, b, 180, ["l", "b"]);
                                        }
                                        // check right cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a, b + 1)) {
                                            addToPossibleRotations(a, b, 90, ["r", "b"]);
                                        }
                                    } else if (endDir === "l") {
                                        addToPossibleRotations(a, b, 270, ["l", "t"]);
                                    } else if (endDir === "r") {
                                        addToPossibleRotations(a, b, 0, ["r", "t"]);
                                    }
                                }
                            }

                            //b = 0. first column
                            if (b === 0) {
                                if (!this.#isEnd(ends, a, b)) {
                                    // check top cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                        addToPossibleRotations(a, b, 0, ["r", "t"]);
                                    }
                                    // check bottom cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                        addToPossibleRotations(a, b, 90, ["r", "b"]);
                                    }
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === "l") {
                                        // check top cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                            addToPossibleRotations(a, b, 270, ["l", "t"]);
                                        }
                                        // check bottom cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                            addToPossibleRotations(a, b, 180, ["l", "b"]);
                                        }
                                    } else if (endDir === "t") {
                                        addToPossibleRotations(a, b, 0, ["r", "t"]);
                                    } else if (endDir === "b") {
                                        addToPossibleRotations(a, b, 90, ["r", "b"]);
                                    }
                                }
                            } else if (b === 4) {
                                if (!this.#isEnd(ends, a, b)) {
                                    // check top cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                        addToPossibleRotations(a, b, 270, ["l", "t"]);
                                    }
                                    // check bottom cell
                                    if (!this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                        addToPossibleRotations(a, b, 180, ["l", "b"]);
                                    }
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === 'r') {
                                        // check top cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                            addToPossibleRotations(a, b, 0, ["r", "t"]);
                                        }
                                        // check bottom cell
                                        if (!this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                            addToPossibleRotations(a, b, 90, ["r", "b"]);
                                        }
                                    } else if (endDir === "t") {
                                        addToPossibleRotations(a, b, 270, ["l", "t"]);
                                    } else if (endDir === "b") {
                                        addToPossibleRotations(a, b, 180, ["l", "b"]);
                                    }
                                }
                            }

                            if (a !== 0 && a !== 4 && b !== 0 && b !== 4) {
                                // check left and top cells
                                if (!this.#isNullOrOutOfBounds(gridData, a, b - 1) && !this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                    addToPossibleRotations(a, b, 270, ["l", "t"]);
                                }
                                // left and bottom cells
                                if (!this.#isNullOrOutOfBounds(gridData, a, b - 1) && !this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                    addToPossibleRotations(a, b, 180, ["l", "b"]);
                                }
                                // right and top cells
                                if (!this.#isNullOrOutOfBounds(gridData, a, b + 1) && !this.#isNullOrOutOfBounds(gridData, a - 1, b)) {
                                    addToPossibleRotations(a, b, 0, ["r", "t"]);
                                }
                                // right and bottom cells
                                if (!this.#isNullOrOutOfBounds(gridData, a, b + 1) && !this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                    addToPossibleRotations(a, b, 90, ["r", "b"]);
                                }
                            }

                        } else if (img.includes("straight")) {
                            if (a === 0 || a === 4) {
                                if (!this.#isEnd(ends, a, b)) {
                                    addToPossibleRotations(a, b, 0, ["l", "r"]);
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === "b" || endDir === "t") {
                                        addToPossibleRotations(a, b, 90, ["b", "t"]);
                                    } else {
                                        addToPossibleRotations(a, b, 0, ["l", "r"]);
                                    }
                                }
                            }
                            if (b === 0 || b === 4) {
                                if (!this.#isEnd(ends, a, b)) {
                                    addToPossibleRotations(a, b, 90, ["b", "t"]);
                                } else {
                                    const endDir = this.#isEnd(ends, a, b)[0];
                                    if (endDir === "l" || endDir === "r") {
                                        addToPossibleRotations(a, b, 0, ["l", "r"]);
                                    } else {
                                        addToPossibleRotations(a, b, 90, ["b", "t"]);
                                    }
                                }
                            }
                            if (a !== 0 && a !== 4 && b !== 0 && b !== 4) {
                                //check top and bottom cells
                                if (!this.#isNullOrOutOfBounds(gridData, a - 1, b) && !this.#isNullOrOutOfBounds(gridData, a + 1, b)) {
                                    addToPossibleRotations(a, b, 90, ["b", "t"]);
                                }
                                // check left and right cells
                                if (!this.#isNullOrOutOfBounds(gridData, a, b - 1) && !this.#isNullOrOutOfBounds(gridData, a, b + 1)) {
                                    addToPossibleRotations(a, b, 0, ["l", "r"]);
                                }
                            }
                        }
                    }
                }
                if (b === 4) {
                    b = 0;
                    a += 1;
                } else {
                    b += 1;
                }
            }
            ////
            for (const key in this.#possible_rotations_obj) {
                if (this.#possible_rotations_obj[key].length > 1) {
                    this.#possible_rotations_obj[key] = this.#removeDuplicates(this.#possible_rotations_obj[key]);
                }
            }

        }
        #createAdjacents() {
            for (const key in this.#possible_rotations_obj) {
                if (this.#possible_rotations_obj[key].length === 1) {
                    for (const possible_rot of this.#possible_rotations_obj[key]) {
                        const a = Number(key.split("_")[0]);
                        const b = Number(key.split("_")[1]);
                        possible_rot.adj = this.#createLimitationsForAdjacentCells(this.#problemGrid, a, b, possible_rot.connections);
                    }
                }
            }
        }
        #createLimitationsForAdjacentCells(grid, a, b, connections) {
            const obj = {};
            for (const direction of connections) {
                const array = this.#possibleOptionsForAdjacentCell(grid, a, b, direction);
                if (array !== null) {
                    obj[direction] = array;
                } else {
                    obj[direction] = [];
                }
            }
            return obj;
        }
        #getConnection(img, rotation) {
            let rot = rotation;
            if (rot >= 360) {
                while (rot >= 360) {
                    rot -= 360;
                }
            }
            const connections = [];
            if (img.includes("angle")) {
                if (rot === 0) {
                    connections.push("r");
                    connections.push("t");
                } else if (rot === 90) {
                    connections.push("b");
                    connections.push("r");
                } else if (rot === 180) {
                    connections.push("b");
                    connections.push("l");
                } else if (rot === 270) {
                    connections.push("t");
                    connections.push("l");
                }
            } else if (img.includes("cross")) {
                connections.push("t");
                connections.push("r");
                connections.push("b");
                connections.push("l");
            } else if (img.includes("straight")) {
                if (rot === 0 || rot === 180) {
                    connections.push("r");
                    connections.push("l");
                } else if (rot === 90 || rot === 270) {
                    connections.push("t");
                    connections.push("b");
                }
            }
            return connections;
        }
        #possibleOptionsForAdjacentCell(grid, a, b, direction) {
            const cell = this.#getAdjacentCell(grid, a, b, direction);
            if (cell === null) {
                return null;
            } else {
                const img = cell.imageName;
                const array = [];
                if (img.includes("angle")) {
                    const possibleAngles = [0, 90, 180, 270];
                    for (const angle of possibleAngles) {
                        if (this.#getConnection("angle", angle).includes(this.#getOppositeDir(direction))) {
                            array.push(angle);
                        }
                    }
                } else if (img.includes('straight')) {
                    const possibleAngles = [0, 90];
                    for (const angle of possibleAngles) {
                        if (this.#getConnection("angle", angle).includes(this.#getOppositeDir(direction))) {
                            array.push(angle);
                        }
                    }

                }
                return array;
            }
        }
        #reducePossibilities() {
            const newObj = {};
            for (const key in this.#possible_rotations_obj) {
                if (this.#possible_rotations_obj[key].length === 1) {
                    for (const possible_rot of this.#possible_rotations_obj[key]) {
                        const a = Number(key.split("_")[0]);
                        const b = Number(key.split("_")[1]);
                        for (const dir in possible_rot.adj) {
                            const adj = possible_rot.adj[dir];
                            if (adj.length > 0) {
                                const adjCell_cords = this.#getAdjacentCords(a, b, dir);
                                if (this.#possible_rotations_obj[`${adjCell_cords[0]}_${adjCell_cords[1]}`]) {
                                    const adjCell = this.#possible_rotations_obj[`${adjCell_cords[0]}_${adjCell_cords[1]}`];
                                    if (adjCell.length > 1) {
                                        for (const rot of adjCell) {
                                            if (adj.includes(rot.rot)) {
                                                const n = adjCell_cords[0];
                                                const p = adjCell_cords[1]
                                                if (!newObj[`${n}_${p}`]) {
                                                    newObj[`${n}_${p}`] = [{ "rot": rot.rot, "connections": rot.connections }]
                                                } else {
                                                    newObj[`${n}_${p}`].push({ "rot": rot.rot, "connections": rot.connections })
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (const key in newObj) {
                this.#possible_rotations_obj[key] = newObj[key];
            }
        }
        #createAdjsNreducePossibilities(numOfTimes = 3) {
            for (let i = 0; i < numOfTimes; i++) {
                this.#createAdjacents();
                this.#reducePossibilities();
            }
        }
        #generateCombinations() {
            const keys = Object.keys(this.#possible_rotations_obj);
            const currentCombination = {};

            if (!this.#findSolution(keys, 0, currentCombination)) {
                console.log("No solution found.");
                return null;
            } else {
                return this.#tempGrid;
            }
        }
        #findSolution(keys, index, currentCombination) {
            if (index === keys.length) {
                if (this.#isSolution(currentCombination)) {
                    return true;
                }
                return false;
            }

            const key = keys[index];
            const values = this.#possible_rotations_obj[key];

            for (const value of values) {
                currentCombination[key] = value;

                if (this.#findSolution(keys, index + 1, currentCombination)) {

                    return true;
                }
                delete currentCombination[key];
            }
            return false;
        }

        #isSolution(combination) {
            const testCombination = JSON.parse(JSON.stringify(this.#problemGrid));
            for (const key in combination) {
                const [a, b] = key.split("_").map(Number);
                const value = combination[key];
                this.#updateProperty(testCombination, a, b, { "rotation": value.rot, "connections": value.connections });
            }
            if (this.#isSolved(testCombination)) {
                this.#tempGrid = testCombination;
                return true;
            }
            return false;
        }
        #updateProperty(grid, a, b, obj) {
            const cell = grid.tails[a][b];
            for (const key in obj) {
                cell[key] = obj[key];
            }
        }
        async solve() {
            console.time("GarlandSolver");
            return new Promise((resolve, reject) => {
                try {
                    this.#createPossibleOptions();
                    this.#createAdjsNreducePossibilities(3);
                    const solution = this.#generateCombinations();
                    if (solution) {
                        console.timeEnd("GarlandSolver");
                        resolve(solution);
                    } else {
                        console.timeEnd("GarlandSolver");
                        reject("No solution found.");
                    }
                } catch (err) {
                    console.timeEnd("GarlandSolver");
                    reject(err);

                }
            });
        }
    }
    /////////////////
    class SourTable {
        // Private fields
        #table;
        #excludedColumns;
        #keysForAttributes;
        #customParseFunctions = {};
        #isEngaged = false;
        constructor(table, excludedColumns = [], keysForAttributes = {}) {
            // Validate inputs
            if (!(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
                throw new Error("SourTable: Invalid table element. Must be a 'table' element.");
            }
            if (!Array.isArray(excludedColumns) || !excludedColumns.every(Number.isInteger)) {
                throw new Error("SourTable: excludedColumns must be an array of integers.");
            }
            if (excludedColumns.some(col => col < 0)) {
                throw new Error("SourTable: excludedColumns cannot contain negative numbers.");
            }
            if (typeof keysForAttributes !== "object" || keysForAttributes === null) {
                throw new Error("SourTable: keysForAttributes must be an object.");
            }

            // Validate keysForAttributes structure
            for (const key in keysForAttributes) {
                if (!key.startsWith('col_') || isNaN(parseInt(key.split('_')[1]))) {
                    throw new Error(`SourTable: Invalid key in keysForAttributes. Use 'col_N' format.`);
                }
                if (typeof keysForAttributes[key] !== 'string') {
                    throw new Error(`SourTable: Attribute names must be strings.`);
                }
            }

            // Assign to private fields
            this.#table = table;
            this.#excludedColumns = excludedColumns;
            this.#keysForAttributes = keysForAttributes;
        }

        // Public API
        initiate() {
            if (this.#table.classList.contains("sourtable-initiated")) {

                throw new Error("SourTable: This table has already been initialized. Disengage the previous instance of this table before initializing a new one.");
            }
            if (this.#isEngaged) {
                throw new Error("This SourTable instance is already engaged. Disengage it properly before initiating a new instance.");
            }
            this.#isEngaged = true;
            this.#resetIndicatorArrows();
            this.#addListeners();
            this.#addCSS();
            this.#table.classList.add("sourtable-initiated");

        }
        #removeListeners() {
            const headers = this.#table.querySelectorAll(".sourtable-header");
            headers.forEach(th => {
                // Remove using the bound handler reference
                th.removeEventListener("click", this.#boundSortClickHandler);
            });
        }
        disengage() {
            const headerRow = this.#getHeader();
            this.#removeListeners();
            const headers = headerRow.querySelectorAll("th.sourtable-header");

            for (const th of headers) {

                th.classList.remove("sourtable-header");
                if (th.hasAttribute("data-sourtable-order")) th.removeAttribute("data-sourtable-order");
                const arrowsDiv = th.querySelector(".sourtable-arrow-container");
                if (arrowsDiv) arrowsDiv.remove();
            }
            this.#table.classList.remove("sourtable-initiated");
            this.#isEngaged = false;
        }
        #addListeners() {
            const headers = this.#table.querySelectorAll(".sourtable-header");
            if (!headers.length) {
                throw new Error("SourTable: No sortable headers found. Did you call initiate() first?");
            }
            this.#removeListeners();
            headers.forEach(th => {
                th.addEventListener("click", this.#boundSortClickHandler);
            });
        }

        #boundSortClickHandler = (event) => {
            this.#sortClickHandler(event)
        }
        #sortClickHandler = (event) => {
            //console.log(event.target)

            const target = event.target.closest(".sourtable-header");
            if (!target) return;

            const colIndex = Number(target.getAttribute("data-sourtable-col-index").split("_")[1]);
            const order = target.getAttribute("data-sourtable-order") || "asc";
            const key = this.#keysForAttributes[`col_${colIndex}`] ? `attr=${this.#keysForAttributes[`col_${colIndex}`]}` : "";
            this.sort(colIndex, order, key)
        }

        sort(colIndex, order, key = "") {
            try {
                const array = [];
                let rows = this.#getBody();
                if (rows.length === 0) {
                    console.warn("No rows to sort.");
                    return;
                }

                const isKeyAttr = typeof key === 'string' && key !== '' && key.startsWith('attr=');
                let keyAttr = "";
                if (isKeyAttr) {
                    keyAttr = key.split('attr=')[1];
                    if (!keyAttr) {
                        throw new Error("Empty attribute key provided.");
                    }
                }

                let rowIndex = 0;
                for (const row of rows) {
                    const index = `index_${rowIndex}`;
                    row.setAttribute("data-sourtable-row-index", index);

                    const tdList = row.querySelectorAll("td");
                    if (colIndex >= tdList.length) {
                        throw new Error(`Column index ${colIndex} is out of bounds for row ${rowIndex}.`);
                    }

                    const relevantTd = tdList[colIndex];

                    if (isKeyAttr) {
                        const attrVal = relevantTd.getAttribute(keyAttr);
                        if (attrVal === null) {
                            throw new Error(`Attribute '${keyAttr}' not found in column ${colIndex}, row ${rowIndex}.`);
                        }

                        let parsed;
                        if (this.#customParseFunctions[`col_${colIndex}`]) {
                            try {
                                parsed = this.#customParseFunctions[`col_${colIndex}`](attrVal);
                            } catch (parseError) {
                                throw new Error(`Custom parse function for column ${colIndex} failed: ${parseError.message}`);
                            }
                        } else {
                            parsed = this.#parseText(attrVal);
                        }
                        array.push([index, parsed]);
                    } else {
                        const text = relevantTd.innerText;
                        let parsed;
                        if (this.#customParseFunctions[`col_${colIndex}`]) {
                            try {
                                parsed = this.#customParseFunctions[`col_${colIndex}`](text);
                            } catch (parseError) {
                                throw new Error(`Custom parse function for column ${colIndex} failed: ${parseError.message}`);
                            }
                        } else {
                            parsed = this.#parseText(text);
                        }
                        array.push([index, parsed]);
                    }
                    rowIndex += 1;
                }

                if (array.length === 0) {
                    console.warn("No sortable data collected.");
                    return;
                }

                const firstValue = array[0][1];
                const isString = typeof firstValue === "string";

                if (order === "asc") {
                    array.sort(function (a, b) {
                        return isString ? a[1].localeCompare(b[1]) : a[1] - b[1];
                    });
                } else {
                    array.sort(function (a, b) {
                        return isString ? b[1].localeCompare(a[1]) : b[1] - a[1];
                    });
                }

                const tbody = this.#table.querySelector("tbody") || this.#table;
                const last_element = tbody.querySelector(`tr[data-sourtable-row-index="${array[array.length - 1][0]}"]`);
                if (!last_element) {
                    throw new Error("Could not find last row element in DOM.");
                }
                tbody.appendChild(last_element);
                array.splice(-1);

                for (const [index] of array) {

                    const rowElement = tbody.querySelector(`tr[data-sourtable-row-index="${index}"]`);
                    if (!rowElement) {
                        console.warn(`Row with index ${index} not found in DOM.`);
                        continue;
                    }
                    tbody.insertBefore(rowElement, last_element);
                }


                const selector = order === "asc" ? "div.sourtable-arrow-up" : "div.sourtable-arrow-down";

                const target = this.#table.querySelector(`th[data-sourtable-col-index="index_${colIndex}"]`);
                if (!target) {
                    throw new Error(`Could not find header for column ${colIndex}.`);
                }
                this.#resetIndicatorArrows();
                target.querySelector(selector).classList.add("filled");
                const newOrder = order === "asc" ? "desc" : "asc";
                target.setAttribute("data-sourtable-order", newOrder);

            } catch (error) {
                console.error(`SourTable.sort failed: ${error.message}`);
                throw error;
            }
        }
        addCustomParseFunction(colIndex, parseFunction) {
            if (typeof parseFunction !== 'function') {
                throw new Error("parseFunction must be a function.");
            }
            this.#customParseFunctions[`col_${colIndex}`] = parseFunction;
        }

        static get version() {
            return "1.0.0";
        }

        // Private methods
        #getHeader() {
            const header = this.#table.querySelector("tr");
            if (!header) throw new Error("No header row found.");
            return header;
        }

        #getBody() {
            if (this.#table.querySelector("thead")) {
                return Array.from(this.#table.querySelectorAll("tbody tr"));
            } else {
                const rows = this.#table.querySelectorAll("tr");
                return rows.length > 1 ? Array.from(rows).slice(1) : [];
            }
        }

        #resetIndicatorArrows() {
            const headerRow = this.#getHeader();
            const headers = headerRow.querySelectorAll("th");

            headers.forEach((th, index) => {
                if (this.#excludedColumns.includes(index)) return;

                let arrowsDiv = th.querySelector(".sourtable-arrow-container");
                if (!arrowsDiv) {
                    th.classList.add("sourtable-header");
                    th.setAttribute("data-sourtable-col-index", `index_${index}`);
                    arrowsDiv = this.#createElement("div", { class: "sourtable-arrow-container" });
                    th.appendChild(arrowsDiv);
                }

                arrowsDiv.innerHTML = `<div class=sourtable-arrow-up><svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M18.2 13.3L12 7l-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7s.4.3.7.3h11c.3 0 .5-.1.7-.3s.3-.5.3-.7s-.1-.5-.3-.7"/></svg></div><div class=sourtable-arrow-down><svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M5.8 9.7L12 16l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7s-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3s-.3.4-.3.7s.1.5.3.7"/></svg></div>`;
                th.setAttribute("data-sourtable-order", "asc");
            });
        }




        #addCSS() {
            if (document.querySelector("style#sourtable-style")) return;

            const style = this.#createElement("style", { id: "sourtable-style" });
            style.textContent = `.sourtable-arrow-container{display:inline-flex;flex-direction:column;margin-left:.3em;vertical-align:middle;height:1em;width:.8em;justify-content:space-between}.sourtable-arrow-down,.sourtable-arrow-up{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}.sourtable-arrow-down svg,.sourtable-arrow-up svg{width:100%;height:100%;fill:currentColor;opacity:.3;max-height:.5em}.sourtable-arrow-down.filled svg,.sourtable-arrow-up.filled svg{opacity:1!important}.sourtable-header{cursor:pointer!important}`;
            document.head.appendChild(style);
        }

        #parseText(text) {
            if (typeof text !== 'string') return text;
            const stripped = text.replace(/[$,£]/g, "").replace(/\s/g, '');
            const float = parseFloat(stripped.endsWith(".") ? stripped.slice(0, -1) : stripped);
            return isNaN(float) ? text : float;
        }

        #createElement(nodeType, attributes = {}) {
            const element = document.createElement(nodeType);
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        }
        isEngaged() {
            return this.#isEngaged;
        }
    }
    ///////////////////
})();

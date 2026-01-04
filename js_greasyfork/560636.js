// ==UserScript==
// @name         Torn Christmas Town Helper (merger)
// @namespace    awaken.ct.hybrid
// @version      1.0.0
// @description  CT Helper - Merger of Hardy's and Getty111's versions. In test mode but safe to use. Modified by Mr_Awaken (3255504). Highlights Items, Chests, NPCs. Arrow pointing to items with item names, Auto-walk, and Games Cheat.
// @author       Mr_Awaken (3255504) (Merger of Hardy & Getty111 versions)
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/560636/Torn%20Christmas%20Town%20Helper%20%28merger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560636/Torn%20Christmas%20Town%20Helper%20%28merger%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector("#awaken_ct_hybrid_placeholder")) return;
    const placeholder = document.createElement("div");
    placeholder.id = "awaken_ct_hybrid_placeholder";
    placeholder.style.display = "none";
    document.body.appendChild(placeholder);

    // --- State & Settings ---
    let saved;
    let isAutoRunning = false;
    let autoRunInterval = null;
    let currentDirection = null;
    let arrowDiv = null;
    let audioContext = null;
    let statusDiv = null;

    const MOVE_INTERVAL = 300;
    const STORAGE_KEY = 'awaken_ct_hybrid_settings';
    const chirp = new Audio("https://www.torn.com/js/chat/sounds/Chirp_1.mp3");

    const options = {
        "checkbox": {
            "items": { "name": "Highlight Items", "def": "yes", "color": "#00ff00" },
            "gold_chest": { "name": "Highlight Golden Chests", "def": "yes", "color": "#ffd700" },
            "silver_chest": { "name": "Highlight Silver Chests", "def": "yes", "color": "#c0c0c0" },
            "bronze_chest": { "name": "Highlight Bronze Chests", "def": "yes", "color": "#cd7f32" },
            "combo_chest": { "name": "Highlight Combination Chests", "def": "yes", "color": "#ff4500" },
            "gold_key": { "name": "Highlight Golden Keys", "def": "yes", "color": "#ffd700" },
            "silver_key": { "name": "Highlight Silver Keys", "def": "yes", "color": "#c0c0c0" },
            "bronze_key": { "name": "Highlight Bronze Keys", "def": "yes", "color": "#cd7f32" },
            "highlight_santa": { "name": "Highlight Santa", "def": "yes", "color": "#ff0000" },
            "highlight_npc": { "name": "Highlight Other NPCs", "def": "yes", "color": "#000000" },
            "wreath": { "name": "Christmas Wreath Helper", "def": "yes" },
            "snowball_shooter": { "name": "Snowball Shooter Helper", "def": "yes" },
            "santa_clawz": { "name": "Santa Clawz Helper", "def": "yes" },
            "word_fixer": { "name": "Word Fixer Helper", "def": "yes" },
            "hangman": { "name": "Hangman Helper", "def": "yes" },
            "typoGame": { "name": "Typocalypse Helper", "def": "yes" },
            "garland": { "name": "Garland Assemble Helper", "def": "yes" },
            "chirp_alert_ct": { "name": "Chirp Alert", "def": "no" },
            "arrow_enabled": { "name": "Show Direction Arrow", "def": "yes" },
            "sound_enabled": { "name": "Enable Bing Sound", "def": "no" }
        }
    };

    const wordList = ["holly and ivy", "elf", "eve", "fir", "ham", "icy", "ivy", "joy", "pie", "toy", "gift", "gold", "list", "love", "nice", "sled", "star", "wish", "wrap", "xmas", "yule", "angel", "bells", "cider", "elves", "goose", "holly", "jesus", "merry", "myrrh", "party", "skate", "visit", "candle", "creche", "cookie", "eggnog", "family", "frosty", "icicle", "joyful", "manger", "season", "spirit", "tinsel", "turkey", "unwrap", "wonder", "winter", "wreath", "charity", "chimney", "festive", "holiday", "krampus", "mittens", "naughty", "package", "pageant", "rejoice", "rudolph", "scrooge", "snowman", "sweater", "tidings", "firewood", "nativity", "reindeer", "shopping", "snowball", "stocking", "toboggan", "trimming", "vacation", "wise men", "workshop", "yuletide", "chestnuts", "christmas", "fruitcake", "greetings", "mince pie", "mistletoe", "ornaments", "snowflake", "tradition", "candy cane", "decoration", "ice skates", "jack frost", "north pole", "nutcracker", "saint nick", "yule log", "card", "jolly", "hope", "scarf", "candy", "sleigh", "parade", "snowy", "wassail", "blizzard", "noel", "partridge", "give", "carols", "tree", "fireplace", "socks", "lights", "kings", "goodwill", "sugarplum", "bonus", "coal", "snow", "happy", "presents", "pinecone"];

    function init() {
        console.log('[CT Helper] Initializing Christmas Town Helper...');
        const stored = GM_getValue(STORAGE_KEY, null);
        
        if (!stored) {
            // First time - create settings with just the default values
            saved = { checkbox: {} };
            for (const key in options.checkbox) {
                saved.checkbox[key] = options.checkbox[key].def;
            }
        } else {
            saved = stored;
            // Ensure all checkbox entries have default values if they don't exist
            for (const key in options.checkbox) {
                if (!saved.checkbox[key]) {
                    saved.checkbox[key] = options.checkbox[key].def;
                }
            }
        }
        
        // Initialize metadata.cache.last_chirp if not already set
        if (!metadata.cache.last_chirp) {
            metadata.cache.last_chirp = 0;
        }

        initFetchInterception();
        highlighter_css();
        gamesHelper_css();

        waitForElement('#user-map', (mapElement) => {
            console.log('[CT Helper] Map found, setting up...');
            createStatusDisplay();
            setupMapOverlay(mapElement);
            setupMutationObserver();
            initAudio();
            highlightItems();
            highlightNPC();
            highlighter_css();

            if (wordList.length > 0) {
                console.log('[CT Helper] Word list ready.');
            }
        });
    }

    function saveSettings() {
        GM_setValue(STORAGE_KEY, saved);
    }

    const original_fetch = unsafeWindow.fetch;
    let metadata = { cache: { spawn_rate: 0, speed_rate: 0, hangman: { list: [], chars: [], len: false } }, settings: { games: { wordFix: false } } };
    let cdForTypingGame = null;
    let waitObj = {};

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
                        input.value = target.getAttribute("hardy").replace("-", " ");
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
                    gameHelper.html = `<label class="ctHelperSuccess">Click on blue tiles until no longer blue.</label> However, click slowly to avoid unnecessary clicks.`;
                    gameHelper.update();
                }).catch(error => {
                    const message = error.message;
                    if (error ===  "No solution found.") {
                        GM_setClipboard(`CT Helper Normal Version: ${version}\nFailed to solve Garland Assemble game: ${JSON.stringify(gridData)}`);
                        gameHelper.html = `<label class="ctHelperError">No solution found. The puzzle grid information has been copied to your clipboard. Paste it in a <a href="https://pastebin.com/" target="_blank">Pastebin</a> or any other text pasting site you like and send it to me(<a href="https://www.torn.com/profiles.php?XID=2131687">Father[2131687]</a>) so that I can look further into this issue.</label>`;
                    } else {
                        gameHelper.html = `<label class="ctHelperError">Failed to solve the puzzle. The error message is: ${message}  </label>`;
                    }
                    gameHelper.update();
                });

        }
    };

    const garlandColor = (clicks) => {
        if (!document.querySelector('div[ct_garland_xy_info="x_0_y_0"]')) {
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
            setInterval(() => {
                garlandColor(clicks)
            }, 2000);
        }
    };

    const normaliseRotationValue = (rotation, img) => {
        let rot = rotation;
        if (rot >= 360) {
            while (rot >= 360) rot -= 360;
        }
        if (img.includes("straight")) {
            if (rot === 0 || rot === 180) rot = 0;
            else if (rot === 270 || rot === 90) rot = 90;
        } else if (img.includes("angle")) {
            if (rot === 0) rot = 360;
        }
        return rot;
    };

    const calculateClicks = (originalGrid, solutionGrid) => {
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
                                clicks += ((360 - orig_rot) / 90) + (sol_rot / 90);
                            } else {
                                clicks += (sol_rot - orig_rot) / 90;
                            }
                        }
                    }
                }
            }
            if (clicks > 0) array.push([a, b, clicks]);
            b += 1;
            if (b === 5) {
                b = 0;
                a += 1;
            }
        }
        return array;
    };


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
                        if (this.#getConnection("straight", angle).includes(this.#getOppositeDir(direction))) {
                            array.push(angle);
                        }
                    }
                } else if (img.includes('cross')) {
                    array.push(0);
                }
                return array;
            }
        }
        #cleanOptions() {
            let a = 0;
            let b = 0;
            let total_options = 0;
            for (const key in this.#possible_rotations_obj) {
                total_options += this.#possible_rotations_obj[key].length;
            }
            while (true) {
                a = 0;
                b = 0;
                for (let i = 0; i < 25; i++) {
                    const cellKey = `${a}_${b}`;
                    if (this.#possible_rotations_obj[cellKey]) {
                        const connectionsList = this.#possible_rotations_obj[cellKey];
                        const connectionsList_len = connectionsList.length;
                        if (connectionsList_len > 1) {
                            for (let j = connectionsList_len - 1; j >= 0; j--) {
                                const connections = connectionsList[j].connections;
                                for (const connection of connections) {
                                    const adjacentCellKey = this.#getAdjacentCords(a, b, connection).join("_");
                                    if (this.#possible_rotations_obj[adjacentCellKey]) {
                                        const adjacentOptions = this.#possible_rotations_obj[adjacentCellKey];
                                        let hasMatch = false;
                                        for (const adjOption of adjacentOptions) {
                                            if (adjOption.connections.includes(this.#getOppositeDir(connection))) {
                                                hasMatch = true;
                                                break;
                                            }
                                        }
                                        if (!hasMatch) {
                                            connectionsList.splice(j, 1);
                                            break;
                                        }
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
                let current_total = 0;
                for (const key in this.#possible_rotations_obj) {
                    current_total += this.#possible_rotations_obj[key].length;
                }
                if (current_total === total_options) break;
                total_options = current_total;
            }
        }

        #backtrack(index, gridData, cellKeys) {
            if (index === cellKeys.length) {
                if (this.#isSolved(gridData)) return gridData;
                return null;
            }

            const cellKey = cellKeys[index];
            const [a, b] = cellKey.split("_").map(Number);
            const options = this.#possible_rotations_obj[cellKey];

            for (const option of options) {
                const originalCell = gridData.tails[a][b];
                gridData.tails[a][b] = {
                    ...originalCell,
                    rotation: option.rot,
                    connections: option.connections
                };

                const result = this.#backtrack(index + 1, gridData, cellKeys);
                if (result) return result;

                gridData.tails[a][b] = originalCell;
            }

            return null;
        }

        async solve() {
            this.#createPossibleOptions();
            this.#cleanOptions();
            const cellKeys = Object.keys(this.#possible_rotations_obj);
            const result = this.#backtrack(0, JSON.parse(JSON.stringify(this.#problemGrid)), cellKeys);
            if (result) return result;
            throw new Error("No solution found.");
        }
    }


    function sortWord(word) {
        const array = word.toUpperCase().split('');
        array.sort();
        return array.join('');
    }
    function createUniqueArray(array) {
        const newArray = [];
        for (const el of array) {
            if (newArray.indexOf(el) === -1) newArray.push(el);
        }
        return newArray;
    }
    function getUniqueLetter(argArray) {
        const newArray = [];
        const array = createUniqueArray(argArray);
        for (const letter of array) {
            if (metadata.cache.hangman.chars.indexOf(letter) === -1) newArray.push(letter);
        }
        return newArray;
    }
    function countLetter(string, letter) {
        return string.split('').filter(c => c === letter).length;
    }

    function highlightItems() {
        const items = document.querySelectorAll('.items-layer .ct-item');
        const obj = {
            'Mystery Gift': 'items',
            'Gold Chest': 'gold_chest',
            'Silver Chest': 'silver_chest',
            'Bronze Chest': 'bronze_chest',
            'Combination Chest': 'combo_chest',
            'Golden Key': 'gold_key',
            'Silver Key': 'silver_key',
            'Bronze Key': 'bronze_key'
        };
        for (const item of items) {
            const imgEl = item.querySelector('img');
            if (!imgEl) continue;
            const link = imgEl.src;
            const info = ctHelperGetInfo(link);
            const name = info.name;
            const key = obj[name];
            if (key && saved.checkbox[key] === 'yes') {
                item.setAttribute(`hardy_highlight_${key}`, 'yes');
            }
        }
    }

    function ctHelperGetInfo(link) {
        let type = 'items';
        const categories = ['/keys/', '/chests/', '/combinationChest/'];
        for (const category of categories) {
            if (link.indexOf(category) !== -1) {
                const typetxt = category.replace(/\//g, '').toLowerCase();
                if (typetxt === 'combinationchest') type = 'combo_chest';
                else if (typetxt === 'keys') type = 'chest_keys';
                else if (typetxt === 'chests') type = 'chests';
                break;
            }
        }
        let name;
        switch (type) {
            case 'chest_keys':
                if (link.includes('bronze')) name = 'Bronze Key';
                else if (link.includes('gold')) name = 'Golden Key';
                else if (link.includes('silver')) name = 'Silver Key';
                break;
            case 'chests':
                if (link.includes('1.gif')) name = 'Gold Chest';
                else if (link.includes('2.gif')) name = 'Silver Chest';
                else if (link.includes('3.gif')) name = 'Bronze Chest';
                break;
            case 'combo_chest':
                name = 'Combination Chest';
                break;
            default:
                name = 'Mystery Gift';
        }
        return { type, name };
    }

    function highlightNPC() {
        const npcList = document.querySelectorAll('.ct-user.npc');
        for (const npc of npcList) {
            const svg = npc.querySelector('svg');
            if (!svg) continue;
            const fill = svg.getAttribute('fill');
            if (fill && fill.toUpperCase() === '#FA5B27') {
                if (saved.checkbox['highlight_santa'] === 'yes') npc.setAttribute('npctype', 'santa');
            } else {
                if (saved.checkbox['highlight_npc'] === 'yes') npc.setAttribute('npctype', 'other');
            }
        }
    }

    function highlighter_css() {
        // Build item/chest highlighting CSS
        const to_highlight = [];
        for (const el of ['items', 'gold_chest', 'combo_chest', 'silver_chest', 'bronze_chest', 'gold_key', 'silver_key', 'bronze_key']) {
            if (saved.checkbox[el] === 'yes') {
                to_highlight.push(`.items-layer .ct-item[hardy_highlight_${el}="yes"]`);
            }
        }

        if (to_highlight.length > 0) {
            let css = '';
            for (const el of to_highlight) {
                const key = el.match(/hardy_highlight_(\w+)/)[1];
                const color = (saved.color && saved.color[`color_${key}`]) || options.checkbox[key].color || '#00ff00';
                css += `${el} { position:absolute; border: 5px solid ${color} !important; border-radius:50%; animation: 2s ease-in-out infinite pulse; }`;
            }
            css += `@keyframes pulse { 0%, 100% { transform: scale(1); opacity: .5; } 50% { transform: scale(2); opacity: .8; } }`;
            GM_addStyle(css);
        }

        // Build NPC highlighting CSS
        if (saved.checkbox['highlight_santa'] === 'yes' || saved.checkbox['highlight_npc'] === 'yes') {
            let npccss = '.ct-user[npctype]::before { content:""; position:absolute; top:15px; left:15px; width:30px; height:30px; border-radius:50%; transform:translate(-50%,-50%); animation:1.5s ease-in-out infinite pulse-npc; pointer-events:none; } @keyframes pulse-npc { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.8 } 50% { transform:translate(-50%,-50%) scale(2); opacity:.4 } }';
            if (saved.checkbox['highlight_santa'] === 'yes') {
                const santaColor = (saved.color && saved.color['color_highlight_santa']) || options.checkbox['highlight_santa'].color || '#ff0000';
                npccss += ` .ct-user[npctype='santa']::before { border: 5px solid ${santaColor}; }`;
            }
            if (saved.checkbox['highlight_npc'] === 'yes') {
                const npcColor = (saved.color && saved.color['color_highlight_npc']) || options.checkbox['highlight_npc'].color || '#ff6200';
                npccss += ` .ct-user[npctype='other']::before { border: 5px solid ${npcColor}; }`;
            }
            GM_addStyle(npccss);
        }

        //santa clawz
            GM_addStyle(`[class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADuy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADu4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADms'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADjr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADSx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADPy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADOx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADLx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADKq'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADCS'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAD03'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACun'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACnk'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACmg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACSe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACGL'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC1U'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC0w'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAByX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAB7g'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACzVBMVEUAAACTM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAADlw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAAD67'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAACnR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADy2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADrw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADlt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADl5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgp'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgo'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADak'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADKx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADJn'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD57'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD16'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAClR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAACdN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAC0R'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAABxW'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKc'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC7lBMVEUAAACXN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADw7'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADvz'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADu6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADsx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADrx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADr1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADpv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADnt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADe6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADc2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADVg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADOv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADLh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADFV'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADEx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD68'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD28'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACup'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACQN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0p'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0l'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABpe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB2V'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB/e'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADt5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADf0'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADcr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADal'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADLv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADJx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACnl'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACWM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACMh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAC+Y'] {display: none;}`);

    }

    function gamesHelper_css() {
        // Hide Christmas wreath
        if (saved.checkbox['wreath'] === 'yes') {
            GM_addStyle(`img[alt='christmas wreath'] {display: none;}`);
        }
        // Hide all santas in snowball shooter
        if (saved.checkbox['snowball_shooter'] === 'yes') {
            GM_addStyle(`div[class^='moving-block'] img[alt^='santa'] {display: none;}`);
        }
        // Style for game helper boxes
        GM_addStyle(`
            .ctHelperGameBox { margin-top: 10px; margin-bottom: 10px; }
            .hardyCTHeader { background-color: #200505; color: #f2f2f2 !important; padding: 6px; font-size: 1.5em; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0; }
            .hardyGameBoxContent { background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 0 0 10px 10px; padding: 10px; min-height: 40px; }
            .ctHelperSuccess { color: #008000 !important; font-weight: bold; }
            .ctHelperError { color: red !important; font-weight: bold; }
            .helcostrDoesntLikeGreenCommas { color: black !important; }
            .hardyCTTypoAnswer { padding: 5px 10px; background-color: #4a9f33; color: white !important; margin: 5px; border-radius: 5px; border: none; cursor: pointer; font-weight: bold; }
            .hardyCTTypoAnswer:hover { background-color: #3e8a2a; }

            /* Garland Highlight */
            div[ct_garland_clicks="num_1"], div[ct_garland_clicks="num_2"], div[ct_garland_clicks="num_3"] {
                background-color: blue !important;
            }

            body.dark-mode .hardyCTHeader { background-color: #191919; color: #f2f2f2 !important; }
            body.dark-mode .hardyGameBoxContent { background-color: #333; color: #ddd; }
            body.dark-mode .helcostrDoesntLikeGreenCommas { color: white !important; }
            body.dark-mode .ctHelperSuccess { color: #90ee90 !important; }
        `);
    }

    function initFetchInterception() {
        unsafeWindow.fetch = async (url, init) => {
            const response_ = await original_fetch(url, init);
            const response = response_.clone();
            response.json().then((data) => {
                // Parse inventory for bonuses
                const invData = data.inventory || (data.mapData && data.mapData.inventory);
                if (invData) {
                    metadata.cache.spawn_rate = 0;
                    metadata.cache.speed_rate = 0;
                    for (const item of invData) {
                        if (item.category === "ornaments") {
                            if (item.modifierType === "itemSpawn") {
                                metadata.cache.spawn_rate += item.modifier;
                            } else if (item.modifierType === "speed") {
                                metadata.cache.speed_rate += item.modifier;
                            }
                        }
                    }
                    updateStatusBonuses();
                }

                if (url.includes('christmas_town.php?q=move') || url.includes('christmas_town.php?q=initMap')) {
                    if (gameHelper.state !== 'Inactive') gameHelper.stop();
                    if (data.mapData) {
                        if (data.mapData.inventory) {
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
                            updateStatusBonuses();
                        }
                        highlightNPC();
                        highlightItems();
                        highlighter_css();
                    }
                } else if (url.includes('christmas_town.php?q=miniGameAction')) {
                    let body = false;
                    if (init.body) {
                        body = JSON.parse(init.body);
                    }
                    if (body && body.action && body.action === 'start') {
                        if (body.gameType) {
                            const gameType = body.gameType;
                            if (gameType === 'gameWordFixer' && saved.checkbox.word_fixer === 'yes') {
                                gameHelper.state = 'Word Fixer';
                                gameHelper.start();
                                metadata.settings.games.wordFix = data.progress.word;
                                gameHelper.fixWord();
                            } else if (gameType === 'gameHangman' && saved.checkbox.hangman === 'yes') {
                                gameHelper.state = 'Hangman';
                                gameHelper.start();
                                metadata.cache.hangman.len = data.progress.words;
                                gameHelper.hangman_charLength();
                            } else if (gameType === 'gameTypocalypse' && saved.checkbox.typoGame === 'yes') {
                                if (gameHelper.state !== 'Typocalypse') {
                                    gameHelper.state = 'Typocalypse';
                                    gameHelper.start();
                                    // Set Typocalypse notice
                                    gameHelper.html = `<label class="ctHelperSuccess">Type the words appearing on the gifts. Click the buttons below to auto-fill the answer.</label>`;
                                    gameHelper.update();
                                    gameHelper.gameTypocalypseStart();
                                }
                            } else if (gameType === 'gameGarlandAssemble' && saved.checkbox.garland === 'yes') {
                                gameHelper.state = 'Garland Assemble';
                                gameHelper.start();
                                // Set a notice for Garland Assemble
                                gameHelper.html = `<label class="ctHelperSuccess">Solve the puzzle by continuously clicking on blue tiles until they no longer appear blue.</label> However, click slowly to avoid unnecessary clicks. Do not interact with any other tiles.`;
                                gameHelper.update();
                                setTimeout(() => gameHelper.garlandAssembleSolve(data), 500);
                            }
                        }
                    } else {
                        if (gameHelper.state === 'Word Fixer') {
                            if (data.finished) {
                                gameHelper.stop();
                            } else {
                                if (data.progress && data.progress.word) {
                                    metadata.settings.games.wordFix = data.progress.word;
                                    gameHelper.fixWord();
                                }
                            }
                        } else if (gameHelper.state === 'Hangman') {
                            if (data.mistakes === 6 || data.message.startsWith('Congratulations')) {
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
                }
            }).catch(err => console.log('[CT Helper] Fetch error:', err));
            return response_;
        };
    }

    // --- UI & Styling ---
    GM_addStyle(`
        #ct-helper-arrow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 999;
            display: none;
        }
        #ct-helper-arrow svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 0 3px #000);
        }
        .ct-helper-highlight-items #world .items-layer > * {
            filter: drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 16px #ffff00) !important;
            animation: ct-glow 0.5s ease-in-out infinite alternate !important;
        }
        @keyframes ct-glow {
            from { filter: drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 12px #ffff00); }
            to { filter: drop-shadow(0 0 12px #00ff00) drop-shadow(0 0 20px #ff6600); }
        }
        .awaken_modal_dialog { position: fixed; z-index: 10211; padding-top: 6px; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); }
        .awaken_modal { position: absolute; top: 50%; left: 50%; height: auto; transform: translate(-50%, -50%); background-color: #f2f2f2; width: 320px; border-radius: 0.5rem; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); font-family: sans-serif; }
        .awaken_modal_header { background-color: #200505; text-align: center; color: #fff; border-radius: 6px 6px 0 0; padding: 10px; font-weight: bold; }
        .awaken_modal_content { padding: 15px; max-height: 80vh; overflow-y: auto; }
        .awaken_modal_row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .awaken-save-prefs { background-color: #4CAF50; color: #fff; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px; }
        .settings-trigger { position: fixed; bottom: 20px; right: 20px; z-index: 10001; background: #200505; color: white; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 20px; }
        body.dark-mode .awaken_modal { background-color: #333; color: #f2f2f2; }
    `);

    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 200);
            }
        };
        check();
    }

    let statusPosition = 0;
    const positions = [
        { top: '10px', right: '10px', left: 'auto', bottom: 'auto' },
        { top: 'auto', right: '10px', left: 'auto', bottom: '10px' },
        { top: 'auto', right: 'auto', left: '10px', bottom: '10px' },
        { top: '10px', right: 'auto', left: '10px', bottom: 'auto' }
    ];
    const positionLabels = ['Top Right', 'Bottom Right', 'Bottom Left', 'Top Left'];

    function updateStatusBonuses() {
        const bonusDiv = document.getElementById('ct-bonus-display');
        if (bonusDiv) {
            bonusDiv.innerHTML = `
                <div style="color: #00ff00;">Spawn Rate: <span style="font-weight: bold;">${metadata.cache.spawn_rate}%</span></div>
                <div style="color: #00ff00;">Speed Rate: <span style="font-weight: bold;">${metadata.cache.speed_rate}%</span></div>
            `;
        }
    }

    function createStatusDisplay() {
        if (document.getElementById('ct-helper-status')) return;
        statusDiv = document.createElement('div');
        statusDiv.id = 'ct-helper-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            z-index: 99999;
            border: 1px solid rgba(0, 255, 0, 0.3);
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            min-width: 220px;
        `;
        statusDiv.innerHTML = `
            <div style="font-weight: bold; color: #ffffff; margin-bottom: 12px; text-align: center; border-bottom: 1px solid rgba(0, 255, 0, 0.2); padding-bottom: 8px; font-size: 15px;">
                CT Helper - <span style="color: #FFD700; font-size: 0.85em;">By Mr_Awaken</span>
            </div>
            <div id="ct-bonus-display" style="margin-bottom: 12px; line-height: 1.6;">
                <div style="color: #00ff00;">Spawn Rate: <span style="font-weight: bold;">${metadata.cache.spawn_rate}%</span></div>
                <div style="color: #00ff00;">Speed Rate: <span style="font-weight: bold;">${metadata.cache.speed_rate}%</span></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(0, 255, 0, 0.1); pt: 8px;">
                <div style="display: flex; justify-content: space-between;"><span>Status:</span> <span id="ct-status-text" style="color: #ffcc00;">Idle</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Item:</span> <span id="ct-item-name" style="color: #ffcc00; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">-</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Direction:</span> <span id="ct-direction-text" style="color: #ffcc00;">-</span></div>
            </div>
            <div style="font-size: 10px; color: #888; margin-top: 10px; text-align: center; font-style: italic;">(click to move widget)</div>
        `;
        document.body.appendChild(statusDiv);

        statusDiv.addEventListener('click', () => {
            statusPosition = (statusPosition + 1) % positions.length;
            const pos = positions[statusPosition];
            statusDiv.style.top = pos.top;
            statusDiv.style.right = pos.right;
            statusDiv.style.left = pos.left;
            statusDiv.style.bottom = pos.bottom;
            GM_setValue('ct_helper_position', statusPosition);
        });

        const savedPosition = GM_getValue('ct_helper_position', 0);
        statusPosition = savedPosition;
        const pos = positions[statusPosition];
        statusDiv.style.top = pos.top;
        statusDiv.style.right = pos.right;
        statusDiv.style.left = pos.left;
        statusDiv.style.bottom = pos.bottom;

        const trigger = document.createElement("div");
        trigger.className = "settings-trigger";
        trigger.innerHTML = "⚙️";
        trigger.onclick = openSettings;
        document.body.appendChild(trigger);
    }

    function openSettings() {
        if (document.querySelector(".awaken_modal_dialog")) return;
        const dialog = document.createElement("div");
        dialog.className = "awaken_modal_dialog";
        dialog.innerHTML = `
            <div class="awaken_modal">
                <div class="awaken_modal_header">CT Hybrid Settings</div>
                <div class="awaken_modal_content">
                    ${Object.entries(options.checkbox).map(([key, opt]) => `
                        <div class="awaken_modal_row">
                            <label style="font-size: 14px;">${opt.name}</label>
                            <div style="display:flex; align-items:center; gap:5px;">
                                ${opt.color ? `<input type="color" data-key="${key}" data-type="color" value="${(saved.color && saved.color[`color_${key}`]) || opt.color}" style="width:24px; height:24px; border:none; background:none;">` : ""}
                                <input type="checkbox" data-key="${key}" data-type="checkbox" ${saved.checkbox[key] === "yes" ? "checked" : ""}>
                            </div>
                        </div>
                    `).join("")}
                    <button class="awaken-save-prefs">Save & Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        dialog.querySelector(".awaken-save-prefs").onclick = () => {
            dialog.querySelectorAll("input").forEach(input => {
                const key = input.dataset.key;
                if (input.dataset.type === "checkbox") {
                    saved.checkbox[key] = input.checked ? "yes" : "no";
                } else if (input.dataset.type === "color") {
                    if (!saved.color) saved.color = {};
                    saved.color[`color_${key}`] = input.value;
                }
            });
            saveSettings();
            highlighter_css();
            gamesHelper_css();
            updateArrow();
            if (saved.checkbox.items === "yes") document.body.classList.add('ct-helper-highlight-items');
            else document.body.classList.remove('ct-helper-highlight-items');
            dialog.remove();
        };
    }

    function createArrowIndicator() {
        if (document.getElementById('ct-helper-arrow')) return;
        waitForElement('.user-map-container', (mapContainer) => {
            if (document.getElementById('ct-helper-arrow')) return;
            mapContainer.style.position = 'relative';
            arrowDiv = document.createElement('div');
            arrowDiv.id = 'ct-helper-arrow';
            arrowDiv.innerHTML = `
                <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 0 3px #000);">
                    <polygon id="ct-arrow-poly" points="50,10 90,90 50,70 10,90" fill="#00ff00" stroke="#003300" stroke-width="3"/>
                </svg>
                <div id="ct-arrow-distance" style="position:absolute; bottom:-15px; left:50%; transform:translateX(-50%); color:#00ff00; font-size:10px; text-shadow:0 0 3px #000; white-space:nowrap; font-family:monospace;"></div>
            `;
            mapContainer.appendChild(arrowDiv);
        });
    }

    function getPlayerPosition() {
        const youMarker = document.querySelector('.img-wrap.you, .svgImageWrap.you');
        const player = youMarker ? youMarker.closest('.ct-user') : null;
        if (!player) return null;
        const rect = player.getBoundingClientRect();
        const container = document.querySelector('.user-map-container')?.getBoundingClientRect();
        if (container) {
            return {
                x: rect.left - container.left + (rect.width / 2),
                y: rect.top - container.top + (rect.height / 2)
            };
        }
        return null;
    }

    function updateArrow() {
        if (!arrowDiv && document.querySelector('.user-map-container')) {
            createArrowIndicator();
            return;
        }

        if (!arrowDiv || saved.checkbox.arrow_enabled !== 'yes') {
            if (arrowDiv) arrowDiv.style.display = 'none';
            return;
        }

        const playerPos = getPlayerPosition();
        const containerEl = document.querySelector('.user-map-container');
        const container = containerEl?.getBoundingClientRect();

        if (!playerPos || !container) {
            arrowDiv.style.display = 'none';
            return;
        }

        arrowDiv.style.left = `${playerPos.x}px`;
        arrowDiv.style.top = `${playerPos.y}px`;

        let closestItem = null, closestDist = Infinity;
        const items = document.querySelectorAll('#world .items-layer > *');

        items.forEach(item => {
            if (item.id === 'ct-helper-arrow' || item.closest('#ct-helper-arrow')) return;
            const rect = item.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            if (!containerEl.contains(item)) return;
            const iX = rect.left - container.left + (rect.width / 2);
            const iY = rect.top - container.top + (rect.height / 2);
            const dx = iX - playerPos.x;
            const dy = iY - playerPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist && dist > 15) {
                closestDist = dist;
                closestItem = { x: iX, y: iY, dx, dy, element: item };
            }
        });

        if (!closestItem) {
            arrowDiv.style.display = 'none';
            const itemNameDiv = document.getElementById('ct-item-name');
            if (itemNameDiv) itemNameDiv.textContent = '-';
            return;
        }

        const angle = Math.atan2(closestItem.dy, closestItem.dx) * (180 / Math.PI) + 90;
        arrowDiv.style.display = 'block';
        arrowDiv.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        const distanceDiv = document.getElementById('ct-arrow-distance');
        if (distanceDiv) {
            distanceDiv.textContent = `${Math.round(closestDist / 30)} tiles`;
            distanceDiv.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
        }

        const poly = document.getElementById('ct-arrow-poly');
        let itemName = '🎁 Present';
        let color = "#00ff00";

        if (poly) {
            const img = closestItem.element.tagName === 'IMG' ? closestItem.element : closestItem.element.querySelector('img');
            const src = (img ? img.getAttribute('src') : (closestItem.element.getAttribute('src') || '')).toLowerCase();

            const categories = ["/keys/", "/chests/", "/combinationchest/"];
            let type = "items";

            for (const category of categories) {
                if (src.indexOf(category) !== -1) {
                    const typetxt = category.replace(/\//g, "").toLowerCase();
                    if (typetxt === "combinationchest") type = "combo_chest";
                    else if (typetxt === "keys") type = "chest_keys";
                    else if (typetxt === "chests") type = "chests";
                    break;
                }
            }

            if (type === "chest_keys") {
                if (src.includes("bronze")) {
                    itemName = "🟤 Bronze Key";
                    color = (saved.color && saved.color['color_bronze_key']) || options.checkbox['bronze_key'].color || '#cd7f32';
                } else if (src.includes("gold")) {
                    itemName = "🏆 Golden Key";
                    color = (saved.color && saved.color['color_gold_key']) || options.checkbox['gold_key'].color || '#ffd700';
                } else if (src.includes("silver")) {
                    itemName = "⚪ Silver Key";
                    color = (saved.color && saved.color['color_silver_key']) || options.checkbox['silver_key'].color || '#c0c0c0';
                }
            } else if (type === "chests") {
                if (src.includes("1.gif")) {
                    itemName = "🏆 Gold Chest";
                    color = (saved.color && saved.color['color_gold_chest']) || options.checkbox['gold_chest'].color || '#ffd700';
                } else if (src.includes("2.gif")) {
                    itemName = "⚪ Silver Chest";
                    color = (saved.color && saved.color['color_silver_chest']) || options.checkbox['silver_chest'].color || '#c0c0c0';
                } else if (src.includes("3.gif")) {
                    itemName = "🟤 Bronze Chest";
                    color = (saved.color && saved.color['color_bronze_chest']) || options.checkbox['bronze_chest'].color || '#cd7f32';
                }
            } else if (type === "combo_chest") {
                itemName = "🔐 Combo Chest";
                color = (saved.color && saved.color['color_combo_chest']) || options.checkbox['combo_chest'].color || '#ff00ff';
            } else {
                itemName = "🎁 Present";
                color = (saved.color && saved.color['color_items']) || options.checkbox['items'].color || '#00ff00';
            }

            poly.setAttribute('fill', color);
            
            // Only play sounds if a target was actually found and synced with the arrow
            playBingSound();
            chirp_sound.play();
        }

        const itemNameDiv = document.getElementById('ct-item-name');
        if (itemNameDiv) itemNameDiv.textContent = itemName;
    }

    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let itemChanged = false;
            mutations.forEach(m => {
                if (m.addedNodes.length || m.removedNodes.length) {
                    // Filter out non-map related mutations if possible
                    // But for now, we follow the logic that a mutation might mean a new item
                    itemChanged = true;
                }
            });
            if (itemChanged) {
                updateArrow();
                // Both sounds are now handled inside updateArrow to ensure sync with detection
            }
        });
        const world = document.getElementById('world');
        if (world) observer.observe(world, { childList: true, subtree: true });
    }

    function setupMapOverlay(mapElement) {
        if (document.getElementById('ct-click-overlay')) return;
        const mapContainer = mapElement.closest('.user-map-container') || mapElement;
        const overlay = document.createElement('div');
        overlay.id = 'ct-click-overlay';
        overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;cursor:crosshair;';

        overlay.addEventListener('click', (e) => {
            if (isAutoRunning) { stopAutoRun(); return; }
            const rect = overlay.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const angle = Math.atan2(clickY - centerY, clickX - centerX) * (180 / Math.PI);

            let dir = null;
            if (angle >= -22.5 && angle < 22.5) dir = 'right';
            else if (angle >= 22.5 && angle < 67.5) dir = 'right-bottom';
            else if (angle >= 67.5 && angle < 112.5) dir = 'bottom';
            else if (angle >= 112.5 && angle < 157.5) dir = 'left-bottom';
            else if (angle >= 157.5 || angle < -157.5) dir = 'left';
            else if (angle >= -157.5 && angle < -112.5) dir = 'left-top';
            else if (angle >= -112.5 && angle < -67.5) dir = 'top';
            else if (angle >= -67.5 && angle < -22.5) dir = 'right-top';
            if (dir) startAutoRun(dir);
        });
        mapContainer.appendChild(overlay);
    }

    function triggerMove(direction) {
        const control = document.querySelector(`ul.map-controls li.${direction}`);
        if (control) {
            ['mousedown', 'mouseup', 'click'].forEach(t => control.dispatchEvent(new MouseEvent(t, {bubbles:true})));
        }
    }

    function startAutoRun(dir) {
        stopAutoRun(); 
        isAutoRunning = true; 
        currentDirection = dir;
        const statusText = document.getElementById('ct-status-text');
        const directionText = document.getElementById('ct-direction-text');
        if (statusText) statusText.textContent = 'Running';
        if (directionText) directionText.textContent = dir;

        autoRunInterval = setInterval(() => {
            if (isAutoRunning && currentDirection) {
                triggerMove(currentDirection);
            }
        }, MOVE_INTERVAL);
    }

    function stopAutoRun() {
        isAutoRunning = false; 
        currentDirection = null;
        if (autoRunInterval) {
            clearInterval(autoRunInterval);
            autoRunInterval = null;
        }
        const statusText = document.getElementById('ct-status-text');
        const directionText = document.getElementById('ct-direction-text');
        if (statusText) statusText.textContent = 'Idle';
        if (directionText) directionText.textContent = '-';
    }

    function initAudio() {
        chirp_sound.getLast();
    }

    function playBingSound() {
        if (saved.checkbox.sound_enabled !== 'yes') return;
        
        // Only play Bing for high priority items (Chests and Keys)
        const itemNameDiv = document.getElementById('ct-item-name');
        const itemName = itemNameDiv ? itemNameDiv.textContent : "";
        const isHighPriority = itemName.includes("Chest") || itemName.includes("Key");
        
        if (!isHighPriority) return;

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        try {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (e) {
            console.log('[CT Helper] Audio error:', e);
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

    init();
    setInterval(updateArrow, 100);
    document.addEventListener('keydown', (e) => { 
        if (e.key === ' ' || e.key === 'Escape') stopAutoRun(); 
    });

    // Santa stuck fix observer (from ct.js)
    const initGameObserver = () => {
        const targetNode = document.body;
        const config = { childList: true, subtree: true, characterData: true };
        let lastTitle = "";

        const callback = () => {
            const statusTitle = document.querySelector('.status-title');
            if (!statusTitle) return;

            const titleTextRaw = statusTitle.innerText.trim();
            const titleTextClean = titleTextRaw.toLowerCase().replace(/\s+/g, ' ');

            if (titleTextClean === lastTitle) return;
            lastTitle = titleTextClean;

            const santaDiv = document.querySelector('.santaMessageWrapper___MV6M3 p.paragraph');
            if (!santaDiv) return;

            if (santaDiv.innerText.includes('There are no more presents for you today')) {
                if (canFixSantaToday()) {
                    const todayDate = new Date().toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
                    localStorage.setItem('santaLastFixedDate', todayDate);
                    console.log("Santa fix applied for today");
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    };
    initGameObserver();

    function canFixSantaToday() {
        const todayDate = new Date().toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
        const lastFixedDate = localStorage.getItem('santaLastFixedDate');
        if (lastFixedDate !== todayDate) {
            return true;
        }
        return false;
    }
})();
 
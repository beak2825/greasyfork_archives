// ==UserScript==
// @name         BlackJackStrat
// @namespace    http://tampermonkey.net/s
// @version      2025-12-01.8
// @description  Script to help with Blackjack.
// @author       You
// @match        https://www.torn.com/page.php?sid=blackjack
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557483/BlackJackStrat.user.js
// @updateURL https://update.greasyfork.org/scripts/557483/BlackJackStrat.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // All code from and credit to torntools

    const ACTIONS = {
        H: "Hit",
        S: "Stand",
        D: "Double Down",
        P: "Split",
        R: "Surrender",
    };

    /* these suggestions come from :
	https://www.beatingbonuses.com/bjstrategy.php?decks=8&soft17=stand&doubleon=any2cards&peek=off&das=on&dsa=on&charlie=on&surrender=earlyf&opt=1&btn=Generate+Strategy
	(8 decks, double on any 2 cards, Double after Split, Hit Split Aces, 6-Card charlie, No Resplits Allowed, Dealer Stands on Soft 17, Dealer does not peek, full early surrender)
	*/

    const OUTPUT_DEBUG = true;

    const SUGGESTIONS = {
        // 4 is only used in a very specific case : After 2,2 is split and you get dealt another 2. Re-splits are not allowed, and therefore you need a backup strategy (which is to always hit, based on the strategy for 2,2).
        4: {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        5: {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        6: {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        7: {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        8: {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        9: {
            2: "H",
            3: "D",
            4: "D",
            5: "D",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        10: {
            2: "D",
            3: "D",
            4: "D",
            5: "D",
            6: "D",
            7: "D",
            8: "D",
            9: "D",
            10: "H",
            A: "H",
        },
        11: {
            2: "D",
            3: "D",
            4: "D",
            5: "D",
            6: "D",
            7: "D",
            8: "D",
            9: "D",
            10: "H",
            A: "H",
        },
        12: {
            2: "H",
            3: "H",
            4: "S3",
            5: "S3",
            6: "S3",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        13: {
            2: "S3",
            3: "S3",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        14: {
            2: "S4",
            3: "S4",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "H",
            8: "H",
            9: "H",
            10: "R",
            A: "R",
        },
        15: {
            2: "S4",
            3: "S4",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "H",
            8: "H",
            9: "H",
            10: "R",
            A: "R",
        },
        16: {
            2: "S4",
            3: "S4",
            4: "S",
            5: "S",
            6: "S",
            7: "H",
            8: "H",
            9: "R",
            10: "Rs",
            A: "R",
        },
        17: {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S4",
            10: "S4",
            A: "RS4",
        },
        18: {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S",
            10: "S",
            A: "S",
        },
        19: {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S",
            10: "S",
            A: "S",
        },
        20: {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S",
            10: "S",
            A: "S",
        },
        21: {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S",
            10: "S",
            A: "S",
        },
        "A,2": {
            2: "H",
            3: "H",
            4: "H",
            5: "H",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,3": {
            2: "H",
            3: "H",
            4: "H",
            5: "D",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,4": {
            2: "H",
            3: "H",
            4: "H",
            5: "D",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,5": {
            2: "H",
            3: "H",
            4: "D",
            5: "D",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,6": {
            2: "H",
            3: "D",
            4: "D",
            5: "D",
            6: "D",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,7": {
            2: "S3",
            3: "DS3",
            4: "DS3",
            5: "DS3",
            6: "DS3",
            7: "S4",
            8: "S3",
            9: "H",
            10: "H",
            A: "H",
        },
        "A,8": {
            2: "S4",
            3: "S4",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "S4",
            8: "S4",
            9: "S4",
            10: "S3",
            A: "S4",
        },
        "A,9": {
            2: "S4",
            3: "S4",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "S4",
            8: "S4",
            9: "S4",
            10: "S4",
            A: "S4",
        },
        "A,10": {
            2: "S4",
            3: "S4",
            4: "S4",
            5: "S4",
            6: "S4",
            7: "S4",
            8: "S4",
            9: "S4",
            10: "S4",
            A: "S4",
        },
        "2,2": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "P",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "3,3": {
            2: "H",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "P",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        "4,4": {
            2: "H",
            3: "H",
            4: "H",
            5: "P",
            6: "P",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "H",
        },
        "5,5": {
            2: "D",
            3: "D",
            4: "D",
            5: "D",
            6: "D",
            7: "D",
            8: "D",
            9: "D",
            10: "H",
            A: "H",
        },
        "6,6": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            A: "R",
        },
        "7,7": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "P",
            8: "H",
            9: "H",
            10: "R",
            A: "R",
        },
        "8,8": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "P",
            8: "H",
            9: "H",
            10: "Rs",
            A: "R",
        },
        "9,9": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "S",
            8: "P",
            9: "P",
            10: "S",
            A: "S",
        },
        "10,10": {
            2: "S",
            3: "S",
            4: "S",
            5: "S",
            6: "S",
            7: "S",
            8: "S",
            9: "S",
            10: "S",
            A: "S",
        },
        "A,A": {
            2: "P",
            3: "P",
            4: "P",
            5: "P",
            6: "P",
            7: "P",
            8: "P",
            9: "P",
            10: "P",
            A: "P",
        },
    };

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    let utc = new Date().toISOString();
    let yyyymmdd = utc.slice(0,4) + utc.slice(5,7) + utc.slice(8,10);

    let defaultData = {'baseBetAmount': 1000000, 'multiplier': 1, 'lastBetAmount': 0, 'totalToday': 0, 'today': yyyymmdd}
    let cards;
    let betAmountData;

    let baseData = loadFromStorage('baseData', defaultData);

    debug('load ', baseData);

    const betContainer = document.createElement("div");
    betContainer.className = "betcontainer";

    const textDiv = document.createElement("div");
    textDiv.className = "baseAmount";
    textDiv.textContent = "Base: ";

    const textDivNextBet = document.createElement("div");
    textDivNextBet.className = "nextBet";
    textDivNextBet.textContent = "Next Bet: " + formatter.format(baseData.baseBetAmount * baseData.multiplier);

    const textDivTotalWon = document.createElement("div");
    textDivTotalWon.className = "totalWon";
    textDivTotalWon.textContent = "Total Won: " + formatter.format(baseData.totalToday);

    const textDivMulti = document.createElement("div");
    textDivMulti.className = "multi";
    textDivMulti.textContent = "Current Multiplyer: " + baseData.multiplier;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "baseBetInput";
    input.value = baseData.baseBetAmount;

    const updateButton = document.createElement("button");
    updateButton.className = "updateBase";
    updateButton.textContent = "Update";

    const resetButton = document.createElement("button");
    resetButton.className = "resetBase";
    resetButton.textContent = "Reset";

    textDiv.appendChild(input);
    textDiv.appendChild(updateButton);
    betContainer.appendChild(textDivNextBet);
    betContainer.appendChild(textDivTotalWon);
    betContainer.appendChild(textDivMulti);
    betContainer.appendChild(textDiv);
    betContainer.appendChild(resetButton);

    const style = document.createElement("style");
    style.textContent = `
  .nextBet, .totalWon, .multi, .baseAmount {
    font-size: 14px;
    padding: 10px;
    color: #ddd;
  }
  .baseBetInput{
    width: 100px;
    padding:2px;
  }
  .resetBase, .updateBase{
    cursor:pointer;
    border: 1px solid;
    background-color: darkgrey;
  }
`;
    document.head.appendChild(style);

    function debug(...args){
        if(OUTPUT_DEBUG){
            console.log(...args);
        }
    }

    // Save any value to localStorage (auto JSON-encodes)
    function saveToStorage(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (err) {
            console.error("Failed to save to storage:", err);
        }
    }

    // Load any value from localStorage (auto JSON-decodes)
    function loadFromStorage(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (err) {
            console.error("Failed to load from storage:", err);
            return defaultValue;
        }
    }

    function initialiseStrategy() {
        addXHRListen2(({ detail: { page, xhr, json } }) => {
            if (page === "page") {
                let params = new URL(xhr.responseURL).searchParams;
                let sid = params.get("sid");
                if (sid === "blackjackData" && json) {
                    debug('json', json);
                    switch (json.DB.result) {
                            // case undefined:
                        case "gameStarted":
                            updateBetAmountData('gs', json.DB);
                            break;
                        case "chooseAction":
                            executeStrategy(json.DB);
                            break;
                        case "startGame":
                            showStartBet();
                            debug('sg');
                            break;
                        case "won":
                            updateBetAmountData('w', json.DB);
                            break;
                        case "wonNatural":
                            updateBetAmountData('nw', json.DB);
                            break;
                        case "lost":
                            updateBetAmountData('l', json.DB);
                            break;
                        case "dealerLost":
                            updateBetAmountData('dl', json.DB);
                            break;
                        case "draw":
                            updateBetAmountData('d', json.DB);
                            removeSuggestion();
                            break;
                        case "surrendered":
                            updateBetAmountData('s', json.DB);
                            removeSuggestion();
                            break;
                        default:
                            if (json.DB.roundNotEnded && json.DB.nextGame) {
                                executeStrategy(json.DB);
                            }
                            break;
                    }
                }
            }
        });
    }

    function getTodayNumeric() {
        const d = new Date();
        return Number(
            d.getFullYear().toString() +
            String(d.getMonth() + 1).padStart(2, "0") +
            String(d.getDate()).padStart(2, "0")
        );
    }

    function showStartBet(){
        let baseBetInput = document.find(".baseBetInput");

        if (baseBetInput) {
            baseBetInput.show();
        } else {
            document.find(".bet-action").appendChild(betContainer);
            updateButton.addEventListener("click", () => {
                updateBaseBet();
            });
            resetButton.addEventListener("click", () => {
                resetBaseBet();
            });
        }

        updatePannel();
    }

    function resetBaseBet(){
        let d = new Date();
        let utc = d.toISOString();
        let yyyymmdd = utc.slice(0,4) + utc.slice(5,7) + utc.slice(8,10);

        let baseBetInput = document.find(".baseBetInput");
        debug('resetBaseBet', baseBetInput.value);
        baseData.baseBetAmount = baseBetInput.value;
        baseData.multiplier = 1;
        baseData.totalToday = 0;
        baseData.today = yyyymmdd;
        updatePannel();
        saveToStorage('baseData', baseData);
    }

    function updatePannel(){
        let utc = new Date().toISOString();
        let yyyymmdd = utc.slice(0,4) + utc.slice(5,7) + utc.slice(8,10);

        if(baseData.today != yyyymmdd){
            resetBaseBet();
        }

        let nextBetAmount = baseData.baseBetAmount * baseData.multiplier;

        const textDivTotalWon = document.find(".totalWon");
        textDivTotalWon.textContent = "Total Won: " + formatter.format(baseData.totalToday);

        const textDivNextBet = document.find(".nextBet");
        textDivNextBet.textContent = "Next Bet: " + formatter.format(nextBetAmount);

        const input = document.find(".baseBetInput");
        input.value = baseData.baseBetAmount;

        const multi = document.find(".multi");
        multi.value = "Current Multiplyer: " + baseData.multiplier;

    }

    function updateBaseBet(){
        let baseBetInput = document.find(".baseBetInput");
        debug('updateBaseBet', baseBetInput.value);
        baseData.baseBetAmount = baseBetInput.value;
        updatePannel();
        saveToStorage('baseData', baseData);
    }

    function hideStartBet(){
        document.find(".baseBetInput").hide();
    }

    function updateBetAmountData(a, data){
        debug(a, data);
        if(a == 'gs'){
            let inputs = document.find(".bet.input-money");
            baseData.lastBetAmount = parseInt(inputs.value.replace(/[^0-9]/g, ""), 10);
            saveToStorage('baseData', baseData);
            debug('start ', baseData);
            hideStartBet();
        }

        if(a == 'w' || a == 'nw' || a == 'dl'){
            // check for double down

            baseData.multiplier = 1;
            baseData.totalToday = (parseInt(baseData.totalToday) + parseInt(baseData.lastBetAmount));
            saveToStorage('baseData', baseData);
            debug('win ', baseData);
        }

        if(a == 'l'){
            // check for double down

            baseData.multiplier = (baseData.multiplier == 1? 2: baseData.multiplier == 2? 4: 1);
            baseData.totalToday = (parseInt(baseData.totalToday) - parseInt(baseData.lastBetAmount));
            saveToStorage('baseData', baseData);
            debug('loss ', baseData);
        }

        if(a == 's'){
            baseData.multiplier = (baseData.multiplier == 1? 2: baseData.multiplier == 2? 4: 1);
            baseData.totalToday = (parseInt(baseData.totalToday) - (parseInt(baseData.lastBetAmount)/2));
            saveToStorage('baseData', baseData);
            debug('surrender ', baseData);
        }

        if(a == 'd'){
            debug('draw', baseData);
        }

    }

    function executeStrategy(data) {
        cards = { dealer: getWorth(data.dealer.hand[0]), player: [] };
        debug('executeStrategy', data);
        debug(cards);

        debug('cards.player',cards.player);
        for (let card of data.player.hand) {
            let worth = getWorth(card);
            debug('card', card, 'worth', worth);
            cards.player.push(worth);
            debug('cards.player1',cards.player);
        }

        debug('cards.player2',cards.player);

        let playerValue;
        debug('1'); // ********
        if (cards.player.length === 2) {
            debug('2'); // ********
            if (cards.player.includes("A")) {
                debug('3'); // ********
                let other = cards.player.find((worth) => worth !== "A");

                if (!other) playerValue = "A,A";
                else playerValue = `A,${other}`;
            } else if (cards.player[0] === cards.player[1]) {
                debug('4', cards); // ********
                playerValue = `${cards.player[0]},${cards.player[1]}`;
            } else {
                debug('5'); // ********
                playerValue = data.player.score;
            }
        } else {
            debug('6'); // ********
            if (cards.player.includes("A") && data.player.score !== data.player.lowestScore) {
                debug('7'); // ********
                let leftOver = cards.player.filter((card) => card !== "A").map(getWorth);
                let leftOverWorth = leftOver.totalSum() + (cards.player.length - 1 - leftOver.length);

                playerValue = `A,${leftOverWorth}`;
            } else {
                debug('7'); // ********
                playerValue = data.player.score;
            }
        }
        debug('8', playerValue); // ********
        let suggestion = getSuggestion(playerValue, data);

        let element = document.find(".blackjack-suggestion");

        if (element) element.textContent = suggestion;
        else {
            document.find(".player-cards").appendChild(document.newElement({ type: "span", class: "blackjack-suggestion", text: suggestion, style: {color: '#00a0ea', position: 'absolute', fontSize: '17px', marginTop: '15px'} }));
        }

    }

    function getWorth(card) {
        //debug('get worth card:', card);

        let symbol;
        if (typeof card === "string") {
            symbol = card.split("-").last();
            //debug('symbol',symbol, isNaN(symbol), isNaN(symbol) ? (symbol === "A" ? "A" : 10) : parseInt(symbol));
        } else symbol = card;

        //debug('symbol', symbol, parseInt(symbol));

        return isNaN(symbol) ? (symbol === "A" ? "A" : 10) : parseInt(symbol);
    }

    function getSuggestion(player, data) {
        let suggestion;
        if (player in SUGGESTIONS) {
            let dealer = cards.dealer;

            if (dealer in SUGGESTIONS[player]) {
                let action = getAction(SUGGESTIONS[player][dealer], true, data, player);

                suggestion = action in ACTIONS ? ACTIONS[action] : `no action - ${action}`;
            } else {
                suggestion = "no suggestion - dealer: " + dealer;
                //debug("no suggestion - dealer: ", dealer, player);

            }
        } else {
            suggestion = "no suggestion - " + player;
            //debug("no suggestion: ", player);
        }

        return suggestion;
    }

    function getAction(action, allowSelf, data, player) {
        if (action === "S3") return cards.player.length > 3 ? "H" : "S";
        else if (action === "S4") return cards.player.length > 4 ? "H" : "S";
        else if (action === "D" && !data.availableActions.includes("doubleDown")) return "H";
        else if (action === "DS3") return data.availableActions.includes("doubleDown") ? "D" : cards.player.length > 3 ? "H" : "S";
        else if (action === "R" && !data.availableActions.includes("surrender")) return "H";
        else if (action === "Rs") return data.availableActions.includes("surrender") ? "R" : "S";
        else if (action === "RS4") return data.availableActions.includes("surrender") ? "R" : cards.player.length > 4 ? "H" : "S";
        else if (action === "P" && !data.availableActions.includes("split")) {
            if (allowSelf) {
                let hand = player.split(",");
                if (hand[0] === hand[1]) {
                    let value;
                    if (isNaN(hand[0])) {
                        if (hand[0] === "A") {
                            return "H"; // It's not in the suggestions array, but we should always hit A,A after split
                        } else value = 20;
                    } else value = parseInt(hand[0]) * 2;

                    let alternative = getAction(SUGGESTIONS[value][cards.dealer], false);
                    if (alternative !== "P") return alternative;
                }
            }

            return "H";
        }

        return action;
    }

    function removeSuggestion() {
        let suggestion = document.find(".blackjack-suggestion");
        if (suggestion) suggestion.remove();
    }

    function addXHRListen2(callback) {
        interceptXHR2("bj-xhr2");
        window.addEventListener("bj-xhr2", callback);
    }

    function interceptXHR2(channel) {
        let oldXHROpen = window.XMLHttpRequest.prototype.open;
        let oldXHRSend = window.XMLHttpRequest.prototype.send;

        window.XMLHttpRequest.prototype.open = function (method, url) {
            let params = this.params ?? {};

            this.method = method;
            this.url = url;
            this.params = params;

            this.addEventListener("readystatechange", function () {
                if (this.readyState > 3 && this.status === 200) {
                    let page = this.responseURL.substring(this.responseURL.indexOf("torn.com/") + "torn.com/".length, this.responseURL.indexOf(".php"));

                    let json, uri;
                    if (isJsonString(this.response)) json = JSON.parse(this.response);
                    else uri = getUrlParams(this.responseURL);

                    window.dispatchEvent(
                        new CustomEvent(channel, {
                            detail: {
                                page,
                                json,
                                uri,
                                xhr: {
                                    // We used to pass the current XHR here as "...this"
                                    // but not possible due to some change in Chromium.
                                    // https://stackoverflow.com/a/53914790
                                    // https://issues.chromium.org/issues/40091619
                                    requestBody: this.requestBody,
                                    response: this.response,
                                    responseURL: this.responseURL,
                                },
                            },
                        })
                    );
                }
            });

            arguments[0] = method;
            arguments[1] = url;

            return oldXHROpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function (body) {
            this.params = this.params ?? {};
            /*
            if (typeof xhrSendAdjustments === "object") {
                for (let key in xhrSendAdjustments) {
                    if (typeof xhrSendAdjustments[key] !== "function") continue;

                    body = xhrSendAdjustments[key]({ ...this }, body);
                }
            }
*/
            this.requestBody = body;

            arguments[0] = body;

            return oldXHRSend.apply(this, arguments);
        };

        //
	 //* JavaScript Get URL Parameter (https://www.kevinleary.net/javascript-get-url-parameters/)
	 //
        function getUrlParams(url, prop) {
            if (!url) url = location.href;

            let search = decodeURIComponent(url.slice(url.indexOf("?") + 1));
            let definitions = search.split("&");

            let params = {};
            definitions.forEach((val) => {
                let parts = val.split("=", 2);

                params[parts[0]] = parts[1];
            });

            return prop && prop in params ? params[prop] : params;
        }

        // Global functions
        function isJsonString(str) {
            if (!str || str === "") return false;

            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    function getParams(body) {
        let params = {};

        for (let param of body.split("&")) {
            let split = param.split("=");

            params[split[0]] = split[1];
        }

        return params;
    }

    // noinspection JSUnusedGlobalSymbols
    function paramsToBody(params) {
        let _params = [];

        for (let key in params) {
            _params.push(key + "=" + params[key]);
        }

        return _params.join("&");
    }

    function _find(element, selector, options = {}) {
        options = {
            text: false,
            ...options,
        };

        if (options.text) {
            for (let element of document.querySelectorAll(selector)) {
                if (element.textContent === options.text) {
                    return element;
                }
            }
        }

        if (selector.includes("=") && !selector.includes("[")) {
            let key = selector.split("=")[0];
            let value = selector.split("=")[1];

            for (let element of document.querySelectorAll(key)) {
                if (element.textContent.trim() === value.trim()) {
                    return element;
                }
            }

            try {
                element.querySelector(selector);
            } catch (err) {
                return undefined;
            }
        }
        return element.querySelector(selector);
    }

    Object.defineProperty(Document.prototype, "find", {
        value(selector, options = {}) {
            return _find(this, selector, options);
        },
        enumerable: false,
    });

    Object.defineProperty(Array.prototype, "last", {
        value() {
            return this[this.length - 1];
        },
        enumerable: false,
    });

    Object.defineProperty(Document.prototype, "newElement", {
        value(options = {}) {
            if (typeof options === "string") {
                return this.createElement(options);
            } else if (typeof options === "object") {
                options = {
                    type: "div",
                    id: false,
                    class: false,
                    text: false,
                    html: false,
                    value: false,
                    href: false,
                    children: [],
                    attributes: {},
                    events: {},
                    style: {},
                    dataset: {},
                    ...options,
                };

                let newElement = this.createElement(options.type);

                if (options.id) newElement.id = options.id;
                if (options.class) {
                    if (Array.isArray(options.class)) newElement.setClass(...options.class.filter((name) => !!name));
                    else newElement.setClass(options.class.trim());
                }
                if (options.text !== false) newElement.textContent = options.text;
                if (options.html) newElement.innerHTML = options.html;
                if (options.value) {
                    if (typeof options.value === "function") newElement.value = options.value();
                    else newElement.value = options.value;
                }
                if (options.href) newElement.href = options.href;

                for (let child of options.children.filter((child) => !!child) || []) {
                    if (typeof child === "string") {
                        newElement.appendChild(document.createTextNode(child));
                    } else {
                        newElement.appendChild(child);
                    }
                }

                if (options.attributes) {
                    let attributes = options.attributes;
                    if (typeof attributes === "function") attributes = attributes();

                    for (let attribute in attributes) newElement.setAttribute(attribute, attributes[attribute]);
                }
                for (let event in options.events) newElement.addEventListener(event, options.events[event]);

                for (let key in options.style) newElement.style[key] = options.style[key];
                for (let key in options.dataset) {
                    if (typeof options.dataset[key] === "object") newElement.dataset[key] = JSON.stringify(options.dataset[key]);
                    else newElement.dataset[key] = options.dataset[key];
                }

                return newElement;
            }
        },
        enumerable: false,
    });

    Object.defineProperty(Document.prototype, "setClass", {
        value(...classNames) {
            this.setAttribute("class", classNames.join(" "));
        },
        enumerable: false,
    });

    Object.defineProperty(Element.prototype, "setClass", {
        value(...classNames) {
            this.setAttribute("class", classNames.join(" "));
        },
        enumerable: false,
    });

    Object.defineProperty(Element.prototype, "hide", {
        value() {
            this.setAttribute("style", "display: none;");
        },
        enumerable: false,
    });

    Object.defineProperty(Element.prototype, "show", {
        value() {
            this.setAttribute("style", "display: block;");
        },
        enumerable: false,
    });

    initialiseStrategy();
})();
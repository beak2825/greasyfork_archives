// ==UserScript==
// @name         Chess.com Assistant
// @namespace    Buffxny
// @version      1.0.0
// @description  Chess.com Assistant that finds the best move
// @author       Buffxny
// @license      MIT
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     stockfish.js        https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://greasyfork.org/scripts/445697/code/index.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563030/Chesscom%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/563030/Chesscom%20Assistant.meta.js
// ==/UserScript==
const currentVersion = '1.0.0';
function main() {
    var stockfishObjectURL;
    var engine = document.engine = {};
    var myVars = document.myVars = {};
    myVars.suggestMove = GM_getValue('suggestMove', false);
    myVars.customDepth = GM_getValue('customDepth', 11);
    var myFunctions = document.myFunctions = {};
    myVars.activeHighlights = [];
    myFunctions.color = function(dat) {
        console.log("[Move] Processing:", dat);
        console.log("[Highlight] Attempting highlight on board element:", board ? board.nodeName : 'Board not found!');
        let response = dat;
        let res1 = response.substring(0, 2);
        let res2 = response.substring(2, 4);
        isThinking = false;
        res1 = res1.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        res2 = res2.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        myFunctions.clearHighlights();
        const destHighlight = $('<div class="highlight square-' + res2 + ' bro" style="background-color: #7fa650; opacity: 0; border-radius: 5px; box-shadow: inset 0 0 5px rgba(255,255,255,0.5); data-test-element="highlight"></div>');
        $(board.nodeName).prepend(destHighlight);
        myVars.activeHighlights.push(destHighlight);
        destHighlight.animate({
            opacity: 0.7
        }, 300);
        const originHighlight = $('<div class="highlight square-' + res1 + ' bro" style="background-color: #7fa650; opacity: 0; border-radius: 5px; box-shadow: inset 0 0 5px rgba(255,255,255,0.5); data-test-element="highlight"></div>');
        $(board.nodeName).prepend(originHighlight);
        myVars.activeHighlights.push(originHighlight);
        originHighlight.animate({
            opacity: 0.7
        }, 300);
        setTimeout(function() {
            myFunctions.clearHighlights();
        }, 1800);
    };
    myFunctions.clearHighlights = function() {
        if (myVars.activeHighlights && myVars.activeHighlights.length > 0) {
            myVars.activeHighlights.forEach(function(highlight) {
                highlight.animate({
                    opacity: 0
                }, 300, function() {
                    $(this).remove();
                });
            });
            myVars.activeHighlights = [];
        }
        $('.highlight.bro').animate({
            opacity: 0
        }, 300, function() {
            $(this).remove();
        });
    };
    function parser(e) {
        console.log("[Engine] Message:", e.data);
        if (e.data.includes('info depth') && e.data.includes('pv')) {
            try {
                const parts = e.data.split(' ');
                const depthIndex = parts.indexOf('depth');
                const scoreIndex = parts.indexOf('score');
                const pvIndex = parts.indexOf('pv');
                if (depthIndex >= 0 && scoreIndex >= 0 && pvIndex >= 0) {
                    const depth = parseInt(parts[depthIndex + 1]);
                    const scoreType = parts[scoreIndex + 1];
                    const scoreValue = parseInt(parts[scoreIndex + 2]);
                    const move = parts[pvIndex + 1];
                    let evalText = '';
                    if (scoreType === 'cp') {
                        const pawns = (scoreValue / 100).toFixed(2);
                        evalText = (pawns > 0 ? '+' : '') + pawns;
                    } else if (scoreType === 'mate') {
                        evalText = 'M' + (scoreValue > 0 ? '+' : '') + scoreValue;
                    }
                    if (!myVars.topMoves) {
                        myVars.topMoves = [];
                    }
                    const existingIndex = myVars.topMoves.findIndex(m => m.move === move);
                    if (existingIndex >= 0) {
                        myVars.topMoves[existingIndex] = { move, evalText, depth, score: scoreValue };
                    } else {
                        myVars.topMoves.push({ move, evalText, depth, score: scoreValue });
                    }
                    myVars.topMoves.sort((a, b) => b.score - a.score);
                    myVars.topMoves = myVars.topMoves.slice(0, 2);
                    if (document.getElementById('topMove1') && myVars.topMoves.length > 0) {
                        for (let i = 0; i < Math.min(2, myVars.topMoves.length); i++) {
                            const moveElem = document.getElementById(`topMove${i+1}`);
                            const evalElem = document.getElementById(`topMoveEval${i+1}`);
                            if (moveElem && evalElem) {
                                moveElem.innerText = myVars.topMoves[i].move;
                                evalElem.innerText = myVars.topMoves[i].evalText;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("[Engine] Error parsing move info:", error);
            }
        }
        if (e.data.includes('bestmove')) {
            console.log("[Engine] Found best move:", e.data);
            const bestMove = e.data.split(' ')[1];
            myFunctions.color(bestMove);
            isThinking = false;
            myVars.topMoves = [];
        }
    }
    myFunctions.loadChessEngine = function() {
        console.log("[Engine] Loading Stockfish...");
        try {
            if (!stockfishObjectURL) {
            stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('stockfish.js')], {type: 'application/javascript'}));
        }
            engine.engine = new Worker(stockfishObjectURL);
            engine.engine.onmessage = e => {
                parser(e);
            };
            engine.engine.onerror = e => {
                console.error("[Engine] Error:", e);
                isThinking = false;
            };
            engine.engine.postMessage('ucinewgame');
            console.log("[Engine] Loaded successfully");
        } catch (error) {
            console.error("[Engine] Load failed:", error);
        }
    };
    myFunctions.reloadChessEngine = function() {
        console.log("[Engine] Reloading...");
        try {
            if (engine.engine) {
                engine.engine.terminate();
            }
            isThinking = false;
            stockfishObjectURL = null;
            setTimeout(() => {
                myFunctions.loadChessEngine();
                console.log("[Engine] Reloaded successfully");
            }, 100);
        } catch (error) {
            console.error("[Engine] Reload failed:", error);
        }
    };
    myFunctions.runChessEngine = function(depth) {
        console.log("[Engine] Running at depth", depth);
        let fen = board.game.getFEN();
        console.log("[Engine] Position:", fen);
        engine.engine.postMessage(`position fen ${fen}`);
        isThinking = true;
        engine.engine.postMessage(`go depth ${depth}`);
        lastValue = depth;
    };
    myFunctions.autoRun = function(depth) {
        if (board.game.getTurn() == board.game.getPlayingAs()) {
            myFunctions.runChessEngine(depth || myVars.customDepth);
        }
    };
    function other(delay) {
        let endTime = Date.now() + delay;
        let timer = setInterval(() => {
            if (Date.now() >= endTime) {
                myFunctions.autoRun(myVars.customDepth);
                canGo = true;
                clearInterval(timer);
            }
        }, 10);
    }
    myFunctions.startNewGame = function() {
        console.log("[Match] Starting new game...");
        const modalNewGameButton = $('.game-over-modal-content .game-over-buttons-component .cc-button-component:not([aria-label="Rematch"])');
        if (modalNewGameButton.length) {
            modalNewGameButton[0].click();
            console.log("[Match] Clicked New Game from modal");
            myVars.hasAutoMatched = true;
            myVars.gameEnded = false;
            return;
        }
        const newGameButton = $('.game-over-buttons-component .cc-button-component:not([aria-label="Rematch"])');
        if (newGameButton.length) {
            newGameButton[0].click();
            console.log("[Match] Clicked New Game button");
            myVars.hasAutoMatched = true;
            myVars.gameEnded = false;
            return;
        }
        console.log("[Match] No New Game button found");
    };
    myFunctions.spinner = function() {
        if (loaded && $('#overlay').length) {
            $('#overlay').css('display', isThinking ? 'block' : 'none');
        }
    };
    document.onkeydown = function(e) {
        const depthKeys = {
            81: 1, 87: 2, 69: 3, 82: 4, 84: 5, 89: 6, 85: 7, 73: 8, 79: 9, 80: 10,
            65: 11, 83: 12, 68: 13, 70: 14, 71: 15, 72: 16, 74: 17, 75: 18, 76: 19,
            90: 20, 88: 21, 67: 22, 86: 23, 66: 24, 78: 25, 77: 26, 187: 100
        };
        if (depthKeys[e.keyCode]) {
            myVars.customDepth = depthKeys[e.keyCode];
            if (loaded) {
                $('#depthValue').text(myVars.customDepth);
            }
            GM_setValue('customDepth', myVars.customDepth);
            location.reload();
        }
        if (e.keyCode === 27 && loaded) {
            $('#chessPanel').toggle();
        }
    };
    var loaded = false;
    myFunctions.loadEx = function() {
        if (loaded) return;
        try {
            console.log("[UI] Creating Chess.com themed interface...");
            board = $('chess-board')[0] || $('wc-chess-board')[0];
             if (!board) {
                console.warn("[UI] Board not found yet");
                return;
             }
            myVars.board = board;
            const panel = document.createElement('div');
            panel.id = 'chessPanel';
            const savedDimensions = GM_getValue('panelDimensions', {
                width: 220,
                height: 400,
                minWidth: 180,
                minHeight: 300
            });
            const savedPosition = GM_getValue('panelPosition', {
                top: 100,
                left: window.innerWidth - savedDimensions.width - 20,
                right: 'auto'
            });
            panel.style = `
                position: fixed;
                right: ${savedPosition.right};
                top: ${savedPosition.top}px;
                left: ${savedPosition.left}px;
                transform: none;
                width: ${savedDimensions.width}px;
                height: ${savedDimensions.height}px;
                min-width: ${savedDimensions.minWidth}px;
                min-height: ${savedDimensions.minHeight}px;
                background: linear-gradient(180deg, #2d2b29 0%, #1a1918 100%);
                color: #e0e0e0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                z-index: 9999;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(127, 166, 80, 0.3);
                font-size: 14px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: both;
                backdrop-filter: blur(10px);
            `;
            const header = document.createElement('div');
            header.style = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                background: linear-gradient(135deg, #3a3634 0%, #2d2b29 100%);
                border-bottom: 2px solid #7fa650;
                border-radius: 8px 8px 0 0;
            `;
            const brandContainer = document.createElement('div');
            brandContainer.style = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            const brandIcon = document.createElement('div');
            brandIcon.innerHTML = '♟';
            brandIcon.style = `
                font-size: 24px;
                color: #7fa650;
            `;
            const title = document.createElement('h2');
            title.innerText = 'Chess Assistant';
            title.style = `
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: 0.5px;
            `;
            brandContainer.appendChild(brandIcon);
            brandContainer.appendChild(title);
            const toggleButton = document.createElement('button');
            toggleButton.innerText = '-';
            toggleButton.style = `
                background: rgba(127, 166, 80, 0.2);
                border: 1px solid #7fa650;
                color: #7fa650;
                width: 32px;
                height: 32px;
                cursor: pointer;
                border-radius: 4px;
                font-size: 20px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                line-height: 1;
                transition: all 0.2s;
            `;
            toggleButton.addEventListener('mouseover', function() {
                this.style.background = 'rgba(127, 166, 80, 0.3)';
            });
            toggleButton.addEventListener('mouseout', function() {
                this.style.background = 'rgba(127, 166, 80, 0.2)';
            });
            let isMinimized = GM_getValue('panelMinimized', false);
            header.appendChild(brandContainer);
            header.appendChild(toggleButton);
            panel.appendChild(header);
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.style = `
    position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(49, 46, 43, 0.85);
    z-index: 10000;
    display: none;
                border-radius: 5px;
            `;
            const spinner = document.createElement('div');
            spinner.style = `
    position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin-top: -20px;
                margin-left: -20px;
                border: 3px solid #bababa;
                border-top-color: #7fa650;
    border-radius: 50%;
                animation: spin 1s infinite linear;
            `;
            const spinStyle = document.createElement('style');
            spinStyle.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinStyle);
            overlay.appendChild(spinner);
            panel.appendChild(overlay);
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'scroll-container';
            scrollContainer.style = `
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 15px;
                scrollbar-width: thin;
                scrollbar-color: #7fa650 #1a1918;
            `;
            const scrollbarStyle = document.createElement('style');
            scrollbarStyle.textContent = `
                .scroll-container::-webkit-scrollbar {
                    width: 8px;
                }
                .scroll-container::-webkit-scrollbar-track {
                    background: #1a1918;
                }
                .scroll-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #7fa650 0%, #6a8f43 100%);
                    border-radius: 4px;
                }
                .scroll-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #8fb761 0%, #7fa650 100%);
                }
            `;
            document.head.appendChild(scrollbarStyle);
            panel.appendChild(scrollContainer);
            const createSection = (title) => {
                const section = document.createElement('div');
                section.className = 'collapsible-section';
                section.style = `
                    margin-bottom: 20px;
                    background: rgba(58, 54, 52, 0.3);
                    border-radius: 6px;
                    padding: 12px;
                    border: 1px solid rgba(127, 166, 80, 0.2);
                `;
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'section-header';
                sectionHeader.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(127, 166, 80, 0.3);
                    user-select: none;
                `;
                const sectionTitle = document.createElement('h3');
                sectionTitle.innerText = title;
                sectionTitle.style = `
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #7fa650;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                `;
                const collapseIcon = document.createElement('span');
                collapseIcon.className = 'collapse-icon';
                collapseIcon.innerHTML = '▼';
                collapseIcon.style = `
                    font-size: 10px;
                    color: #7fa650;
                    transition: transform 0.3s;
                `;
                sectionHeader.appendChild(sectionTitle);
                sectionHeader.appendChild(collapseIcon);
                const sectionContent = document.createElement('div');
                sectionContent.className = 'section-content';
                sectionContent.style = `
                    margin-top: 10px;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
                    max-height: 1000px; /* Start expanded */
                    opacity: 1;
                    visibility: visible;
                `;
                sectionHeader.addEventListener('click', function() {
                    const isCollapsed = sectionContent.style.maxHeight === '0px' || !sectionContent.style.maxHeight;
                    if (isCollapsed) {
                        sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        sectionContent.style.opacity = '1';
                        sectionContent.style.visibility = 'visible';
                        collapseIcon.innerHTML = '▼';
                        collapseIcon.style.transform = 'rotate(0deg)';
                        setTimeout(() => {
                            sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        }, 50);
                    } else {
                        sectionContent.style.maxHeight = '0px';
                        sectionContent.style.opacity = '0';
                        setTimeout(() => {
                            if (sectionContent.style.maxHeight === '0px') {
                                sectionContent.style.visibility = 'hidden';
                            }
                        }, 300);
                        collapseIcon.innerHTML = '▶';
                        collapseIcon.style.transform = 'rotate(-90deg)';
                    }
                    const collapsedSections = GM_getValue('collapsedSections', {});
                    collapsedSections[title] = !isCollapsed;
                    GM_setValue('collapsedSections', collapsedSections);
                });
                section.appendChild(sectionHeader);
                section.appendChild(sectionContent);
                const collapsedSections = GM_getValue('collapsedSections', {});
                if (collapsedSections[title]) {
                    sectionContent.style.maxHeight = '0px';
                    sectionContent.style.opacity = '0';
                    sectionContent.style.visibility = 'hidden';
                    collapseIcon.innerHTML = '▶';
                    collapseIcon.style.transform = 'rotate(-90deg)';
                } else {
                    setTimeout(() => {
                        if (sectionContent.style.maxHeight !== '0px') {
                            sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        }
                    }, 50);
                }
                return {
                    section: section,
                    content: sectionContent
                };
            };
            const depthSectionObj = createSection('Engine Depth');
            const depthSection = depthSectionObj.section;
            const depthContent = depthSectionObj.content;
            const depthDisplay = document.createElement('div');
            depthDisplay.style = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                background-color: #3a3634;
                padding: 8px 12px;
                border-radius: 4px;
            `;
            const depthLabel = document.createElement('span');
            depthLabel.innerText = 'Current Depth:';
            const depthValue = document.createElement('span');
            depthValue.id = 'depthValue';
            depthValue.innerText = myVars.customDepth;
            depthValue.style = `
                font-weight: bold;
                color: #7fa650;
            `;
            depthDisplay.appendChild(depthLabel);
            depthDisplay.appendChild(depthValue);
            const depthInput = document.createElement('div');
            depthInput.style = `
                display: flex;
                align-items: center;
                margin-top: 10px;
            `;
            const depthInputLabel = document.createElement('label');
            depthInputLabel.innerText = 'Set Depth:';
            depthInputLabel.style = 'margin-right: 10px;';
            const depthInputField = document.createElement('input');
            depthInputField.type = 'number';
            depthInputField.id = 'customDepthInput';
            depthInputField.min = '1';
            depthInputField.max = '100';
            depthInputField.value = myVars.customDepth;
            depthInputField.style = `
                background-color: #3a3634;
                border: 1px solid #464442;
                color: #bababa;
                padding: 5px;
                border-radius: 3px;
                width: 60px;
            `;
            depthInputField.addEventListener('change', function() {
                const value = parseInt(this.value);
                if (!isNaN(value) && value >= 1 && value <= 100) {
                    myVars.customDepth = value;
                    depthValue.innerText = value;
                    GM_setValue('customDepth', myVars.customDepth);
                    location.reload();
                } else {
                    this.value = GM_getValue('customDepth', 11);
                }
            });
            depthInput.appendChild(depthInputLabel);
            depthInput.appendChild(depthInputField);
            depthContent.appendChild(depthDisplay);
            depthContent.appendChild(depthInput);
            scrollContainer.appendChild(depthSection);
            const optionsSectionObj = createSection('Game Options');
            const optionsSection = optionsSectionObj.section;
            const optionsContent = optionsSectionObj.content;
            const createCheckbox = (id, label) => {
                const container = document.createElement('div');
                container.style = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                `;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.style = `
                    margin-right: 10px;
                    cursor: pointer;
                `;
                const checkLabel = document.createElement('label');
                checkLabel.htmlFor = id;
                checkLabel.innerText = label;
                checkLabel.style = 'cursor: pointer;';
                container.appendChild(checkbox);
                container.appendChild(checkLabel);
                return container;
            };
            const autoRunCheck = createCheckbox('suggestMove', 'Enable Suggested Move');
            optionsContent.appendChild(autoRunCheck);
            scrollContainer.appendChild(optionsSection);
            autoRunCheck.querySelector('input').checked = myVars.suggestMove;
            const delaySectionObj = createSection('Suggestion Delay');
            const delaySection = delaySectionObj.section;
            const delayContent = delaySectionObj.content;
            const createDelayInput = (id, label, defaultValue) => {
                const container = document.createElement('div');
                container.style = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                `;
                const inputLabel = document.createElement('label');
                inputLabel.htmlFor = id;
                inputLabel.innerText = label;
                inputLabel.style = `
                    flex: 1;
                `;
                const input = document.createElement('input');
                input.type = 'number';
                input.id = id;
                input.min = '0.1';
                input.step = '0.1';
                input.value = defaultValue;
                input.style = `
                    background-color: #3a3634;
                    border: 1px solid #464442;
                    color: #bababa;
                    padding: 5px;
                    border-radius: 3px;
                    width: 60px;
                `;
                container.appendChild(inputLabel);
                container.appendChild(input);
                return container;
            };
            const minDelayInput = createDelayInput('timeDelayMin', 'Min Delay (s):', '0.1');
            const maxDelayInput = createDelayInput('timeDelayMax', 'Max Delay (s):', '1.0');
            delayContent.appendChild(minDelayInput);
            delayContent.appendChild(maxDelayInput);
            scrollContainer.appendChild(delaySection);
            const actionsSectionObj = createSection('Actions');
            const actionsSection = actionsSectionObj.section;
            const actionsContent = actionsSectionObj.content;
            const createButton = (text, onClick, primary = false) => {
                const button = document.createElement('button');
                button.innerText = text;
                button.addEventListener('click', onClick);
                button.style = `
                    background: ${primary ? 'linear-gradient(135deg, #7fa650 0%, #6a8f43 100%)' : 'linear-gradient(135deg, #3a3634 0%, #2d2b29 100%)'};
                    color: #fff;
                    border: 1px solid ${primary ? '#7fa650' : 'rgba(127, 166, 80, 0.3)'};
                    padding: 12px;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    width: 100%;
                    cursor: pointer;
                    font-weight: ${primary ? '600' : '500'};
                    font-size: 13px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                `;
                button.addEventListener('mouseover', function() {
                    this.style.transform = 'translateY(-1px)';
                    this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                });
                button.addEventListener('mouseout', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                });
                return button;
            };
            const reloadButton = createButton('Reload Chess Engine', () => myFunctions.reloadChessEngine(), true);
            actionsContent.appendChild(reloadButton);
            scrollContainer.appendChild(actionsSection);
            const topMovesSectionObj = createSection('Top Moves');
            const topMovesSection = topMovesSectionObj.section;
            const topMovesContent = topMovesSectionObj.content;
            const topMovesContainer = document.createElement('div');
            topMovesContainer.style = `
                background-color: #3a3634;
                border-radius: 4px;
                padding: 10px;
            `;
            const topMovesHeader = document.createElement('div');
            topMovesHeader.style = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 12px;
                color: #bababa;
                opacity: 0.8;
            `;
            const moveHeader = document.createElement('span');
            moveHeader.innerText = 'Move';
            const evalHeader = document.createElement('span');
            evalHeader.innerText = 'Evaluation';
            topMovesHeader.appendChild(moveHeader);
            topMovesHeader.appendChild(evalHeader);
            topMovesContainer.appendChild(topMovesHeader);
            for (let i = 1; i <= 2; i++) {
                const moveRow = document.createElement('div');
                moveRow.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-top: 1px solid #464442;
                `;
                const moveNumber = document.createElement('span');
                moveNumber.style = `
                    background-color: ${i === 1 ? '#7fa650' : '#5d5955'};
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    margin-right: 8px;
                `;
                moveNumber.innerText = i;
                const moveText = document.createElement('span');
                moveText.id = `topMove${i}`;
                moveText.innerText = '...';
                moveText.style = `
                    font-family: monospace;
                    font-weight: ${i === 1 ? 'bold' : 'normal'};
                `;
                const moveLeft = document.createElement('div');
                moveLeft.style = `
                    display: flex;
                    align-items: center;
                `;
                moveLeft.appendChild(moveNumber);
                moveLeft.appendChild(moveText);
                const evalText = document.createElement('span');
                evalText.id = `topMoveEval${i}`;
                evalText.innerText = '...';
                evalText.style = `
                    font-family: monospace;
                    color: ${i === 1 ? '#7fa650' : '#bababa'};
                `;
                moveRow.appendChild(moveLeft);
                moveRow.appendChild(evalText);
                topMovesContainer.appendChild(moveRow);
            }
            topMovesContent.appendChild(topMovesContainer);
            scrollContainer.appendChild(topMovesSection);
            header.style.cursor = 'move';
            header.style.userSelect = 'none';
            let isDragging = false;
            let offsetX, offsetY;
            const dragHandle = document.createElement('div');
            dragHandle.style = `
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 3px;
                margin-right: 8px;
                cursor: move;
                user-select: none;
                width: 16px;
                height: 16px;
            `;
            const gripIcon = document.createElement('div');
            gripIcon.innerHTML = '≡';
            gripIcon.style = ``;
            dragHandle.appendChild(gripIcon);
            header.insertBefore(dragHandle, header.firstChild);
            header.addEventListener('mousedown', function(e) {
                if (e.target === header || e.target === dragHandle || e.target === gripIcon || e.target === title || e.target === brandIcon || e.target === brandContainer) {
                    e.preventDefault();
                    isDragging = true;
                    const rect = panel.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    document.addEventListener('mousemove', handleDrag);
                    document.addEventListener('mouseup', stopDrag);
                }
            });
            header.addEventListener('touchstart', function(e) {
                if (e.target === header || e.target === dragHandle || e.target === gripIcon || e.target === title || e.target === brandIcon || e.target === brandContainer) {
                    e.preventDefault();
                    isDragging = true;
                    const touch = e.touches[0];
                    const rect = panel.getBoundingClientRect();
                    offsetX = touch.clientX - rect.left;
                    offsetY = touch.clientY - rect.top;
                    document.addEventListener('touchmove', handleTouchDrag, { passive: false });
                    document.addEventListener('touchend', stopTouchDrag);
                }
            });
            function handleDrag(e) {
                if (!isDragging) return;
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                const newLeft = clientX - offsetX;
                const newTop = clientY - offsetY;
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;
                panel.style.right = 'auto';
                panel.style.top = Math.max(0, Math.min(newTop, maxY)) + 'px';
                panel.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
                panel.style.transform = 'none';
            }
            function handleTouchDrag(e) {
                e.preventDefault();
                handleDrag(e);
            }
            function stopDrag() {
                if (!isDragging) return;
                isDragging = false;
                const rect = panel.getBoundingClientRect();
                GM_setValue('panelPosition', {
                    top: rect.top,
                    left: rect.left,
                    right: 'auto'
                });
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', stopDrag);
            }
            function stopTouchDrag() {
                if (!isDragging) return;
                isDragging = false;
                const rect = panel.getBoundingClientRect();
                GM_setValue('panelPosition', {
                    top: rect.top,
                    left: rect.left,
                    right: 'auto'
                });
                document.removeEventListener('touchmove', handleTouchDrag);
                document.removeEventListener('touchend', stopTouchDrag);
            }
            const footer = document.createElement('div');
            footer.style = `
                padding: 10px 15px;
                border-top: 2px solid rgba(127, 166, 80, 0.3);
                font-size: 10px;
                text-align: center;
                color: rgba(224, 224, 224, 0.5);
                flex-shrink: 0;
                background: rgba(26, 25, 24, 0.8);
                border-radius: 0 0 8px 8px;
            `;
            footer.innerText = 'Press ESC to toggle • Drag to move • Resize from corners';
            panel.appendChild(footer);
            const updateToggleState = function() {
                if (isMinimized) {
                    toggleButton.innerText = '+';
                    scrollContainer.style.display = 'none';
                    footer.style.display = 'none';
                    panel.style.height = 'auto';
                    panel.style.minHeight = 'auto';
                    panel.style.resize = 'none';
                } else {
                    toggleButton.innerText = '-';
                    scrollContainer.style.display = 'block';
                    footer.style.display = 'block';
                    panel.style.height = savedDimensions.height + 'px';
                    panel.style.minHeight = savedDimensions.minHeight + 'px';
                    panel.style.resize = 'both';
                }
            };
            toggleButton.addEventListener('click', function(e) {
                e.stopPropagation();
                isMinimized = !isMinimized;
                GM_setValue('panelMinimized', isMinimized);
                updateToggleState();
            });
            updateToggleState();
            panel.style.overflow = 'auto';
            let resizeTimeout;
            const saveResizedDimensions = function() {
                const width = panel.offsetWidth;
                const height = panel.offsetHeight;
                GM_setValue('panelDimensions', {
                    width: width,
                    height: height,
                    minWidth: savedDimensions.minWidth,
                    minHeight: savedDimensions.minHeight
                });
            };
            const resizeObserver = new ResizeObserver(function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(saveResizedDimensions, 500);
            });
            resizeObserver.observe(panel);
            document.body.appendChild(panel);
            loaded = true;
            console.log("[UI] Chess.com themed interface created successfully");
        } catch (error) {
            console.error("[UI] Error creating interface:", error);
        }
    };
    const waitForChessBoard = setInterval(() => {
        if (loaded) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            try {
                myVars.suggestMove = document.getElementById('suggestMove').checked;
                GM_setValue('suggestMove', myVars.suggestMove);
                let minDelay = parseFloat(document.getElementById('timeDelayMin').value) || 0.1;
                let maxDelay = parseFloat(document.getElementById('timeDelayMax').value) || 1.0;
                myVars.delay = Math.random() * (maxDelay - minDelay) + minDelay;
            } catch (e) {
                console.warn("[UI] Error reading UI state:", e);
            }
            myVars.isThinking = isThinking;
            myFunctions.spinner();
            const gameOverModal = $('.game-over-modal-content');
            if (gameOverModal.length > 0 && !myVars.gameEnded) {
                console.log("[Game] Game over detected");
                myVars.gameEnded = true;
            }
            try {
                if (!myVars.gameEnded && board && board.game) {
                    myTurn = (board.game.getTurn() == board.game.getPlayingAs());
                } else {
                    myTurn = false;
                }
            } catch (e) {
                myTurn = false;
            }
            console.log(`[State] SuggestMove:${myVars.suggestMove} MyTurn:${myTurn} Thinking:${isThinking} CanGo:${canGo}`);
            if (!engine.engine) {
                myFunctions.loadChessEngine();
            }
            if (myVars.suggestMove && canGo && !isThinking && myTurn && !myVars.gameEnded) {
                console.log("[Auto] Triggering suggested move analysis...");
                canGo = false;
                const currentDelay = myVars.delay * 1000;
                other(currentDelay);
            }
        } else if ($('chess-board, wc-chess-board').length > 0) {
            myFunctions.loadEx();
        }
    }, 100);
}
var isThinking = false;
var canGo = true;
var myTurn = false;
var board;
const hideMenuStyle = document.createElement('style');
hideMenuStyle.textContent = `
    .GM_menuCommand,
    #GM_menu,
    div[id$="-menu"] {
        display: none !important;
    }
`;
document.head.appendChild(hideMenuStyle);
function initializeMenuCommands() {
    GM_registerMenuCommand("Chess.com Assistant v1.0.0", function() {
        const panel = document.getElementById('chessPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        }
    });
}
setTimeout(initializeMenuCommands, 1000);
window.addEventListener("load", (event) => {
    console.log("[Script] Chess.com Assistant v1.0.0 starting...");
    main();
});
// ==UserScript==
// @name          ♟-GabiBot-: Chess Bot And ModMenu!♟ (No Key) - SYNTAX ROBUST V3 (Expanded)
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   GabiBot is a ModMenu (Key Removed) with Evaluation Bar and PV Display.
// @author        thehackerclient (Modified & Expanded)
// @match         https://www.chess.com/play/computer
// @license       MIT
// @icon          https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant         none
// @antifeature   membership
// @downloadURL https://update.greasyfork.org/scripts/551414/%E2%99%9F-GabiBot-%3A%20Chess%20Bot%20And%20ModMenu%21%E2%99%9F%20%28No%20Key%29%20-%20SYNTAX%20ROBUST%20V3%20%28Expanded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551414/%E2%99%9F-GabiBot-%3A%20Chess%20Bot%20And%20ModMenu%21%E2%99%9F%20%28No%20Key%29%20-%20SYNTAX%20ROBUST%20V3%20%28Expanded%29.meta.js
// ==/UserScript==

(async function() {

    // INCREASED DELAY to 5000ms (5 seconds)
    setTimeout(async function(){
        alert("Stockfish Loaded!")
        console.log("GabiBot: Starting GUI creation sequence.");

        async function startStockfish(key){
            var menuWrap = document.createElement("div")
            menuWrap.id="menuWrap"
            var menuWrapStyle = document.createElement("style")

            // *** UPDATED: Added PV Display item ***
            menuWrap.innerHTML = [
                '<div id="topText">',
                '    <a id="modTitle">-GabiBot-</a>',
                '    <a>Ctrl+B To Hide</a>',
                '</div>',
                '<div id="itemsList">',
                '    <div name="enableHack" class="listItem">',
                '        <input class="checkboxMod" type="checkbox">',
                '        <a class="itemDescription">Enable Hack: </a>',
                '        <a class="itemState">Off</a>',
                '    </div>',
                '    <div name="autoMove" class="listItem">',
                '        <input class="checkboxMod" type="checkbox">',
                '        <a class="itemDescription">Auto Move:</a>',
                '        <a class="itemState">Off</a>',
                '    </div>',
                '    <div name="botPower" class="listItem">',
                '        <input min="1" max="15" value="12" class="rangeSlider" type="range">',
                '        <a class="itemDescription">Bot Power:</a>',
                '        <a class="itemState">12</a>',
                '    </div>',
                '    <div name="autoMoveSpeed" class="listItem">',
                '        <input min="1" max="10" value="4" class="rangeSlider" type="range">',
                '        <a class="itemDescription">Auto Move Speed:</a>',
                '        <a class="itemState">3</a>',
                '    </div>',
                '    <div name="updateSpeed" class="listItem">',
                '        <input min="1" max="10" value="8" class="rangeSlider" type="range">',
                '        <a class="itemDescription">Update Speed:</a>',
                '        <a class="itemState">8</a>',
                '    </div>',
                '    <div name="currentEvaluation" class="listItem">',
                '        <a class="itemDescription">Current Evaluation:</a>',
                '        <a class="itemState">-</a>',
                '    </div>',
                '    <div name="bestMove" class="listItem">',
                '        <a class="itemDescription">Best Move:</a>',
                '        <a class="itemState">-</a>',
                '    </div>',
                '    <div name="pvDisplay" class="listItem">',
                '        <a class="itemDescription">PV (Prediction):</a>',
                '        <a class="itemState pv-text-state" title="Principal Variation">-</a>', // Use a custom class for styling PV
                '    </div>',
                '    <div name="information" class="listItem">',
                '        <a class="itemDescription">Information: </a>',
                '        <a class="itemState">GabiHarMotion (1242 Elo)</a>',
                '    </div>',
                '</div>'
            ].join('');

            // *** UPDATED: Added CSS for Evaluation Bar and PV Display ***
            menuWrapStyle.innerHTML = [
                '#menuWrap {',
                '    font-family: monospace;',
                '    border-radius: 1vh;',
                '    z-index: 1000000;',
                '    grid: none;',
                '    display: grid;',
                '    grid-template-columns: 90%;',
                '    grid-template-rows: 15% 85%;',
                '    justify-content: center;',
                '    width: 350px;',
                '    height: 400px;',
                '    position: absolute;',
                '    border: 1px solid rgb(100 100 100);',
                '    background: rgb(16, 16, 16);',
                '    opacity: 0.98;',
                '    user-select: none;',
                '    max-width: 60vw;',
                '    top: 100px;',
                '    left: 100px;',
                '}',
                // New CSS for Principal Variation text to allow long strings
                '.pv-text-state {',
                '    color: white;',
                '    margin-left: 3%;',
                '    max-width: 50%;',
                '    overflow-x: auto;',
                '    white-space: nowrap;',
                '}',
                // New CSS for the Evaluation Bar next to the board
                '#evaluationBarWrap {',
                '    position: absolute;',
                '    height: 100%;',
                '    width: 20px;',
                '    background-color: #333;',
                '    z-index: 999999;',
                '    right: -25px;',
                '    top: 0;',
                '    border-radius: 5px;',
                '    overflow: hidden;',
                '}',
                '#evaluationBar {',
                '    width: 100%;',
                '    position: absolute;',
                '    bottom: 50%;',
                '    transition: height 0.5s ease, bottom 0.5s ease;',
                '}',
                '#evaluationBar.white-advantage {',
                '    background-color: #f7d247;', /* Gold for White */
                '}',
                '#evaluationBar.black-advantage {',
                '    background-color: #3d8bff;', /* Blue for Black */
                '}',
                '#topText {',
                '    width: 40%;',
                '    justify-self: center;',
                '    text-align: center;',
                '}',
                '#modTitle {',
                '    color: white;',
                '    justify-self: center;',
                '    margin-bottom: 5%;',
                '    font-size: 17px;',
                '}',
                '#itemsList{',
                '    overflow-x: hidden;',
                '}',
                '::-webkit-scrollbar {',
                '    width: 8px;',
                '}',
                '::-webkit-scrollbar-thumb {',
                '    background: #888;',
                '    height: 10px;',
                '}',
                '.listItem {',
                '    display: flex;',
                '    align-items: center;',
                '    margin-bottom: 6%;',
                '}',
                '.checkboxMod {',
                '    outline: #acacac 1px solid;',
                '    vertical-align: middle;',
                '    appearance: none;',
                '    border-radius: 30%;',
                '    height: 20px;',
                '    width: 20px;',
                '    top: 30%;',
                '    background: #303030;',
                '    margin-right: 5%;',
                '}',
                '.checkboxMod:checked {',
                '    background-color: #808080;',
                '}',
                '.rangeSlider {',
                '    -webkit-appearance: none;',
                '    width: 45%;',
                '    height: 15px;',
                '    border-radius: 5px;',
                '    background: #b0b0b0;',
                '    outline: none;',
                '    margin-right: 6%;',
                '}',
                '.rangeSlider::-webkit-slider-thumb {',
                '    appearance: none;',
                '    width: 17px;',
                '    height: 17px;',
                '    border-radius: 50%;',
                '    background: #505050;',
                '    cursor: pointer;',
                '}',
                '.itemDescription{',
                '    color: white;',
                '}',
                '.itemState{',
                '    color: white;',
                '    margin-left: 3%;',
                '}'
            ].join('');

            document.body.appendChild(menuWrap)
            document.body.appendChild(menuWrapStyle)

            // *** UPDATED: Added new window variable for PV ***
            window.hackEnabled = 0
            window.botPower = 12
            window.updateSpeed = 8
            window.autoMove = 0
            window.autoMoveSpeed = 4
            window.currentEvaluation = 0
            window.bestMove = ""
            window.principalVariation = "" // New variable

            var itemWrap = document.getElementById("menuWrap")

            function getElementByName(name,selector){return selector.querySelector(`[name="${name}"]`)}
            function getInputElement(element){return element.children[0]}
            function getStateElement(element){return element.children[element.children.length-1]}

            function modFunction(name,type,variable){
                var modElement = getElementByName(name,itemWrap)
                var modState = getStateElement(modElement)
                var modInput = getInputElement(modElement)

                if(type=="text"){
                    // PV is often a long string, so we use the 'title' attribute for hover text
                    if(name === "pvDisplay") modState.title = eval(variable);
                    modState.innerHTML=eval(variable)
                }
                modInput.onmouseup=e=>{
                    if(e.button==0){
                        if(type=="checkbox"){
                            modState.innerHTML=["Off","On"][Number(!modInput.checked)]
                            // Robust eval syntax
                            eval(variable + "=" + !modInput.checked)
                        }
                        if(type=="range"){
                            modState.innerHTML=modInput.value
                            // Robust eval syntax
                            eval(variable + "=" + modInput.value)
                        }
                    }
                }
            }

            modFunction("enableHack","checkbox","window.hackEnabled")
            modFunction("autoMove","checkbox","window.autoMove")

            modFunction("botPower","range","window.botPower")
            modFunction("autoMoveSpeed","range","window.autoMoveSpeed")
            modFunction("updateSpeed","range","window.updateSpeed")

            function updateTexts(){
                modFunction("currentEvaluation","text","window.currentEvaluation");
                modFunction("bestMove","text","window.bestMove");
                modFunction("pvDisplay","text","window.principalVariation"); // New line for PV
                // Robust eval syntax for text
                modFunction("information","text","context.user.username + ' (' + context.user.rating + ' Elo)'");
            }

            // *** NEW FUNCTION: Update Evaluation Bar ***
            function updateEvaluationBar(evaluation, playingAs) {
                const bar = document.getElementById("evaluationBar");
                if (!bar) return;

                let score = 0;
                // Convert mate scores (M-1, M+3) to high numerical values
                if (typeof evaluation === 'string' && evaluation.includes('M')) {
                    let mateScore = parseInt(evaluation.replace('M', ''));
                    score = Math.sign(mateScore) * 1000;
                } else {
                    score = parseFloat(evaluation);
                }

                const maxScore = 8;
                let normalizedScore = Math.max(-maxScore, Math.min(maxScore, score));

                // Scale for visual effect (0-100% height)
                let height = Math.abs(normalizedScore) * (50 / maxScore);

                // If the board is flipped (playing as Black) invert the visual logic
                if (playingAs === 2) {
                    normalizedScore *= -1;
                }

                bar.style.height = `${height}%`;
                // Position: from 50% upwards for White advantage, downwards for Black advantage
                bar.style.bottom = normalizedScore > 0 ? '50%' : `${50 - height}%`;

                // Set class for color
                bar.classList.remove('white-advantage', 'black-advantage');
                if (normalizedScore > 0.5) {
                    bar.classList.add('white-advantage');
                } else if (normalizedScore < -0.5) {
                    bar.classList.add('black-advantage');
                }
            }


            var board = document.querySelector('.board');
            var drawingBoard = document.createElement("canvas");
            var drawingBoardCTX = drawingBoard.getContext("2d");

            // *** NEW HTML FOR EVAL BAR: Check for board and add bar structure ***
            if (!board) {
                console.error("GabiBot Error: Could not find the chess board element (selector: .board). The script may be outdated.");
                return;
            }

            // Add Evaluation Bar Structure
            var evalBarWrap = document.createElement("div");
            evalBarWrap.id = "evaluationBarWrap";
            var evalBar = document.createElement("div");
            evalBar.id = "evaluationBar";
            evalBarWrap.appendChild(evalBar);
            board.appendChild(evalBarWrap);
            // End Eval Bar HTML

            // Set canvas size to match the board
            drawingBoard.width=board.clientWidth;
            drawingBoard.height=board.clientHeight;
            board.appendChild(drawingBoard);

            function clear(){
                drawingBoardCTX.clearRect(0,0,board.clientWidth,board.clientHeight)
            }

            async function executeAction(bestmove){

                // Flip the drawing board if playing as Black
                if(board.game.getPlayingAs()==2){
                    drawingBoard.style.rotate="180deg"
                }else{
                    drawingBoard.style.rotate="0deg"
                }
                clear()

                console.log(bestmove)
                bestmove = bestmove.split(" ")[1] // Format: 'bestmove e2e4' -> 'e2e4'

                var tileSize = (drawingBoard.clientWidth/8)
                var letters = ["a","b","c","d","e","f","g","h"];

                // Calculate coordinates for drawing the move arrow
                var x1 = letters.indexOf(bestmove[0])+1;
                var y1 = 9-Number(bestmove[1]);
                var x2 = letters.indexOf(bestmove[2])+1;
                var y2 = 9-Number(bestmove[3]);

                // Draw the arrow
                drawingBoardCTX.beginPath();
                drawingBoardCTX.moveTo(x1*tileSize-(tileSize/2),y1*tileSize-(tileSize/2));
                drawingBoardCTX.lineTo(x2*tileSize-(tileSize/2),y2*tileSize-(tileSize/2));
                drawingBoardCTX.lineWidth=tileSize/5;
                drawingBoardCTX.strokeStyle="#00ff0050"; // Green with transparency
                drawingBoardCTX.stroke();


                if(window.autoMove){
                    setTimeout(function(){
                        // Find the move object and execute it
                        var legalMoves = game.getLegalMoves()
                        for(var i=0;i<legalMoves.length;i++){
                            if(legalMoves[i].from==bestmove.split("")[0]+bestmove.split("")[1]){
                                if(legalMoves[i].to==bestmove.split("")[2]+bestmove.split("")[3]){
                                    var move = legalMoves[i]
                                    // 'game' object is expected to be available in the global scope of chess.com
                                    game.move({
                                        ...move,
                                        promotion: 'false',
                                        animate: false,
                                        userGenerated: true
                                    });
                                }
                            }
                        }
                    },5000-window.autoMoveSpeed*500) // Speed control: faster if autoMoveSpeed is higher
                }
            }

            var updateBotRunning = false;

            async function updateBot() {
                // Throttle the update rate based on user setting (updateSpeed)
                var updateBotInterval = setTimeout(async function(){

                    updateTexts();
                    var board = document.querySelector('.board');

                    if(!window.hackEnabled) {
                        clear();
                        updateEvaluationBar(0, 1); // Reset bar
                        updateBotRunning = false;
                        clearInterval(updateBotInterval)
                        return;
                    }

                    // Check for board availability again during updates
                    if (!board || !board.game) {
                        console.error("GabiBot Warning: Board or game object is unavailable during update. Retrying...");
                        updateBot(); // Recursively retry after a small delay
                        return;
                    }

                    // *** NEW FEATURE: Game State Awareness ***
                    if (board.game.isGameOver()) {
                        var result = board.game.getGameOverReason();
                        window.currentEvaluation = `GAME OVER: ${result.toUpperCase()}`;
                        window.bestMove = "No moves possible.";
                        window.principalVariation = "Game has ended.";
                        clear(); // Clear the arrow
                        updateEvaluationBar(0, board.game.getPlayingAs()); // Reset bar
                        updateTexts(); // Update the menu
                        // Stop analysis loop until a new game starts
                        updateBotRunning = false;
                        return;
                    }
                    // *** END Game State Awareness ***

                    updateBotRunning = true;


                    // Get FEN from the chess.com game object
                    var FEN = board.game.getFEN();
                    var depth = window.botPower;

                    // Call the Stockfish API
                    // Note: The 'pv' (Principal Variation) should be returned by this API
                    let response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(FEN)}&depth=${depth}`);
                    let data = await response.json();

                    window.bestMove = data.bestmove || "Calculating...";
                    window.currentEvaluation = data.evaluation || "-";
                    // *** NEW FEATURE: Principal Variation (PV) Display ***
                    window.principalVariation = data.pv || "PV not available";

                    var bestmove = data.bestmove;

                    // *** UPDATED: Call Evaluation Bar update ***
                    var playingAs = board.game.getPlayingAs(); // 1 for White, 2 for Black
                    updateEvaluationBar(window.currentEvaluation, playingAs);


                    if (bestmove && bestmove.includes("bestmove")) {
                         executeAction(bestmove);
                    }


                    // Use requestAnimationFrame for smooth GUI updates (if any) and recursive call
                    requestAnimationFrame(()=>{
                        if (updateBotRunning) updateBot();
                    });
                },1100-(window.updateSpeed*100))
            }

            // Re-run the bot logic whenever a change event happens (like a user move)
            document.addEventListener("change", updateBot);

            // Start the bot immediately without a key check
            updateBot();


            var draggingElement = document.getElementById("modTitle")
            dragElement(itemWrap,draggingElement);

            // Function to allow the menu window to be dragged
            function dragElement(elmnt,elmnt2) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                elmnt2.onmousedown = dragMouseDown;
                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }
                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }
                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // Keyboard shortcut for menu visibility
            var menuHidden = 0
            document.addEventListener("keyup",(e)=>{
                if(e.key=="b"&&e.ctrlKey){
                    if(!menuHidden){menuWrap.style.display="none"}
                    else{menuWrap.style.display="grid"}
                    menuHidden^=1
                }
            })
        }

        // Start the bot with a dummy key (key is ignored in this version)
        await startStockfish("key_removed")

    },5000) // Initial 5 second delay to wait for chess.com to load
})();
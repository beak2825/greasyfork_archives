// ==UserScript==
// @name         FV - Picross Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      9.7
// @description  Picross (Nonogram) puzzles for Furvilla. Randomly generated 10x10 boards.
// @match        https://www.furvilla.com/villager/404433
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556599/FV%20-%20Picross%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556599/FV%20-%20Picross%20Mini-Game.meta.js
// ==/UserScript==

(function() {

  const target = document.querySelector('.villager-description .profanity-filter');
  if (!target) return;

  const container = document.createElement("div");
  container.id = "fv-nonogram-container";
  target.innerHTML = "";
  target.appendChild(container);


  // css

  const style = document.createElement("style");
  style.textContent = `
    /* Main Container */
    #fv-nonogram-container {
      position: relative;
      width: 100%;
      text-align: center;
      font-family: Verdana;
      margin-top: 10px;
    }

    /* Background Styling */
    #fv-background {
      background-image: url("https://www.furvilla.com/img/villages/world.png");
      background-size: cover;
      background-position: center;
      padding: 20px 0;
      border-radius: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Board Area */
    #fv-board-area {
      background: linear-gradient(to bottom right, rgba(255, 240, 255, 0.35), rgba(220, 200, 220, 0.55));
      border-radius: 18px;
      border: 2px solid rgba(180, 120, 180, 0.55);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.25), inset 0 0 8px rgba(255, 180, 215, 0.6);
      width: max-content;
      padding: 10px 14px;
      margin: 10px auto;
    }

    /* Nonogram Table */
    .nonogram-table {
      border-collapse: collapse;
      margin: 0 auto;
    }

    .nonogram-table td {
      width: 28px;
      height: 28px;
      background: #fff;
      border: 1px solid #bbb;
      text-align: center;
      vertical-align: middle;
      font-size: 18px;
      cursor: pointer;
    }

    /* Filled Cells */
    td.filled {
      background-color: rgba(106, 76, 156, 0.7) !important;
      border: none !important;
    }

    td.filled.hovered {
      background-color: rgba(86, 56, 122, 0.7) !important;
    }

    /* Wrong Cells */
    td.wrong {
      background-color: rgba(255, 0, 0, 0.5) !important;
      border: none !important;
    }

    /* Flagged Cells */
    td.flagged {
      color: #110000;
      font-weight: bold;
      font-size: 20px;
      border: none !important;
    }

    /* Hover Effects */
    td.hover-row {
      border-bottom: 3px solid #56387a !important;
    }

    td.hover-col {
      border-right: 3px solid #56387a !important;
    }

    td.cross-row {
      border-bottom: 3px solid #694b70 !important;
    }

    td.cross-col {
      border-right: 3px solid #694b70 !important;
    }

    /* Clues */
    .fv-clue {
      font-size: 14px;
      color: #222;
      padding: 2px 4px;
    }

    .fv-clue.done {
      text-decoration: line-through;
      opacity: 0.5;
    }

    /* Buttons */
    #fv-mode-btn {
      margin: 8px auto 10px;
      display: block;
      font-weight: bold;
      font-size: 18px;
      padding: 6px 12px;
      width: 140px;
    }

    #fv-hearts {
      margin-top: 5px;
    }

    .fv-heart {
      font-size: 24px;
      color: #c22;
    }

    .fv-heart.dead {
      color: #666;
    }

    #fv-timer {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    /* Win and Lose Overlays */
    #fv-win-overlay, #fv-lose-overlay {
      font-size: 32px;
      font-weight: bold;
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    #fv-win-overlay {
      background: rgba(255, 255, 255, 0.75);
      color: #333;
    }

    #fv-lose-overlay {
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
    }

    /* Reload Button */
    #fv-reload-btn {
      background-color: #d0a0a0;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      padding: 10px 20px;
      border: 2px solid #8c5b5b;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 15px;
    }

    #fv-reload-btn:hover {
      background-color: #c08080;
    }
  `;
  document.head.appendChild(style);


  // html

  container.innerHTML = `
    <div id="fv-background">
      <div id="fv-timer">0:00</div>
      <div id="fv-hearts"></div>
      <div id="fv-board-area"></div>
      <a id="fv-mode-btn" class="btn big">Mode: Fill</a>
      <div id="fv-win-overlay"><h1>You Win!</h1></div>
      <div id="fv-lose-overlay"><h1>Game Over</h1></div>
      <button id="fv-reload-btn">Reload Game</button>
    </div>
  `;


  // var

  let solution = null, filled = [], flagged = [], mode = "fill", timer = 0, timerInt = null, hearts = 3, started = false;

  // timer

  function startTimer() {
    if (started) return;
    started = true;
    timer = 0;
    timerInt = setInterval(() => {
      timer++;
      const m = Math.floor(timer / 60), s = timer % 60;
      document.getElementById("fv-timer").textContent = m + ":" + (s < 10 ? "0" : "") + s;
    }, 1000);
  }
 // hearts
  function drawHearts() {
    const h = document.getElementById("fv-hearts");
    h.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      span.className = "fv-heart" + (i < hearts ? "" : " dead");
      span.textContent = "❤";
      h.appendChild(span);
    }
  }


  // Board logic

  function generateBoard() {
    let board = [];
    for (let r = 0; r < 10; r++) {
      let row = [];
      for (let c = 0; c < 10; c++) {
        row.push(Math.random() < 0.5 ? 1 : 0);
      }
      board.push(row);
    }
    return board;
  }

  function getRowClues(row) {
    let clues = [], count = 0;
    for (let v of row) {
      if (v === 1) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    }
    if (count > 0) clues.push(count);
    return clues.length ? clues : [0];
  }

  function getColClues(col) { return getRowClues(col); }

  function checkRow(r) {
    for (let c = 0; c < 10; c++) {
      if (filled[r][c] !== solution[r][c]) return false;
    }
    return true;
  }

  function checkCol(c) {
    for (let r = 0; r < 10; r++) {
      if (filled[r][c] !== solution[r][c]) return false;
    }
    return true;
  }

  function updateClues() {
    for (let r = 0; r < 10; r++) {
      const el = document.getElementById("clue-row-" + r);
      if (el && checkRow(r)) el.classList.add("done");
    }
    for (let c = 0; c < 10; c++) {
      const el = document.getElementById("clue-col-" + c);
      if (el && checkCol(c)) el.classList.add("done");
    }
  }

  function highlightCell(td, enter) {
    const r = parseInt(td.dataset.row), c = parseInt(td.dataset.col);
    document.querySelectorAll(".nonogram-table td[data-row]").forEach(cell => {
      const cellR = parseInt(cell.dataset.row), cellC = parseInt(cell.dataset.col);

      if (filled[cellR][cellC] || flagged[cellR][cellC]) return;

      if (cellR === r) cell.classList.toggle("hover-row", enter);
      if (cellC === c) cell.classList.toggle("hover-col", enter);
    });

    if (filled[r][c]) {
      td.classList.toggle("hovered", enter);
    }
  }

  function clickCell(r, c, td) {
    if (filled[r][c]) return;

    startTimer();
    if (mode === "fill") {
      if (flagged[r][c]) return;
      if (solution[r][c] === 0 && !filled[r][c]) {
        hearts--;
        drawHearts();
        td.classList.add("wrong");
        setTimeout(() => td.classList.remove("wrong"), 1000);
      } else {
        filled[r][c] = 1;
        td.classList.add("filled");
      }
    } else {
      flagged[r][c] = !flagged[r][c];
      td.innerHTML = flagged[r][c] ? '<i class="fa-solid fa-x"></i>' : '';
    }
    updateClues();
    checkWin();
  }

  function checkWin() {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (filled[r][c] !== solution[r][c]) return false;
      }
    }
    document.getElementById("fv-win-overlay").style.display = "flex";
    clearInterval(timerInt);
    return true;
  }

  function buildBoard() {
    solution = generateBoard();
    const area = document.getElementById("fv-board-area");
    area.innerHTML = "";
    const table = document.createElement("table");
    table.className = "nonogram-table";
    filled = Array.from({ length: 10 }, () => Array(10).fill(0));
    flagged = Array.from({ length: 10 }, () => Array(10).fill(0));

    // Top Clues
    const topRow = document.createElement("tr");
    let topLeft = document.createElement("td");
    topLeft.style.border = "none";
    topLeft.style.width = "60px";
    topLeft.style.height = "60px";
    topRow.appendChild(topLeft);
    for (let c = 0; c < 10; c++) {
      const td = document.createElement("td");
      td.style.border = "none";
      td.style.height = "60px";
      td.style.verticalAlign = "bottom";
      const col = solution.map(r => r[c]);
      const div = document.createElement("div");
      div.className = "fv-clue";
      div.id = "clue-col-" + c;
      div.textContent = getColClues(col).join(" ");
      td.appendChild(div);
      topRow.appendChild(td);
    }
    table.appendChild(topRow);

    // Rows
    for (let r = 0; r < 10; r++) {
      const tr = document.createElement("tr");
      const leftTd = document.createElement("td");
      leftTd.style.border = "none";
      leftTd.style.textAlign = "right";
      const div = document.createElement("div");
      div.className = "fv-clue fv-clue-row";
      div.id = "clue-row-" + r;
      div.textContent = getRowClues(solution[r]).join(" ");
      leftTd.appendChild(div);
      tr.appendChild(leftTd);
      for (let c = 0; c < 10; c++) {
        const td = document.createElement("td");
        td.dataset.row = r;
        td.dataset.col = c;
        if (r === 4) td.classList.add("cross-row");
        if (c === 4) td.classList.add("cross-col");
        td.addEventListener("mouseover", () => highlightCell(td, true));
        td.addEventListener("mouseout", () => highlightCell(td, false));
        td.addEventListener("click", () => clickCell(r, c, td));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    area.appendChild(table);
  }

  //  Mode Button
  document.getElementById("fv-mode-btn").onclick = () => {
    mode = (mode === "fill" ? "flag" : "fill");
    document.getElementById("fv-mode-btn").textContent = "Mode: " + (mode === "fill" ? "Fill" : "Flag");
  };

  // Switch mode on spacebar press
  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      mode = (mode === "fill" ? "flag" : "fill");
      document.getElementById("fv-mode-btn").textContent = "Mode: " + (mode === "fill" ? "Fill" : "Flag");
    }
  });

  // hearts
  drawHearts();

  // Reload Game
  document.getElementById("fv-reload-btn").addEventListener("click", () => {
    const currentScroll = window.scrollY;
    location.reload();
    window.scrollTo(0, currentScroll); // Keep user in the same scroll position
  });

  // Build initial board
  buildBoard();
})();

// ==UserScript==
// @name         [GC] - Scarab 21 Deck Tracker + Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Tracks cards, adds keyboard shortcuts and logs scores for Scarab 21
// @author       Heda, wibreth
// @match        https://www.grundos.cafe/games/scarab21/
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/561276/%5BGC%5D%20-%20Scarab%2021%20Deck%20Tracker%20%2B%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/561276/%5BGC%5D%20-%20Scarab%2021%20Deck%20Tracker%20%2B%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const VALUES = [...Array(13)].map((_, i) => i + 2),
    SUITS = ["spades", "hearts", "diamonds", "clubs"],
    SUIT_SYMBOLS = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" },
    SUIT_NAMES = {
      spades: "Spades",
      hearts: "Hearts",
      diamonds: "Diamonds",
      clubs: "Clubs",
    },
    FACE_NAMES = { 11: "J", 12: "Q", 13: "K", 14: "A" },
    BASE = "https://grundoscafe.b-cdn.net/games/cards",
    TEN_VALS = [10, 11, 12, 13],
    keyList = [
      ...'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=+[]{};:",.<>/?`~\\|',
    ];

  let groupBySuit = false,
    defaultKeys = ["1", "2", "3", "4", "5"],
    keyBindings = defaultKeys,
    seenCards = new Set(),
    canLogScore = true,
    scale = "1.00",
    manualMode = true;

  // Initialize async values
  (async function init() {
    keyBindings = (await GM.getValue("scarab21_keys", defaultKeys));
    scale = parseFloat(await GM.getValue("ui_scale", 1)).toFixed(2);
    manualMode = await GM.getValue("scarab21_manualMode", true);
    groupBySuit = await GM.getValue("scarab21_groupBySuit", false);

    // Load seenCards from storage
    const savedSeenCards = await GM.getValue("scarab21_seenCards", []);
    seenCards = new Set(savedSeenCards);

    // Continue with the rest of the initialization
    main();
  })();

  async function main() {
    const displayValue = (v) => FACE_NAMES[v] || v;

    const createRecentGamesFieldset = async () => {
      const games = await GM.getValue("recentGames", []);
      return `
    <fieldset id="recentGamesBox">
      <legend>Score Log (Last 50)</legend>
      <div id="recentGamesList">
        ${games.map((s) => `<div>${s}</div>`).join("")}
      </div>
    </fieldset>`;
    };

    async function addRecentScore(score, item) {
      let games = await GM.getValue("recentGames", []);
      games.push(item ? `${score} (${item[1]})` : score);
      if (games.length > 50) {games.shift();}
      await GM.setValue("recentGames", games);
      const list = document.getElementById("recentGamesList");
      if (list) list.innerHTML = games.map((s) => `<div>${s}</div>`).join("");
    }

    $('head').append(`<style>
        #scarabUI > div:last-child {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: auto;
          max-height: 100%;
        }
        #scarabUI button {
            background: #007bff;
            color: #fff;
            border-radius: 4px;
            display: block;
        }
        #drag_header {
          width: 100%;
          cursor: move;
          background: #fff;
          color: #000;
          padding: 4px 10px;
          font-weight: bold;
          border-radius: 6px 6px 0 0;
        }
        .scarab_settings {
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .scarab_settings > * {
          flex: 1 0 50%;
        }
        .scarab_settings div {
          display: flex;
          align-items: center;
        }
        .scarab_tracker {
          display: flex;
          flex: 1;
          gap: 10px;
          overflow: hidden;
        }
        .scarab_left {
          flex-grow: 1;
          overflow: auto;
          gap: 10px;
          display: flex;
          flex-direction: column;
        }
        .scarab_tracker fieldset {
          border: 2px solid #fff;
          border-radius: 6px;
          padding: 10px;
        }
        .scarab_overview {
          border-color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .scarab_tracker .scarab_keyboard {
          border-color: #33c4ff;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: stretch;
        }
        .scarab_keyboard > div:nth-child(2) {
          display:flex;
          justify-content:space-between;
          gap:10px;
        }
        #scarabUI legend {
          font-weight: bold;
        }
        .scarab_keyboard legend {
          color: #33c4ff;
        }
        .manualMode .scarab_card {
          cursor: pointer;
        }
        .scarab_card {
          box-sizing: border-box;
          width: 48px;
          height: 70px;
          padding: 0;
          margin: 0;
        }
        .scarab_card img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .scarab_gray {
          border: 2px solid red;
        }
        .scarab_gray img {
          filter: grayscale(100%) opacity(0.5);
        }
        #cardContainer fieldset {
          border-color: #888;
          padding: 6px 10px;
          margin: 0;
        }
        #cardContainer legend {
          color: #fff;
        }
        #cardContainer .groupByNumber {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        #cardContainer .groupBySuit {
          display: flex;
          gap: 6px;
        }
        #cardContainer .numbers {
          display: flex;
          gap: 6px;
        }
        #recentGamesBox {
          border-color: #fa0;
          padding: 10px;
          margin: 0;
          min-width: 160px;
          max-height: calc(100% - 20px);
          overflow: auto;
        }
        #recentGamesBox legend {
          color: #fa0;
        }
      </style>`)
    const win = document.createElement("div");
    win.id = "scarabUI";
    win.style.cssText = `
    position:absolute;top:50px;left:50px;max-height:95vh;
    background:#2a3439;border:2px solid #fff;border-radius:8px;
    overflow:hidden;z-index:9999;color:#eee;font-family:sans-serif;
    display:flex;flex-direction:column;transform:scale(${scale});transform-origin:bottom left;
  `;
    win.innerHTML = `

    <div id="drag_header">Scarab 21 Deck Tracker</div>
    <div>
    <div class="scarab_tracker">
      <div class="scarab_left">
        <fieldset class="scarab_overview">
            <div><strong>Total in Pile:</strong> <span id="deckCount">52</span></div>
            <div><strong>10-Value Cards:</strong> <span id="tenCardInfo">--</span></div>
            <label>
              <input type="checkbox" id="toggleView"${groupBySuit ? " checked" : ""}> Group by Suit
            </label>
        </fieldset>
        <div id="cardContainer"></div>
        <fieldset class="scarab_keyboard">
          <legend>Settings</legend>
          <div>
            ${[0, 1, 2, 3, 4].map((i) => `<label style="display:flex;flex-direction:column;">Col ${i + 1}:
                <select class="form-control" id="keyCol${i}">${keyList.map((k) =>
                  `<option value="${k}"${keyBindings[i] === k ? " selected" : ""}>${k}</option>`).join("")}
                </select>
              </label>`).join("")}
          </div>
            <button id="saveKeys" class="form-control ignore-button-size">Save Keys</button>

        <div class="scarab_settings">
          <div>Scale: <input type="range" id="scaleSlider" min="0.6" max="1.6" step="0.05" value="${scale}">
          <span id="scaleVal">${scale}</span></div>
          <label><input type="checkbox" id="anchorToggle">Mobile Mode</label>
          <label><input type="checkbox" id="manualToggle"${manualMode ? " checked" : ""}> Manually Set Cards</label>
          <button id="clearTracker" class="form-control ignore-button-size">Clear Tracker</button>
        </div>
        </fieldset>
      </div>
      ${await createRecentGamesFieldset()}
    </div>
    </div>
  `;

    const savedPos = await GM.getValue("windowPosition");
    if (savedPos?.top && savedPos?.left) {
      win.style.top = `${savedPos.top}px`;
      win.style.left = `${savedPos.left}px`;
    }
    document.body.appendChild(win);

    document.getElementById("scaleSlider").addEventListener("input", async (e) => {
      const val = parseFloat(e.target.value).toFixed(2);
      document.getElementById("scarabUI").style.transform = `scale(${val})`;
      document.getElementById("scaleVal").textContent = val;
      await GM.setValue("ui_scale", val);
    });

    document.getElementById("manualToggle").addEventListener("change", async (e) => {
      manualMode = e.target.checked;
      const container = document.getElementById("cardContainer");
      container.className = container.className == 'manualMode' ?  '' : 'manualMode';
      await GM.setValue("scarab21_manualMode", manualMode);
    });

    document.getElementById("clearTracker").addEventListener("click", async (e) => {
      seenCards = new Set();
      await GM.setValue("scarab21_seenCards", Array.from(seenCards));
      updateUI();
    });

    document.getElementById("toggleView").addEventListener("change", async (e) => {
      groupBySuit = e.target.checked;
      await GM.setValue("scarab21_groupBySuit", groupBySuit);
      updateUI();
    });

    let isAnchored = await GM.getValue("scarab21_anchor", false);
    document.getElementById("anchorToggle").checked = isAnchored;
    const anchorToggle = document.getElementById("anchorToggle");
    anchorToggle.addEventListener("change", async () => {
      isAnchored = anchorToggle.checked;
      await GM.setValue("scarab21_anchor", isAnchored);
      if (isAnchored) {
        anchorWindow();
      } else {
        win.style.position = "absolute";
        win.style.marginTop = "initial";
        win.style.paddingBottom = "initial";
      }
    });

    function anchorWindow() {
      win.style.position = "initial";
      win.style.marginTop = "-250px";
      win.style.paddingBottom = "130px";
    }

    window.addEventListener("scroll", () => isAnchored && anchorWindow());
    window.addEventListener("resize", () => isAnchored && anchorWindow());

    document.getElementById("saveKeys").addEventListener("click", async () => {
      keyBindings = [0, 1, 2, 3, 4].map(
        (i) => document.getElementById(`keyCol${i}`).value
      );
      await GM.setValue("scarab21_keys", keyBindings);
      alert("Key bindings saved!");
    });

    document.addEventListener("keydown", (e) => {
      const i = keyBindings.indexOf(e.key);
      if (i !== -1)
        document.querySelector(`a[onclick="play_card(${i})"]`)?.click();
    });

    const header = document.getElementById("drag_header");
    let isDragging = false,
      startX,
      startY;
    header.addEventListener("mousedown", (e) => {
      if (isAnchored) return;
      isDragging = true;
      startX = e.clientX - win.offsetLeft;
      startY = e.clientY - win.offsetTop;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    });

    const drag = (e) => {
      if (!isDragging || isAnchored) return;
      win.style.left = `${e.clientX - startX}px`;
      win.style.top = `${e.clientY - startY}px`;
    };

    const stopDrag = async () => {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
      await GM.setValue("windowPosition", { top: win.offsetTop, left: win.offsetLeft });
    };

    async function updateUI() {
      const remaining = Object.fromEntries(
        SUITS.flatMap((s) => VALUES.map((v) => [`${v}_${s}`, 1]))
      );
      seenCards.forEach((k) => {
        if (remaining[k]) remaining[k] = 0;
      });

      let total = 0,
        tenCount = 0;
      const suitCounts = Object.fromEntries(SUITS.map((s) => [s, 0])),
        valueCounts = Object.fromEntries(VALUES.map((v) => [v, 0]));

      for (let k in remaining) {
        if (remaining[k]) {
          total++;
          const [val, suit] = k.split("_");
          suitCounts[suit]++;
          valueCounts[val]++;
          if (TEN_VALS.includes(+val)) tenCount++;
        }
      }

      document.getElementById("deckCount").textContent = total - 1;
      document.getElementById("tenCardInfo").textContent = `${tenCount} cards (${
        total ? ((tenCount / total) * 100).toFixed(1) : "0.0"
      }%)`;

      const container = document.getElementById("cardContainer");
      if (manualMode)
        container.className = 'manualMode'
      container.innerHTML = "";

      const appendCard = (k, gray) => {
        const div = document.createElement("div");
        div.className = `scarab_card${gray ? " scarab_gray" : ""}`;

        div.onclick = async () => {
          if (!manualMode)
            return;
          if (!seenCards.has(k)) {
            seenCards.add(k);
            await GM.setValue("scarab21_seenCards", Array.from(seenCards));
            updateUI();
          }
          else {
            seenCards.delete(k);
            await GM.setValue("scarab21_seenCards", Array.from(seenCards));
            updateUI();
          }
        };
        div.innerHTML = `<img src="${BASE}/${k}.gif">`;
        return div;
      };

      if (groupBySuit) {
        SUITS.forEach((s) => {
          const count = suitCounts[s],
            pct = total ? ((count / total) * 100).toFixed(1) : "0.0";
          const field = document.createElement("fieldset");
          field.innerHTML = `<legend>${SUIT_SYMBOLS[s]} ${SUIT_NAMES[s]} [${count} cards, ${pct}%]</legend>`;
          const wrap = document.createElement("div");
          wrap.className = "groupBySuit";
          VALUES.forEach((v) => {
            const k = `${v}_${s}`;
            wrap.appendChild(appendCard(k, !remaining[k]));
          });
          field.appendChild(wrap);
          container.appendChild(field);
        });
      } else {
        const grid = document.createElement("div");
        grid.className = "groupByNumber";
        VALUES.forEach((v) => {
          const count = valueCounts[v],
            pct = total ? ((count / total) * 100).toFixed(1) : "0.0";
          const field = document.createElement("fieldset");
          field.innerHTML = `<legend>${displayValue(v)} [${count} cards, ${pct}%]</legend>`;
          const wrap = document.createElement("div");
          wrap.className = "numbers";
          SUITS.forEach((s) => {
            const k = `${v}_${s}`;
            wrap.appendChild(appendCard(k, !remaining[k]));
          });
          field.appendChild(wrap);
          grid.appendChild(field);
        });
        container.appendChild(grid);
      }
    }

    const cache = document.createElement("div");
    cache.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;";
    for (let v of VALUES) {
      for (let s of SUITS) {
        const img = new Image();
        img.src = `${BASE}/${v}_${s}.gif`;
        cache.appendChild(img);
      }
    }
    document.body.appendChild(cache);

    // add visible cards to seenCards and updateUI()
    async function addVisible() {
      const boardCards = document.querySelectorAll("div.cards img.card");
      boardCards.forEach((img) => {
        const match = img.src.match(/\/(\d+)_([a-z]+)\.gif/i);
        if (match) {
          const cardKey = `${match[1]}_${match[2]}`;
          seenCards.add(cardKey);
        }
      });
      await GM.setValue("scarab21_seenCards", Array.from(seenCards));
      updateUI();
    }
    // reset seenCards to what is visible on the board
    async function resetCards() {
      seenCards.clear();
      addVisible();
    }

    unsafeWindow.play_card = function (column) {
      // copy + paste of the original play_card(column) below
      $.ajax({
        type: "POST",
        url: "/games/scarab21/process/",
        dataType: "json",
        data: {
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
          action: "play_card",
          column: column
        },
        success: function (response) {
          // adding additional functionality to the success function for the userscript
          /* Note about Scarab21 logic:
            When you get the Deck Cleared! alert, the card you just played will be shuffled into the new draw pile.
            When the draw pile says 0, all cards currently visible (including the last card) will not be shuffled into the new draw pile.
          */
          const wasLast = document.querySelector('.stats tr:last-child td:last-child').innerHTML === '0';
          if (wasLast) {
            resetCards();
          }
          const card = document.querySelector('td[align="center"] > img.card');
          const key = card?.src.match(/\/(\d+)_([a-z]+)\.gif/i);
          if (key) {
            seenCards.add(`${key[1]}_${key[2]}`);
            GM.setValue("scarab21_seenCards", Array.from(seenCards));
            updateUI();
          }

          // original success callback below
          // random event
          let event = document.getElementById("page_event");
          event.innerHTML = response["page_event"];

          // new content
          let content = document.querySelector("#page_content > main");
          content.innerHTML = response["page_content"];

          hover_arrows();
        },
        error: function (response) {
          window.location.reload();
        },
      });
    };

    unsafeWindow.collect_winnings = function () {
      // copy + paste of the original collect_winnings() below
      $.ajax({
        type: "POST",
        url: "/games/scarab21/process/",
        dataType: "json",
        data: {
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
          action: "collect",
          column: null
        },
        success: function (response) {
          // original success callback below
          // random event
          let event = document.getElementById("page_event");
          event.innerHTML = response["page_event"];

          // new content
          let content = document.querySelector("#page_content > main");
          content.innerHTML = response["page_content"];

          hover_arrows();

          // adding additional functionality to the success function for the userscript
          const match = response["page_content"].match(/<p>You have scored <strong>(\d+)<\/strong>/i);
          const item = response["page_content"].match(/slides you an? (.*?) - take care of it!/i);
          if (match) {
            addRecentScore(Number(match[1]), item);
            seenCards.clear();
            GM.setValue("scarab21_seenCards", Array.from(seenCards));
            updateUI();
          }
        },
        error: function (response) {
          window.location.reload();
        },
      });
    };

    if (isAnchored) {
      anchorWindow();
    }
    addVisible();
  }
})();
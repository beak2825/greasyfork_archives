// ==UserScript==
// @name         RollAdvantage Discord Logger
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Capture dice roll results and send to Discord
// @author       Apathivity
// @license MIT 
// @match        *://rolladvantage.com/diceroller*
// @match        *://www.rolladvantage.com/diceroller*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561540/RollAdvantage%20Discord%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/561540/RollAdvantage%20Discord%20Logger.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* ---------------------------------------------------------
       UI PANEL
    --------------------------------------------------------- */

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "6px",
    zIndex: "99999",
    fontSize: "14px",
    width: "180px",
  });

  panel.innerHTML = `
        <div id="ra-drag-handle" style="
            margin-bottom:6px;
            font-weight:bold;
            cursor:move;
            background:#333;
            padding:4px;
            border-radius:4px;
            text-align:center;
        ">Discord Logger</div>

        <label>Webhook URL:</label><br>
        <input id="ra-webhook" type="text" style="width:160px; margin-bottom:8px;"><br>

        <label>Character Name:</label><br>
        <input id="ra-username" type="text" style="width:160px; margin-bottom:8px;"><br>

        <label>Embed Color:</label><br>
        <input id="ra-color" type="color" style="width:160px; height:30px; padding:0; border:none;"><br>
    `;
  document.body.appendChild(panel);

  const usernameInput = document.getElementById("ra-username");
  const colorInput = document.getElementById("ra-color");

  usernameInput.value = localStorage.getItem("ra-username") || "Player";
  colorInput.value = localStorage.getItem("ra-color") || "#ffffff";

  usernameInput.addEventListener("input", (e) =>
    localStorage.setItem("ra-username", e.target.value)
  );
  colorInput.addEventListener("input", (e) =>
    localStorage.setItem("ra-color", e.target.value)
  );

  const webhookInput = document.getElementById("ra-webhook");
  webhookInput.value = localStorage.getItem("ra-webhook") || "";
  webhookInput.addEventListener("input", (e) =>
    localStorage.setItem("ra-webhook", e.target.value)
  );

  /* ---------------------------------------------------------
       DRAGGABLE PANEL
    --------------------------------------------------------- */

  (function makePanelDraggable() {
    const handle = document.getElementById("ra-drag-handle");
    let offsetX = 0,
      offsetY = 0,
      isDown = false;

    handle.addEventListener("mousedown", (e) => {
      isDown = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
      document.body.style.userSelect = "";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      panel.style.left = e.clientX - offsetX + "px";
      panel.style.top = e.clientY - offsetY + "px";
      panel.style.right = "auto";
    });
  })();

  /* ---------------------------------------------------------
       BREAKDOWN PARSER
    --------------------------------------------------------- */

  function parseBreakdown(text) {
    if (!text) return [];
    return text.replace(/\n/g, " ").trim().split(/\s+/).filter(Boolean);
  }

  /* ---------------------------------------------------------
      HELPER FUNCTIONS
   --------------------------------------------------------- */

  const icon_urls = {
    Q: "https://i.imgur.com/5DFE7Yn.png", // success
    W: "https://i.imgur.com/9PUKXG0.png", // advantage
    E: "https://i.imgur.com/CMd3ueo.png", // triumph
    R: "https://i.imgur.com/KJ66coN.png", // failure
    T: "https://i.imgur.com/uMhXotu.png", // threat
    Y: "https://i.imgur.com/IeSaHr9.png", // despair
    I: "https://i.imgur.com/jvAFRvf.png", // dark
    U: "https://i.imgur.com/exi5SSX.png", // light
  };

  const dice_urls = {
    ability: "https://i.imgur.com/7Nf9lhM.png",
    proficiency: "https://i.imgur.com/Nm78Ujf.png",
    boost: "https://i.imgur.com/kETim4m.png",
    difficulty: "https://i.imgur.com/fRH2a0b.png",
    challenge: "https://i.imgur.com/7LDHYv3.png",
    setback: "https://i.imgur.com/gOT680k.png",
    force: "https://i.imgur.com/KoRcjJv.png",
  };

  // Preload images for faster loading
  (function preloadImages() {
    const allUrls = Object.values(icon_urls).concat(Object.values(dice_urls));
    allUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  })();

  function luck30Roll(detailed_flag) {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const d30 = Math.floor(Math.random() * 30) + 1;
    const roll = d20 + d30;

    const detailed_roll = Math.floor(Math.random() * 100 + 1); // d100

    let luck = roll >= 30 ? "Good" : "Bad";

    if (detailed_flag === true) {
      luck = detailed_roll <= 50 ? luck + " Good" : luck + " Bad";
    }

    const result = { d20, d30, roll, luck };
    return result;
  }

  /* ---------------------------------------------------------
       LUCK30 LOGIC
    --------------------------------------------------------- */

  const luckPanel = document.createElement("div");
  Object.assign(luckPanel.style, {
    position: "fixed",
    top: "220px",
    right: "20px",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "6px",
    zIndex: "99999",
    fontSize: "14px",
    width: "180px",
  });

  luckPanel.innerHTML = `
    <div id="luck30-drag" style="
        margin-bottom:6px;
        font-weight:bold;
        cursor:move;
        background:#333;
        padding:4px;
        border-radius:4px;
        text-align:center;
    ">Roll Luck30</div>

    <label style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
        <input id="luck30-detailed" type="checkbox" style="transform:scale(1.2);">
        Detailed Roll
    </label>

    <button id="luck30-roll" style="
        width:100%;
        padding:6px;
        margin-bottom:8px;
        background:#444;
        color:#fff;
        border:1px solid #666;
        border-radius:4px;
        cursor:pointer;
    ">Roll</button>

    <div id="luck30-result" style="
        background:#111;
        padding:6px;
        border-radius:4px;
        min-height:60px;
        white-space:pre-line;
        font-family:monospace;
    ">Waiting...</div>
    `;

  document.body.appendChild(luckPanel);

  // ✅ Load & save the Detailed Roll toggle state
  const detailedToggle = document.getElementById("luck30-detailed");

  // Load saved state
  detailedToggle.checked = localStorage.getItem("luck30-detailed") === "true";

  // Save state on change
  detailedToggle.addEventListener("change", () => {
    localStorage.setItem("luck30-detailed", detailedToggle.checked);
  });

  (function makeLuckPanelDraggable() {
    const handle = document.getElementById("luck30-drag");
    let offsetX = 0,
      offsetY = 0,
      isDown = false;

    handle.addEventListener("mousedown", (e) => {
      isDown = true;
      offsetX = e.clientX - luckPanel.offsetLeft;
      offsetY = e.clientY - luckPanel.offsetTop;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
      document.body.style.userSelect = "";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      luckPanel.style.left = e.clientX - offsetX + "px";
      luckPanel.style.top = e.clientY - offsetY + "px";
      luckPanel.style.right = "auto";
    });
  })();

  document.getElementById("luck30-roll").addEventListener("click", () => {
    const detailed = detailedToggle.checked;
    const result = luck30Roll(detailed);
    const box = document.getElementById("luck30-result");

    box.textContent =
      `d20:   ${result.d20}\n` +
      `d30:   ${result.d30}\n` +
      `Total: ${result.roll}\n` +
      `Luck:  ${result.luck}`;

    // ✅ Send to Discord after a tiny delay (feels smoother)
    setTimeout(() => {
      const playerName = localStorage.getItem("ra-username") || "Player";
      const hexColor = localStorage.getItem("ra-color") || "#ffffff";
      const webhook = localStorage.getItem("ra-webhook");

      if (webhook) {
        sendLuck30ToDiscord(playerName, result, hexColor, webhook);
      }
    }, 150);
  });

  /* ---------------------------------------------------------
       ROLLADVANTAGE ROLL RESULT CONVERSION
    --------------------------------------------------------- */

  function getDiceResults(breakdown) {
    const diceResults = [];
    const diceInfo = breakdown.childNodes; // the node is an array (useable)

    diceInfo.forEach((child) => {
      const type = child.classList[3]; // type name of the dice
      const icons = child.innerText; // result of the dice
      diceResults.push({ type: type, icons: icons });
    });

    return diceResults;
  }

  // dice type and dice icon url conversion
  function getImageUrls(diceResults) {
    const all_result_img_urls = [];

    diceResults.forEach(({ type, icons }) => {
      const raw_icons = icons.split("");
      const icon_img_urls = raw_icons.map((letter) => icon_urls[letter]);
      const dice_img_url = dice_urls[type];

      all_result_img_urls.push({
        type,
        dice: dice_img_url,
        icons: icon_img_urls,
      });
    });

    return all_result_img_urls;
  }

  /* ---------------------------------------------------------
       CANVAS BLOB RENDER
    --------------------------------------------------------- */

  async function drawDiceCanvas(resultGroups) {
    // ===== MASTER CONTROLS =====
    const BASE_HEIGHT = 50; // height of each die face
    const GAP = 20; // space between dice

    // Icon scaling controls
    const ICON_SCALE_SINGLE = 0.45; // 45% of BASE_HEIGHT
    const ICON_SCALE_DOUBLE = 0.32; // 32% of BASE_HEIGHT
    const ICON_SCALE_MULTI = 1.0; // evenly divided

    // Vertical offsets per die type (optical centering)
    const TYPE_OFFSET = {
      ability: -6,
      proficiency: -6,
      force: -6,

      difficulty: 6,
      challenge: 6,

      // ✅ Your request: boost & setback have NO offset
      boost: 0,
      setback: 0,
    };

    // ===== IMAGE LOADING =====
    function loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }

    const loadedGroups = await Promise.all(
      resultGroups.map(async (group) => {
        const diceImg = await loadImage(group.dice);
        const iconImgs = await Promise.all(group.icons.map(loadImage));
        return { diceImg, iconImgs, type: group.type };
      })
    );

    // ===== CANVAS SIZE =====
    const totalWidth = loadedGroups.reduce((sum, group) => {
      const scale = BASE_HEIGHT / group.diceImg.height;
      return sum + group.diceImg.width * scale + GAP;
    }, -GAP);

    const canvas = document.createElement("canvas");
    canvas.width = totalWidth;
    canvas.height = BASE_HEIGHT;
    const ctx = canvas.getContext("2d");

    let x = 0;

    // ===== RENDER LOOP =====
    for (const group of loadedGroups) {
      const { diceImg, iconImgs, type } = group;

      // Scale die face
      const diceScale = BASE_HEIGHT / diceImg.height;
      const diceWidth = diceImg.width * diceScale;

      ctx.drawImage(diceImg, x, 0, diceWidth, BASE_HEIGHT);

      // ===== ICON SIZE LOGIC =====
      const count = iconImgs.length;
      let iconHeight;

      if (count === 1) {
        iconHeight = BASE_HEIGHT * ICON_SCALE_SINGLE;
      } else if (count === 2) {
        iconHeight = BASE_HEIGHT * ICON_SCALE_DOUBLE;
      } else {
        iconHeight = (BASE_HEIGHT * ICON_SCALE_MULTI) / count;
      }

      const totalIconsHeight = iconHeight * count;
      let startY = (BASE_HEIGHT - totalIconsHeight) / 2;

      // Apply type offset
      const offset = TYPE_OFFSET[type] || 0;
      startY += offset;

      // ===== DRAW ICONS =====
      iconImgs.forEach((icon, i) => {
        const scale = iconHeight / icon.height;
        const iconWidth = icon.width * scale;

        const iconX = x + (diceWidth - iconWidth) / 2;
        const iconY = startY + i * iconHeight;

        // Off-screen canvas for inversion
        const temp = document.createElement("canvas");
        temp.width = iconWidth;
        temp.height = iconHeight;
        const tctx = temp.getContext("2d");

        tctx.drawImage(icon, 0, 0, iconWidth, iconHeight);

        // Invert only for difficulty / setback
        if (type === "difficulty" || type === "setback") {
          const imgData = tctx.getImageData(0, 0, iconWidth, iconHeight);
          const data = imgData.data;

          for (let p = 0; p < data.length; p += 4) {
            if (data[p + 3] > 0) {
              data[p] = 255 - data[p];
              data[p + 1] = 255 - data[p + 1];
              data[p + 2] = 255 - data[p + 2];
            }
          }

          tctx.putImageData(imgData, 0, 0);
        }

        ctx.drawImage(temp, iconX, iconY);
      });

      x += diceWidth + GAP;
    }

    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  /* ---------------------------------------------------------
       DISCORD IMAGE HELPER
    --------------------------------------------------------- */

  function sendLuck30ToDiscord(playerName, result, hexColor, webhook) {
    const payload = {
      embeds: [
        {
          title: `${playerName}'s Luck30 Roll`,
          color: parseInt(hexColor.replace("#", ""), 16),
          fields: [
            { name: "d20", value: `${result.d20}`, inline: true },
            { name: "d30", value: `${result.d30}`, inline: true },
            { name: "Total", value: `${result.roll}`, inline: true },
            { name: "Luck", value: `${result.luck}`, inline: false },
          ],
          footer: { text: "Luck30 System" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.text())
      .then((t) => console.log("✅ Luck30 sent to Discord:", t))
      .catch((err) => console.error("❌ Discord error:", err));
  }

  function sendImageToDiscord(
    blob,
    playerName,
    compoundText,
    breakdownArray,
    hexColor,
    webhook
  ) {
    const form = new FormData();

    form.append("file", blob, "roll.png");

    form.append(
      "payload_json",
      JSON.stringify({
        embeds: [
          {
            title: `${playerName}'s Roll`,
            color: parseInt(hexColor.replace("#", ""), 16),
            fields: [
              { name: "Result", value: compoundText || "—", inline: true },
              {
                name: "Breakdown",
                value: breakdownArray.join(" ") || "—",
                inline: true,
              },
            ],
            image: { url: "attachment://roll.png" },
            footer: { text: "RollAdvantage.com" },
            timestamp: new Date().toISOString(),
          },
        ],
      })
    );

    fetch(webhook, {
      method: "POST",
      body: form,
    })
      .then((r) => r.text())
      //.then((t) => console.log('✅ Discord:', t))
      .catch((err) => console.error("❌ Discord error:", err));
  }

  /* ---------------------------------------------------------
       OBSERVER FOR ROLL RESULTS
    --------------------------------------------------------- */

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (!node.classList.contains("result")) continue;

        setTimeout(async () => {
          const compound = node.querySelector(".compound");
          const breakdown = node.querySelector(".breakdown");
          if (!compound || !breakdown) return;

          const results = getDiceResults(breakdown);

          const compoundText = compound.innerText.split(": ")[1]?.trim() || "";

          const breakdownArray = parseBreakdown(breakdown.innerText);
          if (!compoundText || breakdownArray.length === 0) return;

          const playerName = localStorage.getItem("ra-username") || "Player";
          const hexColor = localStorage.getItem("ra-color") || "#ffffff";
          const webhook = localStorage.getItem("ra-webhook");

          if (!webhook) return;

          // console.log(`🎲 ${playerName}: ${results[0].type} | ${results[0].icons}`);

          // Convert dice results → image URL groups
          const imageGroups = getImageUrls(results);

          // Draw canvas
          const blob = await drawDiceCanvas(imageGroups);

          // Send to Discord
          sendImageToDiscord(
            blob,
            playerName,
            compoundText,
            breakdownArray,
            hexColor,
            webhook
          );
        }, 500);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("🚀 Dice Roller Discord Webhook Logger (Canvas Mode) is running");
})();

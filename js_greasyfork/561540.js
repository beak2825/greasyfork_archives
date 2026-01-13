// ==UserScript==
// @name         RollAdvantage Discord Logger
// @namespace    http://tampermonkey.net/
// @version      1.70
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
  'use strict';

  /* ---------------------------------------------------------
       UI PANEL
    --------------------------------------------------------- */

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px',
    background: '#222',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '6px',
    zIndex: '99999',
    fontSize: '14px',
    width: '180px',
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

  const usernameInput = document.getElementById('ra-username');
  const colorInput = document.getElementById('ra-color');

  usernameInput.value = localStorage.getItem('ra-username') || 'Player';
  colorInput.value = localStorage.getItem('ra-color') || '#ffffff';

  usernameInput.addEventListener('input', (e) =>
    localStorage.setItem('ra-username', e.target.value)
  );
  colorInput.addEventListener('input', (e) => localStorage.setItem('ra-color', e.target.value));

  const webhookInput = document.getElementById('ra-webhook');
  webhookInput.value = localStorage.getItem('ra-webhook') || '';
  webhookInput.addEventListener('input', (e) => localStorage.setItem('ra-webhook', e.target.value));

  /* ---------------------------------------------------------
       DRAGGABLE PANEL
    --------------------------------------------------------- */

  (function makePanelDraggable() {
    const handle = document.getElementById('ra-drag-handle');
    let offsetX = 0,
      offsetY = 0,
      isDown = false;

    handle.addEventListener('mousedown', (e) => {
      isDown = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      panel.style.left = e.clientX - offsetX + 'px';
      panel.style.top = e.clientY - offsetY + 'px';
      panel.style.right = 'auto';
    });
  })();

  /* ---------------------------------------------------------
       BREAKDOWN PARSER
    --------------------------------------------------------- */

  function parseBreakdown(text) {
    if (!text) return [];
    return text.replace(/\n/g, ' ').trim().split(/\s+/).filter(Boolean);
  }

  /* ---------------------------------------------------------
      HELPER FUNCTIONS
   --------------------------------------------------------- */

  const icon_urls = {
    Q: 'https://i.imgur.com/5DFE7Yn.png', // success
    W: 'https://i.imgur.com/9PUKXG0.png', // advantage
    E: 'https://i.imgur.com/CMd3ueo.png', // triumph
    R: 'https://i.imgur.com/KJ66coN.png', // failure
    T: 'https://i.imgur.com/uMhXotu.png', // threat
    Y: 'https://i.imgur.com/IeSaHr9.png', // despair
    I: 'https://i.imgur.com/jvAFRvf.png', // dark
    U: 'https://i.imgur.com/exi5SSX.png', // light
  };

  const dice_urls = {
    ability: 'https://i.imgur.com/7Nf9lhM.png',
    proficiency: 'https://i.imgur.com/Nm78Ujf.png',
    boost: 'https://i.imgur.com/kETim4m.png',
    difficulty: 'https://i.imgur.com/fRH2a0b.png',
    challenge: 'https://i.imgur.com/7LDHYv3.png',
    setback: 'https://i.imgur.com/gOT680k.png',
    force: 'https://i.imgur.com/KoRcjJv.png',
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

    let luck = roll >= 30 ? 'Good' : 'Bad';

    if (detailed_flag === true) {
      luck = detailed_roll <= 50 ? luck + ' Good' : luck + ' Bad';
    }

    const result = { d20, d30, roll, luck };
    return result;
  }

  /* ---------------------------------------------------------
       LUCK30 LOGIC
    --------------------------------------------------------- */

  const luckPanel = document.createElement('div');
  Object.assign(luckPanel.style, {
    position: 'fixed',
    top: '220px',
    right: '20px',
    padding: '10px',
    background: '#222',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '6px',
    zIndex: '99999',
    fontSize: '14px',
    width: '180px',
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
  const detailedToggle = document.getElementById('luck30-detailed');

  // Load saved state
  detailedToggle.checked = localStorage.getItem('luck30-detailed') === 'true';

  // Save state on change
  detailedToggle.addEventListener('change', () => {
    localStorage.setItem('luck30-detailed', detailedToggle.checked);
  });

  (function makeLuckPanelDraggable() {
    const handle = document.getElementById('luck30-drag');
    let offsetX = 0,
      offsetY = 0,
      isDown = false;

    handle.addEventListener('mousedown', (e) => {
      isDown = true;
      offsetX = e.clientX - luckPanel.offsetLeft;
      offsetY = e.clientY - luckPanel.offsetTop;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      luckPanel.style.left = e.clientX - offsetX + 'px';
      luckPanel.style.top = e.clientY - offsetY + 'px';
      luckPanel.style.right = 'auto';
    });
  })();

  document.getElementById('luck30-roll').addEventListener('click', () => {
    const detailed = detailedToggle.checked;
    const result = luck30Roll(detailed);
    const box = document.getElementById('luck30-result');

    box.textContent =
      `d20:   ${result.d20}\n` +
      `d30:   ${result.d30}\n` +
      `Total: ${result.roll}\n` +
      `Luck:  ${result.luck}`;

    // ✅ Send to Discord after a tiny delay (feels smoother)
    setTimeout(() => {
      const playerName = localStorage.getItem('ra-username') || 'Player';
      const hexColor = localStorage.getItem('ra-color') || '#ffffff';
      const webhook = localStorage.getItem('ra-webhook');

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
      const raw_icons = icons.split('');
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
        img.crossOrigin = 'anonymous';
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

    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = BASE_HEIGHT;
    const ctx = canvas.getContext('2d');

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
        const temp = document.createElement('canvas');
        temp.width = iconWidth;
        temp.height = iconHeight;
        const tctx = temp.getContext('2d');

        tctx.drawImage(icon, 0, 0, iconWidth, iconHeight);

        // Invert only for difficulty / setback
        if (type === 'difficulty' || type === 'setback') {
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

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }

  /* ---------------------------------------------------------
       DISCORD IMAGE HELPER
    --------------------------------------------------------- */

  function sendLuck30ToDiscord(playerName, result, hexColor, webhook) {
    const payload = {
      embeds: [
        {
          title: `${playerName}'s Luck30 Roll`,
          color: parseInt(hexColor.replace('#', ''), 16),
          fields: [
            { name: 'd20', value: `${result.d20}`, inline: true },
            { name: 'd30', value: `${result.d30}`, inline: true },
            { name: 'Total', value: `${result.roll}`, inline: true },
            { name: 'Luck', value: `${result.luck}`, inline: false },
          ],
          footer: { text: 'Luck30 System' },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.text())
      .then((t) => console.log('✅ Luck30 sent to Discord:', t))
      .catch((err) => console.error('❌ Discord error:', err));
  }

  function sendImageToDiscord(blob, playerName, compoundText, breakdownArray, hexColor, webhook) {
    const form = new FormData();

    form.append('file', blob, 'roll.png');

    form.append(
      'payload_json',
      JSON.stringify({
        embeds: [
          {
            title: `${playerName}'s Roll`,
            color: parseInt(hexColor.replace('#', ''), 16),
            image: { url: 'attachment://roll.png' },
            footer: { text: compoundText },
            timestamp: new Date().toISOString(),
          },
        ],
      })
    );

    fetch(webhook, {
      method: 'POST',
      body: form,
    })
      .then((r) => r.text())
      .catch((err) => console.error('❌ Discord error:', err));
  }

  /* ---------------------------------------------------------
       OBSERVER FOR ROLL RESULTS
    --------------------------------------------------------- */

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (!node.classList.contains('result')) continue;

        setTimeout(async () => {
          const compound = node.querySelector('.compound');
          const breakdown = node.querySelector('.breakdown');
          if (!compound || !breakdown) return;

          const results = getDiceResults(breakdown);

          const compoundText = compound.innerText.split(': ')[1]?.trim() || '';

          const breakdownArray = parseBreakdown(breakdown.innerText);
          if (!compoundText || breakdownArray.length === 0) return;

          // Compute and store the roll outcome for highlighting from icons
          lastRollOutcome = computeRollOutcomeFromIcons(breakdownArray);

          // Update the probability panel with highlighting
          setTimeout(() => {
            const tally = readDicePool();
            updateProbabilityPanel(tally);
          }, 100);

          const playerName = localStorage.getItem('ra-username') || 'Player';
          const hexColor = localStorage.getItem('ra-color') || '#ffffff';
          const webhook = localStorage.getItem('ra-webhook');

          if (!webhook) return;

          // Convert dice results → image URL groups
          const imageGroups = getImageUrls(results);

          // Draw canvas
          const blob = await drawDiceCanvas(imageGroups);

          // Send to Discord
          sendImageToDiscord(blob, playerName, compoundText, breakdownArray, hexColor, webhook);
        }, 500);
      }
    }
  });

  // Global variable to store the last roll outcome for highlighting
  let lastRollOutcome = null;

  // Function to compute roll outcome from dice icons
  function computeRollOutcomeFromIcons(breakdownArray) {
    let totalSuccess = 0;
    let totalAdvantage = 0;
    let totalFailure = 0;
    let totalThreat = 0;
    let totalTriumph = 0;
    let totalDespair = 0;

    const symbolMap = {
      Q: 'success',
      W: 'advantage',
      E: 'triumph',
      R: 'failure',
      T: 'threat',
      Y: 'despair',
    };

    breakdownArray.forEach((icons) => {
      icons.split('').forEach((letter) => {
        const symbol = symbolMap[letter];
        if (symbol === 'success') totalSuccess++;
        else if (symbol === 'advantage') totalAdvantage++;
        else if (symbol === 'failure') totalFailure++;
        else if (symbol === 'threat') totalThreat++;
        else if (symbol === 'triumph') totalTriumph++;
        else if (symbol === 'despair') totalDespair++;
      });
    });

    const netSuccess = totalSuccess - totalFailure;
    const netAdvantage = totalAdvantage - totalThreat;

    const primary = netSuccess > 0 ? 'Success' : 'Failure';
    const modifiers = [];
    if (netAdvantage > 0) modifiers.push('Advantage');
    else if (netAdvantage < 0) modifiers.push('Threat');
    const specials = [];
    if (totalTriumph > 0) specials.push('Triumph');
    if (totalDespair > 0) specials.push('Despair');

    return { primary, modifiers, specials };
  }

  // Click listener for dice-pool info
  function readDicePool() {
    const pool = document.querySelector('.dice-pool');
    if (!pool) return {};

    const dice = pool.querySelectorAll('.button');
    const tally = {};

    dice.forEach((die) => {
      const label = die.querySelector('.label')?.textContent.trim();
      const amount = parseInt(die.querySelector('.amount')?.textContent.trim() || '0', 10);

      if (label) {
        tally[label] = (tally[label] || 0) + amount;
      }
    });

    return tally;
  }

  document.addEventListener('click', () => {
    lastRollOutcome = null;
    // Let RollAdvantage update the DOM first
    setTimeout(() => {
      const tally = readDicePool();
      updateProbabilityPanel(tally);
    }, 0);
  });

  document.addEventListener('click', (e) => {
    const relevant =
      e.target.closest('.dice .die') ||
      e.target.closest('.reset.button') ||
      e.target.closest('.dice-pool');

    if (!relevant) return;

    lastRollOutcome = null;
    setTimeout(() => {
      const tally = readDicePool();
      updateProbabilityPanel(tally);
    }, 0);
  });

  // --- Create Probability Panel ---
  function createProbabilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'sw-prob-panel';
    panel.style.position = 'fixed';
    panel.style.top = '120px';
    panel.style.left = '20px';
    panel.style.zIndex = '999999';
    panel.style.background = 'rgba(0,0,0,0.85)';
    panel.style.color = 'white';
    panel.style.padding = '10px 14px';
    panel.style.border = '1px solid #666';
    panel.style.borderRadius = '6px';
    panel.style.fontSize = '14px';
    panel.style.minWidth = '200px';
    panel.style.cursor = 'move';
    panel.style.userSelect = 'none';
    panel.innerHTML = `
  <div style="font-weight:bold; margin-bottom:6px;">Probability</div>

  <label style="display:flex; align-items:center; gap:6px; margin-bottom:8px; cursor:pointer;">
    <input type="checkbox" id="sw-hide-odds" style="cursor:pointer;">
    Never tell me the odds
  </label>

  <div id="sw-prob-content">Waiting for dice…</div>
`;

    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
    #sw-prob-panel .prob-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        margin-bottom: 2px;
    }

    #sw-prob-panel .prob-section {
        margin-top: 10px;
        margin-bottom: 4px;
        font-weight: bold;
        text-decoration: underline;
    }

    #sw-prob-panel .prob-subsection {
        margin-top: 6px;
        margin-bottom: 2px;
        font-weight: bold;
        text-decoration: underline;
        opacity: 0.85;
    }

    #sw-prob-panel .prob-row span:first-child {
        white-space: nowrap;
    }
`;
    document.head.appendChild(style);

    makePanelDraggable(panel);
  }

  // --- Make Panel Draggable ---
  function makePanelDraggable(panel) {
    let offsetX = 0,
      offsetY = 0,
      isDown = false;

    panel.addEventListener('mousedown', (e) => {
      isDown = true;
      offsetX = panel.offsetLeft - e.clientX;
      offsetY = panel.offsetTop - e.clientY;
    });

    document.addEventListener('mouseup', () => (isDown = false));

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      panel.style.left = e.clientX + offsetX + 'px';
      panel.style.top = e.clientY + offsetY + 'px';
    });
  }

  createProbabilityPanel();

  document.addEventListener('change', (e) => {
    if (e.target.id === 'sw-hide-odds') {
      const content = document.getElementById('sw-prob-content');
      if (content) {
        content.style.display = e.target.checked ? 'none' : 'block';
      }
    }
  });

  //== Probability Stuff
  // Dice definitions for Star Wars: Edge of the Empire RPG
  // s: success, a: advantage, d: failure, t: threat, tri: triumph, des: despair
  // Force die is not included
  const MAX_PMF_SIZE = 800_000; // Limit to prevent excessive computation
  const DICE = {
    // Ability (green, d8): Boost die for skill checks
    Ability: [
      { s: 0, a: 0 }, // Blank
      { s: 1, a: 0 }, // Success
      { s: 1, a: 0 }, // Success
      { s: 2, a: 0 }, // Success + Success
      { s: 0, a: 1 }, // Advantage
      { s: 0, a: 1 }, // Advantage
      { s: 1, a: 1 }, // Success + Advantage
      { s: 0, a: 2 }, // Advantage + Advantage
    ],
    // Proficiency (yellow, d12): For skilled characters
    Proficiency: [
      { s: 0, a: 0 }, // Blank
      { s: 1, a: 0 }, // Success
      { s: 1, a: 0 }, // Success
      { s: 2, a: 0 }, // Success + Success
      { s: 2, a: 0 }, // Success + Success
      { s: 1, a: 1 }, // Success + Advantage
      { s: 1, a: 1 }, // Success + Advantage
      { s: 1, a: 1 }, // Success + Advantage
      { s: 0, a: 2 }, // Advantage + Advantage
      { s: 0, a: 2 }, // Advantage + Advantage
      { s: 0, a: 1 }, // Advantage
      { s: 1, a: 0, tri: 1 }, // Triumph (Success + Advantage + Triumph)
    ],
    // Difficulty (purple, d8): Opposed die for skill checks
    Difficulty: [
      { d: 0, t: 0 }, // Blank
      { d: 1, t: 0 }, // Failure
      { d: 2, t: 0 }, // Failure + Failure
      { d: 0, t: 1 }, // Threat
      { d: 0, t: 1 }, // Threat
      { d: 0, t: 2 }, // Threat + Threat
      { d: 1, t: 1 }, // Failure + Threat
      { d: 0, t: 0 }, // Blank
    ],
    // Challenge (red, d12): For difficult or opposed tasks
    Challenge: [
      { d: 0, t: 0 }, // Blank
      { d: 1, t: 0 }, // Failure
      { d: 2, t: 0 }, // Failure + Failure
      { d: 1, t: 1 }, // Failure + Threat
      { d: 1, t: 1 }, // Failure + Threat
      { d: 0, t: 2 }, // Threat + Threat
      { d: 0, t: 2 }, // Threat + Threat
      { d: 0, t: 1 }, // Threat
      { d: 0, t: 1 }, // Threat
      { d: 1, t: 0, des: 1 }, // Despair (Failure + Threat + Despair)
      { d: 1, t: 0 }, // Failure
      { d: 0, t: 0 }, // Blank
    ],
    // Boost (blue, d6): Positive modifiers
    Boost: [
      { s: 0, a: 0 }, // Blank
      { s: 0, a: 0 }, // Blank
      { s: 1, a: 0 }, // Success
      { s: 0, a: 2 }, // Advantage + Advantage
      { s: 1, a: 1 }, // Success + Advantage
      { s: 0, a: 1 }, // Advantage
    ],
    // Setback (black, d6): Negative modifiers
    Setback: [
      { s: 0, a: 0 }, // Blank
      { s: 0, a: 0 }, // Blank
      { d: 1, t: 0 }, // Failure
      { d: 1, t: 0 }, // Failure
      { d: 0, t: 1 }, // Threat
      { d: 0, t: 1 }, // Threat
    ],
  };

  // Normalize a face so missing fields become 0
  function normalize(face) {
    return {
      s: face.s || 0,
      a: face.a || 0,
      d: face.d || 0,
      t: face.t || 0,
      tri: face.tri || 0,
      des: face.des || 0,
    };
  }

  // Combine two probability mass functions (PMFs) by convolution
  function combineTwoPMFs(pmfMap, diceArray) {
    const newMap = new Map();
    const numFaces = diceArray.length;

    for (const [keyA, massA] of pmfMap) {
      const a = JSON.parse(keyA);
      for (const b of diceArray) {
        const combined = {
          s: a.s + (b.s || 0),
          a: a.a + (b.a || 0),
          d: a.d + (b.d || 0),
          t: a.t + (b.t || 0),
          tri: a.tri + (b.tri || 0),
          des: a.des + (b.des || 0),
        };
        const key = JSON.stringify(combined);
        const mass = massA / numFaces;
        newMap.set(key, (newMap.get(key) || 0) + mass);
      }
    }

    return newMap;
  }

  // Build the PMF for the entire dice pool
  function buildPoolPMF(tally) {
    const initial = { s: 0, a: 0, d: 0, t: 0, tri: 0, des: 0 };
    let pmf = new Map([[JSON.stringify(initial), 1]]); // Start with no dice

    for (const [label, count] of Object.entries(tally)) {
      for (let i = 0; i < count; i++) {
        if (pmf.size * DICE[label].length > MAX_PMF_SIZE) {
          return null; // Too many combinations, skip calculation
        }
        pmf = combineTwoPMFs(pmf, DICE[label]);
      }
    }

    return pmf;
  }

  // Cancel opposing symbols: success vs failure, advantage vs threat
  function cancelOutcome(o) {
    return {
      netSuccess: o.s - o.d,
      netAdvantage: o.a - o.t,
      triumph: o.tri,
      despair: o.des,
    };
  }

  // Compute game-focused probabilities based on actual roll mechanics
  // Primary outcome: net success > 0 = Success, net success <= 0 = Failure
  // Modifiers: advantage (a > t), threat (t > a), triumph, despair
  function computeGameOutcomes(tally) {
    const pmf = buildPoolPMF(tally);
    if (!pmf) return null; // Too many combinations

    const outcomes = {
      // Success outcomes
      success_advantage: 0, // net success > 0 AND net advantage > 0
      success_threat: 0, // net success > 0 AND net threat > 0
      success_clean: 0, // net success > 0 AND advantage == threat (clean success)

      // Failure outcomes
      failure_advantage: 0, // net success <= 0 AND net advantage > 0
      failure_threat: 0, // net success <= 0 AND net threat > 0
      failure_clean: 0, // net success <= 0 AND advantage == threat (blank/clean fail)

      // Special outcomes (tracked independently)
      triumph: 0,
      despair: 0,
    };

    for (const [key, mass] of pmf) {
      const o = JSON.parse(key);
      const c = cancelOutcome(o);
      const s = c.netSuccess;
      const a = c.netAdvantage;
      const tri = c.triumph;
      const des = c.despair;

      // Track specials
      if (tri > 0) outcomes.triumph += mass;
      if (des > 0) outcomes.despair += mass;

      // Classify primary outcome
      if (s > 0) {
        // Success
        if (a > 0) outcomes.success_advantage += mass;
        else if (a < 0) outcomes.success_threat += mass;
        else outcomes.success_clean += mass;
      } else {
        // Failure (net success <= 0)
        if (a > 0) outcomes.failure_advantage += mass;
        else if (a < 0) outcomes.failure_threat += mass;
        else outcomes.failure_clean += mass;
      }
    }

    return outcomes;
  }

  function updateProbabilityPanel(tally) {
    const content = document.getElementById('sw-prob-content');
    if (!content) return;

    const outcomes = computeGameOutcomes(tally);
    if (!outcomes) {
      content.innerHTML = 'Too many dice combinations to calculate probabilities.';
      return;
    }

    // Calculate aggregate probabilities
    const pSuccess = outcomes.success_advantage + outcomes.success_threat + outcomes.success_clean;
    const pFailure = outcomes.failure_advantage + outcomes.failure_threat + outcomes.failure_clean;

    function pct(x) {
      return (x * 100).toFixed(1) + '%';
    }

    // Helper to get highlight style
    function getHighlightStyle(isHighlighted) {
      return isHighlighted
        ? 'background-color: rgba(255, 255, 0, 0.5); color: black; font-weight: bold;'
        : '';
    }

    // Determine highlights based on last roll outcome
    const highlightSuccessAdvantage =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Success' &&
      lastRollOutcome.modifiers.includes('Advantage');
    const highlightSuccessThreat =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Success' &&
      lastRollOutcome.modifiers.includes('Threat');
    const highlightSuccessClean =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Success' &&
      lastRollOutcome.modifiers.length === 0;
    const highlightFailureAdvantage =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Failure' &&
      lastRollOutcome.modifiers.includes('Advantage');
    const highlightFailureThreat =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Failure' &&
      lastRollOutcome.modifiers.includes('Threat');
    const highlightFailureClean =
      lastRollOutcome &&
      lastRollOutcome.primary === 'Failure' &&
      lastRollOutcome.modifiers.length === 0;
    const highlightTriumph = lastRollOutcome && lastRollOutcome.specials.includes('Triumph');
    const highlightDespair = lastRollOutcome && lastRollOutcome.specials.includes('Despair');

    content.innerHTML = `
  <div class="prob-section">Roll Outcome</div>
  <div class="prob-row"><span>Success:</span><span style="color:#0f0;">${pct(pSuccess)}</span></div>
  <div class="prob-row"><span>Failure:</span><span style="color:#f00;">${pct(pFailure)}</span></div>

  <div class="prob-section">Success Modifiers</div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightSuccessAdvantage
  )}"><span>+ Advantage:</span><span>${pct(outcomes.success_advantage)}</span></div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightSuccessThreat
  )}"><span>+ Threat:</span><span>${pct(outcomes.success_threat)}</span></div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightSuccessClean
  )}"><span>Clean:</span><span>${pct(outcomes.success_clean)}</span></div>

  <div class="prob-section">Failure Modifiers</div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightFailureAdvantage
  )}"><span>+ Advantage:</span><span>${pct(outcomes.failure_advantage)}</span></div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightFailureThreat
  )}"><span>+ Threat:</span><span>${pct(outcomes.failure_threat)}</span></div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightFailureClean
  )}"><span>Clean:</span><span>${pct(outcomes.failure_clean)}</span></div>

  <div class="prob-section">Special</div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightTriumph
  )}"><span>Triumph:</span><span style="color:#ff0;">${pct(outcomes.triumph)}</span></div>
  <div class="prob-row" style="${getHighlightStyle(
    highlightDespair
  )}"><span>Despair:</span><span style="color:#f0f;">${pct(outcomes.despair)}</span></div>
`;
  }

  console.log('🚀 Dice Roller Discord Webhook Logger (Canvas Mode) is running');
  observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         Block Gambling Sites
// @namespace    http://tampermonkey.net/
// @version      2025.09.28
// @description  Prevent access to known gambling websites
// @author       sevenv1
// @license      MIT
// @match        *://*.rainbet.com/*
// @match        *://*.rainbet.us/*
// @match        *://*.stake.com/*
// @match        *://*.stake.us/*
// @match        *://*.betonline.ag/*
// @match        *://*.bet9ja.com/*
// @match        *://*.bet365.com/*
// @match        *://*.caesars.com/*
// @match        *://*.draftkings.com/*
// @match        *://*.fanduel.com/*
// @match        *://*.fanatics.com/*
// @match        *://*.betfair.com/*
// @match        *://*.888casino.com/*
// @match        *://*.pokerstars.com/*
// @match        *://*.luckywins.com/*
// @match        *://*.playoro.com/*
// @match        *://*.puntit.com/*
// @match        *://*.lukki.com/*
// @match        *://*.hollywoodbets.net/*
// @match        *://*.chumbacasino.com/*
// @match        *://*.betway.co.za/*
// @match        *://*.betano.com/*
// @match        *://*.caliente.mx/*
// @match        *://*.gamdom.com/*
// @match        *://*.1win-official.com/*
// @match        *://*.1win.com/*
// @icon         https://raw.githubusercontent.com/sevenv1/Anti-Gamble/refs/heads/main/icon.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550937/Block%20Gambling%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/550937/Block%20Gambling%20Sites.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const messages = [
    "Stop gambling, your future self will thank you.",
    "Every dollar saved brings you closer to freedom.",
    "The house always wins. Don’t play their game.",
    "You’re worth more than a slot machine’s spin.",
    "Money lost here is time you’ll never get back.",
    "Invest in yourself, not in false odds.",
    "Gambling drains dreams, protect yours.",
    "You’re not missing out. You’re breaking free.",
    "Keep control of your future, not the casino.",
    "Small wins don’t erase big losses.",
    "People who win big, are down big.",
    "Just because you can win a million dollars doesn't ever mean you will.",
    "Your time and money are more valuable than any jackpot.",
    "True wealth comes from within, not from a machine.",
    "Every bet is a step away from your goals.",
    "Choose growth over gambling.",
    "Your potential is limitless, don’t limit it with bets.",
    "Happiness isn't found in winnings, but in well-being.",
    "Invest in experiences, not in odds.",
    "You deserve a future free from the chains of gambling."
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  const blockHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Blocked</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600&display=swap" rel="stylesheet">
        <style>
          html,body {
            height:100%;
            margin:0;
            font-family:'Unbounded', system-ui, -apple-system, Segoe UI, Roboto, Arial;
            overflow:hidden;
            background:#0f1117;
            color:#eaeaea;
            letter-spacing:0.5px;
          }
          .wrap {
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
          }
          .card {
            background:#1a1d27;
            border-radius:20px;
            padding:60px 40px;
            text-align:center;
            box-shadow:0 16px 40px rgba(0,0,0,0.7);
            max-width:500px;
            width:100%;
          }
          .emoji {
            font-size:42px;
            margin-bottom:16px;
          }
          h1 {
            font-size:28px;
            font-weight:600;
            margin-bottom:16px;
          }
          p {
            font-size:16px;
            margin:0 0 18px;
            color:#cfcfcf;
          }
          small {
            display:block;
            margin-bottom:30px;
            color:#888;
          }
          button {
            font-family:'Unbounded', system-ui, -apple-system, Segoe UI, Roboto, Arial;
            padding:14px 28px;
            border:none;
            border-radius:10px;
            font-size:16px;
            font-weight:600;
            background:#22c55e;
            color:white;
            cursor:pointer;
            box-shadow:0 4px 12px rgba(34,197,94,0.55);
            transition:transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          button:hover {
            background:#16a34a;
            transform:scale(1.08);
            box-shadow:0 5px 14px rgba(34,197,94,0.65);
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="emoji">❌</div>
            <h1>Site Blocked</h1>
            <p>You can’t access this page.</p>
            <small>${message}</small>
            <button onclick="
              if (document.referrer && !document.referrer.includes('rainbet.com')) {
                window.location.href = document.referrer;
              } else {
                window.location.href = 'https://google.com';
              }
            ">Leave</button>
          </div>
        </div>
      </body>
    </html>
  `;

  document.open();
  document.write(blockHtml);
  document.close();
})();
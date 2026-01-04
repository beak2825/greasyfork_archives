// ==UserScript==
// @name         Duolingo JWT Token
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Get your jwt_token!
// @author       star-pro
// @match        https://www.duolingo.com/*
// @icon         https://github.com/pillowslua/crackduo/blob/main/hacklingo.png?raw=true
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560886/Duolingo%20JWT%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/560886/Duolingo%20JWT%20Token.meta.js
// ==/UserScript==

//use this script to get jwt_token
//free bots : https://discord.gg/aEjDs4Zd

(function() {
    'use strict';

    // css
    GM_addStyle(`
      #jwtToolBox {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #1cb0f6;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 15px;
        border-radius: 12px;
        z-index: 99999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      }
      #jwtToolBox button {
        background: #fff;
        color: #1cb0f6;
        border: none;
        padding: 6px 10px;
        margin-top: 8px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }
      #jwtToolBox button:hover {
        background: #f0f0f0;
      }
      #jwtTokenDisplay {
        margin-top: 10px;
        word-break: break-all;
        max-width: 250px;
        background: rgba(255,255,255,0.15);
        padding: 6px;
        border-radius: 6px;
      }
    `);

    // create box /ui
    const box = document.createElement("div");
    box.id = "jwtToolBox";
    box.innerHTML = `
      <div><b>🔑 Duolingo JWT Tool</b></div>
      <button id="getTokenBtn">Get jwt_token</button>
      <div id="jwtTokenDisplay">[JTW tokens]</div>
    `;
    document.body.appendChild(box);

    // credit : hoangtienghi_ discord
    function getJwtToken() {
        let match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
        if (match) {
            return match[2];
        }
        return null;
    }

    // event
    document.getElementById("getTokenBtn").addEventListener("click", () => {
        let token = getJwtToken();
        let display = document.getElementById("jwtTokenDisplay");
        if (token) {
            display.textContent = token;
        } else {
            display.textContent = "❌ Không tìm thấy jwt_token!";
        }
    });
})();

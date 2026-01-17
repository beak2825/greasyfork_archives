// ==UserScript==
// @name         Neopets: Training Schools Missing Fortune Cookie Warning
// @version      1.0
// @namespace    https://github.com/NicoSlothEmoji
// @author       NicoSlothEmoji
// @description  Shows warning if you are missing a training fortune cookie and provides search link to your SDB and the NC Mall.
// @match        *://www.neopets.com/island/training.phtml*
// @match        *://www.neopets.com/pirates/academy.phtml*
// @match        *://www.neopets.com/island/fight_training.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562853/Neopets%3A%20Training%20Schools%20Missing%20Fortune%20Cookie%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/562853/Neopets%3A%20Training%20Schools%20Missing%20Fortune%20Cookie%20Warning.meta.js
// ==/UserScript==

GM_addStyle (`
    #fortune-cookie-warning {
        width: 98%;
        text-align: center;
        font-size: 24px;
        background-color: #ffbcbc;
        border: 5px solid black;
        margin-bottom: 35px;
    }
    #fortune-cookie-warning h1 {
        color: #ff0000;
        font-size: 42px;
    }
`);

var header = document.querySelector("#content > table > tbody > tr > td.content > p:nth-child(5) > b");
var fortune = document.querySelector('#fc-bd-remaining');

if (!fortune) {
    header.innerHTML += `
      <div id="fortune-cookie-warning">
        <h1>MISSING FORTUNE COOKIE</h1>
        <p>
          <a href="https://www.neopets.com/safetydeposit.phtml?obj_name=Fortune+Cookie&category=0" target="_blank">Safety Deposit Box</a> | 
          <a href="https://ncmall.neopets.com/mall/search.phtml?type=search&text=training+fortune+cookie&page=1&limit=24" target="_blank">NC Mall</a>
        </p>
      </div>
    `;
}
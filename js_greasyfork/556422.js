// ==UserScript==
// @name         Faction Money
// @namespace    ljovcheg.stuff
// @version      1.0.4
// @description  View you faction balance
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      mit
// @match        https://www.torn.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/556422/Faction%20Money.user.js
// @updateURL https://update.greasyfork.org/scripts/556422/Faction%20Money.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const apiCacheKey = 'ljovcheg_factionmoney_apiKey';

    let apiKey = GM_getValue(apiCacheKey, '');
    let content = '...';


    const observer = new MutationObserver(mutations => {
        detectMobileToolTip();
        detectDesktop();

        document.querySelectorAll('.name___ChDL3').forEach(el => {
            el.style.width = '49px';
        });

    });
    function detectDesktop() {
        let el = document.querySelector('.points___UO9AU');
        if (!el) return;
        if (document.querySelector('#vaultDivDesktop')) return;

        const first = el.firstElementChild;

        const div = document.createElement("p");
        div.id = "vaultDivDesktop";
        div.className = "point-block___rQyUK";
        div.innerHTML = `<span class="name___ChDL3">Faction: </span><span class="value___mHNGb vaultDivMobile factionMoney">${content}</span>`
        div.addEventListener("click", apiPopUp);
        first.appendChild(div);

        setText();

    }
    function detectMobileToolTip() {

        const el = document.querySelector('[role="tooltip"][class*="tooltip"][class*="tooltipCustomClass"]');
        if (!el) return;

        const first = el.firstElementChild;
        if (first.innerText.indexOf('You have $') === -1) return;

        if (el.querySelector('#vaultDivMobile')) return;

        const div = document.createElement("div");
        div.id = "vaultDivMobile";
        div.className = "vaultDivMobile";
        div.innerHTML = `Faction: <span class="factionMoney">${content}</span>`;

        div.addEventListener("click", apiPopUp);

        el.appendChild(div);

        setText();
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    async function GM_fetch() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/v2/user/money?key=${apiKey}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function (response) {
                    try {
                        if (!response || !response.responseText) {
                            return reject(new Error("Empty response"));
                        }
                        const json = JSON.parse(response.responseText);
                        resolve(json);

                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                },
            });
        });
    }




    function apiPopUp() {
        let w = prompt("Faction Money Script apikey", apiKey);
        if (w || w === "" && w !== null) {
            //save key
            GM_setValue(apiCacheKey, w);
            apiKey = w;
            setText();
        }
    }


    async function setText() {
        let isMoney = false;
        let isError = false;
        if (!apiKey) {
            content = 'set API key';
            isError = true;
        } else {
            const tornData = await GM_fetch();

            if (tornData.error) {
                console.log(tornData.error);
                content = tornData.error.error;
                isError = true;
            } else if (!tornData.money) {
                content = "Somethign is wrong";
            } else {
                let money = tornData.money.faction.money
                if (money > 0) isMoney = true;
                content = `$${Number(money).toLocaleString()}`;

                setTimeout(setText, 60000);
            }
        }


        document.querySelectorAll('.factionMoney').forEach(el => {
            el.classList.remove('money-positive___dMv7U');
            el.classList.remove('t-red')


            el.textContent = content;



            if (isMoney) el.classList.add('money-positive___dMv7U');
            if (isError) el.classList.add('t-red');

        });
    }
})();
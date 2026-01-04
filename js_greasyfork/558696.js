// ==UserScript==
// @name         Torn Wars Revive Request Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Branded Torn Wars revive request button
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558696/Torn%20Wars%20Revive%20Request%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558696/Torn%20Wars%20Revive%20Request%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_VERSION = "1.2";

    const handleButtonClick = () => {
        let apiKey = GM_getValue("torn_api_key", null);
        let savedPrice = GM_getValue("revive_price", null);

        if (!apiKey) {
            apiKey = prompt("Please enter your Torn PUBLIC API key:");
            if (!apiKey) {
                alert("No API key set. Cannot send revive request.");
                return;
            }
            GM_setValue("torn_api_key", apiKey);
        }
        showPriceModal(apiKey, savedPrice);
    };

    const createHeaderBtn = (id) => {
        const hBtn = document.createElement('button');
        hBtn.textContent = "TW Revive ⚡";
        hBtn.id = id;
        hBtn.style.cssText = `
            margin-right: 10px;
            margin-top: 2px;
            padding: 0 10px;
            height: 24px;
            font-size: 11px;
            font-weight: 600;
            color: #fff;
            background-color: #3498db;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            line-height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            float: right;
            flex-shrink: 0;
            white-space: nowrap;
            min-width: max-content;
        `;
        hBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleButtonClick();
        });
        return hBtn;
    };

    const sidebarBtn = document.createElement('button');
    sidebarBtn.textContent = "TW Revive ⚡";
    sidebarBtn.id = 'tw-revive-btn';
    sidebarBtn.style.cssText = "width:100%; margin-top:5px; padding:8px 0; font-size:12px; font-weight:600; color:#fff; background-color:#3498db; border:none; border-radius:4px; cursor:pointer; font-family:Arial, sans-serif; flex-shrink: 0;";
    sidebarBtn.addEventListener('click', handleButtonClick);

    const injectButtons = () => {
        const outerWrap = document.querySelector('div[class^="account-links-wrap"]');
        if (outerWrap && !document.getElementById('tw-revive-btn')) {
            outerWrap.style.display = "flex";
            outerWrap.style.flexDirection = "column";
            outerWrap.appendChild(sidebarBtn);
        }

        const reviveLink = document.querySelector('.revive-availability-btn');
        if (reviveLink && !document.getElementById('tw-hospital-btn')) {
            const hBtn = createHeaderBtn('tw-hospital-btn');
            reviveLink.insertAdjacentElement('afterend', hBtn);
        }

        const warfareLink = document.querySelector('.view-wars');
        if (warfareLink && !document.getElementById('tw-faction-btn')) {
            const fBtn = createHeaderBtn('tw-faction-btn');
            warfareLink.insertAdjacentElement('afterend', fBtn);
        }
    };

    setInterval(injectButtons, 1000);

    function showPriceModal(apiKey, savedPrice) {
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:100000;";
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#fff; padding:20px; border-radius:8px; width:300px; color:#333; font-family:Arial;";

        modal.innerHTML = `
            <label style="display:block; margin-bottom:6px; font-weight:600;">Payment Type:</label>
            <select id="tw-type-select" style="width:100%; margin-bottom:12px;"><option value="Cash">Cash</option><option value="Xanax">Xanax</option></select>
            <label style="display:block; margin-bottom:6px; font-weight:600;">Revive Price:</label>
            <select id="tw-price-select" style="width:100%; margin-bottom:12px;"></select>
            <label style="display:block; margin-bottom:6px; font-weight:600;">Required Revive Skill:</label>
            <select id="tw-skill-select" style="width:100%; margin-bottom:12px;"><option>At least 25%</option><option>At least 50%</option><option>At least 75%</option><option>Full (100%)</option></select>
            <label style="display:flex; align-items:center; margin-bottom:12px;"><input type="checkbox" id="tw-save-price" style="margin-right:6px;"> Save this price</label>
            <div style="text-align:center;"><button id="tw-send" style="padding:6px 12px; background:#3498db; color:#fff; border:none; border-radius:4px; cursor:pointer;">Send</button> <button id="tw-close" style="padding:6px 12px; background:#aaa; color:#fff; border:none; border-radius:4px; cursor:pointer;">Cancel</button></div>
        `;

        document.body.appendChild(overlay);
        overlay.appendChild(modal);

        const typeS = modal.querySelector('#tw-type-select');
        const priceS = modal.querySelector('#tw-price-select');
        const update = () => {
            const opts = typeS.value === "Cash" ? ["1m", "2m", "5m"] : ["1 Xanax", "2 Xanax", "5 Xanax"];
            priceS.innerHTML = opts.map(o => `<option value="${o}">${o}</option>`).join('');
            if (savedPrice) priceS.value = savedPrice;
        };
        typeS.onchange = update;
        update();

        modal.querySelector('#tw-send').onclick = () => {
            const data = { type: typeS.value, price: priceS.value, skill: modal.querySelector('#tw-skill-select').value };
            if (modal.querySelector('#tw-save-price').checked) GM_setValue("revive_price", data.price);
            sendToController(data, apiKey);
            document.body.removeChild(overlay);
        };
        modal.querySelector('#tw-close').onclick = () => document.body.removeChild(overlay);
    }

    function sendToController(data, apiKey) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://tornwars.com/api/dashboard/revive/script",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ apiKey, ...data, scriptVersion: SCRIPT_VERSION }),
            onload: (res) => console.log("Sent:", res)
        });
    }
})();
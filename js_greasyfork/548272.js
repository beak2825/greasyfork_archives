// ==UserScript==
// @name         Torn - Vault Buttons (Combined Script)
// @namespace    http://www.tornradio.com/
// @version      0.1
// @description  Add buttons to set money withdraw/deposit inputs to a target amount. Adds buttons for quick withdrawal and deposit to the vault.
// @author       tornradio [2851045], Titanic_, zstorm
// @match        https://www.torn.com/properties.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548272/Torn%20-%20Vault%20Buttons%20%28Combined%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548272/Torn%20-%20Vault%20Buttons%20%28Combined%20Script%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function tornradio() {
        const area = document.querySelector("div.vault-wrap.container-ask");
        const leftInput = document.querySelector("form.vault-cont.left input.input-money");
        const rightInput = document.querySelector("form.vault-cont.right input.input-money");

        const vaultBalance = parseInt(leftInput.getAttribute("data-money"));
        const walletBalance = parseInt(rightInput.getAttribute("data-money"));

        console.log("Found vault input elements.");

        const fillInputs = (walletBalance, target) => {
            if (walletBalance > target) {
                leftInput.value = "";
                leftInput.dispatchEvent(new Event("input", { bubbles: true }));
                rightInput.value = (walletBalance - target).toString();
                rightInput.dispatchEvent(new Event("input", { bubbles: true }));
            } else if (walletBalance < target) {
                leftInput.value = (target - walletBalance).toString();
                leftInput.dispatchEvent(new Event("input", { bubbles: true }));
                rightInput.value = "";
                rightInput.dispatchEvent(new Event("input", { bubbles: true }));
            }
        };

        const pground = document.createElement("div");
        pground.style.cssText = 'background: #333333';

        const text = document.createElement("div");
        text.innerHTML = "Target wallet value:&nbsp;&nbsp;&nbsp;&nbsp;";
        text.className = "m-top10 bold tornradio";
        text.style.background = '#333333';
        area.parentElement.insertBefore(text, area);
        const zeroBtn = document.createElement("button");
        zeroBtn.innerText = "0";
        zeroBtn.className = "torn-btn tornradio";
        zeroBtn.onclick = () => {
            fillInputs(walletBalance, 0);
        };
        pground.appendChild(zeroBtn);

        const fiftyKBtn = document.createElement("button");
        fiftyKBtn.innerText = "50k";
        fiftyKBtn.className = "torn-btn tornradio";
        fiftyKBtn.onclick = () => {
            fillInputs(walletBalance, 50000);
        };
        pground.appendChild(fiftyKBtn);

        const twoHunKBtn = document.createElement("button");
        twoHunKBtn.innerText = "200k";
        twoHunKBtn.className = "torn-btn tornradio";
        twoHunKBtn.onclick = () => {
            fillInputs(walletBalance, 200000);
        };
        pground.appendChild(twoHunKBtn);

        const oneMBtn = document.createElement("button");
        oneMBtn.innerText = "1M";
        oneMBtn.className = "torn-btn tornradio";
        oneMBtn.onclick = () => {
            fillInputs(walletBalance, 1000000);
        };
        pground.appendChild(oneMBtn);

        const twoMBtn = document.createElement("button");
        twoMBtn.innerText = "2M";
        twoMBtn.className = "torn-btn tornradio";
        twoMBtn.onclick = () => {
            fillInputs(walletBalance, 2000000);
        };
        pground.appendChild(twoMBtn);

        const fiveMBtn = document.createElement("button");
        fiveMBtn.innerText = "5M";
        fiveMBtn.className = "torn-btn tornradio";
        fiveMBtn.onclick = () => {
            fillInputs(walletBalance, 5000000);
        };
        pground.appendChild(fiveMBtn);

        area.parentElement.insertBefore(pground, area);
    }

    function addElements() {
        // Check if the buttons are already added
        if (document.getElementById("custom-buttons-container")) {
            return; // Exit the function if buttons already exist
        }

        let parent = document.createElement("div");
        parent.style.cssText = 'justify-content: center; align-items: center; text-align: center;';
        let leftContainer = document.createElement("div");
        let rightContainer = document.createElement("div");

        parent.id = "custom-buttons-container";
        leftContainer.id = "custom-buttons";
        rightContainer.id = "custom-buttonsright";

        // Add buttons to their respective containers
        addButton(leftContainer, "352k", 352500);
        addButton(leftContainer, "100k", 100000);
        addButton(leftContainer, "500k", 500000);
        addButton(leftContainer, "1m", 1000000);
        addButton(leftContainer, "5m", 5000000);
        addButton(leftContainer, "10m", 10000000);
        addPasteButton(leftContainer);

        // Append the containers to the parent
        parent.appendChild(leftContainer);
        parent.appendChild(rightContainer);

        const div = document.querySelector('.vault-access-wrap.p10');
        if (div) div.parentElement.insertBefore(parent, div);
    }

    function addButton(parent, label, amount) {
        let btn = document.createElement("input");
        btn.value = label;
        btn.type = "button";
        btn.className = "torn-btn zstorm";

        btn.addEventListener("click", () => {
            let $inputVisible = document.querySelector("form.left > div.torn-divider > div.input-money-group > input.input-money");
            let $inputHidden = document.querySelectorAll("form.left > div.torn-divider > div.input-money-group > input.input-money")[1];
            let value = parseInt($inputHidden.value);

            if(isNaN(value)) { value = 0 }
            $inputVisible.value = amount + value;
            $inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
        });

        parent.appendChild(btn);
    }

    function addPasteButton(parent) {
        let btn = document.createElement("input");
        btn.value = "Clear";
        btn.type = "button";
        btn.classList.add("torn-btn");

        btn.addEventListener("click", () => {
            let $inputVisible = document.querySelector("form.left > div.torn-divider > div.input-money-group > input.input-money");
            let $inputHidden = document.querySelectorAll("form.left > div.torn-divider > div.input-money-group > input.input-money")[1];
            $inputVisible.value = 0;
            $inputVisible.dispatchEvent(new Event("input", { bubbles: true }));

        });

        parent.appendChild(btn);
    }


    function inputCheck() {
        if (document.querySelector('.input-money-group > .input-money')) {
            if (!document.querySelector('.zstorm')) addElements();
            if (!document.querySelector('.tornradio')) tornradio();
        }
    }

    const observer = new MutationObserver(() => {
        if (window.location.href.includes("tab=vault")) {
            inputCheck();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.href.includes("tab=vault")) {
        inputCheck();
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Add CSS to position the QDeposit button directly over the Deposit button
    addGlobalStyle(`
    #qdeposit-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(106, 13, 173, 0.8); /* Slightly transparent background */
        color: #ffffff;
        border-radius: 5px;
        z-index: 1000;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        font-size: 16px;

    }
`);




})();

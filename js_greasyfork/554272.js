// ==UserScript==
// @name         Neopets: Another Bank Improvement Script
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  The others didn't do exactly what I wanted. Deposit All, Deposit Round, Withdraw All/15k/50k/100/600k/1m, saved PIN, interest protection, bye bye upgrade area, k to 000 and m to 000000, visual commas
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/bank.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/554272/Neopets%3A%20Another%20Bank%20Improvement%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/554272/Neopets%3A%20Another%20Bank%20Improvement%20Script.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Adds a "Deposit All" button that deposits every neopoint in your hand
    - Adds a "Deposit Round" button that deposits the biggest possible multiple of 10,000 neopoints. If you have 123,456
      neopoints, clicking it deposits 120,000 neopoints and leaves you with 3,456 neopoints on hand.
    - Removes the "Don't withdraw too many times" and "No daily limit on deposits" texts.
    - Adds withdrawal options: "All", 15k, 50k, 100k, 600k, and 1kk.
    - Remembers your PIN.
    - Disables the Deposit and Withdraw buttons if you haven't collected interest today. Re-enables them once you do.
    - Moves the interest area lower than deposit and withdraw after you collect interest
    - Turns the account upgrade area into an accordion if you don't have enough neopoints to upgrade.
    - Adds the amount of neopoints you lack to upgrade (given your neopoints on hand and in the bank, but not the till)
      to the title of the account upgrade area.
    - Moves the account upgrade area to the top if you have enough neopoints to upgrade. There's never any reason not to.
    - Removes the account upgrade area if you're fully upgraded.
    - Converts typed "k" into 000, and "m" into 000000

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const getNeopointsOnHand = () => parseInt(document.getElementById("npanchor").textContent.replaceAll(/\.|,/g, ''));

const getRoundNeopointsOnHand = () => Math.floor(getNeopointsOnHand() / 10000) * 10000;

const getBalance = () => parseInt(document.getElementById("txtCurrentBalance").textContent.replaceAll(/\D/g, ''));

const hasInterest = () => document.getElementsByClassName("bank-interest-btn").length > 0;

const getNextAccountRequirement = () => {
    const options = [...document.getElementById("account_type").options];
    const next = options.findIndex(option => option.textContent.startsWith(document.getElementById("txtAccountType").textContent)) + 1;
    if(options[next]) return parseInt(options[next].textContent.replaceAll(/\D/g, ''));
}

const setPinPersistence = () => document.getElementById("pin_field").addEventListener("change", e => GM.setValue("pin", e.target.value));

const getPersistedPin = async () => {
    const pinField = document.getElementById("pin_field");
    if(!pinField) throw new Error("No pin!");
    pinField.value = await GM.getValue("pin", '');
}

const depositAll = () => document.querySelector("#frmDeposit input[name='amount']").value = getNeopointsOnHand();

const depositRound = () => document.querySelector("#frmDeposit input[name='amount']").value = getRoundNeopointsOnHand();

const withdrawAll = () => document.querySelector("#frmWithdraw input[name='amount']").value = getBalance();

const withdrawAmount = (e) => document.querySelector("#frmWithdraw input[name='amount']").value = e.target.value.replaceAll("k", "000");

const addButton = (title, parent, cb) => {
    const button = document.createElement("input");
    button.type = "submit";
    button.classList.add("button-default__2020", "button-yellow__2020", "bank-btn", "saah-button");
    button.value = title;
    button.addEventListener("click", cb);
    parent.appendChild(button);
}

const addDepositButtons = () => {
    addButton('Deposit All', document.getElementById("frmDeposit"), depositAll);
    addButton('Deposit Round', document.getElementById("frmDeposit"), depositRound)
}

const addWithdrawalButtons = () => {
    const values = ['15k', '50k', '100k', '600k', '1kk'];
    const parent = document.getElementById("frmWithdraw");
    values.forEach(value => addButton(value, parent, withdrawAmount));
    addButton("All", parent, withdrawAll);
}

const moveInterest = () => {
    if(hasInterest()) return;
    document.getElementsByClassName("bank-body-container")[0].appendChild(document.getElementsByClassName("bank-interest")[0]);
}

const disableOperationsForInterest = () => {
    if(!hasInterest()) return;
    const buttons = document.querySelectorAll(":is(#frmDeposit, #frmWithdraw) input[type='submit']");
    document.getElementsByClassName("bank-interest-btn")[0].addEventListener("click", () => {
        buttons.forEach(btn => btn.disabled = false);
        moveInterest();
    });
    buttons.forEach(btn => btn.disabled = true);
}

const handleAccountUpgrade = () => {
    const requirements = getNextAccountRequirement();
    const neededNeopoints = (requirements ?? 0) - getNeopointsOnHand() - getBalance();
    const area = document.getElementsByClassName("bank-upgrade")[0];
    if (requirements && neededNeopoints > 0) {
        area.classList.add("saah-accordion");
        area.getElementsByTagName("h2")[0].textContent = `Upgrade Your Account (${Math.max(0, neededNeopoints).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} NP left)`;
    }
    else if(!requirements) {
        area.remove();
    }
    else {
        area.classList.remove("saah-accordion");
        area.getElementsByTagName("h2").textContent = `Upgrade Your Account`;
        document.getElementsByClassName("bank-body-container")[0].prepend(area);
    }
}

const prepareForAccountUpgradeChanges = () => {
    const area = document.getElementsByClassName("bank-upgrade")[0];
    area.getElementsByClassName("bank-upgrade-header")[0].addEventListener("click", () => area.classList.toggle("saah-accordion"));
}

const onMoneyChange = () => {
    getPersistedPin();
    handleAccountUpgrade();
}

const watchChanges = () => {
    const observer = new MutationObserver(onMoneyChange);
    observer.observe(document.getElementById("npanchor"), {childList: true});
}

const typingConversion = () => {
    document.querySelectorAll("input[name='amount']").forEach(input => {
        input.addEventListener("keyup", (e) => {
            console.log(e.target.value);
            e.target.value = e.target.value.replaceAll(/k/g, '000').replaceAll(/m/g, '000000');
        });
    });
}

const addCss = () => document.head.insertAdjacentHTML('beforeEnd', `<style>${css}</style>`);

const initializeScript = () => {
    addDepositButtons();
    addWithdrawalButtons();
    document.querySelectorAll(".bank-action-container p").forEach(p => p.remove());
    getPersistedPin().then(() => setPinPersistence()).catch(e => {
        if(e.message === "No pin!") return;
        throw e;
    });
    disableOperationsForInterest();
    moveInterest();
    prepareForAccountUpgradeChanges();
    watchChanges();
    typingConversion();
    handleAccountUpgrade();
    addCss();
}

const css = `
.saah-button {
  width: auto;
  padding: 2px 1em 7px 1em;
  display: inline-block;
  margin: 0.25em 0.15em;
}

.bank-upgrade-body {
/* firefox allow interpolate-size please bestie */
  max-height: 500px;
  transition: max-height 500ms ease-in-out;
}

.saah-accordion .bank-upgrade-body {
  max-height: 0;
  transition: max-height 500ms ease-in-out;
}
`;

(function() {
    'use strict';
    initializeScript();
})();

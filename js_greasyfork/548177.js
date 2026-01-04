// ==UserScript==
// @name         Neopets: Codestone Tracker
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      2.0.3
// @description  Tracks your codestones, removes them with a click on the training page, adds a link to SW for the ones you don't have yet
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/island/training.phtml?type=status
// @match        *://*.neopets.com/island/fight_training.phtml?type=status
// @match        *://*.neopets.com/safetydeposit.phtml?*category=2&*
// @match        *://*.neopets.com/safetydeposit.phtml?*category=2
// @match        *://*.neopets.com/quickstock.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/548177/Neopets%3A%20Codestone%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/548177/Neopets%3A%20Codestone%20Tracker.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    0. Every feature SHOULD work for both the Training School and the Ninja Training School, but I can't test
       the Ninja Training School so I'm doing it blindly.
    1. Remembers which codestones you have in your SDB
       - To do that, you must go to your SDB's Codestones page:
         https://www.neopets.com/island/training.phtml?type=status
       - If the script gets out of sync, go back to the Codestones page to update it.
    2. Adds a link to your SDB's Codestones page to the top links (Courses, Status, etc)
    3. Highlights any pet waiting for their course to be paid if you don't own all needed codestones
    4. Adds a link to the Shop Wizard search page to each codestone you don't own
    5. Adds a link to remove one codestone from your Safety Deposit Box if you own it
       - To do this, you'll either have to add your PIN to the pin const, fill your PIN in the PIN box at the top
         of the page, or not have a pin at all. I couldn't get PIN autofillers to work with this script, sorry.
    6. Remembers whenever you add codestones to your SDB by using the quick stock page
       - I didn't do the same with the inventory page because I don't know if anyone uses it
    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            Configuration
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Whether codestones on your SDB should have a link to retrieve it with a click (if true) or to your SDB's search function (if false)
* @constant {boolean}
* @default
*/
const iWantToRemoveCodestonesFromMySDBWithAClick = true;

/**
* Your PIN, or, if you don't have a PIN set on your SDB, an empty string ''
* @constant {string}
*/
const pin = '0000';

/**
* Turns debug mode on or off. In debug mode, your codestone storage will be printed on the console on every page refresh.
* @constant {boolean}
* @default
*/
const isDebug = false;

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
             Migration
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Migrates your storage from version 1.x to version 2.x. You can delete this (and its call) after visiting your SDB, quick stock, or either schoopl once.
*/
const migrateToV2 = async () => {
    const oldStorage = await GM.getValue("saahphire-codestone-tracker");
    if(!oldStorage) return;
    const newStorage = Object.values(JSON.parse(oldStorage)).map(entry => {
        const id = parseInt(entry.id);
        return (id < 22208) ? [id - 7457, parseInt(entry.qty)] : [id - 22197, parseInt(entry.qty)];
    }).reduce((agg, [id, qty]) => {agg[id] = qty;return agg;}, new Array(17));
    await GM.setValue("codestones", newStorage);
    GM.setValue("saahphire-codestone-tracker", null);
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
                 PIN
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Tries to retrieve your PIN from either the input field or your pin const
* @returns {string|undefined}
*/
const getPin = () => {
    const pinField = document.getElementById("pin_field")?.value;
    if(pinField && pinField !== '') return pinField;
    if(pin === '' || pin.match(/^\d{4}$/)) return pin;
}

/**
* Adds an input field for your PIN in the Training School's page
*/
const addPinField = () => {
    const div = document.createElement("div");
    div.classList.add("saahphire-pin");
    div.style = "display: flex;place-content:center;place-items:center;gap:0.5em;";
    div.innerHTML = `<p>Enter your <a href="/pin_prefs.phtml">PIN</a>:</p>
    <input type="password" name="pin" id="pin_field" size="4" maxlength="4" style="width:10ex;height:15px;">
    <img src="https://images.neopets.com/pin/bank_pin_mgr_35.jpg" border="1" width="35" height="35" align="left">`;
    document.querySelector(".content > div:nth-child(2) center").insertAdjacentElement("afterEnd", div);
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
             Utility
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Takes an image's URL and retrieves the codestone's ID from within
* @returns {number}
*/
const getIndexFromImageUrl = (imageUrl) => parseInt(imageUrl.match(/codestone(\d+)/)[1]);

/**
* Takes a codestone's index (from 1 to 16) and returns its item id.
* @returns {number}
*/
const getIdFromIndex = (index) => index < 22208 ? index + 7457 : index + 22197;

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
               Storage
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Retrieves stored data about your codestones
* @returns {Array<number>}
*/
const getStoredCodestones = async () => {
    return await GM.getValue("codestones");
}

/**
* Saves data about your codestones
* @param codestones {Array<number>} The data to be saved
*/
const setStoredCodestones = (codestones) => {
    GM.setValue("codestones", codestones);
}

/**
* Adjusts the quantity of a given codestone in your saved data by reducing it by one
* @param imageUrl {string} The codestone's image URL
* @returns {number} The new quantity
*/
const removeOneFromStorage = async (imageUrl) => {
    const index = getIndexFromImageUrl(imageUrl);
    const storage = await getStoredCodestones();
    storage[index]--;
    setStoredCodestones(storage);
    return storage[index];
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
                Links
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Edits a given anchor to communicate a successful action
* @param anchor {Element} The anchor element that should be edited to reflect success
*/
const communicateSuccess = (anchor) => {
    anchor.textContent = anchor.textContent.replace("⌛", "✔️");
    anchor.style.textDecoration = "line-through";
    anchor.removeAttribute("href");
}

/**
* Edits a given anchor to communicate a failed action and logs its error in the console
* @param anchor {Element} The anchor element that should be edited to reflect failure
* @param error {string} The error that should be logged
*/
const communicateFailure = (anchor, error) => {
    console.error("Something went wrong! " + error);
    anchor.textContent = anchor.textContent.replace("⌛", "✖️");
}

/**
* Retrieves a given codestone from your SDB
* @param itemIndex {number} The codestone's index within image numbers and our storage
* @param itemName {string} The codestone's name
* @param pin {string} Your pin
* @param anchor {Element} The anchor element that should be edited to reflect the request's result
*/
const removeCodestone = async (itemIndex, pin, anchor) => {
    anchor.textContent = "⌛ " + anchor.textContent;
    const itemId = getIdFromIndex(itemIndex);
    const url = `https://www.neopets.com/process_safetydeposit.phtml?offset=0&remove_one_object=${itemId}&obj_name=&category=2&pin=${pin}`;
    try {
        await fetch(url);
        removeOneFromStorage(itemIndex);
        communicateSuccess(anchor);
    } catch (e) {
        communicateFailure(anchor, e)
    }
}

/**
* Adds a link to the appropriate place (or an event listener) to each codestone name
* @param codestoneElement {Element} The bold element containing the codestone's name
* @param isSDB {boolean} Whether this should link to an SDB action (on true) or the Shop Wizard (on false)
* @param itemIndex {number} The codestone's index within image numbers and our storage
*/
const makeLink = (codestoneElement, isSDB, itemIndex) => {
    const a = document.createElement("a");
    codestoneElement.insertAdjacentElement("beforeBegin", a);
    a.appendChild(codestoneElement);
    const foundPin = getPin();
    if(iWantToRemoveCodestonesFromMySDBWithAClick && isSDB && typeof foundPin === 'string') {
        a.onclick = (e) => {
            e.preventDefault();
            removeCodestone(itemIndex, foundPin, a)
        };
        a.href = "#";
    }
    else {
        a.href = `https://www.neopets.com/${isSDB ? 'safetydeposit.phtml?obj_name' : 'shops/wizard.phtml?string'}=${codestoneElement.textContent.replace(" ", "+")}`;
        a.target = "_blank";
    }
}

/**
* Adds a link to the Codestones page in the SDB to the top link list
*/
const addSDBLink = () => document.getElementsByTagName("center")[0].insertAdjacentHTML("beforeEnd", " | <a href='https://www.neopets.com/safetydeposit.phtml?obj_name=&category=2'>SDB</a>");

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            Page-Specific
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Adds links to each codestone shown in the Training School status page
*/
const onTrainingPage = async () => {
    const ownedCodestones = await getStoredCodestones();
    const codestones = document.querySelectorAll("table[width='500'] tr:nth-child(2n) td:last-child b + img");
    const usage = new Array(17);
    codestones.forEach(codestone => {
        const textElement = codestone.previousElementSibling;
        const itemIndex = getIndexFromImageUrl(codestone.src);
        const available = ownedCodestones[itemIndex] ?? 0;
        const used = usage[itemIndex] ?? 0;
        if (used < available) {
            usage[itemIndex] = used + 1;
            makeLink(textElement, true, itemIndex);
        }
        else {
            makeLink(textElement, false);
            textElement.style.color = "red";
            codestone.parentElement.parentElement.style.backgroundColor = "wheat";
        }
    });
}

/**
* Saves codestones to storage
*/
const onSDBPage = () => {
    const ownedCodestones = new Array(17);
    document.querySelectorAll("#boxform ~ tr:not(:last-child)").forEach(row => {
        const imageUrl = row.querySelector("img[height='80']").src;
        const quantity = row.querySelector('td[align="center"]:not(:first-child)').textContent;
        const index = getIndexFromImageUrl(imageUrl);
        ownedCodestones[index] = parseInt(quantity);
    });
    setStoredCodestones(ownedCodestones);
}

/**
* Adds an event listener so whenever you store codestones in the Quick Stock, their quantities get updated
*/
const onQuickStock = async () => {
    const storage = await getStoredCodestones();
    const codestoneNames = ["Mau", "Tai-Kai", "Lu", "Vo", "Eo", "Main", "Zei", "Orn", "Har", "Bri", "Mag", "Vux", "Cui", "Kew", "Sho", "Zed"];
    document.querySelector("input[type='submit']").addEventListener("click", () => {
        const names = [...document.querySelectorAll("input[name='buyitem'] ~ table tr:has(input[type='hidden'])")].slice(0, 70).querySelectorAll("tr:has(td:nth-of-type(3) input:checked) td:first-of-type");
        names.forEach(name => {
            const itemIndex = codestoneNames.findIndex(codestone => name.match(codestone + " Codestone"));
            if(itemIndex === -1) return;
            storage[itemIndex + 1]++;
        })
        setStoredCodestones(storage);
    });
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            URL Checkers
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

/**
* Checks whether the current page's url contains a string.
* @param query {string} The string to search for
* @returns {boolean} Whether the string is in the current page's url
*/
const isUrl = (query, parameters) => window.location.href.includes(query) && (!parameters || Object.entries(parameters).every(([name, data]) => isParam(name, data.value, data.nullIsTrue)));

/**
* Checks whether the current page's url contains a parameter and its value is the desired value.
* @param parameter {string} The parameter to check for
* @param value {string} The value the parameter should have
* @param nullIsTrue {boolean} Whether the ausence of the parameter should be counted as a positive or negative result
* @returns {boolean} Whether the parameter has the appropriate value
*/
const isParam = (parameter, value, nullIsTrue = true) => window.location.href.match(new RegExp(`${parameter}=${value}(&|$)`)) ?? (nullIsTrue && !window.location.href.match(parameter + '='));

(async function() {
    'use strict';
    await migrateToV2();
    if(isParam('type', 'status', false)) {
        addPinField();
        addSDBLink();
        onTrainingPage();
    }
    else if(isUrl('safetydeposit', {'obj_name': {value: ''}, category: {value: 2, nullIsTrue: false}})) onSDBPage();
    else if(isUrl('quickstock')) onQuickStock();
    if(isDebug) {
        console.info("Codestone Tracker storage:");
        console.info(await getStoredCodestones());
    }
})();

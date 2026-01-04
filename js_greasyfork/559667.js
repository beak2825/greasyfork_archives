// ==UserScript==
// @name         GC Stock Price Reminder
// @namespace    https://www.grundos.cafe/userlookup/?user=hazr
// @version      1.0
// @description  Displays the first 3 shop results in the Description field when the user looks up an item in their Shop Stock using the Shop Wizard.
// @author       hazr
// @license      MIT
// @match        https://www.grundos.cafe/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.setValue
// @grant        GM.addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/559667/GC%20Stock%20Price%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/559667/GC%20Stock%20Price%20Reminder.meta.js
// ==/UserScript==

class Item
{
    constructor(name, description)
    {
        this.name = name;
        this.description = description;
    }
}

function onStockPage()
{
    return !window.location.href.includes("wizard");
}

(async function () {
    'use strict';

    if (onStockPage())
    {
        let stockItemNameNodes = Array.from(document.querySelectorAll("div.data.flex-column.small-gap.break > strong"));
        var stockItemMap = new Map();
        stockItemNameNodes.forEach(node =>
            stockItemMap.set(node.innerText, node.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling));

        GM.setValue('shopWizardItem', null);
        console.log("Waiting for Shop Wizard info...")
        GM.addValueChangeListener('shopWizardItem', async (key, oldValue, newValue, remote) =>
        {
            if (remote && newValue)
            {
                console.log("A price for " + newValue.name + " was found!");
                stockItemMap.get(newValue.name).innerHTML = newValue.description;
            }
        });
    }
    else
    {
        let swItemName = document.querySelector('p.mt-1 > strong')?.innerHTML.substring(18, undefined).trim();
        if (swItemName)
        {
            let item = new Item(swItemName, await collectShopWizPrices());
            console.log("Updating '" + item.name + "' price: " + item.description + "");
            GM.setValue('shopWizardItem', item);
        }
    }

    async function collectShopWizPrices()
    {
        let swPrices = Array.from(document.querySelectorAll('.sw_results > div.data:not(.price_zero) > strong'))
            .slice(0,3).map((s) => parseInt(s.innerText.replace(',', '') + " NP"))

        return swPrices.length > 0 ? swPrices.join("<br />") : "None found :(";
    }
})();


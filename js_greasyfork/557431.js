// ==UserScript==
// @name         Neopets: Quest Improvements
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Adds an estimated value for the items requested of you in every quest. Also remembers and fills your Brain Tree answers.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/557431/Neopets%3A%20Quest%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/557431/Neopets%3A%20Quest%20Improvements.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Adds price estimates for every quest in the game, including faerie quests
    - Adds a link to the requested item to the Shop Wizard as soon as you get the request, no need to refresh
      - Does that even for faerie quests in case you have alt accounts you want to SW in.
    - Saves the Brain Tree's answers that you got from Esophagor and fills them automatically
    - Adds a link from the Brain Tree to the Esophagor and another from the Esophagor to the Brain Tree
    
    Price estimates are retrieved from itemDB. Please consider contributing by adding a simple userscript:
      https://itemdb.com.br/contribute

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const slugify = (name) => name.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

const quests = [
    {
        url: "halloween/esophagor.phtml",
        itemSelector: ".ingredient-grid p b",
        totalSelector: "h2 b"
    },
    {
        url: "halloween/witchtower.phtml",
        itemSelector: ".ingredient-grid p b",
        totalSelector: "h2 b"
    },
    {
        url: "winter/snowfaerie.phtml",
        itemSelector: ".ingredient-grid p b",
        totalSelector: "h2 b"
    },
    {
        url: "island/kitchen.phtml",
        itemSelector: ".ingredient-grid p b",
        totalSelector: "h2 b"
    },
    {
        url: "space/coincidence.phtml",
        itemSelector: "#questItems td",
        totalSelector: "#panelPopups + p"
    },
    {
        // TODO
        url: "medieval/earthfaerie.phtml",
        itemSelector: ".ingredient-grid p b",
        totalSelector: "h2 b"
    },
    {
        url: "faerieland/darkfaerie.phtml",
        itemSelector: "#dark-container p:first-of-type b",
        totalSelector: "#dark-container p:nth-child(5) b"
    },
    {
        url: "quests.phtml",
        itemSelector: ".item b",
        totalSelector: ".item b"
    }
];

const offsetHours = parseInt(new Intl.DateTimeFormat("en-UK", {timeStyle: "long", timeZone: "America/Los_Angeles"}).format(new Date()).slice(-1));

const setBrainTree = (value) => GM.setValue(`brainTree${isNaN(parseInt(value)) ? 'Location' : 'Year'}`, {date: new Date().getTime(), info: value ?? ""});

const getBrainTree = () => Promise.all(["Year", "Location"].map(async info => {
    const data = await GM.getValue(`brainTree${info}`, "");
    const midnight = new Date();
    midnight.setUTCHours(offsetHours);
    midnight.setUTCMinutes(0);
    midnight.setSeconds(0);
    if(!data || data.info === "" || data.date < midnight.getTime()) return;
    return data.info;
}));

const onBrainTree = async () => {
    if(!document.querySelector("div p b").textContent.startsWith("You've already")) document.querySelector('.container .button-default__2020.button-yellow__2020').insertAdjacentHTML("afterEnd", `<a class="button-default__2020 button-blue__2020 btn-single__2020" href="https://www.neopets.com/halloween/esophagor.phtml" target="_blank">To the Esophagor!</a>`);
    const inputs = document.getElementsByClassName("brain-input");
    if(inputs.length === 0) return;
    const [year, location] = await getBrainTree();
    if(year) document.getElementById("answer_1").value = year;
    if(location) document.getElementById("answer_2").value = location;
}

const addPricesToEsophagor = () => {
    if(document.querySelector(".quest_dialogue__2021 u")) setBrainTree(document.querySelector(".quest_dialogue__2021 u").textContent);
    if(!document.querySelector(".gotree")) document.querySelector('.container .button-default__2020.button-yellow__2020:not(.q-button__2020)')?.insertAdjacentHTML("afterEnd", `<a class="button-default__2020 button-blue__2020 btn-single__2020 gotree" href="https://www.neopets.com/halloween/braintree.phtml" target="_blank">To the Brain Tree!</a>`);
}

const onEsophagor = () => {
    addPricesToEsophagor();
    const observer = new MutationObserver(addPricesToEsophagor);
    observer.observe(document.getElementById("container__2020"), {childList: true, subtree: true});
}

const getItemValues = (items) => {
  return new Promise((total) =>
    Promise.all(
      items.map((item) => {
        const slug = slugify(item.name);
        return new Promise((price) =>
          fetch(`https://itemdb.com.br/api/v1/items/${slug}`).then((res) => {
            res.json().then((json) => price(json.price.value) * item.quantity).catch(() => total(-1));
          })
        );
      })
    ).then((prices) => total(prices.reduce((a, c) => a + c, 0).toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')))
  );
};

const gotValidItems = (items) => items && items.length > 0 && !items[0].dataset.questFoundItems;

const parseItem = (item, index, quantities) => {
    const name = item.textContent.trim().replace(/(.+)x\d$/, "$1");
    const a = document.createElement("a");
    a.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(name).replaceAll("%20", "+")}`;
    a.target = "_blank";
    item.insertAdjacentElement("afterEnd", a);
    a.appendChild(item);
    return {
        name: name,
        quantity: quantities[index] ?? 1
    };
}

const getItems = (query) => {
    const rawItems = document.querySelectorAll(query);
    if(!gotValidItems(rawItems)) return;
    rawItems[0].dataset.questFoundItems = "true";
    const quantities = [...document.querySelectorAll("#questItems td b")].map(b => parseInt(b.textContent.replace("x", "")));
    return [...rawItems].map((item, index) => parseItem(item, index, quantities));
}

const searchForItems = async (quest) => {
    const items = getItems(quest.itemSelector);
    if(!items) return false;
    document.querySelector(quest.totalSelector).textContent += ` (${await getItemValues(items)} NP)`;
    return true;
}

const getTotal = async (quest) => {
    if(!(await searchForItems(quest))) {
        const container = document.getElementById("container__2020");
        const observer = new MutationObserver(() => searchForItems(quest));
        observer.observe(container, {childList: true, subtree: true});
    }
}

const checkForFaerie = async () => {
    const re = document.getElementsByClassName("new_quest_pushdown")[0];
    if(!re) return;
    const item = re.querySelector("b");
    const itemValue = await getItemValues([{name: item.textContent, quantity: 1}]);
    if(itemValue < 0) return;
    item.insertAdjacentHTML("afterEnd", ` (${itemValue} NP)`);
    parseItem(item, 0, []);
}

(function() {
    'use strict';
    checkForFaerie();
    const url = window.location.href;
    if(url.includes("halloween/braintree.phtml")) onBrainTree();
    else {
        const quest = quests.find(q => url.includes(q.url));
        if(quest) getTotal(quest);
        if(url.includes("esophagor")) onEsophagor();
    }
})();

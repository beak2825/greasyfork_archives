// ==UserScript==
// @name         Neopets: Book and Food Tracker
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Adds a border to books/gourmet food a tracked pet hasn't read/eaten yet. Also moves them to the top in various pages.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/*
// @exclude      *://*.neopets.com/~*
// @exclude      *://*.neopets.com/donations.phtml*
// @exclude      *://*.neopets.com/objects.phtml?*type=shop*
// @exclude      *://*.neopets.com/medieval/rubbishdump.phtml
// @exclude      *://*.neopets.com/*lookup.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/563323/Neopets%3A%20Book%20and%20Food%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563323/Neopets%3A%20Book%20and%20Food%20Tracker.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Updates the list of possible books and gourmet food regularly by retrieving itemDB's data
        - Allows you to configure how often (in hours) the update happens. Default is 24h. I wouldn't go under 4h.
    - Adds a button to your pets' Gourmet Food, Book Award, and Booktastic Book Award lists to track/untrack them
    - Keeps track of the books tracked pets have read and food tracked pets have eaten
        - If you read/eat something without the script active, revisit their list page to update it
    - Adds a border to the image of a book/food if it isn't in a tracked list yet (your pet hasn't read/eaten it)
        - Does not work in shops. This is by design. This userscript could be exploited by using it in shops to restock
          on rare books and food. Doing so is AGAINST THE RULES for both Neopets and itemDB. And also I'm judging you.
        - I give up on adding image borders to rows so in auctions, the background becomes a rainbow instead
    - Moves unread/uneaten items to the top in the following pages (you can turn it off for each):
        - User shops
        - Inventory
        - Security Deposit Box
        - Trading Post (except for the inventory when offering on a lot, where they're moved to the bottom)
        - Homepage's Read and Eat screens (will be on top for pets you track and bottom for pets you don't)
    - Puts your tracked pets above all others in inventory actions, together with a divider.
    - If you only track one pet for that list, automatically selects it in your inventory screen.

    Check out this userscript if you want "Read to X" to disappear if you've read it:
        https://greasyfork.org/en/scripts/504166-neopets-read-books-tracker
    And if you want to get rid of "Feed to X" in non-food items for Grarrls and Skeiths:
        https://neoquest.guide/userscripts/ -> Prevent Feeding Non-Food


    For reference, the list urls are (replace PetName with your pet's name)
        Books: https://neopets.com/books_read.phtml?pet_name=PetName
        Booktastic books: https://neopets.com/moon/books_read.phtml?pet_name=PetName
        Gourmet food: https://www.neopets.com/gourmet_club.phtml?pet_name=PetName

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// TODO
// - Implement tracker on homepage

// How many hours should pass, minimum, until the lists are checked for an update
const updateFrequency = 24;
// Change values to true if you want unread/uneaten items to be sorted first in that page, or false if you don't
const sortItems = {
    usershops: true,
    inventory: true,
    sdb: true,
    tradingPost: true,
    homepage: true
}

const lists = {
    booktastic: {
        url: /moon\/books_read\.phtml\?pet_name=/,
        itemdb: 'booktastic-book-award'
    },
    books: {
        url: /books_read\.phtml\?pet_name=/,
        itemdb: 'book-award'
    },
    gourmet: {
        url: /gourmet_club\.phtml\?pet_name=/,
        itemdb: 'gourmet-food'
    }
}

const strings = {
    'track': '🔎 Track this List',
    'untrack': '✖️ Untrack this List'
}

const getItems = (listInfo) => GM.getValue(`${listInfo.id}-${listInfo.pet}`, []);
// const addItems = async (listInfo, newItems) => GM.setValue(`${listInfo.id}-${listInfo.pet}`, (await getItems(listInfo)).concat(newItems).sort((a, b) => a - b));
const addItem = async (listInfo) => GM.setValue(`${listInfo.id}-${listInfo.pet}`, (await getItems(listInfo)).concat([listInfo.item]).sort((a, b) => a - b));
const isInList = async (listInfo) => (await getItems(listInfo)).find(thing => thing === listInfo.item);
const rebuildList = (listInfo) => GM.setValue(`${listInfo.id}-${listInfo.pet}`, listInfo.items);
const addList = async (listInfo) => {
    GM.setValue(`all-${listInfo.id}`, (await getPetsForList(listInfo.id)).concat([listInfo.pet]));
    GM.setValue(`${listInfo.id}-${listInfo.pet}`, [1]);
}
const isBeingTracked = async (listInfo) => (await getPetsForList(listInfo.id)).find(pet => pet === listInfo.pet);
const isDue = async () => (new Date().getTime() - (await GM.getValue('timestamp', 0))) > (updateFrequency * 60 * 60 * 1000);
const getPetsForList = async listId => GM.getValue(`all-${listId}`, []);

const removeList = async (listInfo) => {
    GM.deleteValue(`${listInfo.id}-${listInfo.pet}`);
    GM.setValue(`all-${listInfo.id}`, (await GM.getValue(`all-${listInfo.id}`, [])).filter(pet => pet !== listInfo.pet));
}

const updateCache = (listId, items) => {
    console.log(`Cache for list ${listId} updated with ${items.length} items!`);
    GM.setValue(listId, items);
    GM.setValue('timestamp', new Date().getTime());
};

const listOf = async (item) => {
    const allOfficialLists = await Promise.all(Object.keys(lists).map(async listId => {
        return { id: listId, items: await GM.getValue(listId, []) }
    }));
    return allOfficialLists.find(list => list.items.find(id => id === item))?.id;
}

const findUnfinishedPets = async (listId, item) => {
    const trackedPetLists = await Promise.all((await getPetsForList(listId)).map(async pet => {
        return { pet, items: await GM.getValue(`${listId}-${pet}`, []) }
    }));
    return trackedPetLists.filter(({items}) => !items.find(itemId => itemId === item)).map(({pet}) => pet);
}

const getIdFromImageSource = src => src.match(/items\/(\w+)/)?.[1];
const getAllImagesFromPage = (parent) => [...(parent ?? document).querySelectorAll('img[src*="/items/"]:not(#trainingTimersToggleIcon), .item-img, .petCare-itemgrid-item')];
const parentElements = (element, degree) => {
    let res = element;
    for(let i = 0; i < degree; i++) res = res.parentElement;
    return res;
}

const addBorder = (listId, element, pets) => {
    element.classList.add('saahphire-bft-to-do', listId === 'gourmet' ? 'saahphire-uneaten' : 'saahphire-unread');
    element.dataset.saahphirelist = listId;
    if(pets) element.title = `[${listId === 'gourmet' ? 'Feed' : 'Read'} to ${pets.join(', ')}] ` + element.title;
}

const getListInfo = () => {
    const href = window.location.href;
    const officialList = Object.entries(lists).find(([, {url}]) => href.match(url)) ?? (() => {throw new Error (`Couldn't find list data for url ${href}`)})();
    const pet = href.match(/pet_name=(\w+)/)?.[1] ?? (() => {throw new Error(`Couldn't find pet for url ${href}`)})();
    return { id: officialList[0], pet }
}

const updateList = (listInfo) => {
    listInfo.items = getAllImagesFromPage().map(img => getIdFromImageSource(img.src ?? img.style.backgroundImage)).filter(a => a);
    rebuildList(listInfo);
    console.log(`Updated items in list ${listInfo.id} for pet ${listInfo.pet} (found ${listInfo.items.length})`);
}

const onTrackUntrackClick = (toggle, listInfo) => {
    if(toggle.checked) {
        updateList(listInfo);
        addList(listInfo);
    }
    else removeList(listInfo);
    toggle.nextElementSibling.textContent = toggle.checked ? strings.untrack : strings.track;
}

const makeLabel = (tracked) => {
    const label = document.createElement('label');
    label.htmlFor = 'saahphire-list-tracker';
    label.textContent = tracked ? strings.untrack : strings.track;
    return label;
}

const makeToggle = (tracked) => {
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.classList.add('saahphire-list-tracker');
    toggle.id = 'saahphire-list-tracker';
    toggle.checked = tracked;
    return toggle;
}

const addButton = (listInfo, tracked) => {
    const toggle = makeToggle(tracked);
    document.querySelector('.content img[width="150"]').insertAdjacentElement('afterEnd', toggle);
    toggle.insertAdjacentHTML('beforeBegin', onListCSS);
    const label = makeLabel(tracked);
    toggle.insertAdjacentElement('afterEnd', label);
    toggle.addEventListener('change', (e) => onTrackUntrackClick(e.target, listInfo));
}

const onList = async () => {
    const listInfo = getListInfo();
    const tracked = await isBeingTracked(listInfo);
    addButton(listInfo, tracked);
    if(tracked) updateList(listInfo);
}

const requestUpdate = async () => {
    Object.entries(lists).forEach(async ([listId, info]) => {
        const items = await (await fetch(`https://itemdb.com.br/api/v1/lists/official/${info.itemdb}/itemdata`)).json();
        const itemIds = items.map(item => getIdFromImageSource(item.image));
        updateCache(listId, itemIds);
    });
}

const highlightItem = async (image) => {
    const id = getIdFromImageSource(image.src ?? image.dataset.image ?? image.style.backgroundImage);
    if(!id) return;
    const listId = await listOf(id);
    if(!listId) return;
    const unfinishedPets = await findUnfinishedPets(listId, id);
    if(unfinishedPets.length == 0) return;
    addBorder(listId, image, unfinishedPets);
    return image;
}

const highlightItems = async (parent) => {
    return (await Promise.all(getAllImagesFromPage(parent).map(highlightItem))).filter(a => a);
}

const handleInventoryOption = (pet, action, select) => {
    const val = `${action} to ${pet}`;
    select.prepend(select.querySelector(`[value="${val}"]`));
    return val;
}

const handleInventorySelect = async (listId) => {
    const select = document.querySelector('select[name="action"]');
    select.insertAdjacentHTML('afterBegin', '<option value disabled>-----------------------</option>');
    const trackedPets = await getPetsForList(listId);
    if(!trackedPets.length) return;
    const action = listId === 'gourmet' ? 'Feed' : 'Read';
    if(trackedPets.length === 1) {
        select.value = `${action} to ${trackedPets[0]}`;
        document.querySelector('.invitem-submit').classList.remove("disabledButton");
    }
    return {select, actions: trackedPets.map(pet => handleInventoryOption(pet, action, select))}
}

const onInventorySubmit = async (selectData, listInfo) => {
    console.log(selectData);
    if(!selectData || !selectData.actions.length) return;
    if(!selectData.actions.find(action => action === selectData.select.value)) return;
    listInfo.pet = selectData.select.value.match(/\w+$/);
    if(!await isInList(listInfo)) addItem(listInfo);
}

const onInventoryPopup = async ([{ removedNodes }]) => {
    const submit = document.querySelector('.invitem-submit');
    if(!submit || removedNodes.length !== 2) return;
    const item = getIdFromImageSource(document.getElementById('invItemImg').style.backgroundImage);
    const listInfo = {id: await listOf(item), item};
    if(!listInfo.id) return;
    const selectData = await handleInventorySelect(listInfo.id);
    if(selectData?.actions) addBorder(listInfo.id, document.getElementById('invItemImg'));
    submit.addEventListener('click', async () => onInventorySubmit(selectData, listInfo));
};

const orderInventory = highlightedItems => {
    if(!sortItems.inventory) return;
    const parent = document.getElementById('tableRowsId');
    for (let count = 0; count < highlightedItems.length; count++)
        parent.children[count].insertAdjacentElement('beforeBegin', highlightedItems[count].offsetParent);
}

const onInventory = () => {
    const inventoryObserver = new MutationObserver(async ([{removedNodes}]) => {
        if(removedNodes.length === 1) return;
        orderInventory(await highlightItems());
    });
    inventoryObserver.observe(document.getElementById('invDisplay'), {subtree: true, childList: true});
    const popupObserver = new MutationObserver(onInventoryPopup);
    popupObserver.observe(document.querySelector('#invDesc .popup-body__2020'), {childList: true});
}

const moveToTopInTable = (cell, rows, count, maxColumns) => {
    const min = maxColumns - 1;
    const row = rows[Math.floor(count / maxColumns)];
    cell.insertAdjacentElement('afterEnd', row.querySelector(`td:nth-child(${1 + count % maxColumns})`));
    row.querySelector(`td:nth-child(${Math.min(min, 1 + count % maxColumns)})`).insertAdjacentElement(count % 5 === min ? 'afterEnd' : 'beforeBegin', cell);
}

const onUserShop = images => {
    if(!sortItems.usershops) return;
    const rows = document.querySelectorAll('hr[noshade] ~ table[align="center"] tr');
    let count = 0;
    images.forEach(img => {
        const cell = img.offsetParent;
        if(!cell.offsetParent.cellPadding) return;
        moveToTopInTable(cell, rows, count, 5);
        count++;
    });
}

const onSDB = images => {
    if(!sortItems.sdb) return;
    for(let i = 0; i < images.length; i++)
        document.querySelectorAll('table[cellpadding="4"] tr:not(:first-child, :last-child)')[i].insertAdjacentElement('beforebegin', parentElements(images[i], 2));
}

const orderTradingPreviews = images => {
    if(!sortItems.tradingPost) return;
    images.forEach(image => 
        parentElements(image, 3)
            .querySelector('.gap-4')
            .insertAdjacentElement('beforeBegin', parentElements(image, 2))
    );
}

const orderTradingPopups = (images, parent) => {
    if(!sortItems.tradingPost) return;
    images.forEach(img => parent.prepend(parentElements(img, 2)));
}

const orderTradingLot = (images) => {
    if(!sortItems.tradingPost) return;
    images.forEach(img => parentElements(img, 3).prepend(parentElements(img, 2)));
}

const orderTradingInventory = (images, parent) => {
    if(!sortItems.tradingPost) return;
    images.forEach(img => parent.appendChild(img.parentElement));
}

const tradingPost = {
    'tp-main-content': {
        order: orderTradingPreviews
    },
    'relative': {
        order: orderTradingPopups,
        parent: '.tp-popup-overlay .grid-cols-3'
    },
    'tp-border-frame': {
        order: orderTradingLot,
        parent: '.bg-white.p4'
    },
    'tp-tab-panel': {
        order: orderTradingInventory,
        parent: '.inventory-grid .grid'
    }
}

const onTradingPost = async () => {
    const observer = new MutationObserver(async ([{target}]) => {
        Object.entries(tradingPost).forEach(async ([className, data]) => {
            if(target.classList.contains(className)) {
                const parent = data.parent ? document.querySelector(data.parent) : null;
                const highlighted = await highlightItems(parent);
                data.order(highlighted, parent);
            }
        })
    });
    observer.observe(document.querySelector('.tp-main-content'), {childList: true, subtree: true});
}

const orderHomepage = highlighted => {
    if(!sortItems.homepage) return;
    const parent = document.getElementsByClassName('petCare-itemgrid')[0];
    const petName = document.getElementById('petCareInfoName').textContent;
    highlighted.forEach(async item => {
        if(await isBeingTracked({id: item.dataset.saahphirelist, pet: petName})) parent.prepend(item);
        else parent.appendChild(item);
    });
}

const addItemFromHomepageIfNoError = (target, isHighlighted, mutations) => {
    if(mutations.some(mutation => [...mutation.addedNodes].some(node => node.classList?.contains('petCare-error')))) return;
    addItem({
        id: target.dataset.saahphirelist,
        pet: document.getElementById('petCareInfoName').textContent,
        item: getIdFromImageSource(isHighlighted.style.backgroundImage)
    });
}

const addItemFromHomepage = async ([{target}]) => {
    const isHighlighted = await highlightItem(target);
    if(!isHighlighted) return;
    document.getElementById('petCareUseItem').addEventListener('click', () => {
        const errorObserver = new MutationObserver((mutations) => addItemFromHomepageIfNoError(target, isHighlighted, mutations));
        errorObserver.observe(document.querySelector('#petCareResult .popup-body__2020'), {childList: true, subtree: true});
    })
}

const onHomepage = async () => {
    const inventoryObserver = new MutationObserver(async ([{addedNodes}]) => {
        if(addedNodes.length < 4) return;
        const highlighted = await highlightItems(document.querySelector('.petCare-itemgrid'));
        orderHomepage(highlighted);
    });
    inventoryObserver.observe(document.querySelector('.petCareList .popup-body__2020'), {childList: true})
    const itemObserver = new MutationObserver(addItemFromHomepage);
    itemObserver.observe(document.querySelector('#petCareItemImg'), {attributeFilter: ['style']})
}

const pages = [
    ['inventory.phtml', onInventory],
    ['browseshop.phtml', onUserShop],
    ['safetydeposit.phtml', onSDB],
    ['tradingpost.phtml', onTradingPost],
    ['index.phtml', onHomepage]
];

const init = async () => {
    const href = window.location.href;
    if (await isDue()) requestUpdate();
/* 
    ☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂
      This userscript can be exploited by using it to restock on rare
      books and foods. Doing so is AGAINST THE RULES, both for Neopets
      and itemDB. Don't change the code to allow yourself to do that!
      (Unlicensed scripts have no rules, but I'm judging you so hard.)
    ☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂
*/
    if(href.match('type=shop')) return;
    document.head.insertAdjacentHTML('beforeEnd', borderCSS);
    if(Object.values(lists).some(info => href.match(info.url))) {
        onList();
        return;
    }
    const images = await highlightItems();
    pages.some(([url, func]) => {
        if(href.match(url)) func(images);
    });
}

const onListCSS = `<style>
.saahphire-list-tracker {
    display: none;
}

.saahphire-list-tracker + label {
    --border: hsl(153deg 100% 40% / 0.75);
    --bg-gradient: linear-gradient(
        45deg,
        hsl(123deg 100% 55%) 0%,
        hsl(136deg 100% 48%) 8%,
        hsl(141deg 100% 47%) 17%,
        hsl(145deg 100% 45%) 25%,
        hsl(149deg 100% 43%) 33%,
        hsl(152deg 92% 43%) 42%,
        hsl(152deg 72% 46%) 50%,
        hsl(152deg 92% 43%) 58%,
        hsl(149deg 100% 43%) 67%,
        hsl(145deg 100% 45%) 75%,
        hsl(141deg 100% 47%) 83%,
        hsl(136deg 100% 48%) 92%,
        hsl(123deg 100% 55%) 100%
    );
    padding: 1em;
    display: block;
    box-sizing: border-box;
    width: 150px;
    margin: 1em auto;
    border-radius: 0.5em;
    border: 1px solid var(--border);
    background-image: var(--bg-gradient);
    background-size: 200%;
    transition: background-position 300ms ease-in-out;
    cursor: pointer;
}

@media (prefers-reduced-motion: no-preference) {
    .saahphire-list-tracker + label:hover {
        background-position: 100%;
        transition: background-position 300ms ease-in-out;
    }
}

.saahphire-list-tracker:checked + label {
    --border: hsl(0deg 84% 61% / 0.75);
    --bg-gradient: linear-gradient(
        45deg,
        hsl(0deg 100% 82%) 0%,
        hsl(0deg 98% 79%) 8%,
        hsl(1deg 96% 75%) 17%,
        hsl(1deg 93% 72%) 25%,
        hsl(1deg 90% 68%) 33%,
        hsl(1deg 87% 65%) 42%,
        hsl(0deg 84% 61%) 50%,
        hsl(1deg 87% 65%) 58%,
        hsl(1deg 90% 68%) 67%,
        hsl(1deg 93% 72%) 75%,
        hsl(1deg 96% 75%) 83%,
        hsl(0deg 98% 79%) 92%,
        hsl(0deg 100% 82%) 100%
    );
}
</style>`;

const borderCSS = `<style>
.saahphire-bft-to-do, :not(:has(.items-center)) .gap-4:has(.saahphire-bft-to-do), .popup-body__2020 .petCare-itemgrid .petCare-itemgrid-item.saahphire-bft-to-do {
    border-image: 24 / 8px round;
    border-style: solid;
    border-width: 8px;
    box-sizing: border-box;
    box-shadow: none;
}

.popup-body__2020 .petCare-itemgrid .petCare-itemgrid-item.saahphire-bft-to-do {
    padding-bottom: calc(100% - 16px);
}

.saahphire-unread, :not(:has(.items-center)) .gap-4:has(.saahphire-unread), .popup-body__2020 .petCare-itemgrid .petCare-itemgrid-item.saahphire-unread {
    border-image-source: url("data:image/png;base64,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");
}

.saahphire-uneaten, :not(:has(.items-center)) .gap-4:has(.saahphire-uneaten), .popup-body__2020 .petCare-itemgrid .petCare-itemgrid-item.saahphire-uneaten {
    border-image-source: url("data:image/png;base64,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");
}

tr[bgcolor]:has(a[href*="randomfriend"]):has(.saahphire-bft-to-do) {
    background: linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.5) 0%,
        rgba(255, 154, 0, 0.5) 10%,
        rgba(208, 222, 33, 0.5) 20%,
        rgba(79, 220, 74, 0.5) 30%,
        rgba(63, 218, 216, 0.5) 40%,
        rgba(47, 201, 226, 0.5) 50%,
        rgba(28, 127, 238, 0.5) 60%,
        rgba(95, 21, 242, 0.5) 70%,
        rgba(186, 12, 248, 0.5) 80%,
        rgba(251, 7, 217, 0.5) 90%,
        rgba(255, 0, 0, 0.5) 100%
    )!important;
}

:not(:has(.items-center)) .gap-4 .saahphire-bft-to-do, tr[bgcolor]:has(a[href*="randomfriend"]) .saahphire-bft-to-do {
    border: 0;
}
</style>`;

(function() {
    'use strict';
    init();
})();

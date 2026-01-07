// ==UserScript==
// @name         Neopets: SDB Improvements (Single Page, Prices, No Reload, Export)
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Records all items in your SDB and adds a button to display them all in a single page
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/safetydeposit.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/553557/Neopets%3A%20SDB%20Improvements%20%28Single%20Page%2C%20Prices%2C%20No%20Reload%2C%20Export%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553557/Neopets%3A%20SDB%20Improvements%20%28Single%20Page%2C%20Prices%2C%20No%20Reload%2C%20Export%29.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Stops the SDB page from reloading whenever you remove items from it
    - Adds two buttons to each item:
      - All: take all of the items to your inventory
      - Move: Take the number you wrote to your inventory
    - Records every item in every page of the SDB you visit
    - Adds a button to display all these recorded items in the current page
      - "Move selected items" is disabled when your items are displayed. Use individual buttons instead.
    - Adds a button to forget every item because it doesn't keep track of items you remove, that's too much work
    - Adds buttons to SDB columns so you can sort by their values
    - Adds a column with prices from itemDB. The prices get updated every time you see a SDB page, but not when you
      display every item, so that's another thing to keep updated.
    - A column with Charity Corner prices might be added if I'm ever playing Neopets when they bring it back. Otherwise,
      this script is Unlicensed. Add the column and share your version with others!
    - Adds a button to export the page's source code to the clipboard so you can import them all to JellyNeo. It looks
      like their limit is 750 items at a time, so you have to click the button (and import your clipboard) multiple times.
      https://items.jellyneo.net/wishlists/import/
    - Adds a button to export the page to a JellyNeo-style petpage's code so you can import them all to itemDB at once.
      https://itemdb.com.br/lists/import/advanced
    - A Dress to Impress export button doesn't seem possible.
    - Compatible with /u/chaiinchomp's Better SDB Item Removal (even if it does get a bit crowded)
    - Compatible with diceroll123's Search Helper
    - Compatible with NeoQuest.Guide's SDB Sorter and Est. NP/CC Value, they don't interact at all

    The prices displayed are taken from itemDB. Please consider contributing by installing a simple userscript:
      https://itemdb.com.br/contribute

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// You might need to edit this if you have any userscripts that add columns. Just change order to the column number.
// Indices start at 0, so if names are in the second column, write 1.
const columns = [
  {
    order: 1,
    selector: "td[align='left'] b, .sdb-saah-name",
    comparer: (a, b) => a.textContent.localeCompare(b.textContent)
  },
  {
    order: 3,
    selector: "td[width='350'] + td[align='left'] b, .sdb-saah-category",
    comparer: (a, b) => a.textContent.localeCompare(b.textContent)
  },
  {
    order: 4,
    selector: ".sdb-saah-value",
    comparer: (a, b) => parseInt(a.textContent) - parseInt(b.textContent)
  },
  {
    order: 5,
    selector: "td[width='350'] ~ td[align='center'] b, .sdb-saah-quantity",
    comparer: (a, b) => parseInt(a.textContent) - parseInt(b.textContent)
  }
];

const encodeForNeo = name => encodeURI(name).replaceAll("%20", "+");

const helperData = {
  wizard: {
    query: "shops/wizard",
    url: itemData => `https://www.neopets.com/shops/wizard.phtml?string=${encodeForNeo(itemData.name)}`,
    image: "http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png"
  },
  tradingpost: {
    query: "island/tradingpost",
    url: itemData => `https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=${encodeForNeo(itemData.name)}`,
    image: "http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png"
  },
  auctions: {
    query: "com/genie",
    url: itemData => `https://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=${encodeForNeo(itemData.name)}`,
    image: "http://images.neopets.com/themes/h5/basic/images/auction-icon.png"
  },
  jellyneo: {
    query: "jellyneo",
    url: itemData => `https://items.jellyneo.net/search/?name=${encodeForNeo(itemData.name)}&name_type=3`,
    image: "data:image/png;base64,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"
  },
  itemdb: {
    query: "itemdb",
    url: itemData => `https://itemdb.com.br/item/${slugify(itemData.name)}`,
    image: "https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg"
  },
  dresstoimpress: {
    query: "impress.",
    url: itemData => `https://impress.openneo.net/items/${itemData.id}`,
    image: "data:image/gif;base64,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"
  },
  closet: {
    query: ".com/closet",
    url: itemData => `https://www.neopets.com/closet.phtml?obj_name=${encodeForNeo(itemData.name)}`,
    image: "http://images.neopets.com/items/ffu_illusen_armoire.gif"
  }
}

const minifyHelper = (obj) => parseInt([obj.wizard, obj.tradingpost, obj.auctions, obj.closet, obj.jellyneo, obj.itemdb, obj.dresstoimpress].map(icon => icon * 1).join(""), 2);

const minify = (itemObjects) => itemObjects.map(obj => [parseInt(obj.id), obj.name, obj.description, obj.category, parseInt(obj.quantity), parseInt(obj.price.value), obj.helper ? minifyHelper(obj.helper) : null, obj.image, obj.rarity.color, obj.rarity.name, obj.rarity.wearable ? 1 : 0, obj.price.inflated ? 1 : 0]);

const magnifyHelper = (number) => Object.fromEntries(Array.from("0".repeat(7 - number.toString(2).length).concat(number.toString(2))).map((num, i) => [["wizard", "tradingpost", "auctions", "closet", "jellyneo", "itemdb", "dresstoimpress"][i], num === "1"]));

const magnify = (itemArrays) => itemArrays.map(arr => {
  return {
    id: arr[0],
    image: arr[7],
    name: arr[1],
    rarity: {
      color: arr[8],
      name: arr[9],
      wearable: arr[10]
    },
    description: arr[2],
    category: arr[3],
    quantity: arr[4],
    price: {
      value: arr[5],
      inflated: arr[11]
    },
    helper: arr[6] ? magnifyHelper(arr[6]) : null
  }
});

const slugify = (name) => {
  return name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const getItemsFromitemDB = async (itemids) => (await fetch(`https://itemdb.com.br/api/v1/items/many?item_id[]=${itemids.join("&item_id[]=")}`)).json();

const addIds = () => {
  const ids = [];
  document.querySelectorAll("script ~ tr:not(:last-child)").forEach(tr => {
    const id = tr.querySelector("input[type='text'] ~ a.medText").href.match(/passPin\(\d+,(\d+)/)[1];
    tr.dataset.itemid = id;
    ids.push(id);
  });
  return ids;
};

const addPrice = (row, items) => row.getElementsByTagName("TD")[3].insertAdjacentHTML("afterEnd", `<td class="sdb-saah-value${items[row.dataset.itemid].price.inflated ? ' inflated' : ''}">${items[row.dataset.itemid].price.value}</td>`);

const addQuantity = (row) => row.querySelector("td:has(input[type='text'])").dataset.quantity = row.querySelector("td[align='center'] b, .sdb-saah-quantity").textContent

const addLoading = (cell) => {
  cell.classList.add("loading");
  cell.querySelectorAll("input").forEach(child => child.disabled = true);
  cell.querySelectorAll("a").forEach(a => {
    a.dataset.href = a.href;
    a.removeAttribute("href");
  });
}

const removeLoading = (cell) => {
  cell.classList.remove("loading");
  cell.querySelectorAll("input").forEach(child => child.disabled = false);
  cell.querySelectorAll("a").forEach(a => a.setAttribute("href", a.dataset.href));
}

const removeOne = (event) => {
  event.preventDefault();
  const cell = event.target.parentElement;
  addLoading(cell);
  const [offset, itemId, query, category] = event.target.dataset.sdbsaahvals.split("&");
  const pin = document.getElementById("pin_field")?.value ?? "";
  fetch(`https://www.neopets.com/process_safetydeposit.phtml?offset=${offset}&remove_one_object=${itemId}&obj_name=${query}&category=${category}&pin=${pin}`, {
    method: "GET"
  }).then(() => {
    adjustQuantities(cell, 1);
    removeLoading(cell);
  });
}

const adjustQuantities = (cell, removed = null) => {
    const quantityInput = cell.querySelector("input[type='text']");
    const formerQuantity = cell.dataset.quantity;
    const difference = removed ?? parseInt(quantityInput.value);
    const newQuantity = Math.max(0, parseInt(formerQuantity) - difference);
    quantityInput.value = 0;
    const id = parseInt(cell.parentElement.dataset.itemid);
    GM.getValue("items", []).then(items => {
      if(newQuantity === 0) GM.setValue("items", items.filter(item => item[0] !== id));
      else {
        const index = items.findIndex(t => t[0] === id);
        if(index) items[index][4] = newQuantity;
        GM.setValue("items", items);
      }
    });
    if(newQuantity === 0) {
      cell.parentElement.style.display = "none";
      return;
    }
    cell.dataset.quantity = newQuantity;
    cell.parentElement.querySelector("td[align='center'] b, .sdb-saah-quantity").textContent = newQuantity;
}

const onSubmitIndividual = (event) => {
  event.preventDefault();
  document.getElementById("pin_field").setAttribute("form", event.target.id);
  event.target.parentElement.parentElement.getElementsByClassName("remove_safety_deposit")[0].setAttribute("form", event.target.id);
  const formData = new FormData(event.target);
  const cell = event.target.parentElement;
  addLoading(cell);
  fetch("https://www.neopets.com/process_safetydeposit.phtml?checksub=scan", {method: "POST", body: formData}).then(() => {
    adjustQuantities(cell);
    removeLoading(cell);
    document.getElementById("pin_field").removeAttribute("form");
    document.getElementsByClassName("remove_safety_deposit")[0].removeAttribute("form");
  });
}

const onSubmitForm = (e) => onSubmitIndividual(e);

const addForm = (cell, id) => {
  const name = cell.parentElement.querySelector("td[align='left'] b, .sdb-saah-item-name").textContent;
  const form = document.createElement("form");
  form.id = `sdb-saah-${id}`;
  form.classList.add("sdb-saah-move-form");
  form.onsubmit = onSubmitForm;
  form.insertAdjacentHTML("afterBegin", `<input type="hidden" name="obj_name" value="${encodeForNeo(name)}"><input type="hidden" name="category" value="0"><input type="hidden" name="offset" value="0">`);
  cell.querySelector("input").insertAdjacentElement("afterEnd", form);
  return form;
}

const removeAll = (event) => event.target.parentElement.parentElement.querySelector("input[type='text']").value = event.target.parentElement.parentElement.dataset.quantity;

const createSubmitButton = (title, cb = null) => {
  const button = document.createElement("input");
  button.type = "submit";
  button.value = title;
  if(cb) button.onclick = cb;
  return button;
}

const adjustRemoveOneLink = (link, id, name) => {
  link.dataset.sdbsaahvals = `0&${id}&${encodeForNeo(name)}&0`;
  link.href = "";
  link.onclick = removeOne;
}

const addButtons = (row) => {
  const cell = row.querySelector("td:has(input[type='text'])");
  const link = cell.querySelector("input[type='text'] ~ a.medText");
  const id = row.dataset.itemid;
  const form = addForm(cell, id);
  form.appendChild(createSubmitButton("Move"));
  form.appendChild(createSubmitButton("All", removeAll));
  adjustRemoveOneLink(link, id, row.querySelector("td[align='left'] b, .sdb-saah-name").childNodes[0].textContent);
}

const onSubmitAllClick = (e) => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("boxform"));
  console.log([...formData]);
  document.querySelectorAll("script ~ tr:not(:last-child) td:last-child").forEach(cell => {
    addLoading(cell);
  });
  fetch("https://www.neopets.com/process_safetydeposit.phtml?checksub=scan", {method: "POST", body: formData}).then(() => {
    document.querySelectorAll("script ~ tr:not(:last-child) td:last-child").forEach(cell => {
      removeLoading(cell);
      adjustQuantities(cell);
    });
  });
}

const adjustSubmitAllButton = () => {
  const oldButton = document.getElementsByClassName("submit_data")[0];
  const button = oldButton.cloneNode();
  oldButton.insertAdjacentElement("afterEnd", button);
  oldButton.remove();
  button.onclick = onSubmitAllClick;
}

const isInHelper = (query, links) => links.findIndex(link => link.match(query)) !== -1;

const parseHelper = (helper) => {
  const links = [...helper.querySelectorAll("a")].map(a => a.href);
  return Object.fromEntries(Object.entries(helperData).map(([key, data]) => [key, isInHelper(data.query, links)]));
}

const parseItem = (row) => {
  const itemData = {
    id: row.dataset.itemid,
    image: row.querySelector("img[height='80']").src,
    name: row.querySelector("td[align='left'] b").childNodes[0].textContent,
    rarity: {
      color: row.querySelector("td[align='left'] .medText font")?.color ?? "",
      name: row.querySelector("td[align='left'] .medText font")?.textContent ?? "",
      wearable: row.querySelector("td[align='left'] .medText span") ? true : false
    },
    description: row.querySelector("td[width='350'] i").textContent,
    category: row.querySelector("td[width='350'] + td[align='left']").textContent,
    quantity: row.querySelector("td[align='center'] b").textContent,
    price: {
      inflated: row.getElementsByClassName("sdb-saah-value")[0].classList.contains("inflated"),
      value: row.getElementsByClassName("sdb-saah-value")[0].textContent
    }
  };
  const helper = row.getElementsByClassName("search-helper")[0];
  if(helper) itemData.helper = parseHelper(helper);
  return itemData;
}

const savePage = async () => {
  const allItems = await GM.getValue("items", []);
  const newItems = minify([...document.querySelectorAll("script ~ tr:not(:last-child)")].map(row => parseItem(row)));
  GM.setValue("items", allItems.filter(item => !newItems.find(newItem => newItem[0] === item[0])).concat(newItems).sort((a, b) => a[0] - b[0]));
}

const editRows = async () => {
  const ids = addIds();
  document.querySelector("td[colspan='6']").colSpan = 7;
  document.querySelector("tr:has(+ form)").getElementsByTagName("TD")[3].insertAdjacentHTML("afterEnd", '<td class="contentModuleHeaderAlt sdb-saah-header">Value</td>');
  const items = await getItemsFromitemDB(ids);
  document.querySelectorAll("script ~ tr:not(:last-child)").forEach(row => {
    addPrice(row, items);
    addQuantity(row);
    addButtons(row);
  });
};

const hydrateHelper = (itemData) => {
  console.log(itemData);
  return itemData.helper ? `<p class="search-helper">
    ${Object.entries(itemData.helper).map(([key, value]) => value ? `<a tabindex="-1" target="_blank" href="${helperData[key].url(itemData)}"><img src="${helperData[key].image}" class="searchimg"></a>` : '').join("")}
  </p>` : "";
}

const hydrateItem = async (itemData, pin) => {
  return new Promise(resolve => {
    const row = document.createElement("tr");
    row.dataset.itemid = itemData.id;
    const rarity = itemData.rarity.color === "" ? "" : `<p class="sdb-saah-rarity" style="color:${itemData.rarity.color}">${itemData.rarity.name}</p>`;

    row.innerHTML = `
    <td class="sdb-saah-image"><img src="${itemData.image}"></td>
    <td class="sdb-saah-name"><p class="sdb-saah-item-name">${itemData.name}</p>${rarity}${itemData.rarity.wearable ? '<p class="sdb-saah-wearable">(wearable)</p>' : ''}${hydrateHelper(itemData)}</td>
    <td class="sdb-saah-description"><p>${itemData.description}</p></td>
    <td class="sdb-saah-category"><p>${itemData.category}</p></td>
    <td class="sdb-saah-value${itemData.price.inflated ? " inflated" : ""}"><p>${itemData.price.value}</td>
    <td class="sdb-saah-quantity"><p>${itemData.quantity}</p></td>
    <td class="sdb-saah-move" data-quantity="${itemData.quantity}">
      <input type="text" name="back_to_inv[${itemData.id}]" size="3" value="0" data-total_count="${itemData.quantity}" class="remove_safety_deposit" data-remove_val="n">
      <form id="sdb-saah-${itemData.id}" class="sdb-saah-move-form">
        ${pin ? '<input type="hidden" name="pin" value="'+ pin +'">' : ''}
        <input type="hidden" name="obj_name" value="${encodeForNeo(itemData.name)}">
        <input type="hidden" name="category" value="0">
        <input type="hidden" name="offset" value="0">
        <input type="submit" value="Move">
        <input type="submit" value="All" class="sdb-saah-remove-all">
      </form>
      <a class="medText" data-sdbsaahvals="0&${itemData.id}&${encodeForNeo(itemData.name)}&0" href>Remove One</a>
    </td>`;
    row.getElementsByClassName("sdb-saah-move-form")[0].onsubmit = onSubmitForm;
    row.getElementsByClassName("sdb-saah-remove-all")[0].onclick = removeAll;
    row.querySelector("a.medText").onclick = removeOne;
    resolve(row);
  });
}

const addItems = async () => {
  document.querySelector("[value='📄 Single Page SDB']").value = "Loading...";
  const allItemsArray = (await GM.getValue("items", [])).sort((a, b) => a[0] - b[0]);
  const allItems = magnify(allItemsArray);
  document.querySelectorAll("script ~ tr:not(:last-child)").forEach(row => row.remove());
  const sibling = document.querySelector("script + tr");
  Promise.all(allItems.map(async item => await hydrateItem(item))).then(items => {
    items.forEach(item => sibling.insertAdjacentElement("beforeBegin",item));
    document.getElementsByClassName("submit_data")[0].disabled = true;
    document.querySelector("[value='Loading...']").value = "✅";
  });
}

const addControlButton = (title, onclick) => {
  const button = document.createElement("input");
  button.type = "button";
  button.value = title;
  button.onclick = onclick;
  return button;
}

const addLoadButton = () => addControlButton("📄 Single Page SDB", addItems)

const addForgetButton = () => addControlButton("🗑️ Forget Items", () => GM.setValue("items", []));

const sort = (e) => {
  const column = e.target.classList.contains("contentModuleHeaderAlt") ? e.target : e.target.parentElement;
  const index = [...column.parentElement.children].findIndex(c => c === column);
  const states = ["asc", "desc", "off", "asc"];
  const nextState = states[states.findIndex(state => state === column.dataset.state) + 1];
  column.dataset.state = nextState;
  const sorter = columns.find(col => col.order === index);
  const rows = [...document.querySelectorAll("form ~ tr:not(:last-child)")];
  const orderedRows = (nextState === "off") ? rows.sort((a, b) => parseInt(a.dataset.itemid) - parseInt(b.dataset.itemid)) : rows.sort((a, b) => (nextState === "asc" ? 1 : -1) * sorter.comparer(a.querySelector(sorter.selector), b.querySelector(sorter.selector)));
  orderedRows.forEach(row => document.querySelector("form ~ tr:last-child").insertAdjacentElement("beforeBegin", row));
}

const addColumnSorters = () => {
  const headers = document.querySelectorAll("td.contentModuleHeaderAlt");
  columns.forEach(column => {
    headers[column.order].onclick = sort;
    headers[column.order].dataset.state = "off";
  });
}

const exportChunkToJN = (chunk) => `<html>free safety deposit box!${chunk.map(row => `<input name='back_to_inv[${row.dataset.itemid}]' data-total_count='${row.querySelector('[data-quantity]').dataset.quantity}'>`).join("")}</html>`;

const getJNChunks = () => {
  const allItems = [...document.querySelectorAll("form ~ tr:not(:last-child)")];
  const chunked = [];
  for(let i = 0; i < allItems.length; i += 750) {
    chunked.push(allItems.slice(i, Math.min(allItems.length, i + 750)));
  }
  return chunked;
}

const copyChunk = (event, chunkIndex, chunks) => {
  navigator.clipboard.writeText(exportChunkToJN(chunks[chunkIndex]));
  if(chunkIndex === chunks.length - 1)
    event.target.value =  `✅ Copied [${chunkIndex + 1}/${chunks.length}] (Click to restart)`;
  else
    event.target.value = `📋 Copied [${chunkIndex + 1}/${chunks.length}] (Click to copy the next code)`
  if(chunkIndex === 0) window.open("https://items.jellyneo.net/wishlists/import/", "_blank");
  event.target.onclick = (e) => copyChunk(e, (chunkIndex + 1) % chunks.length, chunks);
}

const addJNButton = () => addControlButton("🪼 Export to JN", (e) => {
  const chunks = getJNChunks();
  copyChunk(e, 0, chunks);
});

const exportToitemDB = () => {
  const items = [...document.querySelectorAll("form ~ tr:not(:last-child)")]
  //.sort((a, b) => a.querySelector("td[align='left'] b, .sdb-saah-name").childNodes[0].textContent.localeCompare(b.querySelector("td[align='left'] b, .sdb-saah-name").childNodes[0].textContent))
  .map(row => {
    const name = row.querySelector("td[align='left'] b, .sdb-saah-name").childNodes[0].textContent;
    const quantity = row.querySelector("td[width='350'] ~ td[align='center'] b, .sdb-saah-quantity").textContent;
    const image = row.querySelector("td:first-child img").src;
    return `<tr><td><img src="${image}"><b>${name}</b>${quantity === "1" ? '' : '<span><b>x' + quantity + '</b></span>'}</td></tr>`
  }).join("");
  return `<table class="wishlist-table">${items}</table><p align="center">This list was created at Jellyneo's Item Database!</p>`
}

const additemDBButton = () => addControlButton("📦 Export to itemDB", (e) => {
  navigator.clipboard.writeText(exportToitemDB());
  const val = e.target.value;
  e.target.value = "✅ Copied!";
  window.open("https://itemdb.com.br/lists/import/advanced", "_blank");
  setTimeout(() => e.target.value = val, 200);
});

const addControlButtons = () => {
  document.querySelector("form table[width='100%'] tr").insertAdjacentHTML("afterEnd", `<tr>
  <td colspan="7"><details><summary>SDB Improvements</summary></details><div id="saah-sdb-controls" class="sdb-saah-fake-details"></div></td>
  </tr>`);
  const controls = document.getElementById("saah-sdb-controls");
  [addLoadButton, addForgetButton, addJNButton, additemDBButton].forEach(btn => controls.appendChild(btn()));
}

const init = () => {
  document.head.insertAdjacentHTML("beforeEnd", `<style>${css}</style>`);
  adjustSubmitAllButton();
  editRows().then(() => {
    savePage();
    addColumnSorters();
  });
  addControlButtons();
}

const css = `
script ~ tr td:last-child {
  position: relative;
}

details + .sdb-saah-fake-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 500ms ease-in-out;
}

details:open + .sdb-saah-fake-details {
  max-height: 5em;
  transition: max-height 500ms ease-in-out;
}

summary {
  list-style: none;
}

summary::before {
  content: "▶";
  display: inline-block;
  margin-right: 0.25em;
  font-size: 1.25em;
  transform: rotate(0);
  transition: transform 250ms ease-in-out;
  transition-delay: 250ms;
}

details:open summary::before {
  transform: rotate(90deg);
  transition: transform 500ms ease-in-out;
  transition-delay: 0ms;
}

.sdb-saah-fake-details {
  display: flex;
  gap: 1em;
}

script ~ tr:not(:last-child):nth-child(2n) {
  background: #F6F6F6;
}

script ~ tr:not(:last-child):has(.sdb-saah-wearable), script ~ tr:not(:last-child)[bgcolor="#DFEAF7"] {
  background: #DFEAF7;
}

.sdb-saah-item-name {
  margin: 0;
}

.sdb-saah-rarity, .sdb-saah-wearable {
  font-size: 8pt;
  margin: 0;
}

.sdb-saah-wearable {
  color: #2367B5;
}

.loading:after {
  box-sizing: border-box;
}

.loading:after {
  content: "";
  color: #444;
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid currentColor;
  border-color: currentColor transparent currentColor transparent;
  animation: lds-hourglass 1.2s infinite;
  position: absolute;
  top: 0;
}

.contentModuleHeaderAlt {
  text-align: center;
}

.contentModuleHeaderAlt[data-state] {
  cursor: pointer;
  position: relative;
  height: 3.5em;
}

.contentModuleHeaderAlt[data-state]:hover {
  text-decoration: underline;
}

.contentModuleHeaderAlt::before {
  display: inline-block;
  position: absolute;
  top: 0.25em;
  left: 0;
  width: 100%;
  text-align: center;
}

.contentModuleHeaderAlt[data-state="off"]::before {
  content: "-";
}

.contentModuleHeaderAlt[data-state="asc"]::before {
  content: "▲";
}

.contentModuleHeaderAlt[data-state="desc"]::before {
  content: "▼";
}

.sdb-saah-image {
  width: 80px;
}

.sdb-saah-image img {
  border: 1px solid black;
}

.sdb-saah-name, .sdb-saah-category, .sdb-saah-quantity, .sdb-saah-value {
  font-weight: 600;
}

.sdb-saah-description {
  font-style: italic;
  width: 350px;
}

.sdb-saah-move {
  text-align: center;
}

.sdb-saah-move-form {
  display: flex;
  gap: 0.25em;
  margin: 0.5em 0 0.25em;
}

.sdb-saah-move-form + br {
  display: none;
}

.sdb-saah-name .search-helper img {
    width: 20px;
    height: 20px;
}

@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
`;

(function() {
    'use strict';
    init();
})();

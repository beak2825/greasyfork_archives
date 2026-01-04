// ==UserScript==
// @name         Item Watcher M
// @namespace    http://tampermonkey.net/
// @version      2025-10-11
// @description  Watch for cheap items
// @author       olesien
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      167.235.206.98
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548499/Item%20Watcher%20M.user.js
// @updateURL https://update.greasyfork.org/scripts/548499/Item%20Watcher%20M.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Below you enter if you want to change what keys you use.
    // If you want to see what a key is, look it up here: https://keyjs.dev/ (where this is e.code)

    const startIndexingKey = "Backquote";
    const deleteIndexedKey = "Enter";

    // -----
    let items = [];
    let misc = {market_value: 0};
    let id = 0;
    let orig_url = "";
    const base_url = "http://167.235.206.98:3010"
    const itemListClass = ".itemList___u4Hg1";

    let old_items = [];
    window.addEventListener('popstate', (event) => {
        console.log('URL changed to:', window.location.href);
        old_items = [];
    });
    const getUser = () => {
        //id & playername
        return unsafeWindow?.TornCore?.user?.playername;
    }
    const getItem = async (response) => {
        if (["https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Defensive", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Primary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Secondary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Melee"].includes(window.location.href)) return;
        if (!(window.location.href.includes("Defensive")) && !(window.location.href.includes("Primary")) && !(window.location.href.includes("Secondary")) && !(window.location.href.includes("Melee"))) return;
        console.log("Checking for logger");
        const data = await response.clone().json();
        const list = data?.list;
        // Do stuff
        if (list && list.length === 1) {
            let item = list[0];

            const otherData = old_items.find(old_item => old_item.listingID === item.listingID);
            if (otherData) {
                item = {...item, ...otherData, ID: item.listingID, from: getUser()};

                console.log(item);
                //if (item.anonymous) return; //Early return for anon?
                //We only want to log if the list is exactly 1, meaning that it's a see more click
                const url = `${base_url}/item`;
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    onload: async function (response) {
                        //console.log(response);
                        console.log("Success");
                    },
                    onerror: function (error) {
                        console.error(error);
                        alert("error");
                    },
                    data: JSON.stringify(item),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                console.error("Other data not found");
                console.error(item);
                console.error(old_items);
                alert(":(");
            }
        }
    }

    const checkItem = (itemEl, missingItems, i, items, checkNextAndPrev) => {
        const itemProps = itemEl.querySelector(".properties___QCPEP .property___SHm8e .value___cwqHv"); //This is DAMAGE or ARMOR
        const stat = Number(itemProps?.innerText);
        console.log(itemProps?.innerText);
        const doesNotExist = missingItems.find(v => v.i === i);
        if (doesNotExist) {
            //Control check so it's actually the same item being compared...
            if (("damage" in doesNotExist && doesNotExist.damage === stat) || ("armor" in doesNotExist && doesNotExist.armor === stat)) {
                itemEl.style.backgroundColor = "green";
                itemEl.addEventListener("click", () => {
                    itemEl.remove();
                    itemEl.style.backgroundColor = "inherit";
                });
                return true;
            } else {
                if (checkNextAndPrev) {
                    const itemArray = Array.from(items);
                    //Add and remove 1 index and check that item
                    let existingOne = false;
                    if (i != 0) {
                        const newItem = itemArray[i-1];
                        let found = checkItem(newItem, missingItems, i-1, items, false); //This will branch over the entire item list, tick this off if laggy by setting to false
                        existingOne = found;
                    }

                    if (i != (itemArray.length - 1)) {
                        const newItem = itemArray[i+1];
                        let found = checkItem(newItem, missingItems, i+1, items, false); //This will branch over the entire item list, tick this off if laggy by setting to false
                        existingOne = existingOne || found;
                    }
                    if (!existingOne) {
                        itemEl.style.backgroundColor = "red"; //Could not find
                        itemEl.addEventListener("click", () => {
                            itemEl.style.backgroundColor = "inherit";
                        });
                    }
                } else {
                    //itemEl.style.backgroundColor = "red";
                }
                return false;
            }

        } else {
            return false;
        }
    }

    let missingItems = [];
    const checkExisting = async () => {
        const url = `${base_url}/items`;
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: async function (response) {
                //console.log(response);
                console.log("Success");
                const data = JSON.parse(response.responseText); //This is all items out of the batch that MATCH
                const withIndex = old_items.map((v,i) => ({...v, i}));
                const newMissing = withIndex.filter(v => !data?.listings.includes(Number(v.listingID)));;
                missingItems = newMissing;
                const list = document.querySelector(itemListClass);
                if (list) {
                    const items = list.children;
                    Array.from(items).forEach((itemEl, i) => {
                        checkItem(itemEl, missingItems, i, items, true);
                    });
                } else {
                    console.error("List not found");
                }

            },
            onerror: function (error) {
                console.error(error);
                alert("error");
            },
            data: JSON.stringify(old_items.map(item => item.listingID)),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    document.addEventListener("keypress", (e) => {
        const code = e.code;
        //nsole.log(code);
        if (code === deleteIndexedKey) {
            console.log("DELETING??");
            //Delete
            const list = document.querySelector(itemListClass);
            if (list) {
                //nsole.log(list);
                Array.from(list.children).forEach((itemEl, i) => {
                    if (!(itemEl.style.backgroundColor === "green" || itemEl.style.backgroundColor === "red")) {
                        console.log("HIDING");
                        itemEl.style.display = "none";
                    } else {
                        console.log("green (or red");
                    }

                });
            }
        } else if (code === startIndexingKey) {
            checkExisting();
        }
    });

    const getSearchData = async (response) => {
        if (["https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Defensive", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Primary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Secondary", "https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Melee"].includes(window.location.href)) return;
        if (!(window.location.href.includes("Defensive")) && !(window.location.href.includes("Primary")) && !(window.location.href.includes("Secondary")) && !(window.location.href.includes("Melee"))) return;
        const data = await response.clone().json();
        console.log("orig data");
        console.log(data);
        if (data && data?.items) {
            old_items.push(...data.items);
        }
    }
    const origFetch = unsafeWindow.fetch;
    const getOriginalData = async (response) => {
        console.log("Getting orig data");
        const data = await response.clone().json();
        // Do stuff
        items = data?.list.map(data => ({...data, listingID: data?.listingID ? data?.listingID : data?.ID}));
        console.log(items);
    }
    unsafeWindow.fetch = async (url, config) => {
        //console.log("Intercepted URL:", url);
        const response = await origFetch(url, config);
        if (url.indexOf("getListing") != -1) {
            getOriginalData(response);
            getItem(response); //For cats
        } else if (url.indexOf("searchItem") != -1 || url.indexOf("getShopList") != -1) {
            console.log("GOT SEARCH DATA!!!");
            getSearchData(response);
        }
        return response;
    }

    const getMisc = async () => {
        // Parse the URL to extract the query parameters
        try {
            const fragment = location.href.split('#')[1]; // 'market/view=search&itemID=206&itemName=Xanax&itemType=Drug'

            // Split the fragment into key-value pairs
            const params = new URLSearchParams(fragment?.split('?')[1] || fragment);

            // Get the value of 'itemID'
            const itemID = params.get('itemID');
            orig_url = location.href;
            console.log("Retrieving tornitem for " + itemID);
            if (!itemID) return;
            setTimeout(() => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: `${base_url}/tornitem/${itemID}`,
                    onload: function (response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log(data);
                            if (data?.items && itemID in data?.items) {
                                id = itemID
                                misc = data?.items[itemID];
                                console.log(data?.items[itemID]);
                            } else {
                                alert("ISSUE LOADING ITEM");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Error retrieving data");
                        }
                    },
                    onerror: function (error) {
                        console.error(error);
                        alert("Error retrieving data");
                    },
                });
            }, 250);
        } catch (err) {
            console.error(err);
            alert("ISSUE LOADING ITEM");
        }
    }
    getMisc();

    // Global cache for pricing data
    let pricingData = {};

    async function loadPricingData() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${base_url}/pricings`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.items) {
                            pricingData = data.items;
                            console.log("Pricing data loaded:", pricingData);
                            resolve();
                        } else {
                            reject("Invalid API response");
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (error) {
                    reject(error);
                },
            });
        });
    }
    loadPricingData();

    //END OF CHECK THING
    const minMug = 1000000 //1M
    const fixPrice = (ID, market_price) => {
        const id = Number(ID);

        if (pricingData[id] !== undefined) {
            return pricingData[id];
        }

        // fallbacks (if you want to keep some logic like ranges)
        if ([680, 681, 682, 683, 684].includes(id)) return 4500000000; // EOD
        if (market_price === 0) return market_price || 1; // avoid 0

        return market_price;
    };

    function updateTornMarketUrl( qbPrice, qbListId, qbQuantity) {
        const existingUrl = location.href;
        const [basePart, hashPart] = existingUrl.split('#');

        // Split the hash part into path and parameters
        const [hashPath, ...hashParams] = hashPart.split('&');

        // Filter out any existing qb_ parameters
        const filteredParams = hashParams.filter(param =>
                                                 !param.startsWith('qb_price=') &&
                                                 !param.startsWith('qb_listid=') &&
                                                 !param.startsWith('qb_quantity=')
                                                );

        // Add our new parameters
        filteredParams.push(`qb_price=${qbPrice}`);
        filteredParams.push(`qb_listid=${qbListId}`);
        filteredParams.push(`qb_quantity=${qbQuantity}`);

        // Rebuild the URL
        const newHashPart = [hashPath, ...filteredParams].join('&');

        // Combine everything back together
        location.href = `${basePart}#${newHashPart}`;
    }

    const addItem = (item) => {
        if (orig_url != location.href) {//User has changed URL, so ID is no longer relevant
            console.log("Returning due to changed ID");
            return null;
        }
        let itemID = item?.itemID ?? id;
        const mv = misc?.market_value ?? 0;
        // console.log("ADD ITEM?? " + id + " " + mv);
        let avg = fixPrice(Number(item?.itemID ?? id ), Number(mv));
        //if (misc && String(misc.name).toLowerCase().includes("cache")) {
        //    avg = avg / 1.5; //Reduce value for caches to prevent shit popups
        //};
        console.log(misc);
        console.log("MARKET: " + mv);
        console.log("Intial AVG: " + avg);
        let rarity = "none";
        if (avg < 10 && item?.glowClass && ["glow-yellow", "glow-orange", "glow-red"].includes(item?.glowClass)) {
            switch (item?.glowClass) {
                case "glow-yellow": {
                    console.log("ITEM IS YELLOW");
                    rarity = "yellow";
                    avg = 20000000;
                    break;
                }
                case "glow-orange": {
                    console.log("ITEM IS ORANGE");
                    rarity = "orange";
                    avg = 80000000;
                    break;
                }
                case "glow-red": {
                    console.log("ITEM IS RED");
                    rarity = "red";
                    avg = 200000000;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        const quant = (item?.available ?? item?.total);
        const margin = (avg - (item?.price ?? item?.minPrice) ) * quant;
        const margin2 = ((avg * 1.05) - (item?.price ?? item?.minPrice) ) * quant;
        //console.log(margin2, margin, avg);
        let miscData = {...misc}; //Create a clone
        if (!avg || Number.isNaN(avg)) {
            return //We don't like this one
        }
        miscData.market_value = avg;
        if (!miscData?.name) {
            miscData.name = item?.itemName ?? "RW Item";
        }
        // console.log("SENDING CHEAP!");
        // console.log(item);
        // console.log({item, margin, misc: miscData, id: itemID, url: location.href});
        if (margin2 > -10000000) {
            console.log("Sending. Margin is sufficient");
            const url = `${base_url}/cheap`;
            const itemData = {item: item?.armouryID ? {name: item.itemName, ID: item.listingID, price: item.minPrice, available: item.total, armouryID: item.armouryID, ...item} : item, margin, misc: miscData, id: itemID, url: location.href, inList: items.length, rarity, market_price: avg, from: getUser()};
            GM.xmlHttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json' // Set the Content-Type header
                },
                onload: async function (response) {
                    const data = JSON.parse(response.responseText); //This is all items out of the batch that MATCH

                    //console.log(response);
                },
                onerror: function (error) {
                    console.error(error);
                },
                data: JSON.stringify(itemData)
            });
        }
        return (avg * quant) > 1000000 //value must be more than 1mil
    }

    const checkMug = (item, newQuantity) => {
        if (!item?.user) return; //Early return if it does not contain a user
        //Something sold, check if it's worth it!
        const quantity = item?.available ?? item?.total; //Old quantity from when it was listed / last checked
        const price = item?.price ?? item?.minPrice;
        const value = (quantity - newQuantity) * price;
        let itemID = Number(item?.itemID ?? id );
        console.log("Checking mug");
        if (newQuantity < quantity && !item.anonymous && value > minMug) {
            const url = `${base_url}/inactivemug`;
            if (item?.armoryID) {
                item.armouryID = item?.armoryID
            }
            console.log(item);
            const data = {item: item?.armouryID ? {ID: item.listingID, price: item.minPrice, available: item.total, armouryID: item.armouryID, ...item, name: item?.itemName && item.itemName != "undefined" ? item.itemName : misc?.name } : item, newQuantity, value, itemID, from: getUser() };
            data.item.name = item?.itemName && item.itemName != "undefined" ? item.itemName : misc?.name;
            console.log("SENDINGGGG", item.itemName, misc?.name, item?.itemName && item.itemName != "undefined" ? item.itemName : misc?.name);
            console.log(data);
            GM.xmlHttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json' // Set the Content-Type header
                },
                onload: async function (response) {
                    //console.log(response);
                },
                onerror: function (error) {
                    console.error(error);
                },
                data: JSON.stringify(data)
            });
        }
    }
    let subbed = false;

    const socketAddItem = (data) => {
        const listingId = data?.listingID ? data?.listingID : data?.ID;
        const index = items?.findIndex(item => item.listingID === listingId);
        if (index < 0 && (!data?.bonuses || data.bonuses.length > 0) || data.itemID === 651) {
            //Does not already exist
            const item = {...data, listingID: data?.listingID ? data?.listingID : data?.ID};
            let isGood = addItem(item);
            if (isGood) {
                console.log("ADDED ITEM");
                items?.push(item);
            }
        }

    }

    const socketUpdateItem = (data) => {
        const listingId = data?.listingID ? data?.listingID :data?.ID;

        if (data && data?.minPrice && !data?.bonuses) {
            //This is a category update
            const {minPrice, itemID} = data;

            const price = fixPrice(itemID, 0);
            const margin = price - minPrice;
            console.log("Sending cheap cat");
            const obj = {price: minPrice, id: itemID, value: price, margin};
            //console.log(obj);
            if (margin > 0) {
                const url = `${base_url}/cheapcat`;
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json' // Set the Content-Type header
                    },
                    onload: async function (response) {
                        const data = JSON.parse(response.responseText); //This is all items out of the batch that MATCH
                        if (data.shouldPopup) {
                            //We want to force focus

                            //updateTornMarketUrl( qbPrice, qbListId, qbQuantity) {
                            updateTornMarketUrl(data.item.price, data.item.ID, data.item.available);
                            window.focus();
                        }
                    },
                    onerror: function (error) {
                        console.error(error);
                    },
                    data: JSON.stringify(obj)
                });
            }
        } else {
            const index = items?.findIndex(item => item.listingID === listingId);
            if (index >= 0) {
                const item = items[index];
                if (data?.available) {
                    console.log("available");
                    const newItem = {...item, available: data.available};
                    const oldItem = items[index];
                    items?.splice(index, 1, newItem);
                    if (oldItem) checkMug(oldItem, data.available);
                }
                if (data?.price || data.minPrice) {
                    console.log("price");
                    const newItem = {...item, price: data.price };
                    if (item.minPrice) {
                        newItem.minPrice = data.price
                    }
                    items?.splice(index, 1, {...item, price: data.price});
                    console.log("Received price update");
                    addItem(newItem);
                }
            } else {
                //Get from server.
                const url = `${base_url}/item/${listingId}`;
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    onload: async function (response) {
                        console.log(response);
                        console.log("Fetched from server for UPDATE");
                        const data = JSON.parse(response.responseText);
                        if (data && data.listing) {
                            const item = data.listing;
                            if (data?.available) {
                                const newItem = {...item, available: data.available};
                                const oldItem = items[index];
                                items?.splice(index, 1, newItem);
                                if (oldItem) checkMug(oldItem, data.available);
                            }
                            if (data?.price) {
                                const newItem = {...item, price: data.price};
                                if (item.minPrice) {
                                    newItem.minPrice = data.price
                                }
                                items?.splice(index, 1, {...item, price: data.price});
                                console.log("Received price update");
                                addItem(newItem);
                            }
                        }
                    },
                    onerror: function (error) {
                        console.error(error);
                        alert("error");
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        }



    }

    const removeItem = (listingId) => {
        // const url = `${base_url}/item/${listingId}`;
        // GM.xmlHttpRequest({
        //     method: 'DELETE',
        //     url: url,
        //     onload: async function (response) {
        //     },
        //     onerror: function (error) {
        //         console.error(error);
        //         alert("error");
        //     },
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });
    }

    const socketRemoveItem = (data) => {
        const listingId = data?.listingID ? data?.listingID :data?.ID;
        removeItem(listingId);
        console.log("Removed item!");
        const index = items?.findIndex(item => item.listingID === listingId);
        if (index >= 0) {
            const oldItem = items[index];
            items?.splice(index, 1);
            if (oldItem) checkMug(oldItem, 0);
        } else {
            //Get from server.
            const url = `${base_url}/item/${listingId}`;
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: async function (response) {
                    console.log(response);
                    console.log("Success");
                    const data = JSON.parse(response.responseText);
                    const listing = {
                        armoryID: data.listing.uid,
                        ID: data.listing.listing_id,
                        itemName: data.listing.name,
                        price: data?.minPrice ?? data.listing.price,
                        available: 1,
                        itemID: data.listing.itemId,
                        user: data.listing.user,
                        faction: data.listing.faction,
                        ...data.listing,
                    }
                    if (data && data.listing) checkMug(listing, 0);
                    console.log(data);
                },
                onerror: function (error) {
                    console.error(error);
                    alert("error");
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
    }

    function watchSocket() {
        const originalSend = WebSocket.prototype.send;
        console.log("Starting to watch for socket changes");
        WebSocket.prototype.send = function(...args) {
            if (this.url.includes("wss://ws-centrifugo") && args[0].includes("item-market_")) {
                console.log("Subscribed to: " + args[0]);
                subbed = true;
                //console.log(this);
                this.addEventListener("message", (event) => {
                    //console.log("New data");
                    const res = JSON.parse(event.data);
                    const msg = res?.push?.pub?.data?.message;
                    if (msg) {
                        if ("action" in msg) {
                            const content = msg?.data;
                            if (msg.action === "remove") {
                                if (Array.isArray(content)) {
                                    content.forEach(item => socketRemoveItem(item));
                                } else {
                                    socketRemoveItem(content);
                                }
                            } else if (msg.action === "add") {
                                if (Array.isArray(content)) {
                                    content.forEach(item => socketAddItem(item));
                                } else {
                                    socketAddItem(content);
                                }
                            } else if (msg.action === "update") {
                                if (Array.isArray(content)) {
                                    content.forEach(item => socketUpdateItem(item));
                                } else {
                                    socketUpdateItem(content);
                                }
                            }
                        }

                    }

                });
            }
            return originalSend.call(this, ...args);
        };
    }
    watchSocket();

    setTimeout(() => {
        if (!subbed) {
            alert("Sub Failed");
        }
    }, 5000);

    const buildRequestBody = () => {
        // Extract the fragment part after the '#' in the URL
        const fragment = location.href.split('#')[1]; // E.g., 'market/view=category&categoryName=Primary&sortField=price&sortOrder=ASC&rarity=3&bonuses[0]=51&bonuses[1]=56'

        // Parse the fragment into key-value pairs
        const params = new URLSearchParams(fragment.split('?')[1] || fragment);

        // Build the request body
        const body = {
            type: params.get('categoryName') || null, // Map categoryName to type
            offset: 0, // Default offset
            sortField: params.get('sortField') || "price", // Default sortField
            sortOrder: params.get('sortOrder') || "ASC", // Default sortOrder
            rarity: params.has('rarity') ? parseInt(params.get('rarity')) : null, // Optional rarity
            bonuses: [] // Default bonuses array
        };

        // Extract bonuses parameters if present
        params.forEach((value, key) => {
            if (key.startsWith('bonuses[')) {
                body.bonuses.push(parseInt(value));
            }
        });

        // Remove null or empty values
        Object.keys(body).forEach(key => {
            if (body[key] === null || (Array.isArray(body[key]) && body[key].length === 0)) {
                delete body[key];
            }
        });

        return body;
    };

    const healthCheck = () => {
        console.log("----");
        console.log(unsafeWindow?.TornCore?.user?.playername);
        GM.xmlHttpRequest({
            method: 'POST',
            url: `${base_url}/heartbeat`,
            onload: async function (response) {
            },
            onerror: function (error) {
                console.error(error);
            },
            data: JSON.stringify({url: location.href, from: getUser()}),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const intervalHealth = setInterval(() => {
        healthCheck();
    }, 1000*60);
    setTimeout(() => healthCheck(), 2000);
})();
// ==UserScript==
// @name                 WOWS Obtained Loot Tracker
// @name:zh-CN           窝窝屎出货查询
// @version              1.3
// @match                https://armory.worldofwarships.com/*
// @match                https://armory.worldofwarships.asia/*
// @match                https://armory.worldofwarships.eu/*
// @namespace            https://github.com/FlandreCirno/WOWSArmoryLootboxScript
// @description          Check the drop table of selected lootbox in World of Warships Armory
// @description:zh-CN    窝窝屎军械库箱子掉落查询工具
// @run-at               document-start
// @grant                unsafeWindow
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/550492/WOWS%20Obtained%20Loot%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/550492/WOWS%20Obtained%20Loot%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const tld = hostname.split('.').pop();

    const urlData = "https://worldofwarships."+tld+"/papi/v1/container/?lang=";
    const urlInventory = "https://vortex.worldofwarships."+tld+"/api/inventory/";

    const lang = (navigator.language || navigator.userLanguage || 'en').startsWith('zh') ? 'zh' : 'en';
    const langBoxes = window.location.pathname.split('/').filter(Boolean)[0];
    
    const urlArmory = "https://armory.worldofwarships."+tld+"/"+langBoxes+"/category/community/5000001188/";

    const text = {
        allLootboxes: { en: "All Lootboxes", zh: "全部箱子" },
        ownedLootboxes: { en: "Owned Lootboxes", zh: "已拥有箱子" },
        overlayTitle: { en: "Custom Drop Table", zh: "箱子出货查询" },
        id: { en: "ID", zh: "编号" },
        mark: { en: "Name", zh: "箱子名称" },
        title: { en: "Custom Drop Table", zh: "箱子出货查询"  },
        tooltip: {
            en: 'Click a lootbox to view it in the Armory. If ships are not marked as obtained, click the Naval Community tab, scroll down, and click the "Custom Drop Table". Then it should show the correct obtained status on the items.',
            zh: '点击箱子名称查看出货列表以及已获得的物品，如果获取状态显示不正常，可以点击海军社区，向下滚动找到“箱子出货查询”，点击进入即可正常显示。'
        }
    };

    async function fetchJSON(url) {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
        return await response.json();
    }

    function storeSelectedId(id) {
        localStorage.setItem('WoWsContainerId', id);
    }

    function readId() {
        return localStorage.getItem('WoWsContainerId') || 5000001188;
    }

    function createTable(items) {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.textAlign = "center";
        table.style.fontSize = "14px";

        const header = document.createElement("tr");
        header.style.backgroundColor = "#444";
        header.style.color = "white";
        header.innerHTML = `<th>${text.id[lang]}</th><th>${text.mark[lang]}</th>`;
        table.appendChild(header);

        items.forEach(item => {
            const row = document.createElement("tr");
            row.style.cursor = "pointer";
            row.style.borderBottom = "1px solid #ddd";
            row.innerHTML = `<td>${item.id}</td><td>${item.mark}</td>`;
            row.onmouseover = () => row.style.backgroundColor = "#f0f0f0";
            row.onmouseout = () => row.style.backgroundColor = "white";
            row.onclick = () => {
                storeSelectedId(item.id);
                window.location.href = urlArmory;
            };
            table.appendChild(row);
        });

        return table;
    }

    async function init() {
        const allItems = await fetchJSON(urlData + langBoxes);
        const inventory = await fetchJSON(urlInventory);
        const containerInventory = Object.keys(inventory.data.lootboxes) || [];

        const allTable = createTable(allItems.items);
        const ownedTable = createTable(allItems.items.filter(i => containerInventory.includes(i.id)));

        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.backgroundColor = "white";
        container.style.border = "1px solid #aaa";
        container.style.padding = "10px";
        container.style.maxHeight = "70vh";
        container.style.overflowY = "auto";
        container.style.zIndex = 9999;
        container.style.borderRadius = "10px";
        container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        container.style.fontFamily = "Arial, sans-serif";

        // Title with tooltip
        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex";
        titleContainer.style.alignItems = "center";
        titleContainer.style.marginBottom = "10px";

        const title = document.createElement("div");
        title.textContent = text.overlayTitle[lang];
        title.style.fontWeight = "bold";
        title.style.fontSize = "16px";

        const infoIcon = document.createElement("span");
        infoIcon.textContent = "ℹ️";
        infoIcon.style.marginLeft = "5px";
        infoIcon.style.cursor = "pointer";

        // Show alert on click
        infoIcon.onclick = () => {
            alert(text.tooltip[lang]);
        };

        titleContainer.appendChild(title);
        titleContainer.appendChild(infoIcon);
        container.appendChild(titleContainer);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.marginBottom = "10px";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "5px";

        const allBtn = document.createElement("button");
        allBtn.textContent = text.allLootboxes[lang];
        const ownedBtn = document.createElement("button");
        ownedBtn.textContent = text.ownedLootboxes[lang];

        [allBtn, ownedBtn].forEach(btn => {
            btn.style.padding = "5px 10px";
            btn.style.border = "none";
            btn.style.borderRadius = "5px";
            btn.style.cursor = "pointer";
            btn.style.backgroundColor = "#0078d4";
            btn.style.color = "white";
            btn.onmouseover = () => btn.style.backgroundColor = "#005a9e";
            btn.onmouseout = () => btn.style.backgroundColor = "#0078d4";
        });

        buttonContainer.appendChild(ownedBtn);
        buttonContainer.appendChild(allBtn);
        container.appendChild(buttonContainer);

        allTable.style.display = "none";
        ownedTable.style.display = "table";

        container.appendChild(allTable);
        container.appendChild(ownedTable);
        document.body.appendChild(container);

        allBtn.onclick = () => {
            allTable.style.display = "table";
            ownedTable.style.display = "none";
        };
        ownedBtn.onclick = () => {
            allTable.style.display = "none";
            ownedTable.style.display = "table";
        };
    }

    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));

    let newdata = {
        "productId": null,
        "productCode": null,
        "externalProductId": null,
        "currency": "recruitment_points",
        "price": 3000,
        "originalPrice": null,
        "discount": null,
        "title": "",
        "description": null,
        "productContentDescription": null,
        "descriptionAdditional": null,
        "additionalInformation": null,
        "promoLabel": null,
        "images": null,
        "sizeInGrid": "1/3",
        "decoration": [],
        "disableAutoDescription": false,
        "promoTimerActiveTill": null,
        "entitlements": [{
            "type": "lootbox",
            "identifier": "4288861104",
            "amount": 1,
            "customTitle": null,
            "customDescription": null,
            "customisation": {},
            "isBonus": false,
            "isHidden": false,
            "tags": [],
            "sortOrder": 100,
            "isPrimary": true,
            "isUnique": false,
            "compensation": null
        }],
        "isHidden": false,
        "sizeInGridFeaturing": "1/4",
        "sortOrderFeaturing": 500,
        "clientPaymentMethods": null,
        "limitedQuantity": null,
        "couponCodes": null,
        "displayGroup": null,
        "customization": null,
        "showDiscountLabel": true,
        "disclaimer": null,
        "id": 5000001188,
        "name": "0109_Supercontainer_CTokens_Container",
        "type": null,
        "additionalPrice": null,
        "additionalCurrency": null,
        "labelNewActiveTill": null,
        "videoBackground": null,
        "entryVideo": null,
        "bundleCardHoverVideo": null,
        "bundleCardIdleVideo": null,
        "icons": {
            "web": "https://wows-ops-media.wgcdn.co/armory/images/0109_Supercontainer_CTokens_Container.d634c2278e34f884d459e9f6c9f88f29.png",
            "small": "https://wows-ops-media.wgcdn.co/armory/images/0109_Supercontainer_CTokens_Container.d634c2278e34f884d459e9f6c9f88f29.png",
            "medium": "https://wows-ops-media.wgcdn.co/armory/images/0109_Supercontainer_CTokens_Container_medium.60d9d94b865b63551826ed3883e5f70c.png",
            "big": "https://wows-ops-media.wgcdn.co/armory/images/0109_Supercontainer_CTokens_Container.d634c2278e34f884d459e9f6c9f88f29.png",
            "default": "https://wows-ops-media.wgcdn.co/armory/images/0109_Supercontainer_CTokens_Container_medium.60d9d94b865b63551826ed3883e5f70c.png"
        },
        "gallery": [],
        "isFullscreenGallery": false,
        "audioTrack": null,
        "audioHover": null,
        "backgroundColor": null,
        "bundleContentUnderlayColor": null,
        "denyTitleModification": false,
        "allowCompensation": false,
        "singlePurchaseMaxQuantity": null,
        "promoTimerActiveFrom": null,
        "showCountdown": false,
        "disablePortPreview": false,
        "serialPurchase": false,
        "dependentBundle": null,
        "nextBundle": null,
        "serialIndex": null,
        "serialSequence": [],
        "isValuableSerialBundle": false,
        "enableMultiplePurchase": null,
        "primaryId": 60703,
        "groupName": null,
        "groupIndex": null,
        "hideAdultCheck": null,
        "autoDescriptionSettings": {
            "isDisabled": false,
            "lootboxSettings": []
        },
        "hideAdditionalContent": null,
        "isSecretGift": false,
        "userPrerequisite": null
    }


    const pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    // Create proxy for metashop
    let originalMetashop = pageWindow.metashop || {};

    pageWindow.metashop = new Proxy(originalMetashop, {
        set: function(target, property, value) {
            console.log(`metashop.${property} =`, value);

            if (property === 'state') {
                // Create proxy for metashop.state
                const stateProxy = new Proxy(value, {
                    set: function(stateTarget, stateProp, stateValue) {
                        console.log(`metashop.state.${stateProp} =`, stateProp == 'content', stateValue, );

                        if (stateProp == 'content') {
                            try {
                                const targetPath = stateValue?.bundles;

                                if (targetPath) {
                                    newdata.title = text.title[lang];
                                    newdata.entitlements[0].identifier = "" + readId();
                                    console.log('Original:', targetPath['5000001188']);
                                    targetPath['5000001188'] = newdata;
                                    console.log('Modified:', targetPath['5000001188']);
                                }
                            } catch (e) {
                                console.warn('Failed to modify content:', e);
                            }
                        }

                        stateTarget[stateProp] = stateValue;
                        return true;
                    },

                    get: function(stateTarget, stateProp) {
                        return stateTarget[stateProp];
                    }
                });

                target[property] = stateProxy;
                return true;
            }

            target[property] = value;
            return true;
        },

        get: function(target, property) {
            return target[property];
        }
    });

    console.log('Custom Drop Table Loaded');

})();
// ==UserScript==
// @name         Torn Bazaar Filler
// @namespace    https://github.com/abbyh2199
// @version      1.1.3
// @description  On "Fill" click autofills bazaar item price with lowest market price currently minus $1 (can be customised), shows current price coefficient compared to 3rd lowest, fills max quantity for items, marks checkboxes for guns.
// @author       Oatshead [3487562]
// @license      MIT License
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563642/Torn%20Bazaar%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/563642/Torn%20Bazaar%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bazaarUrl = "https://api.torn.com/market/{itemId}?selections=bazaar&key={apiKey}&comment=BazaarFiller";
    const marketUrl = "https://api.torn.com/v2/market?id={itemId}&selections=itemMarket&key={apiKey}&comment=BazaarFiller";
    const itemUrl = "https://api.torn.com/torn/{itemId}?selections=items&key={apiKey}&comment=BazaarFiller";
    let priceDeltaRaw = localStorage.getItem("Oatshead-torn-bazaar-filler-price-delta") ?? '-1';
    let apiKey = localStorage.getItem("Oatshead-torn-bazaar-filler-apikey");

    try {
        GM_registerMenuCommand('Set Price Delta', setPriceDelta);
        GM_registerMenuCommand('Set Api Key', function() { checkApiKey(false); });
    } catch (error) {
        console.log('[TornBazaarFiller] Tampermonkey not detected!');
    }

    // TornPDA support for GM_addStyle
    let GM_addStyle = function (s) {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };

    GM_addStyle(`
        .btn-wrap.torn-bazaar-fill-qty-price{float:right;margin-left:auto;z-index:99999}
        .btn-wrap.torn-bazaar-clear-qty-price{z-index:99999}
        div.title-wrap div.name-wrap{display:flex;justify-content:flex-end}
        .wave-animation{position:relative;overflow:hidden}
        .wave{pointer-events:none;position:absolute;width:100%;height:33px;background-color:transparent;opacity:0;transform:translateX(-100%);animation:waveAnimation 1s cubic-bezier(0, 0, 0, 1)}
        @keyframes waveAnimation{0%{opacity:1;transform:translateX(-100%)}100%{opacity:0;transform:translateX(100%)}}
        .overlay-percentage{position:absolute;top:0;background-color:rgba(0, 0, 0, 0.9);padding:0 5px;border-radius:15px;font-size:10px}
        .overlay-percentage-add{right:-30px}
        .overlay-percentage-manage{right:0}
        .torn-bazaar-update-all-btn { margin-left: 10px; cursor: pointer; color: #fff; background: linear-gradient(180deg,#60972a 0,#427016 100%); border: 1px solid #60972a; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 12px; }
        .torn-bazaar-update-all-btn:hover { background: #427016; }
        .torn-bazaar-update-all-btn:disabled { opacity: 0.7; cursor: wait; }
    `);

    const pages = { "AddItems": 10, "ManageItems": 20};
    const addItemsLabels = ["Fill", "Clear"];
    const updateItemsLabels = ["Update", "Clear"];

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;

    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };

    const observer = new MutationObserver(function(mutations) {
        let mutation = mutations[0].target;
        // Expanded observer trigger to catch lazy loading scroll events
        if (mutation.classList.contains("items-cont") || 
            mutation.className.indexOf("core-layout___") > -1 || 
            mutation.classList.contains('ReactVirtualized__Grid__innerScrollContainer') || 
            mutation.tagName === "UL" || 
            mutation.tagName === "LI" ||
            mutation.className.indexOf("row___") > -1) {
            
            // Re-attach observer triggers
            $("ul.ui-tabs-nav").off("click").on("click", "li:not(.ui-state-active):not(.ui-state-disabled):not(.m-show)", function() {
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___] a[aria-labelledby=add-items]").off("click").on("click", function(){
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___] a[aria-labelledby=manage-items]").off("click").on("click", function(){
                observer.observe(observerTarget, observerConfig);
            });

            // --- ADD ITEMS PAGE LOGIC ---
            let containerItems = $("ul.items-cont");
            if (containerItems.length > 0) {
                 containerItems.find(".name-wrap").each(function(){
                    let parentRow = $(this).closest('li');
                    let isParentRowDisabled = parentRow.hasClass("disabled");
                    
                    let alreadyHasFillBtn = this.querySelector(".btn-wrap.torn-bazaar-fill-qty-price") != null;
                    
                    if (!alreadyHasFillBtn && !isParentRowDisabled){
                        if($(this).closest('.image-wrap').length === 0) { 
                             insertFillAndWaveBtn(this, addItemsLabels, pages.AddItems);
                        }
                    }
                });
            }

            // --- MANAGE ITEMS PAGE LOGIC ---
            let containerItemsManage = $("div[class*=row___]");
            if (containerItemsManage.length > 0) {
                insertUpdateAllButton();

                containerItemsManage.find("div[class*=item___]").each(function(){
                    let targetContainer = this.querySelector("div[class*=desc___]") || this.querySelector("div[class*=name___]");
                    
                    if (targetContainer) {
                        let alreadyHasUpdateBtn = targetContainer.querySelector(".btn-wrap.torn-bazaar-fill-qty-price") != null;
                        if (!alreadyHasUpdateBtn) {
                            insertFillAndWaveBtn(targetContainer, updateItemsLabels, pages.ManageItems);
                        }
                    }
                });
            }
        }
    });
    
    if(observerTarget) {
        observer.observe(observerTarget, observerConfig);
    }

    function insertUpdateAllButton() {
        let headerArea = $("div[class*=topSection___] div[class*=linksContainer___]"); 
        if (headerArea.length === 0) headerArea = $("div[class*=sortableHeader___]");

        if (headerArea.length > 0 && $(".torn-bazaar-update-all-btn").length === 0) {
            let btn = document.createElement("button");
            btn.className = "torn-bazaar-update-all-btn";
            btn.innerText = "Update Visible";
            btn.onclick = function(e) {
                e.preventDefault();
                updateAllItems();
            };
            headerArea.append(btn);
        }
    }

    function updateAllItems() {
        // Only select buttons currently in the DOM
        let updateButtons = document.querySelectorAll(".torn-bazaar-fill-qty-price input[value='Update']");
        
        if (updateButtons.length === 0) {
            alert("No visible items found to update.\n\nTorn lazy-loads items. Please scroll down to load more items, then click this button again.");
            return;
        }

        if (!confirm(`Update ${updateButtons.length} visible items?\n\n(Note: If you have more items, wait for this to finish, then scroll down and click again.)`)) return;

        let index = 0;
        let btn = document.querySelector(".torn-bazaar-update-all-btn");
        let originalText = btn ? btn.innerText : "Update Visible";
        
        if(btn) btn.disabled = true;

        function processNext() {
            if (index < updateButtons.length) {
                if(btn) btn.innerText = `Updating ${index + 1}/${updateButtons.length}...`;
                
                // Ensure element still exists and click
                if(document.body.contains(updateButtons[index])) {
                    updateButtons[index].click();
                }
                
                index++;
                // 750ms delay = approx 80 requests/min. Safe zone for Torn API (100 req/min limit).
                setTimeout(processNext, 750); 
            } else {
                if(btn) {
                    btn.innerText = "Done! Scroll for more.";
                    btn.disabled = false;
                    setTimeout(() => { btn.innerText = originalText; }, 3000);
                }
            }
        }
        processNext();
    }

    function insertFillAndWaveBtn(element, buttonLabels, pageType){
        const waveDiv = document.createElement('div');
        waveDiv.className = 'wave';

        const outerSpanFill = document.createElement('span');
        outerSpanFill.className = 'btn-wrap torn-bazaar-fill-qty-price';
        const outerSpanClear = document.createElement('span');
        outerSpanClear.className = 'btn-wrap torn-bazaar-clear-qty-price';

        const innerSpanFill = document.createElement('span');
        innerSpanFill.className = 'btn';
        const innerSpanClear = document.createElement('span');
        innerSpanClear.className = 'btn';
        innerSpanClear.style.display = 'none';

        const inputElementFill = document.createElement('input');
        inputElementFill.type = 'button';
        inputElementFill.value = buttonLabels[0];
        inputElementFill.className = 'torn-btn';
        const inputElementClear = document.createElement('input');
        inputElementClear.type = 'button';
        inputElementClear.value = buttonLabels[1];
        inputElementClear.className = 'torn-btn';

        innerSpanFill.appendChild(inputElementFill);
        innerSpanClear.appendChild(inputElementClear);
        outerSpanFill.appendChild(innerSpanFill);
        outerSpanClear.appendChild(innerSpanClear);

        element.append(outerSpanFill, outerSpanClear, waveDiv);

        switch(pageType) {
            case pages.AddItems:
                $(outerSpanFill).on("click", "input", function(event) {
                    checkApiKey();
                    this.parentNode.style.display = "none";
                    fillQuantityAndPrice(this, pageType);
                    event.stopPropagation();
                });

                $(outerSpanClear).on("click", "input", function(event) {
                    this.parentNode.style.display = "none";
                    clearQuantityAndPrice(this);
                    event.stopPropagation();
                });
                break;
            case pages.ManageItems:
                $(outerSpanFill).on("click", "input", function(event) {
                    checkApiKey();
                    updatePrice(this);
                    event.stopPropagation();
                });
                break;
        }
    }

    function insertPercentageSpan(element){
        let moneyGroupDiv = element.querySelector("div.price div.input-money-group");

        if (moneyGroupDiv.querySelector("span.overlay-percentage") === null) {
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'overlay-percentage overlay-percentage-add';
            moneyGroupDiv.appendChild(percentageSpan);
        }

        return moneyGroupDiv.querySelector("span.overlay-percentage");
    }

    function insertPercentageManageSpan(element){
        let moneyGroupDiv = element.querySelector("div.input-money-group");

        if (moneyGroupDiv && moneyGroupDiv.querySelector("span.overlay-percentage") === null) {
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'overlay-percentage overlay-percentage-manage';
            moneyGroupDiv.appendChild(percentageSpan);
        }

        return moneyGroupDiv ? moneyGroupDiv.querySelector("span.overlay-percentage") : null;
    }

    function fillQuantityAndPrice(element, pageType){
        let parentLi = $(element).closest('li')[0];
        let amountDiv = parentLi.querySelector("div.amount-main-wrap");
        
        if(!amountDiv) {
             amountDiv = element.closest('.row-wrap').querySelector("div.amount-main-wrap");
        }

        let priceInputs = amountDiv.querySelectorAll("div.price div input");
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let image = parentLi.querySelector("div.image-wrap img");
        if (!image) image = $(element).closest('.row-wrap').find("div.image-wrap img")[0];

        let numberPattern = /\/(\d+)\//;
        let match = image ? image.src.match(numberPattern) : null;
        let extractedItemId = 0;
        if (match) {
            extractedItemId = parseInt(match[1], 10);
        } else {
            console.error("[TornBazaarFiller] ItemId not found!");
            return;
        }

        let requestUrl = priceDeltaRaw.indexOf('[market]') != -1 ? itemUrl : marketUrl;
        requestUrl = requestUrl
            .replace("{itemId}", extractedItemId)
            .replace("{apiKey}", apiKey);

        let wave = element.closest('div.name-wrap').querySelector("div.wave");
        
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("Oatshead-torn-bazaar-filler-apikey", null);
                wave.style.backgroundColor = "red";
                wave.style.animationDuration = "5s";
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            let lowBallPrice = Number.MAX_VALUE;
            if (priceDeltaRaw.indexOf('[market]') != -1) {
                let priceDelta = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
                let price = data.items[extractedItemId].market_value;
                lowBallPrice = Math.round(performOperation(price, priceDelta));
            } else {
                let price = 999_999_999;
                if (data.itemmarket.listings[0].price == null){
                    console.warn("[TornBazaarFiller] The API is temporarily disabled, please try again later");
                }
                
                let priceListings = data.itemmarket.listings;
                let bazaarSlotOffset = priceDeltaRaw.indexOf('[') == -1 ? 0 : parseInt(priceDeltaRaw.substring(priceDeltaRaw.indexOf('[') + 1, priceDeltaRaw.indexOf(']')));
                let priceDeltaWithoutBazaarOffset = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
                lowBallPrice = Math.round(performOperation(priceListings[Math.min(bazaarSlotOffset, priceListings.length - 1)].price, priceDeltaWithoutBazaarOffset));
                
                let price3rd = priceListings[Math.min(2, priceListings.length - 1)].price;
                let priceCoefficient = ((lowBallPrice / price3rd) * 100).toFixed(0);
                let percentageOverlaySpan = insertPercentageSpan(amountDiv);
                
                if (priceCoefficient <= 95){
                    percentageOverlaySpan.style.display = "block";
                    if (priceCoefficient <= 50){
                        percentageOverlaySpan.style.color = "red";
                        wave.style.backgroundColor = "red";
                        wave.style.animationDuration = "5s";
                    } else if (priceCoefficient <= 75){
                        percentageOverlaySpan.style.color = "yellow";
                        wave.style.backgroundColor = "yellow";
                        wave.style.animationDuration = "3s";
                    } else {
                        percentageOverlaySpan.style.color = "green";
                        wave.style.backgroundColor = "green";
                    }
                    percentageOverlaySpan.innerText = priceCoefficient + "%";
                } else {
                    percentageOverlaySpan.style.display = "none";
                    wave.style.backgroundColor = "green";
                }
            }

            priceInputs[0].value = lowBallPrice;
            priceInputs[1].value = lowBallPrice;
            priceInputs[0].dispatchEvent(inputEvent);

            let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
            if (isQuantityCheckbox){
                amountDiv.querySelector("div.amount.choice-container input").click();
            } else {
                let quantityInput = amountDiv.querySelector("div.amount input");
                quantityInput.value = getQuantity(element, pageType);
                quantityInput.dispatchEvent(keyupEvent);
            }
        })
            .catch(error => {
            wave.style.backgroundColor = "red";
            wave.style.animationDuration = "5s";
            console.error("[TornBazaarFiller] Error fetching data:", error);
        })
            .finally(() => {
            element.parentNode.parentNode.parentNode.querySelector("span.btn-wrap.torn-bazaar-clear-qty-price span.btn").style.display = "inline-block";
        });
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
        wave.style.backgroundColor = "transparent";
        wave.style.animationDuration = "1s";
    }

    function updatePrice(element){
        let moneyGroupDiv;
        let parentNode4 = element.parentNode.parentNode.parentNode.parentNode;
        
        if (isMobileView){
            if (parentNode4.querySelector("[class*=menuActivators___] button[class*=iconContainer___][aria-label=Manage] span[class*=active___]") == null) {
                let manageBtn = parentNode4.querySelector("[class*=menuActivators___] button[class*=iconContainer___][aria-label=Manage]");
                if(manageBtn) manageBtn.click();
            }
            moneyGroupDiv = parentNode4.parentNode.querySelector("[class*=bottomMobileMenu___] [class*=priceMobile___]");
        } else {
            let row = $(element).closest('div[class*=row___]')[0];
            moneyGroupDiv = row.querySelector("div[class*=price___]");
        }
        
        if(!moneyGroupDiv) {
             console.error("Could not find money input group");
             return;
        }

        let priceInputs = moneyGroupDiv.querySelectorAll("div.input-money-group input");
        let inputEvent = new Event("input", {bubbles: true});

        let image = $(element).closest('div[class*=row___]').find("div[class*=imgContainer___] img")[0];
        let extractedItemId = getItemIdFromImage(image);

        let requestUrl = priceDeltaRaw.indexOf('[market]') != -1 ? itemUrl : marketUrl;
        requestUrl = requestUrl
            .replace("{itemId}", extractedItemId)
            .replace("{apiKey}", apiKey);

        let wave = element.closest('.wave-animation') ? element.closest('.wave-animation').querySelector("div.wave") : element.parentElement.parentElement.querySelector("div.wave");
        
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("Oatshead-torn-bazaar-filler-apikey", null);
                if(wave) {
                    wave.style.backgroundColor = "red";
                    wave.style.animationDuration = "5s";
                }
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            let lowBallPrice = Number.MAX_VALUE;
            if (priceDeltaRaw.indexOf('[market]') != -1) {
                let priceDelta = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
                let price = data.items[extractedItemId].market_value;
                lowBallPrice = Math.round(performOperation(price, priceDelta));
            } else {
                let price = 999_999_999;
                if (data.itemmarket.listings[0].price == null){
                    console.warn("[TornBazaarFiller] The API is temporarily disabled, please try again later");
                }
                
                let priceListings = data.itemmarket.listings;
                let bazaarSlotOffset = priceDeltaRaw.indexOf('[') == -1 ? 0 : parseInt(priceDeltaRaw.substring(priceDeltaRaw.indexOf('[') + 1, priceDeltaRaw.indexOf(']')));
                let priceDeltaWithoutBazaarOffset = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
                lowBallPrice = Math.round(performOperation(priceListings[Math.min(bazaarSlotOffset, priceListings.length - 1)].price, priceDeltaWithoutBazaarOffset));
                
                let price3rd = priceListings[Math.min(2, priceListings.length - 1)].cost; 
                if(!price3rd) price3rd = priceListings[Math.min(2, priceListings.length - 1)].price;

                let priceCoefficient = ((lowBallPrice / price3rd) * 100).toFixed(0);
                let percentageOverlaySpan = insertPercentageManageSpan(moneyGroupDiv);
                
                if (percentageOverlaySpan && priceCoefficient <= 95){
                    percentageOverlaySpan.style.display = "block";
                    if (priceCoefficient <= 50){
                        percentageOverlaySpan.style.color = "red";
                        if(wave) {
                            wave.style.backgroundColor = "red";
                            wave.style.animationDuration = "5s";
                        }
                    } else if (priceCoefficient <= 75){
                        percentageOverlaySpan.style.color = "yellow";
                        if(wave) {
                            wave.style.backgroundColor = "yellow";
                            wave.style.animationDuration = "3s";
                        }
                    } else {
                        percentageOverlaySpan.style.color = "green";
                        if(wave) wave.style.backgroundColor = "green";
                    }
                    percentageOverlaySpan.innerText = priceCoefficient + "%";
                } else if (percentageOverlaySpan) {
                    percentageOverlaySpan.style.display = "none";
                    if(wave) wave.style.backgroundColor = "green";
                }
            }

            priceInputs[0].value = lowBallPrice;
            priceInputs[1].value = lowBallPrice;
            priceInputs[0].dispatchEvent(inputEvent);
        })
            .catch(error => {
            if(wave) {
                wave.style.backgroundColor = "red";
                wave.style.animationDuration = "5s";
            }
            console.error("[TornBazaarFiller] Error fetching data:", error);
        });
        
        if(wave) {
            wave.style.animation = 'none';
            wave.offsetHeight;
            wave.style.animation = null;
            wave.style.backgroundColor = "transparent";
            wave.style.animationDuration = "1s";
        }
    }

    function clearQuantityAndPrice(element){
        let parentLi = $(element).closest('li')[0];
        let amountDiv = parentLi.querySelector("div.amount-main-wrap");
        if(!amountDiv) amountDiv = $(element).closest('.row-wrap').find("div.amount-main-wrap")[0];

        let priceInputs = amountDiv.querySelectorAll("div.price div input");
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let wave = element.closest('div.name-wrap').querySelector("div.wave");
        wave.style.backgroundColor = "white";

        let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
        if (isQuantityCheckbox){
            amountDiv.querySelector("div.amount.choice-container input").click();
        } else {
            let quantityInput = amountDiv.querySelector("div.amount input");
            quantityInput.value = "";
            quantityInput.dispatchEvent(keyupEvent);
        }

        priceInputs[0].value = "";
        priceInputs[1].value = "";
        priceInputs[0].dispatchEvent(inputEvent);

        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;

        element.parentNode.parentNode.parentNode.querySelector("span.btn-wrap.torn-bazaar-fill-qty-price span.btn").style.display = "inline-block";
    }

    function getQuantity(element, pageType){
        let rgx = /x(\d+)$/;
        let rgxMobile = /^x(\d+)/
        let quantityText = 0;
        switch(pageType){
            case pages.AddItems:
                let parentLi = $(element).closest('li');
                quantityText = parentLi.text();
                if(quantityText.trim() === "") quantityText = $(element).closest('.name-wrap').text();
                break;
            case pages.ManageItems:
                quantityText = element.parentNode.parentNode.parentNode.querySelector("span").innerText;
                break;
        }
        let match = isMobileView ? rgxMobile.exec(quantityText) : rgx.exec(quantityText);
        let quantity = match === null ? 1 : match[1];
        return quantity;
    }

    function getItemIdFromImage(image){
        let numberPattern = /\/(\d+)\//;
        if(!image) return 0;
        let match = image.src.match(numberPattern);
        if (match) {
            return parseInt(match[1], 10);
        } else {
            console.error("[TornBazaarFiller] ItemId not found!");
        }
    }

    function performOperation(number, operation) {
        const match = operation.match(/^([-+]?)(\d+(?:\.\d+)?)(%)?$/);

        if (!match) {
            throw new Error('Invalid operation string');
        }

        const [, operator, operand, isPercentage] = match;
        const operandValue = parseFloat(operand);

        const adjustedOperand = isPercentage ? (number * operandValue) / 100 : operandValue;

        switch (operator) {
            case '':
            case '+':
                return number + adjustedOperand;
            case '-':
                return number - adjustedOperand;
            default:
                throw new Error('Invalid operator');
        }
    }

    function setPriceDelta() {
        let userInput = prompt('Enter price delta formula (default: -1):', priceDeltaRaw);
        if (userInput !== null) {
            priceDeltaRaw = userInput;
            localStorage.setItem("Oatshead-torn-bazaar-filler-price-delta", userInput);
        } else {
            console.error("[TornBazaarFiller] User cancelled the Price Delta input.");
        }
    }

    function checkApiKey(checkExisting = true) {
        if (!checkExisting || apiKey === null || apiKey.length != 16){
            let userInput = prompt("Please enter a PUBLIC Api Key, it will be used to get current bazaar prices:", apiKey ?? '');
            if (userInput !== null && userInput.length == 16) {
                apiKey = userInput;
                localStorage.setItem("Oatshead-torn-bazaar-filler-apikey", userInput);
            } else {
                console.error("[TornBazaarFiller] User cancelled the Api Key input.");
            }
        }
    }
})();
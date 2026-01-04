// ==UserScript==
// @name         [银河奶牛]自动填充强化数据
// @name:en      [MWI]Auto fill enhancement data
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  从本地自动填充强化数据
// @description:en Auto fill enhancement data from local
// @author       jhd32
// @license      MIT
// @match        https://test.milkywayidle.com/game*
// @match        https://www.milkywayidle.com/game*
// @match        https://test.milkywayidlecn.com/game*
// @match        https://www.milkywayidlecn.com/game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553378/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%BC%BA%E5%8C%96%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/553378/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%BC%BA%E5%8C%96%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const xpaths = {
        primaryItem:`//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div[2]/div/div/div[1]/div[1]/div[1]/div[contains(@class, "ItemSelector_itemSelector__2eTV6")]`,
        maxLevelInput:`//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div[2]/div/div/div[1]/div[2]/div[2]/div/input`,
        protItem:`//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div[2]/div/div/div[1]/div[3]/div[2]/div/div`,
        minLevelInput:`//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div[2]/div/div/div[1]/div[4]/div/div/input`,
    }

    let lastItemName = "";
    let isEnhancingPage = false;
    const isChinese = localStorage.getItem("i18nextLng") != "en"

    const texts = {
        saveButton: isChinese ? "保存" : "SAVE",
        afButton: isChinese ? "填充" : "FILL",
        messageSaved: isChinese ? "已保存到本地" : "Settings saved!",
        messageFilled: isChinese ? "数据已填充" : "Data filled!",
        messageNotFound: isChinese ? "未找到本地数据" : "No saved settings found",
        pageError: isChinese ? "请切换到强化页面" : "Pls switch to enhancing page",
        selectProtItemError: isChinese ? "选择保护材料时发生错误" : "select prot item error",
        protNumNotEnough: isChinese ? "保护材料数量不足" : "Lack of prot num",
        initMessage: isChinese ? "数据已初始化" : "Init enhancement data"

    };

    initData();

    function checkEnhancingTab(){
        const tabContainer = document.querySelector(".EnhancingPanel_enhancingPanel__ysWpV").querySelector(".MuiTabs-flexContainer");
        const childNodes = tabContainer.childNodes;
        if(childNodes[0].getAttribute("aria-selected") == "false"){
            showMessage(texts.pageError);
            return false;
        }
        return true;
    }

    function addButtons(){
        if(document.querySelector("#autoFill")){
            return;
        }
        function createButton(id, text) {
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = text;

            btn.style.background = 'linear-gradient(135deg, rgb(69,71,113) 0%, rgb(89,91,143) 100%)';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.padding = '8px 4px';
            btn.style.fontSize = '0.7rem';
            btn.style.fontWeight = '600';
            btn.style.cursor = 'pointer';
            btn.style.marginRight = '4px';
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            btn.style.transition = 'all 0.2s ease';
            btn.style.letterSpacing = '0.5px';

            btn.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgb(79,81,133) 0%, rgb(99,101,163) 100%)';
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgb(69,71,113) 0%, rgb(89,91,143) 100%)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            });

            btn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(1px)';
                this.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });

            return btn;
        }

        const afButton = createButton("autoFill", texts.afButton);
        afButton.onclick = autoFill;
        const saveButton = createButton("saveToLocal", texts.saveButton);
        saveButton.onclick = saveEnhancingInfo;

        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '12px';
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '8px';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.alignItems = 'center';

        btnContainer.appendChild(afButton);
        btnContainer.appendChild(saveButton);

        const insertNode = document.querySelector('.EnhancingPanel_enhancingPanel__ysWpV').querySelector(".SkillActionDetail_notes__2je2F > div");
        insertNode.parentNode.insertBefore(btnContainer, insertNode.nextSibling);
    }

    function saveEnhancingInfo(){
        if(!checkEnhancingTab()){
            showMessage(texts.pageError);
            return;
        }
        const SELECTORS = {
            empty: "ItemSelector_empty__2GVYD",
        };
        
        const itemName = getItemName(document.evaluate(xpaths.primaryItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);

        const targetLevelInputNode = document.evaluate(xpaths.maxLevelInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(!targetLevelInputNode){
            return;
        }
        const targetLevel = targetLevelInputNode.value;

        const protItemNode = document.evaluate(xpaths.protItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(protItemNode.classList.contains(SELECTORS.empty)){
            saveToLocal(itemName, targetLevel, "", "");
            showMessage(texts.messageSaved);
            return;
        }
        const protName = getItemName(protItemNode);

        const protLevelNode = document.evaluate(xpaths.minLevelInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const protLevel = protLevelNode.value;
        saveToLocal(itemName, targetLevel, protName, protLevel);
        showMessage(texts.messageSaved);
    }

    function saveToLocal(itemName, targetLevel, protName, protLevel){
        const localData = JSON.parse(localStorage.getItem("autoFillEnhancementData")) || {};
        localData[itemName] = {
            targetLevel:targetLevel,
            protName:protName,
            protLevel:protLevel,
        }
        localStorage.setItem("autoFillEnhancementData", JSON.stringify(localData));
    }

    async function autoFill(){
        if(!checkEnhancingTab()){
            showMessage(texts.pageError);
            return;
        }

        const itemName = getItemName(document.evaluate(xpaths.primaryItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
        const enhancingInfo = getEnhancingInfoFromLocal(itemName);
        if(!enhancingInfo){
            showMessage(texts.messageNotFound);
            return;
        }
        const targetLevelInputNode = document.evaluate(xpaths.maxLevelInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(!targetLevelInputNode){
            return;
        }
        await simulateInput(enhancingInfo.targetLevel, targetLevelInputNode);

        const selectResult = await selectProtMat(enhancingInfo.protName);
        if(!selectResult){
            return;
        }

        if(enhancingInfo.protName){
            const protLevelInputNode = document.evaluate(xpaths.minLevelInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if(!protLevelInputNode){
                return;
            }
            await simulateInput(enhancingInfo.protLevel, protLevelInputNode);
        }
        
        showMessage(texts.messageFilled);
    }



    async function selectProtMat(protName) {
        const SELECTORS = {
            itemContainer: ".ItemSelector_itemContainer__3olqe",
            empty: "ItemSelector_empty__2GVYD",
            itemList: ".ItemSelector_itemList__Qa5lq",
            removeButton: ".ItemSelector_removeButton__3i8Lj",
            enhancementLevel: ".Item_enhancementLevel__19g-e",
            clickable: ".Item_clickable__3viV6"
        };

        try {
            let protItemSlot = document.evaluate(xpaths.protItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!protItemSlot) {
                return false;
            }

            const isSlotEmpty = protItemSlot.classList.contains(SELECTORS.empty);

            const itemName = getItemName(protItemSlot);
            if(itemName == protName){
                return true;
            }

            protItemSlot.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            protItemSlot = document.evaluate(xpaths.protItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const itemListNode = document.querySelector(SELECTORS.itemList);
            if (!itemListNode) {
                return false;
            }

            if (!protName) {
                if (isSlotEmpty) {
                    protItemSlot.click();
                } else {
                    const removeBtn = itemListNode.querySelector(SELECTORS.removeButton);
                    if (removeBtn) {
                        removeBtn.click();
                    }
                }
                showMessage(texts.messageFilled);
                return true;
            }

            const items = itemListNode.querySelectorAll(SELECTORS.itemContainer);
            for (let item of items) {
                const itemName = getItemName(item);
                if(!itemName || itemName !== protName) continue;

                if (item.querySelector(SELECTORS.enhancementLevel) || !item.querySelector(SELECTORS.clickable)) {
                    protItemSlot.click();
                    showMessage(texts.protNumNotEnough);
                    break;
                }

                item.querySelector(SELECTORS.clickable).click();
                showMessage(texts.messageFilled);
                return true;
            }

            protItemSlot.click();
            return false;
        } catch (error) {
            showMessage(texts.selectProtItemError);
            console.log(error);
            return false;
        }
    }

    async function simulateInput(value, inputNode){
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

        nativeInputValueSetter.call(inputNode, value);

        inputNode.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function getEnhancingInfoFromLocal(itemName){
        const localData = JSON.parse(localStorage.getItem("autoFillEnhancementData")) || {};
        const enhancingInfo = localData[itemName];
        if(!enhancingInfo){
            return;
        }
        return enhancingInfo;
    }

    function showMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-50%)';
        messageEl.style.background = 'rgba(0, 0, 0, 0.8)';
        messageEl.style.color = 'white';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '4px';
        messageEl.style.zIndex = '10000';
        messageEl.style.fontSize = '14px';
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s';

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }



    function getTargetNode(addedNode) {
        const targetClass = "ItemSelector_itemSelector__2eTV6";
        if(addedNode.classList?.contains(targetClass) || addedNode.querySelector?.(`.${targetClass}`)){
            const primaryItem = document.evaluate(xpaths.primaryItem, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if(primaryItem){
                if(primaryItem.classList.length == 1){
                    return primaryItem;
                }
                
            }
        }
        return null;
    }

    function checkPage(node, action){
        if(node.querySelector(".EnhancingPanel_enhancingPanel__ysWpV")){
            if(action == "add"){
                isEnhancingPage = true;
            }else{
                lastItemName = "";
                isEnhancingPage = false;
            }
        }
    }

    function getItemName(slotNode){
        const useNode = slotNode.querySelector("use");
        if(!useNode){
            return null;
        }
        return useNode.getAttribute("href").split('#').pop();
    }


    const observer1 = new MutationObserver((mutations) => {
        for(const mutation of mutations){
            if(mutation.type != "childList"){
                continue;
            }
            for(const removedNode of mutation.removedNodes){
                if(removedNode.nodeType != Node.ELEMENT_NODE){
                    continue;
                }
                checkPage(removedNode, "remove");
            }
            let targetNode;
            for(const addedNode of mutation.addedNodes){
                if(addedNode.nodeType != Node.ELEMENT_NODE){
                    continue;
                }
                checkPage(addedNode, "add");
                targetNode = getTargetNode(addedNode);
            }
            if(targetNode){
                addButtons();
                const itemName = getItemName(targetNode);
                if(itemName && itemName != lastItemName){
                    lastItemName = itemName;
                    autoFill();
                }
            }
        }
    });

    observer1.observe(document.body, {
        childList: true,
        subtree: true
    });

    function initData(){
        const localData = localStorage.getItem("autoFillEnhancementData");
        if(localData){
            return;
        }
        const initDict = {
            "spiked_bulwark": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "stalactite_shard"
            },
            "werewolf_slasher": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "werewolf_claw"
            },
            "griffin_bulwark": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "griffin_talon"
            },
            "vampiric_bow": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "vampire_fang"
            },
            "cursed_bow": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "cursed_ball"
            },
            "holy_bulwark": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_bulwark"
            },
            "stalactite_spear": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "stalactite_shard"
            },
            "granite_bludgeon": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "living_granite"
            },
            "furious_spear": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "regal_sword": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "chaotic_flail": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "chaotic_chain"
            },
            "soul_hunter_crossbow": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "soul_fragment"
            },
            "sundering_crossbow": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "frost_staff": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "frost_sphere"
            },
            "infernal_battlestaff": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "infernal_ember"
            },
            "jackalope_staff": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "jackalope_antler"
            },
            "rippling_trident": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "blooming_trident": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "blazing_trident": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_sword": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_sword"
            },
            "holy_spear": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_spear"
            },
            "holy_mace": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_mace"
            },
            "eye_watch": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "eye_of_the_watcher"
            },
            "snake_fang_dirk": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "snake_fang"
            },
            "vision_shield": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "magnifying_glass"
            },
            "vampire_fang_dirk": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "vampire_fang"
            },
            "knights_aegis": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "knights_ingot"
            },
            "treant_shield": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "treant_bark"
            },
            "manticore_shield": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "manticore_sting"
            },
            "tome_of_healing": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "tome_of_healing"
            },
            "tome_of_the_elements": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "tome_of_the_elements"
            },
            "watchful_relic": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "eye_of_the_watcher"
            },
            "bishops_codex": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "bishops_scroll"
            },
            "holy_buckler": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_buckler"
            },
            "sinister_cape": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "chimerical_quiver": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "mirror_of_protection"
            },
            "enchanted_cloak": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "red_culinary_hat": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "red_panda_fluff"
            },
            "snail_shell_helmet": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "snail_shell"
            },
            "vision_helmet": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "goggles"
            },
            "fluffy_red_hat": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "red_panda_fluff"
            },
            "corsair_helmet": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "corsair_crest"
            },
            "acrobatic_hood": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "acrobats_ribbon"
            },
            "magicians_hat": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "magicians_cloth"
            },
            "holy_helmet": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_helmet"
            },
            "dairyhands_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "foragers_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "lumberjacks_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "cheesemakers_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "crafters_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "tailors_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "chefs_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "brewers_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "alchemists_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "enhancers_top": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "gator_vest": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "gator_vest"
            },
            "turtle_shell_body": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "turtle_shell"
            },
            "colossus_plate_body": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "colossus_core"
            },
            "demonic_plate_body": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "demonic_core"
            },
            "anchorbound_plate_body": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "damaged_anchor"
            },
            "maelstrom_plate_body": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "maelstrom_plating"
            },
            "marine_tunic": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "marine_scale"
            },
            "revenant_tunic": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "revenant_anima"
            },
            "griffin_tunic": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "griffin_leather"
            },
            "kraken_tunic": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "kraken_leather"
            },
            "icy_robe_top": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "icy_cloth"
            },
            "flaming_robe_top": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "flaming_cloth"
            },
            "luna_robe_top": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "luna_wing"
            },
            "royal_water_robe_top": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "royal_cloth"
            },
            "royal_nature_robe_top": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "royal_cloth"
            },
            "royal_fire_robe_top": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "royal_cloth"
            },
            "holy_plate_body": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_plate_body"
            },
            "dairyhands_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "foragers_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "lumberjacks_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "cheesemakers_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "crafters_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "tailors_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "chefs_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "brewers_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "alchemists_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "enhancers_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "turtle_shell_legs": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "turtle_shell"
            },
            "colossus_plate_legs": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "colossus_core"
            },
            "demonic_plate_legs": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "demonic_core"
            },
            "anchorbound_plate_legs": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "damaged_anchor"
            },
            "maelstrom_plate_legs": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "maelstrom_plating"
            },
            "marine_chaps": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "marine_scale"
            },
            "revenant_chaps": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "revenant_anima"
            },
            "griffin_chaps": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "griffin_leather"
            },
            "kraken_chaps": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "kraken_leather"
            },
            "icy_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "icy_cloth"
            },
            "flaming_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "flaming_cloth"
            },
            "luna_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "luna_wing"
            },
            "royal_water_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "royal_cloth"
            },
            "royal_nature_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "royal_cloth"
            },
            "royal_fire_robe_bottoms": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "royal_cloth"
            },
            "holy_plate_legs": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_plate_legs"
            },
            "enchanted_gloves": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "chrono_sphere"
            },
            "pincer_gloves": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "crab_pincer"
            },
            "panda_gloves": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "panda_fluff"
            },
            "magnetic_gloves": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "magnet"
            },
            "dodocamel_gauntlets": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "dodocamel_plume"
            },
            "sighted_bracers": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "sighted_bracers"
            },
            "marksman_bracers": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "marksman_brooch"
            },
            "chrono_gloves": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "chrono_sphere"
            },
            "holy_gauntlets": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_gauntlets"
            },
            "collectors_boots": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "gobo_rag"
            },
            "shoebill_shoes": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "shoebill_feather"
            },
            "black_bear_shoes": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "black_bear_fluff"
            },
            "grizzly_bear_shoes": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "grizzly_bear_fluff"
            },
            "polar_bear_shoes": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "polar_bear_fluff"
            },
            "centaur_boots": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "centaur_hoof"
            },
            "sorcerer_boots": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "sorcerers_sole"
            },
            "holy_boots": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_boots"
            },
            "small_pouch": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "small_pouch"
            },
            "medium_pouch": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "medium_pouch"
            },
            "large_pouch": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "large_pouch"
            },
            "giant_pouch": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "giant_pouch"
            },
            "gluttonous_pouch": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "guzzling_pouch": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "necklace_of_efficiency": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "fighter_necklace": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "ranger_necklace": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "wizard_necklace": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "necklace_of_wisdom": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "necklace_of_speed": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "philosophers_necklace": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "earrings_of_gathering": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_gathering"
            },
            "earrings_of_essence_find": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_essence_find"
            },
            "earrings_of_armor": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_armor"
            },
            "earrings_of_regeneration": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_regeneration"
            },
            "earrings_of_resistance": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_resistance"
            },
            "earrings_of_rare_find": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_rare_find"
            },
            "earrings_of_critical_strike": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "earrings_of_critical_strike"
            },
            "philosophers_earrings": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "ring_of_gathering": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_gathering"
            },
            "ring_of_essence_find": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_essence_find"
            },
            "ring_of_armor": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_armor"
            },
            "ring_of_regeneration": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_regeneration"
            },
            "ring_of_resistance": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_resistance"
            },
            "ring_of_rare_find": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_rare_find"
            },
            "ring_of_critical_strike": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "ring_of_critical_strike"
            },
            "philosophers_ring": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_milking_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_milking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_milking_charm"
            },
            "advanced_milking_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_milking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_milking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_milking_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_milking_charm"
            },
            "trainee_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_foraging_charm"
            },
            "advanced_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_foraging_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_foraging_charm"
            },
            "trainee_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_woodcutting_charm"
            },
            "advanced_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "master_woodcutting_charm"
            },
            "grandmaster_woodcutting_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "basic_cheesesmithing_charm"
            },
            "advanced_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_cheesesmithing_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_cheesesmithing_charm"
            },
            "trainee_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "basic_crafting_charm"
            },
            "advanced_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_crafting_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_tailoring_charm"
            },
            "advanced_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_tailoring_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_cooking_charm"
            },
            "advanced_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_cooking_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_brewing_charm"
            },
            "advanced_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_brewing_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_brewing_charm"
            },
            "trainee_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "basic_alchemy_charm"
            },
            "advanced_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "master_alchemy_charm"
            },
            "grandmaster_alchemy_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_alchemy_charm"
            },
            "trainee_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "basic_enhancing_charm"
            },
            "advanced_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_enhancing_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_enhancing_charm"
            },
            "trainee_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_stamina_charm"
            },
            "advanced_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "mirror_of_protection"
            },
            "expert_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_stamina_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_stamina_charm"
            },
            "trainee_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_intelligence_charm"
            },
            "advanced_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_intelligence_charm"
            },
            "expert_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_intelligence_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "grandmaster_intelligence_charm"
            },
            "trainee_attack_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_attack_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_attack_charm"
            },
            "advanced_attack_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_attack_charm"
            },
            "expert_attack_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_attack_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_attack_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_defense_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_defense_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_defense_charm"
            },
            "advanced_defense_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_defense_charm"
            },
            "expert_defense_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_defense_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_defense_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_melee_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_melee_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_melee_charm"
            },
            "advanced_melee_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_melee_charm"
            },
            "expert_melee_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_melee_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_melee_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_ranged_charm"
            },
            "advanced_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_ranged_charm"
            },
            "expert_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_ranged_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "trainee_magic_charm": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "mirror_of_protection"
            },
            "basic_magic_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "basic_magic_charm"
            },
            "advanced_magic_charm": {
                "targetLevel": 10,
                "protLevel": 4,
                "protName": "advanced_magic_charm"
            },
            "expert_magic_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "master_magic_charm": {
                "targetLevel": 10,
                "protLevel": 3,
                "protName": "mirror_of_protection"
            },
            "grandmaster_magic_charm": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "mirror_of_protection"
            },
            "basic_task_badge": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "basic_task_badge"
            },
            "advanced_task_badge": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "advanced_task_badge"
            },
            "expert_task_badge": {
                "targetLevel": 10,
                "protLevel": 2,
                "protName": "expert_task_badge"
            },
            "celestial_brush": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "holy_brush": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_brush"
            },
            "celestial_shears": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "holy_shears": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_shears"
            },
            "celestial_hatchet": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "holy_hatchet": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_hatchet"
            },
            "celestial_hammer": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_hammer": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_hammer"
            },
            "celestial_chisel": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_chisel": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_chisel"
            },
            "celestial_needle": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "holy_needle": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_needle"
            },
            "celestial_spatula": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_spatula": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_spatula"
            },
            "celestial_pot": {
                "targetLevel": 10,
                "protLevel": 8,
                "protName": "mirror_of_protection"
            },
            "holy_pot": {
                "targetLevel": 10,
                "protLevel": 5,
                "protName": "holy_pot"
            },
            "celestial_alembic": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_alembic": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_alembic"
            },
            "celestial_enhancer": {
                "targetLevel": 10,
                "protLevel": 7,
                "protName": "mirror_of_protection"
            },
            "holy_enhancer": {
                "targetLevel": 10,
                "protLevel": 6,
                "protName": "holy_enhancer"
            }
        }
        localStorage.setItem("autoFillEnhancementData", JSON.stringify(initDict));
        showMessage(texts.initMessage);
    }
})();
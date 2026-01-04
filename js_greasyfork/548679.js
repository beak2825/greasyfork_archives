// ==UserScript==
// @name         SimpleEnhancerUI
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  删掉一些对于强化师没用的按钮
// @author       AlphB
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://tupian.li/images/2025/09/07/68bd44250be41.png
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/548679/SimpleEnhancerUI.user.js
// @updateURL https://update.greasyfork.org/scripts/548679/SimpleEnhancerUI.meta.js
// ==/UserScript==

(function () {
    function remove_skill_button() {
        // 左侧界面的五个垃圾
        const panel = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_navPanel__3wbAU > div > div.NavigationBar_navigationBar__1gRln > div.NavigationBar_navigationLinks__1XSSb");
        if (!panel) return;
        let toRemoveBaseVal = [
            '/static/media/skills_sprite.3bb4d936.svg#milking',
            '/static/media/skills_sprite.3bb4d936.svg#foraging',
            '/static/media/skills_sprite.3bb4d936.svg#woodcutting',
            '/static/media/skills_sprite.3bb4d936.svg#cooking',
            '/static/media/skills_sprite.3bb4d936.svg#brewing',
        ];
        let toRemove = [];
        for (let child of panel.childNodes) {
            try {
                let baseVal = child.childNodes[0].childNodes[0].childNodes[0].href.baseVal;
                if (toRemoveBaseVal.includes(baseVal)) {
                    toRemove.push(child);
                }
            } catch (err) {
            }

            try {
                // 战斗
                if ((child.childNodes[0].childNodes[1].ariaLabel === 'navigationBar.combat')) {
                    toRemove.push(child);
                }
            } catch (err) {
            }
        }
        for (let e of toRemove) {
            e.hidden = true;
        }
    }

    function removeMaterialButton() {
        let keywords = ['Material', 'Lumber', '材料', '木板'];
        let toRemove = [];
        try {
            let root = document.querySelector('div.TabsComponent_tabsContainer__3BDUp > div > div > div');
            if (keywords.includes(root.childNodes[0].childNodes[0].textContent)) {
                toRemove.push(root.childNodes[0])
            }
        } catch (err) {
        }
        for (let e of toRemove) {
            e.hidden = true;
        }
    }

    function removeAbilityButton() {
        try {
            let button = document.querySelector('div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div > button:nth-child(3)');
            if (['Abilities', '技能'].includes(button.firstChild.textContent)) {
                button.remove();
            }
        } catch (err) {
        }
        try {
            const button = document.querySelector("div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7.GamePage_chatCollapsed__3pV19 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div > button:nth-child(3)");
            if (['Abilities', '技能'].includes(button.firstChild.textContent)) {
                button.remove();
            }
        } catch (err) {
        }
    }

    const rubbishNames = [];
    for (const a of ['cheese', 'verdant', 'azure', 'burble', 'crimson', 'rainbow']) {
        for (const b of ['brush', 'shears', 'hatchet', 'hammer', 'chisel', 'needle', 'spatula', 'pot', 'alembic', 'enhancer',
            'sword', 'spear', 'mace', 'bulwark', 'buckler', 'boots', 'gauntlets', 'helmet', 'plate_legs', 'plate_body',]) {
            rubbishNames.push(`${a}_${b}`);
        }
    }
    for (const a of ['wooden', 'birch', 'cedar', 'purpleheart', 'ginkgo', 'redwood']) {
        for (const b of ['crossbow', 'bow', 'water_staff', 'nature_staff', 'fire_staff', 'shield']) {
            rubbishNames.push(`${a}_${b}`);
        }
    }
    for (const a of ['rough', 'reptile', 'gobo', 'beast']) {
        for (const b of ['boots', 'bracers', 'hood', 'chaps', 'tunic']) {
            rubbishNames.push(`${a}_${b}`);
        }
    }
    for (const a of ['cotton', 'linen', 'bamboo', 'silk']) {
        for (const b of ['boots', 'gloves', 'hat', 'robe_bottoms', 'robe_top']) {
            rubbishNames.push(`${a}_${b}`);
        }
    }


    function removeTrainRubbish() {
        const root1 = document.querySelector("div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div");
        if (root1) make(root1);

        function make(root) {
            if (root.querySelector(".removeTrainRubbishButton")) return;

            const button = document.createElement("button");
            button.classList.add("removeTrainRubbishButton");
            button.textContent = "隐藏背包里的火车垃圾";
            button.style.backgroundColor = "#66CCFF";
            button.style.color = "#000000";
            button.style.height = "50px";
            button.onclick = function () {
                for (const container of root.querySelectorAll(".Item_itemContainer__x7kH1")) {
                    const name = container.querySelector("svg").firstChild.href.baseVal.split("#")[1];
                    if (!container.querySelector(".Item_enhancementLevel__19g-e") && rubbishNames.includes(name)) {
                        container.hidden = true;
                    }
                }
            }
            root.insertBefore(button, root.firstChild);
        }
    }

    new MutationObserver(function () {
        remove_skill_button();
        removeMaterialButton();
        removeAbilityButton();
        removeTrainRubbish();
    }).observe(document, {childList: true, subtree: true});
})();

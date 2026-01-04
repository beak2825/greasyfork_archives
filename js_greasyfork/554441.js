// ==UserScript==
// @name         Neoquest 2 keyboard controls
// @namespace    http://tampermonkey.net/
// @version      2025-11-05
// @description  Keyboard controls for neoquest 2
// @author       JessTheRed
// @match        https://www.grundos.cafe/games/neoquest2/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554441/Neoquest%202%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/554441/Neoquest%202%20keyboard%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", (event) => {
        if (event.key == 'Enter'){
            const actions = document.getElementsByClassName("actions")[0];
            if (actions?.length > 0) {
                const link = actions.getElementsByTagName("a");
                link[0].click();
                return
            }
            let next_turn = document.getElementsByClassName("next-turn");
            for (let item of next_turn) {
                let links = item.getElementsByTagName("a");
                if (links.length > 0) {
                    let link = links[0];
                    link.click();
                    return;
                }
            }
            let battle_encounter = document.getElementById("play_battle_encounter");
            if (battle_encounter?.children?.length > 0) {
                let button_container = battle_encounter.children[0].children[2];
                let link = button_container.getElementsByTagName("a")[0]
                link.click();
                return;
            }
            const result = document.getElementById("play_battle_result");

            let link = null;
            let link_container = result.children[0].children[3];
            if (link_container == null) {
                link_container = result.children[0].children[2];
                link = link_container.getElementsByTagName("a")[0];
            } else {
                link = link_container.getElementsByTagName("a")[0]
            }
            link.click()

        }

        else if (event.key == 'a'){
            const enemy = getEnemy(0);
            enemy.click();
        }
        else if (event.key == 's'){
            const enemy = getEnemy(1);
            enemy.click()
        }
        else if (event.key == 'd'){
            const enemy = getEnemy(2);
            enemy.click()
        }
        else if (event.key == 'f'){
            const enemy = getEnemy(3);
            enemy.click()
        }
        else if (event.key == 'z'){
            const item = getItem(0);
            item.click()
        }
        else if (event.key == 'x'){
            const item = getItem(1);
            item.click()
        }
        else if (event.key == 'c'){
            const item = getItem(2);
            item.click()
        }
        else if (event.key == 'v'){
            const item = getItem(5);
            item.click()
        }
        else if (event.key == 'b'){
            const item = getItem(6);
            item.click()
        }
        else if (event.key == 'n'){
            const item = getItem(7);
            item.click()
        }
        /*
        else if (event.key == 'm'){
            const item = getItem(8);
            item.click()
        }
        else if (event.key == '8'){
            const item = getItem(7);
            item.click()
        }
        else if (event.key == '9'){
            const item = getItem(9);
            item.click()
        }
        else if (event.key == '0'){
            const item = getItem(10);
            item.click()
        }*/
        else if (event.key == 'q'){
            const skill = getSkill(0);
            skill.click();
        }
        else if (event.key == 'w'){
            const skill = getSkill(1);
            skill.click();
        }
        else if (event.key == 'e'){
            const skill = getSkill(2);
            skill.click();
        }
        else if (event.key == 'r'){
            const skill = getSkill(3);
            skill.click();
        }
        else if (event.key == 't'){
            const skill = getSkill(4);
            skill.click();
        }


        else if (event.key == ' '){
            event.preventDefault();
            const commands = document.getElementById("commands");
            const talk = commands.getElementsByTagName("a")[1];
            talk.click();
        }


    });
})();

const getSkill = (skillIndex) => {
    const skillContainer = document.getElementsByClassName("skills")[0];
    const skill = skillContainer.getElementsByTagName("a")[skillIndex]

    return skill;
}

const getItem = (itemIndex) => {
    const itemContainer = document.getElementsByClassName("items")[0];
    const item = itemContainer.getElementsByTagName("a")[itemIndex];
    return item;
}

const getEnemy = (enemyIndex) => {
    const enemyContainer = document.getElementById('enemies');
    const enemy = enemyContainer.children[enemyIndex].children[0].children[0];
    return enemy;
}
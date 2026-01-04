// ==UserScript==
// @name         FV - whiskerton battles
// @version      1.2.1
// @description  Whiskerton-fies the battleground enemies.
// @author       necroam
// @match        https://www.furvilla.com/career/warrior/battle/*
// @grant        none
// @namespace https://greasyfork.org/en/users/1535374-necroam

// @downloadURL https://update.greasyfork.org/scripts/555126/FV%20-%20whiskerton%20battles.user.js
// @updateURL https://update.greasyfork.org/scripts/555126/FV%20-%20whiskerton%20battles.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define monster replacements
    const monsterReplacements = [
        {
            oldImage: "https://www.furvilla.com/img/battle/monsters/273.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109924808_gqFzDT7Qd1IlCPR.png",
            oldName: "Training Dummy",
            newName: "Mikeling"
            // Training Dummy Battle
        },
        {
            oldImage: "https://www.furvilla.com/img/battle/monsters/181.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109926961_8SRFTCZhxvzyP3e.png",
            oldName: "Harbinger",
            newName: "Furlong"
            // Harbinger Battle
        },
       {
            oldImage: "https://www.furvilla.com/img/battle/monsters/186.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109929341_gc23daJ8dJ4lOF9.png",
            oldName: "Guardian of Ancient Treasures",
            newName: "Captain Purrbeard"
                  //Loot Cave Battle
        },
              {
            oldImage: "https://www.furvilla.com/img/battle/monsters/384.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930418_Qr1Zlfqvz28WCsG.png",
            oldName: "Talwor",
            newName: "Min-mow"
                  //Spirit Lions (In Training) Battle
        },
               {
            oldImage: "https://www.furvilla.com/img/battle/monsters/381.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930053_SzDyzizh2bcGWgu.png",
            oldName: "Aril",
            newName: "Dilopurrsaurus"
                  //Spirit Lions (In Training) Battle
        },
                {
            oldImage: "https://www.furvilla.com/img/battle/monsters/386.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930189_I2pje6aG8pyrrod.png",
            oldName: "Hail",
            newName: "Purrch"
                  //Spirit Lions (In Training) Battle
        },
     {
            oldImage: "https://www.furvilla.com/img/battle/monsters/383.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930263_4W3nxU4lH4jNplS.png?1762545581",
            oldName: "Foster",
            newName: "Meow-locanth"
                  //Spirit Lions (In Training) Battle
        },
     {
            oldImage: "https://www.furvilla.com/img/battle/monsters/382.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930542_YiLFkKiOHOMMxK9.png",
            oldName: "Careth",
            newName: "Furlong's Minion"
                  //Spirit Lions (In Training) Battle
        },
     {
            oldImage: "https://www.furvilla.com/img/battle/monsters/385.png",
            newImage: "https://f2.toyhou.se/file/f2-toyhou-se/images/109930649_9J0NDqARGr8ADmz.png",
            oldName: "Bolt",
            newName: "Sea Kitty"
                  //Spirit Lions (In Training) Battle
        },
    ];

    function updateBattleElements() {
        // Replace monster images and names
        monsterReplacements.forEach(monster => {
            // Replace image
            document.querySelectorAll(`img[src="${monster.oldImage}"]`).forEach(img => {
                img.src = monster.newImage;
            });

            // Replace name
            document.querySelectorAll('*').forEach(el => {
                if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                    if (el.textContent.trim() === monster.oldName) {
                        el.textContent = monster.newName;
                    }
                }
            });
        });

        // Update battle link with correct warrior ID
        const urlMatch = window.location.href.match(/\/battle\/(\d+)\//);
        const warriorId = urlMatch ? urlMatch[1] : null;

        if (warriorId) {
            document.querySelectorAll('a[href*="/career/warrior/battle/"]').forEach(link => {
                link.href = link.href.replace(/\/battle\/\d+\//, `/battle/${warriorId}/`);
            });
        }
    }

    // Initiate
    updateBattleElements();

    // Observe and reapply updates
    const observer = new MutationObserver(() => {
        updateBattleElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();


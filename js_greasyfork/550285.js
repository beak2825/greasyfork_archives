// ==UserScript==
// @name         IdlePixel Crit Tracker - TheeMarcel Fork
// @namespace    com.godofnades.idlepixel
// @version      1.1.6
// @description  Adds functionality to the combat and raid window to show which hit you are on in your crit cycle.
// @author       Original Author: GodofNades || Modded By: TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/550285/IdlePixel%20Crit%20Tracker%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/550285/IdlePixel%20Crit%20Tracker%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let USERNAME, getThis

    var combatActive = false;
    var raidActive = false;
    var critActive = false;
    var i = 0;

    class CritTrackerPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("crittracker", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onCombatStart() {
            combatActive = true;
        }

        onCombatEnd() {
            combatActive = false;
            i = 0;
        }

        onVariableSet(key, valueBefore, valueAfter) {
            if (key == "in_raids") {
                if (valueAfter == "1") {
                    raidActive = true;
                } else {
                    raidActive = false;
                    critActive = false;
                    i = 0;
                }
            }
        }

        ModifyElement(end, text, colour1, colour2) {
            document.getElementById(`crit-text${end}`).innerText = text;
            document.getElementById(`crit-box${end}`).style.backgroundColor = colour1;
            document.getElementById(`crit-text-static${end}`).style.color = colour2;
            document.getElementById(`crit-text${end}`).style.color = colour2;
            document.getElementById(`crit-text-static${end}`).style.fontWeight = "bold";
            document.getElementById(`crit-text${end}`).style.fontWeight = "bold";
        }

        onMessageReceived(data) {
            const normalCombat = combatActive && data.startsWith("HITSPLAT_ON_MONSTER=");
            const raidCombat = raidActive && data.startsWith("HIT_SPLAT_RAID_MONSTER=") && data.endsWith(USERNAME);
            const noDistractions = !data.includes("heal_spell.png") && !data.includes("fire_icon.png") && !data.includes("poison.png") && !data.includes("reflect_spell.png") && !data.includes("cannonball.png");
            if((normalCombat || raidCombat) && noDistractions) {
                if (!raidCombat) {
                    if (i == 4 || data.includes("rgba(255,128,0,0.6)")) {
                        i = 0;
                        getThis.ModifyElement("","5 - Crit","green","white");
                    } else if(i == 3) {
                        i++;
                        getThis.ModifyElement("","4 - Crit Next","yellow","black");
                    } else {
                        i++;
                        getThis.ModifyElement("",i,"red","black");
                    }
                } else if (raidCombat && !critActive) {
                    if (i == 4 || data.includes("rgba(255,128,0,0.6)")) {
                        i = 0;
                        getThis.ModifyElement("-raid","5 - Crit","green","white");
                    } else if(i == 3) {
                        i++;
                        getThis.ModifyElement("-raid","4 - Crit Next","yellow","black");
                    } else {
                        i++;
                        getThis.ModifyElement("-raid",i,"red","black");
                    }
                } else if (raidCombat && critActive) {
                    if(i == 3 || data.includes("rgba(255,128,0,0.6)")) {
                        i = 0;
                        getThis.ModifyElement("-raid","4 - Crit","green","white");
                    } else if (i == 2) {
                        i++;
                        getThis.ModifyElement("-raid","3 - Crit Next","yellow","black");
                    } else {
                        i++;
                        getThis.ModifyElement("-raid",i,"red","black");
                    }
                }
            } else if (data.startsWith("SEND_CRITS_FOR_ALL_LABEL=")) {
                critActive = true;
            }
        }

        onLogin() {
            USERNAME = IdlePixelPlus.getVarOrDefault("username", "", "string");
            getThis = IdlePixelPlus.plugins.crittracker;

			const combatButton = document.getElementById("panel-combat-canvas").querySelector("button");
			combatButton.insertAdjacentHTML("afterend", `
			  <div id="crit-box" class="notification" style="margin-left: 400px; margin-bottom: 4px; display: inline-block; background-color: red;">
				<span id="crit-text-static" class="color-white">Hit Count: </span>
				<span id="crit-text" class="color-white">1</span>
			  </div>`);
			const raidButton = document.getElementById("panel-combat-canvas-raids").querySelector("button");
			raidButton.insertAdjacentHTML("afterend", `
			  <div id="crit-box-raid" class="notification" style="margin-left: 400px; margin-bottom: 4px; display: inline-block; background-color: red;">
				<span id="crit-text-static-raid" class="color-white">Hit Count: </span>
				<span id="crit-text-raid" class="color-white">1</span>
			  </div>`);
        }
    }

    const plugin = new CritTrackerPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
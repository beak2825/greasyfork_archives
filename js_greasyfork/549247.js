// ==UserScript==
// @name         FlatMMO+ HP Viewer
// @namespace    com.dounford.flatmmo.hp
// @version      1.0.2
// @description  Shows the enemy hp while fighting
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/549247/FlatMMO%2B%20HP%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/549247/FlatMMO%2B%20HP%20Viewer.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class hpViewerPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("hpViewer", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
        }
        
        onLogin() {

        }
        
        onPaint() {
            for (let uuid in npcs) {
                if (npcs.hasOwnProperty(uuid)) {
                    if(npcs[uuid].in_combat && npcs[uuid].is_hidden === false) {
                        let max_hp = npcs[uuid].max_hp;
                        let hp = npcs[uuid].hp;
                        ctx.fillStyle = "white";
                        ctx.font = "20px serif";
                        ctx.fillText(hp + "/" + max_hp, npcs[uuid].client_x + 4, npcs[uuid].client_y - (npcs[uuid].height - 1) * TILE_SIZE - TILE_SIZE/8 - 3);
                        ctx.font = "16px serif"
                    }
                }
            }
        }
    }
 
    const plugin = new hpViewerPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();
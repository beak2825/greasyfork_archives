// ==UserScript==
// @name         FlatMMO Farmer Hat Required
// @namespace    com.dounford.flatmmo.farmerhat
// @version      1.0.0
// @description  Prevents harvesting without Farmer Hat
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/548886/FlatMMO%20Farmer%20Hat%20Required.user.js
// @updateURL https://update.greasyfork.org/scripts/548886/FlatMMO%20Farmer%20Hat%20Required.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class farmerHatRequiredPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("farmerHatRequired", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "requiresHat",
                        label: "Only harvest with Farmer's Hat",
                        type: "boolean",
                        default: true
                    }
                ]
            });
            this.oldClickHandler = window.mouse_click_handler;
        }
     
        onLogin() {
            canvas.removeEventListener("mousedown", window.mouse_click_handler, false);
            canvas.addEventListener("mousedown", this.newMouseClickHandler, false);
        }
        
        newMouseClickHandler(e) {
            if(Globals.local_username == null) {
                return;
            }
            
            for(let i = 0; i < map_objects.length; i++) {
                let map_object = map_objects[i];
                if (map_object.label !== "Farming Patch") { continue };
                if(is_mouse_on_map_object(mouse_over_now.x_tile, mouse_over_now.y_tile, map_object)) {
                    if(!FlatMMOPlus.plugins.farmerHatRequired.config["requiresHat"] || player_hat[Globals.local_username] === "straw_hat") {
                        FlatMMOPlus.plugins.farmerHatRequired.oldClickHandler(e)
                        return;
                    }
                    add_hit_splat("Farmer Hat Required", "red", players[Globals.local_username].client_x, players[Globals.local_username].client_y)
                    return;
                }
            }
            FlatMMOPlus.plugins.farmerHatRequired.oldClickHandler(e)
        }
    }
 
    const plugin = new farmerHatRequiredPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();
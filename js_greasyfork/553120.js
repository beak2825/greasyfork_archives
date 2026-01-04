// ==UserScript==
// @name         FlatMMO+ Dim
// @namespace    com.dounford.flatmmo.dim
// @version      1.0.2
// @description  FlatMMO+ Dim the screen
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/553120/FlatMMO%2B%20Dim.user.js
// @updateURL https://update.greasyfork.org/scripts/553120/FlatMMO%2B%20Dim.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class DimPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("dim", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "whereToDim",
                        label: "Dim Location",
                        type: "select",
                        options: [
                            {value: "everywhere", label: "Everywhere"},
                            {value: "clouds", label: "Clouds"},
                            {value: "nowhere", label: "Nowhere"}
                        ],
                        default: "clouds"
                    },
                    {
						id: "dimIntensity",
						label: "Dim Intensity",
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						default: 50,
					},
                ]
            });

            this.dim = 0;
        }

        onLogin() {
            
        }
        
        onConfigsChanged() {
            this.changedConfigs.forEach(config => {
				switch (config) {
					case "whereToDim": {
                        const where = this.config.whereToDim;
						if(where === "nowhere") {
                            this.dim = 0;
                        } else if (where === "everywhere" || (where === "clouds" && current_map === "m1000_999_sky")) {
                            this.changeIntensity()
                        }
					} break;
					case "dimIntensity": {
						this.changeIntensity();
					} break;
				}
			})
        }

        //Called when the player changes map
        onMapChanged(mapBefore, mapAfter) {
            if(this.config.whereToDim !== "clouds") {return};
            if(mapAfter === "m1000_999_sky") {
                this.changeIntensity();
            }
            if(mapBefore === "m1000_999_sky") {
                this.dim = 0;
            }
        }

        onPaint() {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.dim})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        changeIntensity() {
            this.dim = this.config.dimIntensity / 100;
        }
    }
    
    const plugin = new DimPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();
// ==UserScript==
// @name         FlatMMO+ Reminders
// @namespace    com.dounford.flatmmo.reminder
// @version      0.0.3
// @description  Adds reminders to the game
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/548648/FlatMMO%2B%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/548648/FlatMMO%2B%20Reminders.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
	const ding = new Audio("https://github.com/Dounford-Felipe/DHM-Idle-Again/raw/refs/heads/main/ding.wav");
 
    class RemindersPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("reminders", {
                about: {
                    name: "Reminder",
                    version: "0.0.1",
                    author: "Dounford",
                    description: "Adds reminders to the game"
                },
                config: [
                    {
						id: "pingVolume",
						label: "Ping Volume",
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						default: 100,
					},
                ]
            });
        }
 
        
        onLogin(){
            ding.volume = this.config.pingVolume / 100;

            window.FlatMMOPlus.registerCustomChatCommand("reminder", (command, data='') => {
				if (data === "") {
                    this.showText("You need to specify the duration")
					return;
				}
                let duration;
                let text = "Reminder";
                const space = data.indexOf(" ");
				if (space <= 0) {
					duration = parseInt(data) ;
				} else {
					duration = parseInt(data.substring(0, space));
					text += ": " + data.substring(space + 1);
				}

                this.showText(`Reminder created (${duration} minutes)`);

                setTimeout(()=>{
                    this.showText(text, "orange");
                    ding.play();
                }, duration * 60 * 1000);

			}, `Sets an reminder. Usage: /reminder <minutes> [text (optional)]`);
        }

        onConfigsChanged() {
            ding.volume = this.config.pingVolume / 100;
		}

        showText(text, color = "orange") {
            if("flatChat" in FlatMMOPlus.plugins) {
                FlatMMOPlus.plugins.flatChat.showWarning(text, color);
            } else {
                add_to_chat("", "", "", color, text);
            }
        }
    }
 
    const plugin = new RemindersPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();
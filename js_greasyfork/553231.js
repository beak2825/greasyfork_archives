// ==UserScript==
// @name         FlatMMO+ Pings
// @namespace    com.dounford.flatmmo.pings
// @version      1.0.0
// @description  Adds watched words list to FMMO
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/553231/FlatMMO%2B%20Pings.user.js
// @updateURL https://update.greasyfork.org/scripts/553231/FlatMMO%2B%20Pings.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const ding = new Audio("https://github.com/Dounford-Felipe/DHM-Idle-Again/raw/refs/heads/main/ding.wav");

    class PingsPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("pings", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
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
                    {
						id: "watchedWords",
						label: "Watched Words",
						type: "list",
						default: []
					}
                ]
            });
        }

        onConfigsChanged() {
			this.changedConfigs.forEach(config => {
				switch (config) {
					case "pingVolume": {
						ding.volume = this.config.pingVolume / 100;
					} break;
				}
			})
		}


        //This is called on pm, local and global chat messages
        onChat(data) {
            const message = data.message.toLowerCase();
            const isMention = message.includes("@" + Globals.local_username);
			const hasWatchedWord = this.config.watchedWords.some(word => message.includes(word.toLowerCase()));
			if (data.username !== Globals.local_username && (isMention || hasWatchedWord)) {
                ding.play();
			}
        }
    }

    const plugin = new PingsPlugin();
    FlatMMOPlus.registerPlugin(plugin);

})();
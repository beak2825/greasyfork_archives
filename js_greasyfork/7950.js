// ==UserScript==
// @name         EyeWire Accuracy Revealer
// @namespace    http://eyewire.org/
// @version      0.9
// @description  Now you can see your accuracy besides points after completing a cube
// @author       posixphreak
// @match        http://eyewire.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7950/EyeWire%20Accuracy%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/7950/EyeWire%20Accuracy%20Revealer.meta.js
// ==/UserScript==
(function() {

    function EWS_main() {
        console.log("EyeWire Script: injected!");
        var taskManager = window.tomni.taskManager;
        var orig_showLeaderboard = taskManager.ui.showLeaderboard;

        taskManager.ui.showLeaderboard = function(response) {

            if (typeof response === 'undefined') {
                /* A rare error I get */
                alert("An error occured while receiving response!");
                return;
            }

            if (!response.data.trailblazer) {
                response.type = "training"; // HAXX
                /* actually, I should do a more "low-level" patching but yeah, I'm lazy... */
                console.log("EyeWire Script: making accuracy visible...");
                ////console.log(response.data);
            }
            orig_showLeaderboard(response);
        }
    }

    function EWS_checkIfLoaded() {
        if (typeof window.tomni !== 'undefined' &&
            typeof window.tomni.taskManager !== 'undefined' &&
            typeof window.tomni.taskManager.ui !== 'undefined') {
            EWS_main();
        } else {
            window.setTimeout(EWS_checkIfLoaded, 1000);
        }
    }

    if (/eyewire\.org/i.test(document.domain)) {
        window.setTimeout(EWS_checkIfLoaded, 1000);
    }

})();
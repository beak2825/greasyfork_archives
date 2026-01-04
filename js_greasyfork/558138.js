// ==UserScript==
// @author        Odd
// @description   Automatically plays Grave Danger
// @match       https://www.neopets.com/halloween/gravedanger/*
// @name          Grave Danger Auto-Player
// @version       1.0.2
// @namespace https://greasyfork.org/users/1545323
// @downloadURL https://update.greasyfork.org/scripts/558138/Grave%20Danger%20Auto-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/558138/Grave%20Danger%20Auto-Player.meta.js
// ==/UserScript==

var DelayMax = 2500;
var DelayMin = 1500;

(function () {

    function getStoredValue(key, defaultValue) {

        var value = localStorage.getItem(key);

        if (value != null) {

            if (typeof value == "string") {

                try { value = JSON.parse(value); }
                catch (ex) { }
            }

            return value;
        }

        return defaultValue;
    }

    function setStoredValue(key, value) {

        if (value == null || value === undefined) localStorage.removeItem(key);
        else {

            if (typeof value != "number" && typeof value != "string") value = JSON.stringify(value);

            localStorage.setItem(key, value);
        }
    }

    if (typeof $ == "undefined") $ = unsafeWindow.$;

    var match;
    var playing = getStoredValue("graveDanger.playing", false);
    var playingB = 'GyeHJt40x';

    if (unsafeWindow.GDActive) {

        if (playing) {

            var notifyOnce;
            var timer = setInterval
            (

                function () {

                    if (Math.max((GDActive.target - ((new Date().getTime() / 1000) + GD.offset)), 0)) {

                        if (!notifyOnce) {

                            notifyOnce = true;

                            console.log("Watching...");
                        }
                    }
                    else {

                        console.log("Redirecting...");

                        setTimeout
                        (

                            function () { location.href = "http://www.neopets.com/halloween/gravedanger/"; },
                            (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                        );

                        clearInterval(timer);
                    }
                },
                1000
            );
        }
    }
    else {

        var again = $("input[name='again']");

        if (again.length && (again = again[0].form)) {

            if (playing) {

                setTimeout
                (

                    function () { again.submit(); },
                    (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                );
            }
        }
        else {

            var pet = getStoredValue("graveDanger.pet", "");

            if (match = GD.sendPetpet.toString().match(/(\s*function[^\{]*\{\s*)([\s\S]*)(\$\(\'\#gdform\'\)\.submit\(\)\;[\s\S]*\})/i)) {

                unsafeWindow.GD.sendPetpet = eval("(" + [match[1], match[2], "graveDangerSendPetpet();\n", match[3]].join("") + ")");
                unsafeWindow.graveDangerSendPetpet = exportFunction
                (

                    function () { setStoredValue("graveDanger.playing", true); },
                    unsafeWindow
                );

                $("#gdSelection button.select").unbind()
                    .click(GD.sendPetpet)
                    .html("Auto-Play!");
            }

            if (match = GD.ui.selectPetpet.toString().match(/(\s*function[^\{]*\{\s*)([\s\S]+)(\})/i)) {

                unsafeWindow.GD.ui.selectPetpet = eval("(" + [match[1], match[2], "graveDangerSelectPetpet();\n", match[3]].join("") + ")");
                unsafeWindow.graveDangerSelectPetpet = exportFunction
                (

                    function () { setStoredValue("graveDanger.pet", (pet = GD.selected)); },
                    unsafeWindow
                );

                $("#gdSelection div.petpet").unbind()
                    .click(GD.ui.selectPetpet);
            }

            if (playing && (pet || "").length) {

                var petpet = $(".petpet[data-neopet='" + pet + "']");
        
                if (petpet.length) {

                    petpet.click();

                    $("#gdNcItem").val("0");
    
                    $("#gdNeopet").val(pet);

                    setTimeout
                    (

                        function () { $("#gdForm").submit(); },
                        (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                    );
                }
            }
        }
    }
})();
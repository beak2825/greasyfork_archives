// ==UserScript==
// @name        Example Commands for Programmable Notepad
// @namespace   ccn0
// @author      CCN0
// @version     1
// @icon        https://ccn0.net/things/notepad/favicon.png
// @match       *://ccn0.net/things/notepad/programmable*
// @match       *://127.0.0.1:8000/things/notepad/programmable*
// @description adds a >hello, >aahhh, and >random command to Programmable Notepad by CCN0
// @downloadURL https://update.greasyfork.org/scripts/562346/Example%20Commands%20for%20Programmable%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/562346/Example%20Commands%20for%20Programmable%20Notepad.meta.js
// ==/UserScript==

(function() {
    NP.help.hello = {
        text: "returns world"
    };
    COMMANDS.hello = (inf) => {
        replaceLine(NP.cursorPosition[0], "world");
    };

    NP.help.aahhh = {
        args: "<amount?>",
        text: "plays aahhh #SoundletsPlus"
    };
    COMMANDS.aahhh = (inf) => {
        const playSound = () => {
            const snd = new Audio();
            snd.src = 'https://ccn0.github.io/img/audio/plus/aahhh.mp3';
            snd.playbackRate = 1;
            snd.play();
        };

        if (inf.argsExist && !isNaN(inf.args[0])) {
            for (let i = 0; i < Number(inf.args[0]); i++) {
                playSound();
            };
        } else {
            playSound();
        };
    };

    COMMANDS.random = (inf) => {
        let max = 1;
        if (inf.argsExist && !isNaN(inf.args[0])) {
            max = Number(inf.args[0]);
        }
        const rand = Math.random() * max;
        replaceLine(NP.cursorPosition[0], `${rand}`);
    };
    NP.help.random = {
        args: "<max?>",
        text: "returns a random number (0-1 default or 0-max)"
    };
})();